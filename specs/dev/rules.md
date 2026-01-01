<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Rules

This document is **internal** (repository contribution rules).

## Commit Message Format

- Use `<type>(<optional scope>)<optional !>: <subject>` format.
- Type: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `build`, `perf`, or `chore`.
- `!` for breaking changes.
- Subject: imperative, ≤50 chars, no period. Example: `feat(auth): add OAuth login`.
- Body: explain **what/why** (not how); wrap at 72 chars; use bullets if clearer.
- Co-authorship: add trailer if AI-assisted.
- Signing: required.

## Spec Item Format

- Each spec item shall be self-contained and not rely on section headers for context.
- Item IDs shall not be modified once assigned; new items shall use higher IDs.
