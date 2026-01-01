<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 3 — Storage & File Operations

## T3.1 Path Normalization

| ID | Test Case | Ref |
|----|-----------|-----|
| T3.1.1 | Path with leading `/` is accepted: `/notes/a.md` | [MCP-025] |
| T3.1.2 | Path without leading `/` is accepted: `notes/a.md` | [MCP-025] |
| T3.1.3 | Redundant separators collapsed: `//notes//a.md` → `/notes/a.md` | [MCP-026] |
| T3.1.4 | Dot segments removed: `/notes/./a.md` → `/notes/a.md` | [MCP-026] |
| T3.1.5 | Parent segments resolved: `/notes/../work/a.md` → `/work/a.md` | [MCP-026] |
| T3.1.6 | Path escaping root rejected: `/../etc/passwd` | [MCP-027] |
| T3.1.7 | Windows absolute path rejected: `C:\Users\file.txt` | [MCP-028] |
| T3.1.8 | Symlink escaping root rejected | [AUTH-042] |

## T3.2 Hash Computation

| ID | Test Case | Ref |
|----|-----------|-----|
| T3.2.1 | Hash is SHA-256 hex digest of UTF-8 bytes | [MCP-031] |
| T3.2.2 | Hash computed on decoded bytes for base64 content | [MCP-031] |
| T3.2.3 | Hash is stable (same content produces same hash) | [MCP-031] |

## T3.3 file.create Tool

| ID | Test Case | Ref |
|----|-----------|-----|
| T3.3.1 | Create file with UTF-8 content returns hash | [MCP-010] |
| T3.3.2 | Create file with base64 content returns hash | [MCP-010], [MCP-030] |
| T3.3.3 | Create file in nested path creates parent directories | [MCP-010] |
| T3.3.4 | Create file that already exists returns error | [MCP-010] |
| T3.3.5 | Create file with default encoding (UTF-8) | [MCP-030] |
| T3.3.6 | Create file with empty content succeeds | [MCP-010] |

## T3.4 file.remove Tool

| ID | Test Case | Ref |
|----|-----------|-----|
| T3.4.1 | Remove file with matching hash succeeds | [MCP-011] |
| T3.4.2 | Remove file with mismatched hash returns instructional error | [MCP-011], [MCP-034], [MCP-052] |
| T3.4.3 | Remove non-existent file returns not-found error | [MCP-011], [MCP-050] |

## T3.5 text.read Tool

| ID | Test Case | Ref |
|----|-----------|-----|
| T3.5.1 | Read entire file returns content, hash, and total_lines | [MCP-012] |
| T3.5.2 | Read with `lines: [1, 3]` returns lines 1-2 | [MCP-012], [MCP-040] |
| T3.5.3 | Read with negative index: `lines: [-2, 0]` returns last 2 lines | [MCP-041], [MCP-042] |
| T3.5.4 | Read with open end: `lines: [5, 0]` returns line 5 to end | [MCP-042] |
| T3.5.5 | Read non-existent file returns not-found error | [MCP-050] |
| T3.5.6 | Read empty file returns empty content with total_lines 0 | [MCP-012] |
