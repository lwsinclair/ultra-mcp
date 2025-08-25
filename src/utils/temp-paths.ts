import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Get a cross-platform temp file path
 */
export function getTempFilePath(filename: string): string {
  return join(tmpdir(), filename);
}

/**
 * Get the system temp directory path
 */
export function getTempDir(): string {
  return tmpdir();
}