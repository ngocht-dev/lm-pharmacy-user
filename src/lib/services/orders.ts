import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { 
  Order, 
  CreateOrderDto,
  ApiResponse 
} from '@/types/api';

export const orderService = {
  // Create a new order
  async createOrder(orderData: CreateOrderDto): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS, orderData);
  },

  // Get user's orders
  async getUserOrders(params?: {
    page?: number;
    limit?: number;
    order_status?: string;
  }): Promise<ApiResponse<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    }>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params?.order_status) {
      queryParams.append('order_status', params.order_status);
    }
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.ORDERS}?${queryParams.toString()}`
      : API_ENDPOINTS.ORDERS;
    
    return apiClient.get<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    }>(url);
  },

  // Get order by ID
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`);
  },

  // Get printable receipt HTML
  async getOrderReceipt(id: string): Promise<ApiResponse<string>> {
    return apiClient.get<string>(`${API_ENDPOINTS.ORDERS}/${id}/print`);
  },

  // Download receipt as PDF
  async downloadReceiptPDF(id: string): Promise<void> {
    const response = await fetch(`${apiClient['baseURL']}${API_ENDPOINTS.ORDERS}/${id}/print/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  },
};
