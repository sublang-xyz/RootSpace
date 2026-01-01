<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# 5. MCP Text File Content Interface

Date: 2025-12-28

## Status

Accepted

## Context

Designing a minimal MCP interface for text file content management optimized for LLM tool calling. Must balance token efficiency, operational clarity, and error resilience.

## Decision

### Two Namespaces

| Namespace | Purpose                                                        |
|-----------|----------------------------------------------------------------|
| `file.*`  | Lifecycle operations (create, remove) — content-type agnostic  |
| `text.*`  | Content manipulation (read, replace, insert, append)           |

`file.*` is the unified lifecycle namespace. Content-type-specific namespaces (`text.*`, `json.*`, etc.) handle manipulation.

### Interface

| Tool           | Parameters                                  | Returns                            |
|----------------|---------------------------------------------|------------------------------------|
| `file.create`  | `path`, `content`, `encoding`               | `hash`                             |
| `file.remove`  | `path`, `hash`                              | —                                  |
| `text.read`    | `path`, `lines`?                            | `content`, `hash`, `total_lines`   |
| `text.replace` | `path`, `hash`, `lines`, `old`, `new`       | `hash`, `total_lines`              |
| `text.insert`  | `path`, `hash`, `line`, `anchor`, `content` | `hash`, `total_lines`              |
| `text.append`  | `path`, `hash`, `content`                   | `hash`, `total_lines`              |

### Design Principles

**Line numbers + text anchors together**: Mutations specify both line range and text anchor. Line numbers provide fast lookup; anchors verify content and protect against drift.

**Single edit per call**: No batch operations. Each edit shifts line numbers and changes content; batching requires predicting all shifts upfront. Single calls allow re-checking line numbers and anchors between edits.

**Mandatory hash validation**: Every mutation requires hash from prior read. Hash mismatch indicates stale state and triggers re-read.

**Python-style line indexing**: `[start, end)` with end exclusive, 1-indexed, negative indices supported, 0 for open-ended ranges.

**Instructional errors**: Messages guide LLM to self-correct (e.g., "Line 42 contains X, not Y").

## Consequences

**Benefits**: Six tools cover all text operations; hash chain detects conflicts; single-edit model enables incremental verification; extensible to other content types.

**Tradeoffs**: Multiple calls for multi-edit tasks; accepted for correctness through verification.
