/**
 * Utility to require environment variables
 * Throws at runtime if variable is missing
 *
 * @author Lalou
 * @date 2025-01-09
 */

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
