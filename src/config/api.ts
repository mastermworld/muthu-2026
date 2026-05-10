/**
 * Production builds MUST NOT fall back to localhost — browsers resolve that on the
 * user's machine (ERR_CONNECTION_REFUSED). Empty string = same origin (`/api/...`).
 */
const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

export const API_URL =
  envUrl || (import.meta.env.PROD ? '' : 'http://localhost:8080');
