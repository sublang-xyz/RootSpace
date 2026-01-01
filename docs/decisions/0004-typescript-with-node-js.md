<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# 4. TypeScript with Node.js

Date: 2025-12-27

## Status

Accepted

## Context

- MCP protocol is JSON-centric (JSON-RPC, JSON Schema, SSE).
- Official MCP SDK is TypeScript-first.
- Maximum code reuse between local and SaaS is required.

## Decision

**TypeScript with Node.js** for all components.

| Component   | Runtime    | Rationale                                       |
|-------------|------------|-------------------------------------------------|
| Shared core | TypeScript | MCP SDK native; Zod for schema validation       |
| Local       | Node.js    | npm/npx distribution; assumes Node.js installed |
| SaaS        | Node.js    | Standard deployment, same codebase              |
| Web UI      | Next.js    | Consent UI, agent management                    |

Zod ensures schemas compile to both runtime validation and static types — documentation never drifts from implementation.

## Consequences

**Benefits**: Single language and runtime; isomorphic code; MCP SDK compatibility; mature ecosystem.

**Tradeoffs**: Local users must have Node.js installed; accepted for simpler stack.
