// Base types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
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
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: Category;
  categoryId: string;
  vendor: Vendor;
  vendorId: string;
  barcode?: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchParams {
  search?: string;
  categoryId?: string;
  vendorId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Order types
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
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
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
  isPaid: boolean;
  isCompleted: boolean;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerType: CustomerType;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  saleMethod: SaleMethod;
  discount?: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
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
