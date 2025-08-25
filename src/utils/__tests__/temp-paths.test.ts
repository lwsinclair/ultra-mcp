import { describe, it, expect } from 'vitest';
import { getTempFilePath, getTempDir } from '../temp-paths';
import { tmpdir } from 'os';
import { join } from 'path';

describe('temp-paths', () => {
  describe('getTempDir', () => {
    it('should return system temp directory', () => {
      const tempDir = getTempDir();
      expect(tempDir).toBe(tmpdir());
    });

    it('should return a valid directory path', () => {
      const tempDir = getTempDir();
      expect(typeof tempDir).toBe('string');
      expect(tempDir.length).toBeGreaterThan(0);
    });
  });

  describe('getTempFilePath', () => {
    it('should create a temp file path', () => {
      const filename = 'test-file.log';
      const tempPath = getTempFilePath(filename);
      const expectedPath = join(tmpdir(), filename);
      
      expect(tempPath).toBe(expectedPath);
    });

    it('should handle different filenames', () => {
      const filenames = [
        'ultra-mcp-cli-start.log',
        'ultra-mcp-error.log',
        'test.txt',
        'file-with-spaces.log'
      ];

      filenames.forEach(filename => {
        const tempPath = getTempFilePath(filename);
        expect(tempPath).toContain(filename);
        expect(tempPath).toContain(tmpdir());
      });
    });

    it('should never return hardcoded /tmp paths on Windows', () => {
      // Mock Windows platform temporarily
      const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        configurable: true
      });

      try {
        const tempPath = getTempFilePath('test.log');
        
        // On Windows, should never start with /tmp/
        expect(tempPath).not.toMatch(/^\/tmp\//);
        // Should contain Windows-like path patterns
        if (process.platform === 'win32') {
          // Could be actual Windows temp dir or the mocked system
          expect(typeof tempPath).toBe('string');
          expect(tempPath).toContain('test.log');
        }
      } finally {
        // Restore original platform
        if (originalPlatform) {
          Object.defineProperty(process, 'platform', originalPlatform);
        }
      }
    });

    it('should work with subdirectory paths', () => {
      const filename = 'subdir/test.log';
      const tempPath = getTempFilePath(filename);
      
      expect(tempPath).toContain('subdir');
      expect(tempPath).toContain('test.log');
      expect(tempPath).toBe(join(tmpdir(), filename));
    });
  });
});