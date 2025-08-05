import type { Product } from '@/types/api';

/**
 * Get the product image URL with fallback logic
 * Priority: thumbnail_url -> first photo_url -> null
 */
export function getProductImageUrl(product: Product): string | null {
  if (product.thumbnail_url) {
    return product.thumbnail_url;
  }
  if (product.photo_urls && product.photo_urls.length > 0) {
    return product.photo_urls[0];
  }
  return null;
}
