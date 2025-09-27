import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { 
  Product, 
  ProductSearchParams, 
  Category,
  ApiResponse 
} from '@/types/api';

export const productService = {
  // Get all products
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS_ALL);
  },

  // Search products with filters
  async searchProducts(params: ProductSearchParams = {}): Promise<ApiResponse<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  }>> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS_SEARCH, params as Record<string, unknown>);
  },

  // Get product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },

  // Get multiple products by IDs (batch)
  async getProductsByIds(ids: string[]): Promise<ApiResponse<Product[]>> {
    if (ids.length === 0) {
      return { success: true, data: [], message: 'No products requested' };
    }
    
    const params = ids.map(id => `product_ids=${encodeURIComponent(id)}`).join('&');
    return apiClient.get<Product[]>(`${API_ENDPOINTS.PRODUCTS_BATCH}?${params}`);
  },

  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES);
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
};
