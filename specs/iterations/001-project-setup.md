<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>
-->

# Iteration 1: Project Setup & HTTP Server

Ref: [ADR-0004](/docs/decisions/0004-typescript-with-node-js.md), [DEP-001]

## Goal

Initialize TypeScript/Node.js project with a functional HTTP server listening on port 9999.

## Deliverables

- Working HTTP server on localhost:9999
- Health check endpoint
- Development tooling configured
- Test infrastructure ready

## Tasks

### 1.1 Initialize Node.js Project

- [ ] Create `package.json` with project metadata
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up ESLint and Prettier
- [ ] Configure Vitest for testing

### 1.2 HTTP Server Foundation (Ref: [DEP-001])

- [ ] Implement HTTP server listening on port 9999
- [ ] Add `/health` endpoint returning `200 OK`
- [ ] Configure graceful shutdown on SIGTERM/SIGINT

### 1.3 Data Directory Setup (Ref: [DEP-002])

- [ ] Implement `~/rootspace/` directory creation on startup
- [ ] Add configuration for custom data directory path

### 1.4 Build and Run Scripts

- [ ] Add `npm run dev` for development with hot reload
- [ ] Add `npm run build` for production build
- [ ] Add `npm run start` for production server
- [ ] Add `npm run test` for running tests

## Test Cases

See [tests/001-project-setup.md](/specs/tests/001-project-setup.md)
