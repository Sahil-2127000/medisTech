// Backend address. The website uses localhost; the Android app is built with VITE_API_URL
// pointing at the computer running the backend (see .env.android).
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

// ---- Mobile app login ----
// Inside the Android app the login cookie isn't sent, so the app keeps the login token
// and attaches it as "Authorization: Bearer <token>". The website keeps cookie-only login.
const TOKEN_KEY = 'authToken';
const inNativeApp = () => !!window.Capacitor?.isNativePlatform?.();

export const saveAuthToken = (token) => {
  try { if (token && inNativeApp()) localStorage.setItem(TOKEN_KEY, token); } catch { /* storage unavailable */ }
};

export const clearAuthToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
};

// Adds the saved token to every request that goes to the backend.
export const installAuthFetch = () => {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    let token = null;
    try { token = localStorage.getItem(TOKEN_KEY); } catch { /* storage unavailable */ }
    const url = typeof input === 'string' ? input : input?.url || '';
    if (token && url.startsWith(API_URL)) {
      const headers = new Headers(init.headers || (typeof input === 'string' ? undefined : input.headers));
      if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
      init = { ...init, headers };
    }
    return originalFetch(input, init);
  };
};
