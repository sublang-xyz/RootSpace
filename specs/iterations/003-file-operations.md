<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 3: Storage & File Operations

Ref: [ADR-0005](/docs/decisions/0005-mcp-text-file-content-interface.md), [MCP-010], [MCP-011], [MCP-012]

## Goal

Implement core file operations: create, remove, and read with path normalization and hash validation.

## Deliverables

- `file.create` tool functional
- `file.remove` tool functional
- `text.read` tool functional
- Path normalization and security enforced
- SHA-256 hash computation working

## Tasks

### 3.1 Path Handling (Ref: [MCP-025], [MCP-026], [MCP-027], [MCP-028])

- [ ] Implement POSIX-style path interpretation within user root
- [ ] Normalize paths: collapse `//`, remove `.`, resolve `..`
- [ ] Reject paths escaping user root after normalization
- [ ] Reject platform-specific absolute paths (e.g., `C:\...`)
- [ ] Implement realpath containment check (Ref: [AUTH-042])

### 3.2 Hash Computation (Ref: [MCP-031])

- [ ] Implement SHA-256 hex digest of stored bytes
- [ ] Handle UTF-8 encoding for text content
- [ ] Handle base64 decoding for binary content (Ref: [MCP-030])

### 3.3 file.create Tool (Ref: [MCP-010])

- [ ] Accept `path`, `content`, `encoding` parameters
- [ ] Support `utf-8` (default) and `base64` encoding
- [ ] Create parent directories as needed
- [ ] Return `hash` of created file
- [ ] Reject if file already exists

### 3.4 file.remove Tool (Ref: [MCP-011])

- [ ] Accept `path`, `hash` parameters
- [ ] Validate hash matches current file content (Ref: [MCP-032])
- [ ] Remove file from filesystem
- [ ] Return instructional error on hash mismatch indicating stale state (Ref: [MCP-034], [MCP-052])

### 3.5 text.read Tool (Ref: [MCP-012])

- [ ] Accept `path`, `lines` (optional) parameters
- [ ] Implement line range selection with Python-style indexing (Ref: [MCP-040], [MCP-041], [MCP-042])
- [ ] Return `content`, `hash`, `total_lines`
- [ ] Return not-found error for missing files (Ref: [MCP-050])

## Test Cases

See [tests/003-file-operations.md](/specs/tests/003-file-operations.md)
