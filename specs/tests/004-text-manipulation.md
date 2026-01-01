<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 4 — Text Manipulation Tools

## T4.1 text.replace Tool

| ID | Test Case | Ref |
|----|-----------|-----|
| T4.1.1 | Replace single line within range returns new hash and total_lines | [MCP-013] |
| T4.1.2 | Replace multiple consecutive lines returns new hash | [MCP-013], [MCP-045] |
| T4.1.3 | Replace with stale hash returns instructional error | [MCP-032], [MCP-034] |
| T4.1.4 | Replace with non-matching `old` content returns instructional error | [MCP-045], [MCP-052] |
| T4.1.5 | Replace with `old` outside `lines` range returns error | [MCP-045] |
| T4.1.6 | Replace that changes line count updates total_lines | [MCP-013] |
| T4.1.7 | Replace on non-existent file returns not-found error | [MCP-050] |

## T4.2 text.insert Tool

| ID | Test Case | Ref |
|----|-----------|-----|
| T4.2.1 | Insert before anchor line returns new hash and total_lines | [MCP-014] |
| T4.2.2 | Insert with stale hash returns instructional error | [MCP-032], [MCP-034] |
| T4.2.3 | Insert with non-matching anchor returns instructional error | [MCP-046], [MCP-052] |
| T4.2.4 | Insert at line 1 with correct anchor prepends content | [MCP-014] |
| T4.2.5 | Insert multiple lines increases total_lines accordingly | [MCP-014] |
| T4.2.6 | Insert on non-existent file returns not-found error | [MCP-050] |

## T4.3 text.append Tool

| ID | Test Case | Ref |
|----|-----------|-----|
| T4.3.1 | Append to file returns new hash and total_lines | [MCP-015] |
| T4.3.2 | Append with stale hash returns instructional error | [MCP-032], [MCP-034] |
| T4.3.3 | Append to empty file succeeds | [MCP-015] |
| T4.3.4 | Append multiple lines increases total_lines accordingly | [MCP-015] |
| T4.3.5 | Append on non-existent file returns not-found error | [MCP-050] |

## T4.4 Line Indexing

| ID | Test Case | Ref |
|----|-----------|-----|
| T4.4.1 | Line index 1 refers to first line | [MCP-040] |
| T4.4.2 | Range `[1, 2)` selects only line 1 | [MCP-040] |
| T4.4.3 | Negative index -1 refers to last line | [MCP-041] |
| T4.4.4 | Negative index -2 refers to second-to-last line | [MCP-041] |
| T4.4.5 | Range `[1, 0]` selects from line 1 to end | [MCP-042] |
| T4.4.6 | Range `[-3, 0]` selects last 3 lines | [MCP-041], [MCP-042] |
