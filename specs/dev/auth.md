<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Authentication

Ref: [ADR-0003](/docs/decisions/0003-unified-multi-tenant-and-local-deployment.md)

This document is **internal** (implementation and configuration). User-facing auth and scope semantics are specified in `specs/user/auth.md`.

## Token Issuers

- [AUTH-010] While in SaaS mode, the system shall authenticate users via the configured external IdP for login and token management. (Ref: [DEP-011])
- [AUTH-011] While in SaaS mode, the system shall accept agent access tokens issued by RootSpace and signed by an RootSpace-managed signing key.
- [AUTH-012] While in local mode, the system shall accept agent access tokens minted by CLI and signed with the local signing secret.

## JWT Validation

- [AUTH-015] The system shall extract user ID from the `sub` claim and scopes from the `scope` claim (space-delimited).
- [AUTH-016] The system shall reject tokens with missing or expired `exp` claim.
- [AUTH-017] The system shall reject the `none` algorithm.
- [AUTH-018] While in SaaS mode, the system shall accept only `RS256` and `ES256` algorithms and discover signing keys via JWKS endpoint.
- [AUTH-019] While in local mode, the system shall use `HS256` with the local signing secret.

## Path Handling

- [AUTH-040] The system shall normalize request `path` values before scope matching and filesystem access. (Ref: [MCP-025], [MCP-026])
- [AUTH-041] The system shall reject platform-specific absolute path syntaxes (e.g., `C:\\...`) and any path that escapes the user's root after normalization. (Ref: [MCP-027], [MCP-028])
- [AUTH-042] The system shall enforce root containment after resolving symlinks (realpath containment) to prevent symlink-based escapes.
