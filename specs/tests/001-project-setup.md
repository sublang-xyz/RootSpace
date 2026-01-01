<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 1 — Project Setup & HTTP Server

## T1.1 HTTP Server Startup

| ID | Test Case | Ref |
| ---- | --------- | --- |
| T1.1.1 | Server starts and listens on port 9999 | [DEP-001] |
| T1.1.2 | Server creates `~/rootspace/` directory if not exists | [DEP-002] |
| T1.1.3 | Server uses custom data directory when configured | [DEP-002] |

## T1.2 Health Check

| ID | Test Case | Ref |
| ---- | --------- | --- |
| T1.2.1 | `GET /health` returns 200 OK | [DEP-001] |
| T1.2.2 | `GET /health` response includes server version | [DEP-001] |

## T1.3 Graceful Shutdown

| ID | Test Case | Ref |
| ---- | --------- | --- |
| T1.3.1 | Server shuts down gracefully on SIGTERM | [DEP-001] |
| T1.3.2 | Server shuts down gracefully on SIGINT | [DEP-001] |
| T1.3.3 | In-flight requests complete before shutdown | [DEP-001] |
