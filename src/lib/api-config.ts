// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  
  // Users
  USERS: '/users',
  
  // Products
  PRODUCTS: '/products',
  PRODUCTS_ALL: '/products/all',
  PRODUCTS_SEARCH: '/products',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Orders
  ORDERS: '/orders',
  
  // Vendors
  VENDORS: '/vendors',
  
  // Messages
  MESSAGES: '/messages',
} as const;

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;
