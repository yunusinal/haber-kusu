import type { AnonymousUser, Article, Category, InteractionPayload, PaginatedArticles, RecommendedArticle } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getArticles(params: {
  page?: number;
  page_size?: number;
  category?: string;
}): Promise<PaginatedArticles> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));
  if (params.category) q.set("category", params.category);
  return fetchApi<PaginatedArticles>(`/api/articles?${q}`);
}

export async function getArticle(id: number): Promise<Article> {
  return fetchApi<Article>(`/api/articles/${id}`);
}

export async function searchArticles(params: {
  q: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedArticles> {
  const q = new URLSearchParams({ q: params.q });
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));
  return fetchApi<PaginatedArticles>(`/api/articles/search?${q}`);
}

export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>("/api/categories");
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function createOrGetAnonymousUser(userId: string): Promise<AnonymousUser> {
  return postApi<AnonymousUser>("/api/users/anonymous", { user_id: userId });
}

export async function logInteraction(payload: InteractionPayload): Promise<void> {
  await postApi<unknown>("/api/interactions", payload);
}

export async function getRecommendations(params: {
  user_id: string;
  page?: number;
  page_size?: number;
}): Promise<RecommendedArticle[]> {
  const q = new URLSearchParams({ user_id: params.user_id });
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));
  const res = await fetch(`${API_BASE}/api/recommendations?${q}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<RecommendedArticle[]>;
}