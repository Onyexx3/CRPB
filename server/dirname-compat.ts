/**
 * Compatibility module for __dirname in both ESM and CJS
 * In production (CJS bundle), returns the dist/ directory
 * In development (ESM), returns the server/ directory
 */

import path from 'path';
import { fileURLToPath } from 'url';

// For development (ESM): Use import.meta to get __dirname equivalent
// For production (CJS bundle): Use process.cwd() + 'dist'
export function getDirname(): string {
  // In production, the bundled server.cjs is in dist/
  // So we need to return the dist directory
  if (process.env.NODE_ENV === 'production') {
    return path.join(process.cwd(), 'dist');
  }
  
  // In development, we're running from server/ directory
  try {
    // Try Node.js 20.11+ import.meta.dirname first
    if (typeof import.meta !== 'undefined' && 'dirname' in import.meta) {
      return import.meta.dirname as string;
    }
    
    // Fallback to import.meta.url for older Node.js versions
    if (typeof import.meta !== 'undefined' && 'url' in import.meta && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch (error) {
    // If import.meta is not available, fall through
  }
  
  // Last fallback: return server directory relative to cwd
  return path.join(process.cwd(), 'server');
}

// Export a constant for convenience
export const dirname = getDirname();
