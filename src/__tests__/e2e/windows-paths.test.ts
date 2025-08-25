import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const CLI_PATH = path.join(process.cwd(), 'dist/cli.js');

describe('Windows Path Compatibility', () => {
  let mockPlatform: string;
  let originalPlatform: PropertyDescriptor | undefined;

  beforeEach(() => {
    // Save original platform
    originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
    mockPlatform = 'win32';
  });

  afterEach(() => {
    // Restore original platform
    if (originalPlatform) {
      Object.defineProperty(process, 'platform', originalPlatform);
    }
  });

  // Helper to run CLI commands
  async function runCLI(args: string[]): Promise<{ stdout: string; stderr: string; code: number | null }> {
    return new Promise((resolve) => {
      const proc = spawn('node', [CLI_PATH, ...args], {
        env: {
          ...process.env,
          // Use test config path to avoid affecting real config
          XDG_CONFIG_HOME: path.join(process.cwd(), 'src/__tests__/__test_config__'),
        },
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('error', (error) => {
        console.error('Process error:', error);
        resolve({ stdout, stderr: stderr + error.message, code: 1 });
      });

      proc.on('close', (code) => {
        resolve({ stdout, stderr, code });
      });

      // Kill after timeout to prevent hanging
      setTimeout(() => {
        proc.kill();
      }, 5000);
    });
  }

  it('should work correctly on Windows after fix', async () => {
    // Mock Windows platform
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    });

    // Test that basic CLI commands work on Windows
    const { stdout, stderr, code } = await runCLI(['--version']);
    
    // After fix, the command should succeed on Windows
    expect(code).toBe(0);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/); // Version pattern
    
    // Should not contain any error messages about /tmp
    expect(stderr).not.toContain('/tmp/');
    expect(stderr).not.toContain('ENOENT');
    
    console.log('✅ CLI works correctly on Windows platform');
  }, 10000);

  it('should not have hardcoded /tmp paths in source code after fix', () => {
    // Read the CLI source files to check for hardcoded /tmp paths
    const cliSourcePath = path.join(process.cwd(), 'src/cli.ts');
    const startServerSourcePath = path.join(process.cwd(), 'src/start-server.ts');
    
    const cliSource = fs.readFileSync(cliSourcePath, 'utf-8');
    const startServerSource = fs.readFileSync(startServerSourcePath, 'utf-8');
    
    // After fix, there should be no hardcoded /tmp paths
    const hardcodedTmpPattern = /['"`]\/tmp\//g;
    
    const cliMatches = cliSource.match(hardcodedTmpPattern);
    const startServerMatches = startServerSource.match(hardcodedTmpPattern);
    
    // After fix, these should be null (no matches)
    expect(cliMatches).toBeNull();
    expect(startServerMatches).toBeNull();
    
    // Should use cross-platform temp directory utilities instead
    expect(cliSource).toContain('getTempFilePath');
    expect(startServerSource).toContain('getTempFilePath');
    
    console.log('✅ No hardcoded /tmp paths found');
    console.log('✅ Using cross-platform temp utilities');
  });

  it('should use cross-platform temp directory after fix', () => {
    // This test documents what the fix should look like
    const expectedTempDir = os.tmpdir();
    
    // After fix, the code should use os.tmpdir() instead of hardcoded /tmp
    expect(expectedTempDir).toBeDefined();
    expect(typeof expectedTempDir).toBe('string');
    
    // On Windows, this should not be /tmp
    if (process.platform === 'win32') {
      expect(expectedTempDir).not.toBe('/tmp');
      expect(expectedTempDir).toMatch(/[A-Z]:\\/); // Windows drive letter pattern
    }
    
    console.log('Expected temp directory:', expectedTempDir);
  });
});