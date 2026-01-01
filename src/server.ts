// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>

import { createServer, IncomingMessage, ServerResponse, Server } from 'node:http';
import { mkdir } from 'node:fs/promises';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Config, VERSION } from './config.js';
import { createMcpServer } from './mcp.js';

export interface ServerInstance {
  server: Server;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export async function ensureDataDir(dataDir: string): Promise<void> {
  await mkdir(dataDir, { recursive: true });
}

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', version: VERSION }));
}

interface Session {
  transport: StreamableHTTPServerTransport;
  mcpServer: McpServer;
}

/**
 * Session manager for MCP transports.
 * Each client session has its own transport and MCP server instance.
 */
class SessionManager {
  private sessions = new Map<string, Session>();

  /**
   * Handle an MCP request. For initialization requests (no session ID),
   * creates a new transport and MCP server. For subsequent requests, looks up existing session.
   */
  async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (sessionId) {
      // Existing session - look up transport
      const session = this.sessions.get(sessionId);
      if (!session) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }
      await session.transport.handleRequest(req, res);
    } else {
      // New session - create transport and MCP server
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
      });

      // Each session gets its own MCP server instance
      const mcpServer = createMcpServer();

      // Connect the MCP server to this transport (non-blocking)
      mcpServer.connect(transport).catch((err) => {
        console.error('MCP connection error:', err);
      });

      // Handle the initialization request first to get the session ID
      await transport.handleRequest(req, res);

      // Store the session after the request is handled (sessionId is now available)
      const newSessionId = transport.sessionId;
      if (newSessionId) {
        this.sessions.set(newSessionId, { transport, mcpServer });

        // Clean up session when transport closes
        transport.onclose = () => {
          if (newSessionId) {
            this.sessions.delete(newSessionId);
          }
        };
      }
    }
  }

  /**
   * Close all active sessions.
   */
  async closeAll(): Promise<void> {
    const closePromises = Array.from(this.sessions.values()).map((s) => s.transport.close());
    await Promise.all(closePromises);
    this.sessions.clear();
  }

  /**
   * Get session count (for testing).
   */
  get sessionCount(): number {
    return this.sessions.size;
  }
}

export function createHttpServer(config: Config): ServerInstance {
  const sessionManager = new SessionManager();

  const handleRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const url = req.url || '';

    if (url === '/health' && req.method === 'GET') {
      handleHealth(req, res);
      return;
    }

    if (url === '/mcp' || url.startsWith('/mcp?')) {
      await sessionManager.handleRequest(req, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  };

  const server = createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      console.error('Request error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  });

  const connections = new Set<import('node:net').Socket>();

  server.on('connection', (socket) => {
    connections.add(socket);
    socket.on('close', () => connections.delete(socket));
  });

  const start = async (): Promise<void> => {
    await ensureDataDir(config.dataDir);

    return new Promise((resolve, reject) => {
      server.listen(config.port, () => {
        console.log(`RootSpace server listening on port ${config.port}`);
        console.log(`Data directory: ${config.dataDir}`);
        resolve();
      });
      server.once('error', reject);
    });
  };

  const stop = async (): Promise<void> => {
    // Close all MCP sessions first
    await sessionManager.closeAll();

    return new Promise((resolve) => {
      // Stop accepting new connections; callback fires when all connections close
      server.close(() => {
        resolve();
      });

      // Force-destroy connections that haven't closed after timeout
      const forceCloseTimeout = setTimeout(() => {
        for (const socket of connections) {
          socket.destroy();
        }
      }, 5000);

      // Clear timeout if server closes gracefully before deadline
      server.once('close', () => clearTimeout(forceCloseTimeout));
    });
  };

  return { server, start, stop };
}
