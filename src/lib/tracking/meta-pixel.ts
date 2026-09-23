// =============================================================================
// AÏLYS Luxury E-commerce — Meta Pixel Client Service
// Currency: strictly "TND" (Tunisian Dinar)
// Deduplication: Order ID deduplication for Purchase events
// Graceful fallback: Complete no-op when NEXT_PUBLIC_META_PIXEL_ID is absent
// =============================================================================

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Set to deduplicate purchase events within the browser session
const firedPurchases = new Set<string>();

export function isMetaPixelAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function" && Boolean(META_PIXEL_ID);
}

/**
 * Standard PageView event
 */
export function trackPageView() {
  if (!isMetaPixelAvailable()) return;
  try {
    window.fbq!("track", "PageView");
  } catch (err) {
    console.debug("[MetaPixel] PageView failed:", err);
  }
}

/**
 * Standard ViewContent event (Product Detail Page)
 */
export function trackViewContent(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  currency?: string;
}) {
  if (!isMetaPixelAvailable()) return;
  try {
    window.fbq!("track", "ViewContent", {
      content_name: params.content_name,
      content_ids: params.content_ids,
      content_type: "product",
      value: params.value,
      currency: params.currency || "TND",
    });
  } catch (err) {
    console.debug("[MetaPixel] ViewContent failed:", err);
  }
}

/**
 * Standard Search event (Catalog search)
 */
export function trackSearch(search_string: string) {
  if (!isMetaPixelAvailable() || !search_string.trim()) return;
  try {
    window.fbq!("track", "Search", {
      search_string: search_string.trim(),
    });
  } catch (err) {
    console.debug("[MetaPixel] Search failed:", err);
  }
}

/**
 * Standard AddToCart event
 */
export function trackAddToCart(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  currency?: string;
}) {
  if (!isMetaPixelAvailable()) return;
  try {
    window.fbq!("track", "AddToCart", {
      content_name: params.content_name,
      content_ids: params.content_ids,
      content_type: "product",
      value: params.value,
      currency: params.currency || "TND",
    });
  } catch (err) {
    console.debug("[MetaPixel] AddToCart failed:", err);
  }
}

/**
 * Standard InitiateCheckout event
 */
export function trackInitiateCheckout(params: {
  value: number;
  num_items: number;
  currency?: string;
}) {
  if (!isMetaPixelAvailable()) return;
  try {
    window.fbq!("track", "InitiateCheckout", {
      value: params.value,
      currency: params.currency || "TND",
      num_items: params.num_items,
    });
  } catch (err) {
    console.debug("[MetaPixel] InitiateCheckout failed:", err);
  }
}

/**
 * Standard Purchase event
 * Strictly requires a confirmed server order ID to deduplicate.
 */
export function trackPurchase(params: {
  orderId: string;
  value: number;
  currency?: string;
  num_items?: number;
  content_ids?: string[];
}) {
  if (!isMetaPixelAvailable()) return;
  if (!params.orderId) {
    console.warn("[MetaPixel] trackPurchase called without orderId. Ignored for integrity.");
    return;
  }

  // Deduplication check
  if (firedPurchases.has(params.orderId)) {
    console.debug(`[MetaPixel] Purchase event for order ${params.orderId} already fired. Deduplicating.`);
    return;
  }

  try {
    window.fbq!(
      "track",
      "Purchase",
      {
        value: params.value,
        currency: params.currency || "TND",
        num_items: params.num_items || 1,
        content_type: "product",
        content_ids: params.content_ids || [],
      },
      { eventID: params.orderId }
    );
    firedPurchases.add(params.orderId);
  } catch (err) {
    console.debug("[MetaPixel] Purchase failed:", err);
  }
}
