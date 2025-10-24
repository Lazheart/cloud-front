/**
 * Token management utilities
 * Handles JWT token storage and retrieval
 */

const TOKEN_KEY = 'auth_token';

/**
 * Store JWT token in localStorage
 * @param token - JWT token string
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Retrieve JWT token from localStorage
 * @returns JWT token string or null if not found
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns boolean indicating if token exists
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token.length > 0;
};

/**
 * Get token with Bearer prefix for API calls
 * @returns Authorization header value or null
 */
export const getAuthHeader = (): string | null => {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
};
