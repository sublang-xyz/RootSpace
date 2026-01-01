<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 7: Authorization & Scopes

Ref: [AUTH-020] through [AUTH-039]

## Goal

Implement scope-based authorization enforcing access control on all tools and resources.

## Deliverables

- Scope parsing and matching logic
- Access control enforcement on all MCP operations
- Default-deny policy

## Tasks

### 7.1 Scope Parsing (Ref: [AUTH-020] through [AUTH-023])

- [ ] Parse scope format: `read:/path` and `write:/path`
- [ ] Support path variations: `/`, `/work/`, `/notes/`
- [ ] Normalize scope paths before matching

### 7.2 Scope Matching (Ref: [AUTH-034] through [AUTH-038])

- [ ] Implement path prefix matching on normalized paths
- [ ] Handle `/*` suffix: match directory and direct children only
- [ ] Handle `/` suffix: match directory and all descendants
- [ ] Treat directory paths without trailing `/` or `/*` as `/` (recursive)
- [ ] Enforce case-sensitive comparisons

### 7.3 Implicit Read from Write (Ref: [AUTH-039])

- [ ] Grant `read:` access when matching `write:` scope exists

### 7.4 Access Control Enforcement (Ref: [AUTH-030], [AUTH-031], [AUTH-032])

- [ ] Default deny if no matching scope present
- [ ] Require `write:` scope for `file.create`, `file.remove`, `text.replace`, `text.insert`, `text.append`
- [ ] Require `read:` (or `write:`) scope for `text.read`, `list://`
- [ ] Return unauthorized error with instructional message (Ref: [MCP-051])

### 7.5 Integration

- [ ] Wire authorization checks into all tool handlers
- [ ] Wire authorization checks into resource handlers
- [ ] Ensure path normalization happens before authorization (Ref: [AUTH-040])

## Test Cases

See [tests/007-authorization.md](/specs/tests/007-authorization.md)
