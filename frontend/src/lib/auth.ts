export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
}

export function saveRefreshToken(token: string) {
  localStorage.setItem("refresh_token", token);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}