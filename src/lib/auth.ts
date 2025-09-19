// src/lib/auth.ts
export function saveAuthToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('token', token);
}
export function clearAuthToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('token');
}
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
export function isLoggedIn(): boolean {
  return !!getAuthToken();
}
