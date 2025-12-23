# 2. Adopt Model Context Protocol as the Agent Interface

Date: 2025-12-23

## Status

Accepted

## Context

OwnSpace needs a standardized interface for AI agents to access the user's knowledge space — without building custom integrations for each client.

## Decision

Adopt MCP (Model Context Protocol) as the agent interface. OwnSpace acts as an MCP server exposing Resources, Tools, and Prompts.

### Deployment

One implementation, two transports:

| Transport       |  Use Case           | Privacy              |
|-----------------|---------------------|----------------------|
| stdio           | Local-only          | Maximum (no network) |
| Streamable HTTP | Remote/multi-device | Requires OAuth       |

### Authentication

Two distinct flows:

- **User login** — OwnSpace as OAuth *client*: supports Google, GitHub, other social logins via OIDC
- **Agent access** — OwnSpace as OAuth *provider*: OAuth 2.1 with PKCE, Dynamic Client Registration, Metadata Discovery

User identity is decoupled from agent authorization.

### Ecosystem

MCP is the de-facto standard: native support in Claude, ChatGPT, Cursor; governed by Linux Foundation (Anthropic, OpenAI, Google, Microsoft, AWS).

## Consequences

**Benefits:** Immediate interoperability with major AI clients; user controls which agents access their data; local-first or cloud from same codebase; self-contained agent auth.

**Tradeoffs:** Protocol dependency — mitigated by open governance and industry convergence.
