<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 2: MCP Protocol Foundation

Ref: [ADR-0002](/docs/decisions/0002-adopt-mcp-as-the-agent-interface.md), [MCP-001], [MCP-002], [MCP-005]

## Goal

Integrate MCP SDK and establish HTTP/SSE transport with protocol handshake.

## Deliverables

- MCP server responding to protocol handshake
- HTTP/SSE transport operational
- Tool registration skeleton (no implementation yet)

## Tasks

### 2.1 MCP SDK Integration (Ref: [MCP-001])

- [ ] Install `@modelcontextprotocol/sdk`
- [ ] Initialize MCP server instance
- [ ] Configure server metadata (name, version, capabilities)

### 2.2 HTTP/SSE Transport (Ref: [MCP-002], [MCP-005])

- [ ] Implement SSE endpoint for server-to-client messages
- [ ] Implement HTTP POST endpoint for client-to-server messages
- [ ] Assign UUID v4 session ID via `mcp-session-id` header on initialization (Ref: [MCP-005])
- [ ] Return HTTP 404 for requests with unknown session ID (Ref: [MCP-005])
- [ ] Handle MCP session lifecycle (connect, disconnect)

### 2.3 Tool Registration Skeleton (Ref: [MCP-003], [MCP-004])

- [ ] Register `file.*` namespace tools with schemas (no implementation)
- [ ] Register `text.*` namespace tools with schemas (no implementation)
- [ ] Validate tool schemas match [MCP-010] through [MCP-015]

### 2.4 Resource Registration Skeleton (Ref: [MCP-020])

- [ ] Register `list://` resource template (no implementation)

## Test Cases

See [tests/002-mcp-protocol.md](/specs/tests/002-mcp-protocol.md)
