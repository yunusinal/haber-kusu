export interface Category {
  id: number;
  slug: string;
  name: string;
}

export interface Source {
  id: number;
  channel_id: number;
  name: string;
  url: string | null;
  enabled: boolean;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
  link: string;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  source: Source;
  category: Category | null;
}

export interface PaginatedArticles {
  total: number;
  page: number;
  page_size: number;
  items: Article[];
}

// ── Öneri sistemi ─────────────────────────────────────────────────

export type InteractionType = "view" | "save" | "like" | "dislike" | "dwell_time";

export interface InteractionPayload {
  user_id: string;
  article_id: number;
  interaction_type: InteractionType;
  dwell_time_ms?: number;
}

export interface RecommendedArticle extends Article {
  score: number;
}

export interface AnonymousUser {
  id: string;
  created_at: string;
  last_seen: string;
}
