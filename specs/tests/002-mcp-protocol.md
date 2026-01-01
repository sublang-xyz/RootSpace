<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 2 — MCP Protocol Foundation

## T2.1 MCP Server Initialization

| ID | Test Case | Ref |
|----|-----------|-----|
| T2.1.1 | MCP server reports correct name and version in capabilities | [MCP-001] |
| T2.1.2 | MCP server advertises tools capability | [MCP-001] |
| T2.1.3 | MCP server advertises resources capability | [MCP-001] |

## T2.2 HTTP/SSE Transport

| ID | Test Case | Ref |
|----|-----------|-----|
| T2.2.1 | SSE endpoint accepts connection and keeps it alive | [MCP-002] |
| T2.2.2 | POST endpoint accepts JSON-RPC messages | [MCP-002] |
| T2.2.3 | Server sends responses via SSE stream | [MCP-002] |
| T2.2.4 | Server handles client disconnect gracefully | [MCP-002] |
| T2.2.5 | Server assigns UUID v4 session ID via `mcp-session-id` header | [MCP-005] |
| T2.2.6 | Server returns HTTP 404 for unknown session ID | [MCP-005] |

## T2.3 Tool Registration

| ID | Test Case | Ref |
|----|-----------|-----|
| T2.3.1 | `tools/list` returns `file.create` with correct schema | [MCP-010] |
| T2.3.2 | `tools/list` returns `file.remove` with correct schema | [MCP-011] |
| T2.3.3 | `tools/list` returns `text.read` with correct schema | [MCP-012] |
| T2.3.4 | `tools/list` returns `text.replace` with correct schema | [MCP-013] |
| T2.3.5 | `tools/list` returns `text.insert` with correct schema | [MCP-014] |
| T2.3.6 | `tools/list` returns `text.append` with correct schema | [MCP-015] |

## T2.4 Resource Registration

| ID | Test Case | Ref |
|----|-----------|-----|
| T2.4.1 | `resources/list` returns `list://` template | [MCP-020] |
