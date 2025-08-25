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

    it('should use os.tmpdir() instead of hardcoded paths', () => {
      // Test that our function always uses os.tmpdir()
      const tempPath = getTempFilePath('test.log');
      const expectedPath = join(tmpdir(), 'test.log');
      
      // Should always match what os.tmpdir() + filename gives us
      expect(tempPath).toBe(expectedPath);
      
      // Should contain the filename
      expect(tempPath).toContain('test.log');
      
      // The important thing is we're not hardcoding '/tmp/' but using system temp
      expect(tempPath).toBe(join(tmpdir(), 'test.log'));
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