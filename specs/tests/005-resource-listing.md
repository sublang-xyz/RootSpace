<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 5 — Resource Listing

## T5.1 list:// Resource

| ID | Test Case | Ref |
|----|-----------|-----|
| T5.1.1 | `list://notes/` returns immediate children only | [MCP-020] |
| T5.1.2 | `list://` returns root directory contents | [MCP-020] |
| T5.1.3 | Result distinguishes files from directories | [MCP-020] |
| T5.1.4 | Nested directories not recursively listed | [MCP-020] |
| T5.1.5 | Entries sorted alphabetically (directories first, then files) | [MCP-020] |

## T5.2 Path Handling in list://

| ID | Test Case | Ref |
|----|-----------|-----|
| T5.2.1 | Path normalized before listing: `list://notes/../work/` lists `/work/` | [MCP-026] |
| T5.2.2 | Path escaping root rejected: `list://../` | [MCP-027] |

## T5.3 Edge Cases

| ID | Test Case | Ref |
|----|-----------|-----|
| T5.3.1 | Non-existent path returns not-found error | [MCP-050] |
| T5.3.2 | Path pointing to file (not directory) returns error | [MCP-020] |
| T5.3.3 | Empty directory returns empty list | [MCP-020] |
| T5.3.4 | Hidden files (dotfiles) included in listing | [MCP-021] |
