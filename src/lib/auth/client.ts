export const TOKEN_COOKIE = "auth_token";

export function getClientAuthStatus(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const hasAuthIndicator =
      document.cookie.includes(TOKEN_COOKIE) ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");

    return !!hasAuthIndicator;
  } catch {
    return false;
  }
}
