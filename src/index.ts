// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>

import { loadConfig } from './config.js';
import { createHttpServer } from './server.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const { start, stop } = createHttpServer(config);

  // Graceful shutdown handlers
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    await stop();
    console.log('Server stopped');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  await start();
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
