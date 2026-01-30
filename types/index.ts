/**
 * Types Index
 * Re-export all types for easy imports
 * 
 * Usage: import { Product, CartItem } from '../types';
 */

export * from './product';
export * from './navigation';

/**
 * Common utility types
 */

// For API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// For loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// User from Clerk
export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  primaryEmailAddress?: {
    emailAddress: string;
  } | null;
  imageUrl?: string | null;
}

// Order type
export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  userEmail?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}
