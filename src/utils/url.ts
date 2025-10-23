/**
 * Ensures a URL has a trailing slash
 */
export function ensureTrailingSlash(url: string): string {
  if (!url || url === '/') return '/';
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Adds trailing slash to a path if not present
 */
export function addTrailingSlash(path: string): string {
  if (!path || path === '/') return '/';
  // Don't add trailing slash to anchors or queries
  if (path.includes('#') || path.includes('?')) return path;
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Removes trailing slash from a path
 */
export function removeTrailingSlash(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
} 