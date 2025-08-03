import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { 
  LoginDto, 
  LoginResponse, 
  ChangePasswordDto, 
  User,
  ApiResponse 
} from '@/types/api';

export const authService = {
  // Login user
  async login(credentials: LoginDto): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
    
    if (response.success && response.data) {
      // Store tokens only (since login API doesn't return user data)
      apiClient.setAccessToken(response.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.data.refresh_token);
        console.log('Stored tokens after login'); // Debugging log
      }
    }
    
    return response;
  },

  // Get current user
  async me(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.ME);
  },

  // Change password
  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  // Logout user
  async logout(): Promise<void> {
    apiClient.clearTokens();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  // Refresh token (now handled automatically by API client)
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
        data: undefined,
      };
    }

    // Note: This method is now primarily for manual refresh
    // Automatic refresh is handled by the API client
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.REFRESH, {
      refresh_token: refreshToken,
    });

    if (response.success && response.data) {
      apiClient.setAccessToken(response.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
    }

    return response;
  },

  // Get stored user
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    console.log('Raw user string from localStorage:', userStr); // Debugging log
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      console.log('Parsed user from localStorage:', user); // Debugging log
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error); // Debugging log
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('access_token');
    const user = this.getStoredUser();
    
    console.log('Auth check - Token:', !!token, 'User:', !!user); // Debugging log
    return !!(token && user);
  },
};
