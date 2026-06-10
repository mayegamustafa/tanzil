import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Typed helper wrappers
export async function fetchPublic<T>(path: string, params?: Record<string, any>): Promise<T> {
  const res = await api.get<{ data: T }>(path, { params });
  return res.data.data;
}

export async function postPublic<T>(path: string, body: unknown): Promise<T> {
  const res = await api.post<{ data: T }>(path, body);
  return res.data.data;
}
