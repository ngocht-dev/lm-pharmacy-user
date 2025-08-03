import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { 
  CreateMessageDto,
  Message,
  ApiResponse 
} from '@/types/api';

export const messageService = {
  // Create a new message
  async createMessage(messageData: CreateMessageDto): Promise<ApiResponse<Message>> {
    return apiClient.post<Message>(API_ENDPOINTS.MESSAGES, messageData);
  },

  // Get all messages (for admin use)
  async getAllMessages(): Promise<ApiResponse<Message[]>> {
    return apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES);
  },

  // Get message by ID (for admin use)
  async getMessageById(id: string): Promise<ApiResponse<Message>> {
    return apiClient.get<Message>(`${API_ENDPOINTS.MESSAGES}/${id}`);
  },
};
