<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Storage

Ref: [ADR-0005](/docs/decisions/0005-mcp-text-file-content-interface.md)

This document is **user-facing**. It describes storage conventions visible to MCP clients and end users (file paths, naming, and organization).

## Format

- [STG-001] The system shall store text content as Markdown files and binary content as raw files.
- [STG-002] The file identifier shall be its full normalized path from the user's root filesystem (e.g., `/notes/privacy-policies-across-ai-agents.md`). (Ref: [MCP-025])
- [STG-003] Filenames should be slugs derived from titles to support recall and legibility.

## Organization

- [STG-010] The system shall allow user-defined folder structure.
- [STG-011] Content types (chats, notes, attachments) shall be organizational conventions, not distinct storage mechanisms.
