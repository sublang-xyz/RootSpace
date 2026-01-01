<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 6: Local Authentication

Ref: [ADR-0003](/docs/decisions/0003-unified-multi-tenant-and-local-deployment.md), [AUTH-012], [AUTH-019]

## Goal

Implement JWT authentication for local mode with CLI token minting.

## Deliverables

- JWT validation middleware
- Local signing secret management
- CLI command for minting tokens
- Token extraction from requests

## Tasks

### 6.1 Local Signing Secret (Ref: [AUTH-019])

- [ ] Generate signing secret on first run if not exists
- [ ] Store secret in `~/rootspace/.secret.key`
- [ ] Use HS256 algorithm for local mode

### 6.2 JWT Validation (Ref: [AUTH-015], [AUTH-016], [AUTH-017])

- [ ] Extract Bearer token from Authorization header
- [ ] Validate token signature with local secret
- [ ] Extract `sub` claim as user ID
- [ ] Extract `scope` claim (space-delimited scopes)
- [ ] Reject tokens with missing or expired `exp` claim
- [ ] Reject `none` algorithm

### 6.3 CLI Token Minting (Ref: [AUTH-012])

- [ ] Add `rootspace token` CLI command
- [ ] Accept `--scope` flag (repeatable) for scope list
- [ ] Accept `--expires` flag for expiration duration
- [ ] Output JWT token to stdout
- [ ] Default user ID to local username or `local-user`

### 6.4 Request Context

- [ ] Create middleware to extract and validate token
- [ ] Attach user context (user ID, scopes) to request
- [ ] Return 401 for missing/invalid tokens

## Test Cases

See [tests/006-local-auth.md](/specs/tests/006-local-auth.md)
