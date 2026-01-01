<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 7 — Authorization & Scopes

## T7.1 Scope Parsing

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.1.1 | `read:/` parsed as read permission on root | [AUTH-020] |
| T7.1.2 | `write:/notes/` parsed as write permission on notes folder | [AUTH-022] |
| T7.1.3 | Multiple scopes in token parsed correctly | [AUTH-015] |

## T7.2 Scope Matching — Recursive

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.2.1 | `read:/work/` matches `/work/a.md` | [AUTH-036] |
| T7.2.2 | `read:/work/` matches `/work/sub/b.md` | [AUTH-036] |
| T7.2.3 | `read:/work/` does not match `/workfiles/a.md` | [AUTH-034] |
| T7.2.4 | `read:/work` (no trailing /) treated as `/work/` | [AUTH-037] |

## T7.3 Scope Matching — Single Level

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.3.1 | `read:/work/*` matches `/work/a.md` | [AUTH-035] |
| T7.3.2 | `read:/work/*` does not match `/work/sub/b.md` | [AUTH-035] |

## T7.4 Case Sensitivity

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.4.1 | `read:/Work/` does not match `/work/a.md` | [AUTH-038] |
| T7.4.2 | `read:/work/` does not match `/Work/a.md` | [AUTH-038] |

## T7.5 Implicit Read from Write

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.5.1 | `write:/notes/` allows `text.read` on `/notes/a.md` | [AUTH-039] |
| T7.5.2 | `write:/notes/` allows `list://notes/` | [AUTH-039] |

## T7.6 Access Control — Tools

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.6.1 | `file.create` without write scope returns 403 | [AUTH-031] |
| T7.6.2 | `file.remove` without write scope returns 403 | [AUTH-031] |
| T7.6.3 | `text.replace` without write scope returns 403 | [AUTH-031] |
| T7.6.4 | `text.insert` without write scope returns 403 | [AUTH-031] |
| T7.6.5 | `text.append` without write scope returns 403 | [AUTH-031] |
| T7.6.6 | `text.read` without read scope returns 403 | [AUTH-032] |

## T7.7 Access Control — Resources

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.7.1 | `list://notes/` without read scope returns 403 | [AUTH-032] |
| T7.7.2 | `list://notes/` with write scope succeeds | [AUTH-032], [AUTH-039] |

## T7.8 Default Deny

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.8.1 | Request with empty scopes denied access to all paths | [AUTH-030] |
| T7.8.2 | Request with unrelated scope denied access | [AUTH-030] |

## T7.9 Path Normalization Before Authorization

| ID | Test Case | Ref |
|----|-----------|-----|
| T7.9.1 | Scope matching uses normalized path: `/notes/../work/a.md` checked against `/work/` | [AUTH-040] |
| T7.9.2 | Scope matching uses normalized path: `//notes//a.md` checked against `/notes/` | [AUTH-040] |
