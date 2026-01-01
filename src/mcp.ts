// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { VERSION } from './config.js';

export const SERVER_NAME = 'rootspace';

/**
 * Creates and configures the MCP server with all tools and resources.
 * Tools are registered as skeletons (schemas only, no implementation yet).
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: VERSION },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Register file.* tools (skeleton - no implementation yet)
  registerFileTools(server);

  // Register text.* tools (skeleton - no implementation yet)
  registerTextTools(server);

  // Register list:// resource template (skeleton - no implementation yet)
  registerListResource(server);

  return server;
}

/**
 * Creates a new StreamableHTTP transport for MCP.
 * Each transport handles one client session.
 */
export function createMcpTransport(): StreamableHTTPServerTransport {
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
}

// Tool schemas based on [MCP-010] through [MCP-015]

function registerFileTools(server: McpServer): void {
  // [MCP-010] file.create
  server.registerTool('file.create', {
    description: 'Create a new file with the given content',
    inputSchema: {
      path: z.string().describe('Path to the file to create'),
      content: z.string().describe('Content to write to the file'),
      encoding: z.enum(['utf-8', 'base64']).default('utf-8').describe('Content encoding'),
    },
  }, async () => {
    // Skeleton - not implemented yet
    return {
      content: [{ type: 'text', text: 'Not implemented' }],
      isError: true,
    };
  });

  // [MCP-011] file.remove
  server.registerTool('file.remove', {
    description: 'Remove an existing file',
    inputSchema: {
      path: z.string().describe('Path to the file to remove'),
      hash: z.string().describe('SHA-256 hash of the file content for verification'),
    },
  }, async () => {
    // Skeleton - not implemented yet
    return {
      content: [{ type: 'text', text: 'Not implemented' }],
      isError: true,
    };
  });
}

function registerTextTools(server: McpServer): void {
  // [MCP-012] text.read
  server.registerTool('text.read', {
    description: 'Read text content from a file',
    inputSchema: {
      path: z.string().describe('Path to the file to read'),
      lines: z.tuple([z.number(), z.number()]).optional().describe('Line range as [start, end), 1-indexed, end exclusive'),
    },
  }, async () => {
    // Skeleton - not implemented yet
    return {
      content: [{ type: 'text', text: 'Not implemented' }],
      isError: true,
    };
  });

  // [MCP-013] text.replace
  server.registerTool('text.replace', {
    description: 'Replace text content in a file',
    inputSchema: {
      path: z.string().describe('Path to the file'),
      hash: z.string().describe('SHA-256 hash of current content for verification'),
      lines: z.tuple([z.number(), z.number()]).describe('Line range as [start, end), 1-indexed, end exclusive'),
      old: z.string().describe('Full content of consecutive lines to replace'),
      new: z.string().describe('New content to replace with'),
    },
  }, async () => {
    // Skeleton - not implemented yet
    return {
      content: [{ type: 'text', text: 'Not implemented' }],
      isError: true,
    };
  });

  // [MCP-014] text.insert
  server.registerTool('text.insert', {
    description: 'Insert text content before an anchor line',
    inputSchema: {
      path: z.string().describe('Path to the file'),
      hash: z.string().describe('SHA-256 hash of current content for verification'),
      line: z.number().describe('Line number to insert at'),
      anchor: z.string().describe('Full content of the anchor line'),
      content: z.string().describe('Content to insert as new lines'),
    },
  }, async () => {
    // Skeleton - not implemented yet
    return {
      content: [{ type: 'text', text: 'Not implemented' }],
      isError: true,
    };
  });

  // [MCP-015] text.append
  server.registerTool('text.append', {
    description: 'Append text content to the end of a file',
    inputSchema: {
      path: z.string().describe('Path to the file'),
      hash: z.string().describe('SHA-256 hash of current content for verification'),
      content: z.string().describe('Content to append'),
    },
  }, async () => {
    // Skeleton - not implemented yet
    return {
      content: [{ type: 'text', text: 'Not implemented' }],
      isError: true,
    };
  });
}

function registerListResource(server: McpServer): void {
  // [MCP-020] list:// resource template
  const listTemplate = new ResourceTemplate('list://{path}', {
    list: undefined, // Will be implemented in later iterations
  });

  server.registerResource('list', listTemplate, {
    description: 'List immediate children of a directory (non-recursive)',
    mimeType: 'application/json',
  }, async () => {
    // Skeleton - not implemented yet
    return {
      contents: [{
        uri: 'list://',
        mimeType: 'application/json',
        text: JSON.stringify({ error: 'Not implemented' }),
      }],
    };
  });
}
