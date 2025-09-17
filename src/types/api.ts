import { CategoryType } from "@/lib/constants";

// Base types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
}

// User types
export interface User {
  id: string;
  username: string;
  role: string;
  code?: string;
  name?: string;
  address?: string;
  delivery_area?: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface LoginDto {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Product types
export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: Category;
  product_status?: {
    id: string;
    name: string;
  };
  categoryId: string;
  vendor: Vendor;
  vendorId: string;
  barcode?: string;
  price: number;
  sale_price: number;
  inventory_amount: number;
  low_inventory_threshold: number;
  isActive: boolean;
  imageUrl?: string;
  thumbnail_url?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductSearchParams {
  search?: string;
  category_id?: string;
  category_ids?: string; // Added for multi-select support
  product_group_ids?: string; // Added for product group support
  vendorId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Order types
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  COMPLETED: "Hoàn thành", 
  CANCELLED: "Đã huỷ",
};

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  INSURANCE = 'INSURANCE',
  ORGANIZATION = 'ORGANIZATION'
}

export enum SaleMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  INSURANCE = 'INSURANCE',
  MOBILE_MONEY = 'MOBILE_MONEY'
}

export interface OrderItem {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  code: string;
  userId: string;
  user?: User;
  customerType: CustomerType;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  saleMethod: SaleMethod;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  total_value: number; // Added for consistency with API response
  order_status: string; // Added order_status field
  isPaid: boolean;
  isCompleted: boolean;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderDto {
  items: {
    product_id: number; // Changed from productId string to product_id number
    quantity: number;
    unit_price: number; // Changed from unit_price to unit_price
  }[];
}

// Shopping Cart types (for frontend state)
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Message types
export interface CreateMessageDto {
  full_name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
}

export interface Message {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
  status?: string;
  created_at: string;
  updated_at: string;
}
