<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Authorization

Ref: [ADR-0003](/docs/decisions/0003-unified-multi-tenant-and-local-deployment.md)

This document is **user-facing** for MCP consumers and the consent UI. All `AUTH-*` items here define externally observable authorization behavior.

## Token Format

- [AUTH-001] The system shall accept JWT Bearer tokens for all requests.
- [AUTH-002] The system shall extract user ID and granted scopes from the token.

## Scopes

Path-based authorization:

- [AUTH-020] `read:/` — read all files
- [AUTH-021] `read:/work/` — read files under work folder
- [AUTH-022] `write:/notes/` — write to notes folder
- [AUTH-023] `write:/` — write (create/modify/delete) any file

## Scope Matching

- [AUTH-034] Scope matching shall use path prefix matching on canonical, normalized paths. (Ref: [MCP-026])
- [AUTH-035] A scope ending in `/*` matches the directory and its direct children (one level). Example: `/work/*` matches `/work/a.md` but not `/work/sub/b.md`.
- [AUTH-036] A scope ending in `/` matches the directory and all descendants (recursive). Example: `/work/` matches `/work/a.md` and `/work/sub/b.md`.
- [AUTH-037] A scope path without trailing `/` or `/*` that refers to a directory shall be treated as ending in `/` (recursive).
- [AUTH-038] Scope and path comparisons shall be case-sensitive.
- [AUTH-039] A matching `write:` scope shall implicitly grant `read:` access to the same path set.

## Access Control

- [AUTH-030] The system shall deny access by default if no matching scope is present, returning HTTP 403 Forbidden. (Ref: [MCP-051])
- [AUTH-031] `file.create`, `text.replace`, `text.insert`, `text.append`, `file.remove` require a matching `write:` scope. (Ref: [MCP-010], [MCP-011], [MCP-013]–[MCP-015])
- [AUTH-032] `text.read`, `list://` require a matching `read:` scope or a matching `write:` scope. (Ref: [MCP-012], [MCP-020])
