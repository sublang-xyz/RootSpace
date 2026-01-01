<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Tests: Iteration 6 — Local Authentication

## T6.1 Signing Secret

| ID | Test Case | Ref |
|----|-----------|-----|
| T6.1.1 | Secret generated on first run if not exists | [AUTH-019] |
| T6.1.2 | Secret stored in `~/rootspace/.secret.key` | [AUTH-019] |
| T6.1.3 | Existing secret loaded on subsequent runs | [AUTH-019] |

## T6.2 JWT Validation

| ID | Test Case | Ref |
|----|-----------|-----|
| T6.2.1 | Valid HS256 token with correct secret accepted | [AUTH-019] |
| T6.2.2 | Token with wrong secret rejected | [AUTH-019] |
| T6.2.3 | Token with `none` algorithm rejected | [AUTH-017] |
| T6.2.4 | Token with expired `exp` rejected | [AUTH-016] |
| T6.2.5 | Token without `exp` claim rejected | [AUTH-016] |
| T6.2.6 | `sub` claim extracted as user ID | [AUTH-015] |
| T6.2.7 | `scope` claim parsed as space-delimited list | [AUTH-015] |
| T6.2.8 | Token with RS256 algorithm rejected in local mode | [AUTH-019] |

## T6.3 CLI Token Minting

| ID | Test Case | Ref |
|----|-----------|-----|
| T6.3.1 | `rootspace token --scope read:/` generates valid JWT | [AUTH-012] |
| T6.3.2 | Multiple `--scope` flags included in token | [AUTH-012] |
| T6.3.3 | `--expires 1h` sets correct expiration | [AUTH-012] |
| T6.3.4 | Default expiration applied when `--expires` omitted | [AUTH-012] |
| T6.3.5 | Token output to stdout | [AUTH-012] |
| T6.3.6 | Default user ID is local username or `local-user` | [AUTH-012] |

## T6.4 Request Authentication

| ID | Test Case | Ref |
|----|-----------|-----|
| T6.4.1 | Request without Authorization header returns 401 | [AUTH-001] |
| T6.4.2 | Request with invalid token returns 401 | [AUTH-001] |
| T6.4.3 | Request with valid token succeeds | [AUTH-001] |
| T6.4.4 | User context attached to request after validation | [AUTH-002] |
