<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# 3. Unified Multi-Tenant and Local Deployment

Date: 2025-12-27

## Status

Accepted

## Context

- RootSpace must run as both multi-tenant SaaS and single-tenant local server.
- Users grant different scopes to different AI agents.
- We need maximum code reuse while supporting fine-grained authorization.

## Decision

Adopt a **remote-first** architecture: single HTTP/SSE server, identical across environments.

### Transport

HTTP/SSE only. Major MCP clients now support HTTP natively. Local daemon auto-starts as a login item (launchd/systemd/Windows Service).

### Authentication

JWT Bearer tokens for both modes:

| Mode  | Token Issuer                  |
|-------|-------------------------------|
| SaaS  | External IdP via OAuth        |
| Local | CLI with local signing secret |

Core validates scopes identically regardless of issuer.

### Isolation

Tenant-agnostic endpoints. User context extracted from token; all queries filter by user ID (no separate infrastructure per tenant).

## Consequences

**Benefits**: Code reuse; one auth flow, one test path; consent UI works naturally (localhost web page).

**Tradeoffs**: Slightly more setup friction for local users (daemon required); accepted for simpler architecture.

**Risks**: Scope-matching bugs could leak data — mitigate with default-deny policy and comprehensive tests.
