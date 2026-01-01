<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 4: Text Manipulation Tools

Ref: [ADR-0005](/docs/decisions/0005-mcp-text-file-content-interface.md), [MCP-013], [MCP-014], [MCP-015]

## Goal

Implement text mutation tools with hash validation and instructional errors.

## Deliverables

- `text.replace` tool functional
- `text.insert` tool functional
- `text.append` tool functional
- Hash chain validation enforced
- Instructional error messages

## Tasks

### 4.1 text.replace Tool (Ref: [MCP-013], [MCP-045])

- [ ] Accept `path`, `hash`, `lines`, `old`, `new` parameters
- [ ] Validate hash matches current file (Ref: [MCP-032])
- [ ] Validate `old` is full content of consecutive lines within range
- [ ] Replace matched content with `new`
- [ ] Return new `hash`, `total_lines` (Ref: [MCP-033])
- [ ] Return instructional error on hash mismatch indicating stale state (Ref: [MCP-034], [MCP-052])
- [ ] Return instructional error on content mismatch (Ref: [MCP-052])

### 4.2 text.insert Tool (Ref: [MCP-014], [MCP-046])

- [ ] Accept `path`, `hash`, `line`, `anchor`, `content` parameters
- [ ] Validate hash matches current file (Ref: [MCP-032])
- [ ] Validate `anchor` is full content of the line at position
- [ ] Insert `content` as new lines before anchor
- [ ] Return new `hash`, `total_lines` (Ref: [MCP-033])
- [ ] Return instructional error on hash mismatch indicating stale state (Ref: [MCP-034], [MCP-052])
- [ ] Return instructional error on anchor mismatch (Ref: [MCP-052])

### 4.3 text.append Tool (Ref: [MCP-015])

- [ ] Accept `path`, `hash`, `content` parameters
- [ ] Validate hash matches current file (Ref: [MCP-032])
- [ ] Append `content` to end of file
- [ ] Return new `hash`, `total_lines` (Ref: [MCP-033])
- [ ] Return instructional error on hash mismatch indicating stale state (Ref: [MCP-034], [MCP-052])

### 4.4 Line Indexing Implementation (Ref: [MCP-040], [MCP-041], [MCP-042])

- [ ] Implement 1-indexed line numbers
- [ ] Implement exclusive end in ranges `[start, end)`
- [ ] Implement negative index support
- [ ] Implement `0` for open-ended ranges

## Test Cases

See [tests/004-text-manipulation.md](/specs/tests/004-text-manipulation.md)
