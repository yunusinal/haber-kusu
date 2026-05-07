import { logInteraction } from "./api";
import { getStoredUserId } from "./useAnonymousUser";
import type { InteractionType } from "./types";

/**
 * Fire-and-forget etkileşim kaydedici.
 * UI'yi hiçbir zaman bloklamaz; ağ hatalarını sessizce yutar.
 */
export function trackInteraction(
  articleId: number,
  type: InteractionType,
  dwellTimeMs?: number
): void {
  const userId = getStoredUserId();
  if (!userId) return;

  logInteraction({
    user_id: userId,
    article_id: articleId,
    interaction_type: type,
    dwell_time_ms: dwellTimeMs,
  }).catch(() => {});
}
