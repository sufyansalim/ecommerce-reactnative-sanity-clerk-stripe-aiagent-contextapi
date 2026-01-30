/**
 * Product Types
 * These define the shape of product data from Sanity
 */

// Basic product type from Sanity
export interface Product {
  _id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
  productImage?: string;
  images?: string[];
  category?: string | { name: string; _id: string };
  brand?: { name: string; _id: string };
  inStock?: boolean;
  featured?: boolean;
  slug?: { current: string };
}

// Product in cart (extends Product with quantity)
export interface CartItem extends Product {
  id?: string; // Some items use id instead of _id
  quantity: number;
  numericPrice?: number;
  uri?: string; // For display purposes
}

// Product in wishlist
export interface WishlistItem extends Product {
  id?: string;
  uri?: string; // For display purposes
}

// Category type
export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  image?: string;
  order?: number;
}

// Brand type
export interface Brand {
  _id: string;
  name: string;
  uri?: string;
  image?: string;
  banner?: string;
  description?: string;
  products?: Product[];
}

// Celebrity type
export interface Celebrity {
  _id: string;
  name: string;
  uri?: string;
  image?: string;
  banner?: string;
  products?: Product[];
}

// TV Show type
export interface TvShow {
  _id: string;
  id?: string;
  name: string;
  uri?: string;
  image?: string;
  videoUrl?: string;
  video?: string;
  products?: Product[];
}
