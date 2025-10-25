import { API } from "./auth";

async function readJson<T>(r: Response): Promise<T> {
  const t = await r.text();
  return JSON.parse(t) as T;
}

export async function apiGet<T>(path: string, token: string, init?: RequestInit) {
  const r = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers || {}) },
    cache: "no-store",
    ...init,
  });
  if (r.status < 200 || r.status >= 300) throw new Error(`HTTP ${r.status}`);
  return readJson<T>(r);
}

export async function apiPut<T>(path: string, token: string, body: unknown) {
  const r = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  if (r.status < 200 || r.status >= 300) throw new Error(`HTTP ${r.status}`);
  return readJson<T>(r);
}
