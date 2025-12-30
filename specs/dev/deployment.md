# Deployment

Ref: [ADR-0003](/docs/decisions/0003-unified-multi-tenant-and-local-deployment.md), [ADR-0004](/docs/decisions/0004-typescript-with-node-js.md)

This document is **internal** (implementation and operations). MCP consumers should not need to rely on `DEP-*` details beyond what is surfaced via the MCP interface and auth scopes.

## Local Mode

- [DEP-001] The system shall run as a persistent HTTP daemon on port 9999.
- [DEP-002] The system shall store data in `~/.ownspace/` by default.
- [DEP-003] The system shall auto-start as a login item (launchd/systemd/Windows Service).
- [DEP-004] The system shall treat the data directory as the root filesystem for all MCP `path` parameters.

## SaaS Mode

- [DEP-010] The system shall run as an HTTP/SSE server. (Ref: [MCP-002])
- [DEP-011] The system shall use external IdP for OAuth authentication. (Ref: [AUTH-010])
- [DEP-012] The system shall isolate tenant data by filtering queries with user ID from token.
- [DEP-013] The system shall use tenant-agnostic endpoints (no tenant ID in URL).
- [DEP-014] The system shall expose a per-user root filesystem (cloud-backed) for all MCP `path` parameters.

## Shared Behavior

- [DEP-020] While running in either mode, the system shall use identical scope validation logic. (Ref: [AUTH-030])
- [DEP-021] While running in either mode, the system shall use identical MCP protocol handling. (Ref: [MCP-001])
