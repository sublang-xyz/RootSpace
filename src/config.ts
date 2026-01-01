// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>

import { homedir } from 'node:os';
import { join } from 'node:path';

export interface Config {
  port: number;
  dataDir: string;
}

export function loadConfig(): Config {
  const port = parseInt(process.env.ROOTSPACE_PORT || '9999', 10);
  const dataDir = process.env.ROOTSPACE_DATA_DIR || join(homedir(), 'rootspace');

  return { port, dataDir };
}

export const VERSION = '0.1.0';
