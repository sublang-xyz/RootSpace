<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 5: Resource Listing

Ref: [MCP-020]

## Goal

Implement `list://` resource for directory browsing.

## Deliverables

- `list://{path}` resource returning directory contents
- Non-recursive listing (immediate children only)
- Proper integration with path normalization

## Tasks

### 5.1 list:// Resource Implementation (Ref: [MCP-020])

- [ ] Handle `list://{path}` resource URI pattern
- [ ] Return immediate children of the path (non-recursive)
- [ ] Include file/directory type indicators
- [ ] Apply path normalization (Ref: [MCP-026])
- [ ] Enforce path containment (Ref: [MCP-027])

### 5.2 Directory Listing Format

- [ ] Return structured list with name and type per entry
- [ ] Include dotfiles in listing (Ref: [MCP-021])
- [ ] Sort entries alphabetically (directories first, then files)
- [ ] Handle empty directories

### 5.3 Edge Cases

- [ ] Return not-found error for non-existent paths (Ref: [MCP-050])
- [ ] Return error for paths pointing to files (not directories)
- [ ] Handle root directory listing (`list://`)

## Test Cases

See [tests/005-resource-listing.md](/specs/tests/005-resource-listing.md)
