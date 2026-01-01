<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 8 — Client Integration

## T8.1 Claude Desktop Integration

| ID | Test Case | Ref |
|----|-----------|-----|
| T8.1.1 | Claude Desktop discovers all 6 tools via MCP | [MCP-001] |
| T8.1.2 | Claude Desktop can call `file.create` through conversation | [MCP-010] |
| T8.1.3 | Claude Desktop can call `text.read` through conversation | [MCP-012] |
| T8.1.4 | Claude Desktop can list directory via `list://` resource | [MCP-020] |

## T8.2 ChatGPT Desktop Integration

| ID | Test Case | Ref |
|----|-----------|-----|
| T8.2.1 | ChatGPT Desktop discovers all 6 tools via MCP | [MCP-001] |
| T8.2.2 | ChatGPT Desktop can call `file.create` through conversation | [MCP-010] |
| T8.2.3 | ChatGPT Desktop can call `text.read` through conversation | [MCP-012] |
| T8.2.4 | ChatGPT Desktop can list directory via `list://` resource | [MCP-020] |

## T8.3 End-to-End Workflows

| ID | Test Case | Ref |
|----|-----------|-----|
| T8.3.1 | Create note, read it back, verify content matches | [MCP-010], [MCP-012] |
| T8.3.2 | Create note, append content, verify hash chain | [MCP-010], [MCP-015], [MCP-032] |
| T8.3.3 | Create note, replace line, verify content updated | [MCP-010], [MCP-013] |
| T8.3.4 | List directory, create file, list again shows new file | [MCP-020], [MCP-010] |
| T8.3.5 | Attempt unauthorized access, receive 403 error | [AUTH-030] |
| T8.3.6 | Create note, insert line, verify insertion position | [MCP-010], [MCP-014] |
| T8.3.7 | Create note, remove it with hash, verify removal | [MCP-010], [MCP-011] |
| T8.3.8 | Edit file with stale hash, receive hash mismatch error | [MCP-034] |

## T8.4 Token Workflow

| ID | Test Case | Ref |
|----|-----------|-----|
| T8.4.1 | Generate token with CLI, configure client, connect successfully | [AUTH-012] |
| T8.4.2 | Token with limited scope restricts agent access | [AUTH-030] |
| T8.4.3 | Expired token rejected, agent must re-authenticate | [AUTH-016] |
