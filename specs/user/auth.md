# Authorization

Ref: [ADR-0003](/docs/decisions/0003-unified-multi-tenant-and-local-deployment.md)

## Audience

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

- [AUTH-034] Scope matching shall use filesystem-style glob matching on canonical, normalized paths. (Ref: [MCP-026])
- [AUTH-035] A scope ending in `/*` matches the directory itself and its direct children (one segment). Example: `/work/*` matches `/work`, `/work/a.md`, and `/work/subdir`, but not `/work/subdir/b.md`.
- [AUTH-036] `**` matches zero or more path segments (recursive). Example: `/work/**` matches `/work/a.md` and `/work/subdir/b.md`.
- [AUTH-037] A scope without wildcards matches exactly one path.
- [AUTH-038] Scope and path comparisons shall be case-sensitive.
- [AUTH-039] A scope ending in `/` shall be treated as if it ended in `/**` (e.g., `/work/` is equivalent to `/work/**`).
- [AUTH-050] A matching `write:` scope shall implicitly grant `read:` access to the same path set.

## Authorization

- [AUTH-030] The system shall deny access by default if no matching scope is present.
- [AUTH-031] `file.create`, `text.replace`, `text.insert`, `text.append`, `file.remove` require a matching `write:` scope. (Ref: [MCP-010], [MCP-011], [MCP-013]–[MCP-015])
- [AUTH-032] `text.read`, `list://` require a matching `read:` scope or a matching `write:` scope. (Ref: [MCP-012], [MCP-020])
