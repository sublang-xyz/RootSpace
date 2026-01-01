<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 8: Client Integration

Ref: [ADR-0002](/docs/decisions/0002-adopt-mcp-as-the-agent-interface.md)

## Goal

Validate end-to-end integration with Claude Desktop and ChatGPT Desktop.

## Deliverables

- Claude Desktop configuration documented and tested
- ChatGPT Desktop configuration documented and tested
- End-to-end workflow validation

## Tasks

### 8.1 Claude Desktop Integration

- [ ] Document MCP server configuration for Claude Desktop
- [ ] Generate token with appropriate scopes
- [ ] Configure `claude_desktop_config.json` with HTTP transport
- [ ] Verify tool discovery (list all 6 tools)
- [ ] Test file operations through Claude conversation

### 8.2 ChatGPT Desktop Integration

- [ ] Document MCP server configuration for ChatGPT Desktop
- [ ] Generate token with appropriate scopes
- [ ] Configure ChatGPT MCP settings
- [ ] Verify tool discovery
- [ ] Test file operations through ChatGPT conversation

### 8.3 End-to-End Scenarios

- [ ] Create a new note via agent
- [ ] Read and modify existing content
- [ ] List directory contents
- [ ] Verify hash chain integrity across edits
- [ ] Test scope restrictions (agent cannot access unauthorized paths)

### 8.4 Documentation

- [ ] Write quickstart guide for local setup
- [ ] Document token generation workflow
- [ ] Document troubleshooting common issues

## Test Cases

See [tests/008-client-integration.md](/specs/tests/008-client-integration.md)
