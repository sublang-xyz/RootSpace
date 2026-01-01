<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# MCP Interface

Ref: [ADR-0002](/docs/decisions/0002-adopt-mcp-as-the-agent-interface.md), [ADR-0005](/docs/decisions/0005-mcp-text-file-content-interface.md)

This document is **user-facing** for MCP clients/agents integrating with RootSpace. All `MCP-*` items define externally observable behavior. Authorization is specified in `specs/user/auth.md`.

## Protocol

- [MCP-001] The system shall act as an MCP server exposing Tools and Resources.
- [MCP-002] The system shall communicate via HTTP/SSE transport.
- [MCP-005] The system shall assign a unique session ID (UUID v4) via `mcp-session-id` header on initialization and reject requests with unknown session IDs with HTTP 404.

## Namespaces

- [MCP-003] `file.*` shall be the unified lifecycle namespace (content-type agnostic).
- [MCP-004] `text.*` shall handle text content manipulation.

## Tools

| ID | Tool | Parameters | Returns |
| ---- | ------ | ------------ | --------- |
| [MCP-010] | `file.create` | `path`, `content`, `encoding` | `hash` |
| [MCP-011] | `file.remove` | `path`, `hash` | — |
| [MCP-012] | `text.read` | `path`, `lines`? | `content`, `hash`, `total_lines` |
| [MCP-013] | `text.replace` | `path`, `hash`, `lines`, `old`, `new` | `hash`, `total_lines` |
| [MCP-014] | `text.insert` | `path`, `hash`, `line`, `anchor`, `content` | `hash`, `total_lines` |
| [MCP-015] | `text.append` | `path`, `hash`, `content` | `hash`, `total_lines` |

## Resources

- [MCP-020] When an agent reads `list://{path}`, the system shall return immediate children of the path (non-recursive).
- [MCP-021] The list resource shall include dotfiles (entries beginning with `.`) in the response.

## Paths

- [MCP-025] All `path` values shall be interpreted as POSIX-style paths within the user's root filesystem; a leading `/` is allowed but does not indicate an OS-level absolute path.
- [MCP-026] The system shall normalize paths before authorization and filesystem access, including collapsing redundant separators (e.g., `//`), removing `.` segments, and resolving `..` segments.
- [MCP-027] The system shall reject any path that would escape the user's root while resolving `..` segments.
- [MCP-028] The system shall treat `/` as the path separator on all platforms and shall reject platform-specific absolute path syntaxes (e.g., `C:\...`).

## Encoding

- [MCP-030] `encoding` shall accept `utf-8` (default) or `base64`.

## Hash Validation

- [MCP-031] `hash` shall be the SHA-256 hex digest of the stored bytes: UTF-8 encoded for text, decoded for base64. No newline normalization.
- [MCP-032] Every mutation shall require `hash` from a prior read.
- [MCP-033] Every mutation shall return the new `hash`.
- [MCP-034] Hash mismatch shall indicate stale state and trigger re-read.

## Line Indexing

- [MCP-040] `lines` shall be a two-element array `[start, end]` with end exclusive, 1-indexed.
- [MCP-041] Negative indices shall be supported.
- [MCP-042] `0` shall indicate open-ended range.

## Text Matching

- [MCP-045] `old` in `text.replace` shall be the full content of one or more consecutive lines within the `lines` range.
- [MCP-046] `anchor` in `text.insert` shall be the full content of a line; `content` is inserted as new lines before it.

## Error Handling

- [MCP-050] If a requested resource does not exist, the system shall return a not-found error.
- [MCP-051] If the agent lacks required scope, the system shall return HTTP 403 Forbidden. (Ref: [AUTH-030])
- [MCP-052] Errors shall be instructional to guide LLM self-correction.
