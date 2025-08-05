import { API_BASE_URL, API_ENDPOINTS } from './api-config';
import type { ApiResponse, LoginResponse } from '@/types/api';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.isRefreshing) {
      // If already refreshing, wait for the current refresh to complete
      return this.refreshPromise || Promise.resolve(false);
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<boolean> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;
    
    if (!refreshToken) {
      console.log('No refresh token available');
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        console.log('Refresh token request failed:', response.status);
        return false;
      }

      const data: LoginResponse = await response.json();
      
      if (data.access_token) {
        this.setAccessToken(data.access_token);
        if (data.refresh_token && typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        console.log('Token refreshed successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle 401 Unauthorized - token might be expired
        if (response.status === 401 && !isRetry) {
          console.log('Received 401, attempting token refresh...');
          
          // Try to refresh the token
          const refreshSuccess = await this.refreshAccessToken();
          
          if (refreshSuccess) {
            // Retry the original request with the new token
            console.log('Token refresh successful, retrying original request...');
            return this.request<T>(endpoint, options, true);
          } else {
            // Refresh failed, clear tokens and redirect to login
            console.log('Token refresh failed, redirecting to login...');
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return {
          success: false,
          error: data?.message || `HTTP ${response.status}: ${response.statusText}`,
          data: undefined,
        };
      }

      return {
        success: true,
        data,
        message: data?.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        data: undefined,
      };
    }
  }

  // HTTP methods
  async get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle array parameters (e.g., categoryIds)
            value.forEach(item => {
              if (item !== undefined && item !== null) {
                searchParams.append(key, item.toString());
              }
            });
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
      url += `?${searchParams.toString()}`;
    }
    
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile<T = unknown>(endpoint: string, formData: FormData, isRetry: boolean = false): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && !isRetry) {
          console.log('Received 401 in file upload, attempting token refresh...');
          
          // Try to refresh the token
          const refreshSuccess = await this.refreshAccessToken();
          
          if (refreshSuccess) {
            // Retry the original upload with the new token
            console.log('Token refresh successful, retrying file upload...');
            return this.uploadFile<T>(endpoint, formData, true);
          } else {
            // Refresh failed, clear tokens and redirect to login
            console.log('Token refresh failed, redirecting to login...');
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return {
          success: false,
          error: data?.message || `HTTP ${response.status}: ${response.statusText}`,
          data: undefined,
        };
      }

      return {
        success: true,
        data,
        message: data?.message,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload error',
        data: undefined,
      };
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
