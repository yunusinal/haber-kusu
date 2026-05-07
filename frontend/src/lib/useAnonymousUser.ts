"use client";

import { useEffect, useState } from "react";
import { createOrGetAnonymousUser } from "./api";

const STORAGE_KEY = "haberKusu_user_id";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useAnonymousUser(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id: string;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        id = stored;
      } else {
        id = generateUUID();
        localStorage.setItem(STORAGE_KEY, id);
      }
    } catch {
      id = generateUUID();
    }

    setUserId(id);

    createOrGetAnonymousUser(id).catch(() => {
      // Ağ hatası sessizce geçilir — interaction router da kullanıcıyı oluşturur
    });
  }, []);

  return userId;
}

export function getStoredUserId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
