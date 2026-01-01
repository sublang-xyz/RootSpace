// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 SubLang contributors <https://github.com/sublang-xyz>

import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { createHttpServer, ensureDataDir, ServerInstance } from './server.js';
import { loadConfig, Config, VERSION } from './config.js';
import { rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import { spawn, ChildProcess } from 'node:child_process';
import { createServer as createNetServer } from 'node:net';
import { request, IncomingMessage } from 'node:http';

const TEST_PORT = 19999;

// Check if a port is available for binding
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createNetServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}
const TEST_DATA_DIR = join(tmpdir(), 'rootspace-test-' + Date.now());

// Spawn server as child process and wait for it to be ready
function spawnServer(
  port: number,
  dataDir: string
): Promise<{ child: ChildProcess; kill: (signal: NodeJS.Signals) => void }> {
  return new Promise((resolve, reject) => {
    // Cross-platform: use Node with tsx loader (requires Node 18.19+)
    const child = spawn(process.execPath, ['--import', 'tsx', 'src/index.ts'],
      {
        env: { ...process.env, ROOTSPACE_PORT: String(port), ROOTSPACE_DATA_DIR: dataDir },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

    let output = '';
    let settled = false;

    // Timeout if server doesn't start
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill();
        reject(new Error(`Server failed to start: ${output}`));
      }
    }, 5000);

    const onData = (chunk: Buffer) => {
      output += chunk.toString();
      if (!settled && output.includes('listening on port')) {
        settled = true;
        clearTimeout(timeoutId);
        child.stdout?.off('data', onData);
        resolve({
          child,
          kill: (signal: NodeJS.Signals) => child.kill(signal),
        });
      }
    };

    child.stdout?.on('data', onData);
    child.stderr?.on('data', (chunk: Buffer) => {
      output += chunk.toString();
    });

    child.on('error', (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        reject(err);
      }
    });
  });
}

function makeRequest(
  port: number,
  path: string,
  method = 'GET'
): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const req = request(
      { hostname: 'localhost', port, path, method, headers: { Connection: 'close' } },
      (res: IncomingMessage) => {
        let data = '';
        res.on('data', (chunk: string) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode ?? 0, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode ?? 0, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

describe('T1.1 HTTP Server Startup', () => {
  let serverInstance: ServerInstance;
  const savedPort = process.env.ROOTSPACE_PORT;
  const savedDataDir = process.env.ROOTSPACE_DATA_DIR;

  beforeEach(() => {
    // Ensure clean env for default value tests
    delete process.env.ROOTSPACE_PORT;
    delete process.env.ROOTSPACE_DATA_DIR;
  });

  afterEach(async () => {
    // Restore original env
    if (savedPort === undefined) {
      delete process.env.ROOTSPACE_PORT;
    } else {
      process.env.ROOTSPACE_PORT = savedPort;
    }
    if (savedDataDir === undefined) {
      delete process.env.ROOTSPACE_DATA_DIR;
    } else {
      process.env.ROOTSPACE_DATA_DIR = savedDataDir;
    }

    if (serverInstance) {
      await serverInstance.stop();
    }
  });

  it('T1.1.1: Default config uses port 9999 and server can start', async () => {
    // Test that loadConfig() returns default port 9999
    const defaultConfig = loadConfig();
    expect(defaultConfig.port).toBe(9999);

    // Test server can start and listen
    serverInstance = createHttpServer({ port: TEST_PORT, dataDir: TEST_DATA_DIR });
    await serverInstance.start();

    const address = serverInstance.server.address();
    expect(address).not.toBeNull();
    expect(typeof address === 'object' && address?.port).toBe(TEST_PORT);
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  it('T1.1.1a: Server actually binds to port 9999 when available', async (ctx) => {
    const port9999Available = await isPortAvailable(9999);
    if (!port9999Available) {
      ctx.skip();
      return;
    }

    const testDir = join(tmpdir(), 'rootspace-port9999-' + Date.now());
    serverInstance = createHttpServer({ port: 9999, dataDir: testDir });
    await serverInstance.start();

    try {
      const address = serverInstance.server.address();
      expect(address).not.toBeNull();
      expect(typeof address === 'object' && address?.port).toBe(9999);

      // Verify we can actually connect to port 9999
      const res = await makeRequest(9999, '/health');
      expect(res.status).toBe(200);
    } finally {
      await serverInstance.stop();
      serverInstance = undefined as unknown as ServerInstance; // Prevent double-stop in afterEach
      await rm(testDir, { recursive: true, force: true });
    }
  });

  it('T1.1.2: Server creates ~/rootspace/ directory if not exists', async () => {
    // Use a temporary HOME to verify default ~/rootspace creation
    const fakeHome = join(tmpdir(), 'rootspace-fakehome-' + Date.now());
    const savedHome = process.env.HOME;
    const savedUserProfile = process.env.USERPROFILE;

    // Set HOME for Unix, USERPROFILE for Windows (os.homedir() checks both)
    process.env.HOME = fakeHome;
    if (process.platform === 'win32') {
      process.env.USERPROFILE = fakeHome;
    }

    try {
      // loadConfig() should return ~/rootspace under fake home
      const defaultConfig = loadConfig();
      expect(defaultConfig.dataDir).toBe(join(fakeHome, 'rootspace'));

      // Start server with default config - should create ~/rootspace
      serverInstance = createHttpServer(defaultConfig);
      await serverInstance.start();

      const stats = await stat(join(fakeHome, 'rootspace'));
      expect(stats.isDirectory()).toBe(true);
    } finally {
      if (savedHome === undefined) {
        delete process.env.HOME;
      } else {
        process.env.HOME = savedHome;
      }
      if (process.platform === 'win32') {
        if (savedUserProfile === undefined) {
          delete process.env.USERPROFILE;
        } else {
          process.env.USERPROFILE = savedUserProfile;
        }
      }
      await rm(fakeHome, { recursive: true, force: true });
    }
  });

  it('T1.1.3: Server uses custom data directory when configured', async () => {
    const customDir = join(tmpdir(), 'rootspace-custom-' + Date.now());

    // Test ROOTSPACE_DATA_DIR env var override
    process.env.ROOTSPACE_DATA_DIR = customDir;
    const envConfig = loadConfig();
    expect(envConfig.dataDir).toBe(customDir);

    // Test server uses custom directory
    serverInstance = createHttpServer({ port: TEST_PORT, dataDir: customDir });
    await serverInstance.start();

    const stats = await stat(customDir);
    expect(stats.isDirectory()).toBe(true);
    await rm(customDir, { recursive: true, force: true });
  });
});

describe('T1.2 Health Check', () => {
  let serverInstance: ServerInstance;
  const config: Config = { port: TEST_PORT, dataDir: TEST_DATA_DIR };

  beforeAll(async () => {
    serverInstance = createHttpServer(config);
    await serverInstance.start();
  });

  afterAll(async () => {
    await serverInstance.stop();
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });

  it('T1.2.1: GET /health returns 200 OK', async () => {
    const res = await makeRequest(TEST_PORT, '/health');
    expect(res.status).toBe(200);
    expect((res.body as { status: string }).status).toBe('ok');
  });

  it('T1.2.2: GET /health response includes server version', async () => {
    const res = await makeRequest(TEST_PORT, '/health');
    expect((res.body as { version: string }).version).toBe(VERSION);
  });
});

describe('T1.3 Graceful Shutdown', () => {
  // Skip signal tests on Windows - SIGTERM/SIGINT are Unix signals
  const isWindows = process.platform === 'win32';

  it('T1.3.1: Server shuts down gracefully on SIGTERM', async (ctx) => {
    if (isWindows) {
      ctx.skip();
      return;
    }
    const testDir = join(tmpdir(), 'rootspace-sigterm-' + Date.now());
    const { child } = await spawnServer(TEST_PORT + 1, testDir);

    try {
      // Verify server is responding
      const healthRes = await makeRequest(TEST_PORT + 1, '/health');
      expect(healthRes.status).toBe(200);

      // Send SIGTERM and wait for exit with timeout
      const exitCode = await new Promise<number | null>((resolve, reject) => {
        const timeout = setTimeout(() => {
          child.kill('SIGKILL');
          reject(new Error('Server did not exit within 5s after SIGTERM'));
        }, 5000);

        child.on('exit', (code) => {
          clearTimeout(timeout);
          resolve(code);
        });

        child.kill('SIGTERM');
      });

      // Graceful shutdown should call process.exit(0)
      expect(exitCode).toBe(0);
    } finally {
      child.kill('SIGKILL'); // Ensure cleanup
      await rm(testDir, { recursive: true, force: true });
    }
  });

  it('T1.3.2: Server shuts down gracefully on SIGINT', async (ctx) => {
    if (isWindows) {
      ctx.skip();
      return;
    }
    const testDir = join(tmpdir(), 'rootspace-sigint-' + Date.now());
    const { child } = await spawnServer(TEST_PORT + 2, testDir);

    try {
      // Verify server is responding
      const healthRes = await makeRequest(TEST_PORT + 2, '/health');
      expect(healthRes.status).toBe(200);

      // Send SIGINT and wait for exit with timeout
      const exitCode = await new Promise<number | null>((resolve, reject) => {
        const timeout = setTimeout(() => {
          child.kill('SIGKILL');
          reject(new Error('Server did not exit within 5s after SIGINT'));
        }, 5000);

        child.on('exit', (code) => {
          clearTimeout(timeout);
          resolve(code);
        });

        child.kill('SIGINT');
      });

      // Graceful shutdown should call process.exit(0)
      expect(exitCode).toBe(0);
    } finally {
      child.kill('SIGKILL'); // Ensure cleanup
      await rm(testDir, { recursive: true, force: true });
    }
  });

  it('T1.3.3: In-flight requests complete before shutdown', async () => {
    const config: Config = { port: TEST_PORT + 3, dataDir: TEST_DATA_DIR };
    const serverInstance = createHttpServer(config);

    // Intercept response to add delay, ensuring request is in-flight when stop() is called
    serverInstance.server.prependListener('request', (_req, res) => {
      const originalEnd = res.end.bind(res);
      res.end = ((...args: Parameters<typeof res.end>) => {
        setTimeout(() => originalEnd(...args), 50);
      }) as typeof res.end;
    });

    await serverInstance.start();

    // Start request and wait for connection to be established
    const connectionEstablished = new Promise<void>((resolve) => {
      serverInstance.server.once('connection', () => resolve());
    });
    const requestPromise = makeRequest(TEST_PORT + 3, '/health');
    await connectionEstablished;

    // Stop while response is delayed (in-flight)
    const stopPromise = serverInstance.stop();

    // Both should complete: request successfully, then shutdown
    const [res] = await Promise.all([requestPromise, stopPromise]);
    expect(res.status).toBe(200);

    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  });
});

describe('loadConfig', () => {
  const originalPort = process.env.ROOTSPACE_PORT;
  const originalDataDir = process.env.ROOTSPACE_DATA_DIR;

  afterEach(() => {
    // Restore original env
    if (originalPort === undefined) {
      delete process.env.ROOTSPACE_PORT;
    } else {
      process.env.ROOTSPACE_PORT = originalPort;
    }
    if (originalDataDir === undefined) {
      delete process.env.ROOTSPACE_DATA_DIR;
    } else {
      process.env.ROOTSPACE_DATA_DIR = originalDataDir;
    }
  });

  it('returns default port 9999 when ROOTSPACE_PORT not set', () => {
    delete process.env.ROOTSPACE_PORT;
    const config = loadConfig();
    expect(config.port).toBe(9999);
  });

  it('returns ROOTSPACE_PORT when set', () => {
    process.env.ROOTSPACE_PORT = '8080';
    const config = loadConfig();
    expect(config.port).toBe(8080);
  });

  it('returns default dataDir ~/rootspace when ROOTSPACE_DATA_DIR not set', () => {
    delete process.env.ROOTSPACE_DATA_DIR;
    const config = loadConfig();
    expect(config.dataDir).toBe(join(homedir(), 'rootspace'));
  });

  it('returns ROOTSPACE_DATA_DIR when set', () => {
    process.env.ROOTSPACE_DATA_DIR = '/custom/path';
    const config = loadConfig();
    expect(config.dataDir).toBe('/custom/path');
  });
});

describe('ensureDataDir', () => {
  const testDir = join(tmpdir(), 'rootspace-ensure-' + Date.now());

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('creates directory if not exists', async () => {
    await ensureDataDir(testDir);
    const stats = await stat(testDir);
    expect(stats.isDirectory()).toBe(true);
  });

  it('succeeds if directory already exists', async () => {
    await ensureDataDir(testDir);
    await ensureDataDir(testDir); // Should not throw
    const stats = await stat(testDir);
    expect(stats.isDirectory()).toBe(true);
  });
});
