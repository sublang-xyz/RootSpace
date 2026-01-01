// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createHttpServer, ServerInstance } from './server.js';
import { Config, VERSION } from './config.js';
import { SERVER_NAME } from './mcp.js';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { request, IncomingMessage } from 'node:http';

const TEST_PORT = 29999;
const TEST_DATA_DIR = join(tmpdir(), 'rootspace-mcp-test-' + Date.now());

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: unknown;
  error?: { code: number; message: string };
}

/**
 * Send a JSON-RPC request to the MCP endpoint.
 * Returns the response body and session ID header.
 */
function sendMcpRequest(
  port: number,
  rpcRequest: JsonRpcRequest,
  sessionId?: string
): Promise<{ status: number; body: JsonRpcResponse; sessionId?: string }> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(rpcRequest);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body)),
      Accept: 'application/json, text/event-stream',
    };
    if (sessionId) {
      headers['mcp-session-id'] = sessionId;
    }

    const req = request(
      { hostname: 'localhost', port, path: '/mcp', method: 'POST', headers },
      (res: IncomingMessage) => {
        let data = '';
        res.on('data', (chunk: string) => (data += chunk));
        res.on('end', () => {
          try {
            // Handle SSE response format
            let jsonData = data;
            if (data.startsWith('event:') || data.startsWith('data:')) {
              // Parse SSE - look for the data line with JSON
              const lines = data.split('\n');
              for (const line of lines) {
                if (line.startsWith('data:')) {
                  jsonData = line.slice(5).trim();
                  break;
                }
              }
            }
            const responseSessionId = res.headers['mcp-session-id'] as string | undefined;
            resolve({
              status: res.statusCode ?? 0,
              body: JSON.parse(jsonData),
              sessionId: responseSessionId,
            });
          } catch {
            resolve({
              status: res.statusCode ?? 0,
              body: { jsonrpc: '2.0', id: rpcRequest.id, error: { code: -32700, message: data } },
              sessionId: res.headers['mcp-session-id'] as string | undefined,
            });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Open an SSE connection to the MCP endpoint.
 * Returns the response and a cleanup function.
 */
function openSseConnection(
  port: number,
  sessionId?: string
): Promise<{ res: IncomingMessage; close: () => void }> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
    };
    if (sessionId) {
      headers['mcp-session-id'] = sessionId;
    }

    const req = request(
      { hostname: 'localhost', port, path: '/mcp', method: 'GET', headers },
      (res: IncomingMessage) => {
        resolve({
          res,
          close: () => req.destroy(),
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

/**
 * Initialize an MCP session and return the session ID.
 */
async function initializeSession(port: number): Promise<{ sessionId: string; serverInfo: { name: string; version: string } }> {
  const initRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-client', version: '1.0.0' },
    },
  };

  const response = await sendMcpRequest(port, initRequest);
  expect(response.status).toBe(200);
  expect(response.body.result).toBeDefined();

  const result = response.body.result as {
    protocolVersion: string;
    serverInfo: { name: string; version: string };
    capabilities: { tools?: object; resources?: object };
  };

  return {
    sessionId: response.sessionId!,
    serverInfo: result.serverInfo,
  };
}

/**
 * Send initialized notification to complete the handshake.
 */
async function sendInitializedNotification(port: number, sessionId: string): Promise<void> {
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
  });

  await new Promise<void>((resolve, reject) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body)),
      'mcp-session-id': sessionId,
    };

    const req = request(
      { hostname: 'localhost', port, path: '/mcp', method: 'POST', headers },
      (res: IncomingMessage) => {
        res.resume(); // Drain the response
        res.on('end', () => resolve());
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

describe('T2.1 MCP Server Initialization', () => {
  let serverInstance: ServerInstance;
  const config: Config = { port: TEST_PORT, dataDir: TEST_DATA_DIR };

  beforeAll(async () => {
    serverInstance = createHttpServer(config);
    await serverInstance.start();
  });

  afterAll(async () => {
    await serverInstance.stop();
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  it('T2.1.1: MCP server reports correct name and version in capabilities', async () => {
    const { serverInfo } = await initializeSession(TEST_PORT);
    expect(serverInfo.name).toBe(SERVER_NAME);
    expect(serverInfo.version).toBe(VERSION);
  });

  it('T2.1.2: MCP server advertises tools capability', async () => {
    const initRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    };

    const response = await sendMcpRequest(TEST_PORT, initRequest);
    const result = response.body.result as { capabilities: { tools?: object } };
    expect(result.capabilities.tools).toBeDefined();
  });

  it('T2.1.3: MCP server advertises resources capability', async () => {
    const initRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    };

    const response = await sendMcpRequest(TEST_PORT, initRequest);
    const result = response.body.result as { capabilities: { resources?: object } };
    expect(result.capabilities.resources).toBeDefined();
  });
});

describe('T2.2 HTTP/SSE Transport', () => {
  let serverInstance: ServerInstance;
  const config: Config = { port: TEST_PORT + 1, dataDir: TEST_DATA_DIR };

  beforeAll(async () => {
    serverInstance = createHttpServer(config);
    await serverInstance.start();
  });

  afterAll(async () => {
    await serverInstance.stop();
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  it('T2.2.1: SSE endpoint accepts connection and keeps it alive', async () => {
    // First initialize to get session ID
    const { sessionId } = await initializeSession(TEST_PORT + 1);
    await sendInitializedNotification(TEST_PORT + 1, sessionId);

    // Open SSE connection
    const { res, close } = await openSseConnection(TEST_PORT + 1, sessionId);

    try {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('text/event-stream');
    } finally {
      close();
    }
  });

  it('T2.2.2: POST endpoint accepts JSON-RPC messages', async () => {
    const initRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    };

    const response = await sendMcpRequest(TEST_PORT + 1, initRequest);
    expect(response.status).toBe(200);
    expect(response.body.jsonrpc).toBe('2.0');
    expect(response.body.result).toBeDefined();
  });

  it('T2.2.3: Server sends responses via SSE stream', async () => {
    const { sessionId } = await initializeSession(TEST_PORT + 1);
    await sendInitializedNotification(TEST_PORT + 1, sessionId);

    // Make a request that returns a response
    const listToolsRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    };

    const response = await sendMcpRequest(TEST_PORT + 1, listToolsRequest, sessionId);
    expect(response.status).toBe(200);
    expect(response.body.result).toBeDefined();
  });

  it('T2.2.4: Server handles client disconnect gracefully', async () => {
    const { sessionId } = await initializeSession(TEST_PORT + 1);
    await sendInitializedNotification(TEST_PORT + 1, sessionId);

    // Open and immediately close SSE connection
    const { close } = await openSseConnection(TEST_PORT + 1, sessionId);
    close();

    // Server should still be operational
    const response = await sendMcpRequest(
      TEST_PORT + 1,
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1.0' } } }
    );
    expect(response.status).toBe(200);
  });

  it('T2.2.5: Server assigns session ID on connect', async () => {
    const initRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    };

    const response = await sendMcpRequest(TEST_PORT + 1, initRequest);
    expect(response.sessionId).toBeDefined();
    expect(response.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('T2.2.6: Server rejects requests with invalid session ID', async () => {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
    };

    const response = await sendMcpRequest(TEST_PORT + 1, request, 'invalid-session-id');
    expect(response.status).toBe(404);
  });
});

describe('T2.3 Tool Registration', () => {
  let serverInstance: ServerInstance;
  let sessionId: string;
  const config: Config = { port: TEST_PORT + 2, dataDir: TEST_DATA_DIR };

  beforeAll(async () => {
    serverInstance = createHttpServer(config);
    await serverInstance.start();
    const session = await initializeSession(TEST_PORT + 2);
    sessionId = session.sessionId;
    await sendInitializedNotification(TEST_PORT + 2, sessionId);
  });

  afterAll(async () => {
    await serverInstance.stop();
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  async function getTools(): Promise<{ name: string; description?: string; inputSchema?: object }[]> {
    const response = await sendMcpRequest(
      TEST_PORT + 2,
      { jsonrpc: '2.0', id: 1, method: 'tools/list' },
      sessionId
    );
    expect(response.body.result).toBeDefined();
    return (response.body.result as { tools: { name: string; description?: string; inputSchema?: object }[] }).tools;
  }

  it('T2.3.1: tools/list returns file.create with correct schema', async () => {
    const tools = await getTools();
    const fileCreate = tools.find((t) => t.name === 'file.create');
    expect(fileCreate).toBeDefined();
    expect(fileCreate?.description).toContain('Create');
    expect(fileCreate?.inputSchema).toBeDefined();

    const schema = fileCreate?.inputSchema as { properties?: Record<string, unknown> };
    expect(schema.properties?.path).toBeDefined();
    expect(schema.properties?.content).toBeDefined();
    expect(schema.properties?.encoding).toBeDefined();
  });

  it('T2.3.2: tools/list returns file.remove with correct schema', async () => {
    const tools = await getTools();
    const fileRemove = tools.find((t) => t.name === 'file.remove');
    expect(fileRemove).toBeDefined();
    expect(fileRemove?.description).toContain('Remove');

    const schema = fileRemove?.inputSchema as { properties?: Record<string, unknown> };
    expect(schema.properties?.path).toBeDefined();
    expect(schema.properties?.hash).toBeDefined();
  });

  it('T2.3.3: tools/list returns text.read with correct schema', async () => {
    const tools = await getTools();
    const textRead = tools.find((t) => t.name === 'text.read');
    expect(textRead).toBeDefined();
    expect(textRead?.description).toContain('Read');

    const schema = textRead?.inputSchema as { properties?: Record<string, unknown> };
    expect(schema.properties?.path).toBeDefined();
  });

  it('T2.3.4: tools/list returns text.replace with correct schema', async () => {
    const tools = await getTools();
    const textReplace = tools.find((t) => t.name === 'text.replace');
    expect(textReplace).toBeDefined();
    expect(textReplace?.description).toContain('Replace');

    const schema = textReplace?.inputSchema as { properties?: Record<string, unknown> };
    expect(schema.properties?.path).toBeDefined();
    expect(schema.properties?.hash).toBeDefined();
    expect(schema.properties?.old).toBeDefined();
    expect(schema.properties?.new).toBeDefined();
  });

  it('T2.3.5: tools/list returns text.insert with correct schema', async () => {
    const tools = await getTools();
    const textInsert = tools.find((t) => t.name === 'text.insert');
    expect(textInsert).toBeDefined();
    expect(textInsert?.description).toContain('Insert');

    const schema = textInsert?.inputSchema as { properties?: Record<string, unknown> };
    expect(schema.properties?.path).toBeDefined();
    expect(schema.properties?.hash).toBeDefined();
    expect(schema.properties?.anchor).toBeDefined();
    expect(schema.properties?.content).toBeDefined();
  });

  it('T2.3.6: tools/list returns text.append with correct schema', async () => {
    const tools = await getTools();
    const textAppend = tools.find((t) => t.name === 'text.append');
    expect(textAppend).toBeDefined();
    expect(textAppend?.description).toContain('Append');

    const schema = textAppend?.inputSchema as { properties?: Record<string, unknown> };
    expect(schema.properties?.path).toBeDefined();
    expect(schema.properties?.hash).toBeDefined();
    expect(schema.properties?.content).toBeDefined();
  });
});

describe('T2.4 Resource Registration', () => {
  let serverInstance: ServerInstance;
  let sessionId: string;
  const config: Config = { port: TEST_PORT + 3, dataDir: TEST_DATA_DIR };

  beforeAll(async () => {
    serverInstance = createHttpServer(config);
    await serverInstance.start();
    const session = await initializeSession(TEST_PORT + 3);
    sessionId = session.sessionId;
    await sendInitializedNotification(TEST_PORT + 3, sessionId);
  });

  afterAll(async () => {
    await serverInstance.stop();
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  it('T2.4.1: resources/list returns list:// template', async () => {
    const response = await sendMcpRequest(
      TEST_PORT + 3,
      { jsonrpc: '2.0', id: 1, method: 'resources/templates/list' },
      sessionId
    );
    expect(response.body.result).toBeDefined();

    const result = response.body.result as { resourceTemplates: { uriTemplate: string; name?: string }[] };
    const listTemplate = result.resourceTemplates.find((r) => r.uriTemplate.includes('list://'));
    expect(listTemplate).toBeDefined();
  });
});
