/**
 * Navigation Types
 * Defines the screens and their parameters
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from './product';

// Main Tab Navigator
export type MainTabParamList = {
  HomeStack: undefined;
  BrandStack: undefined;
  CelebrityStack: undefined;
  CategoryStack: undefined;
  CartStack: undefined;
};

// Home Stack
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  Search: undefined;
};

// Brand Stack
export type BrandStackParamList = {
  Brands: undefined;
  BrandProduct: { 
    banner?: string;
    products?: Product[];
  };
};

// Celebrity Stack
export type CelebrityStackParamList = {
  Celebrities: undefined;
  CelebrityProduct: { 
    banner?: string;
    products?: Product[];
  };
};

// Category Stack
export type CategoryStackParamList = {
  Categories: undefined;
  CategoryProducts: { 
    categorySlug: string;
    categoryName: string;
  };
};

// Cart Stack
export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  Thankyou: { 
    sessionId?: string;
    orderNumber?: string;
  };
};

// Auth Stack
export type AuthStackParamList = {
  AuthSignin: { returnToCheckout?: boolean };
  AuthRegister: { returnToCheckout?: boolean };
};

// Root Navigator (combines all)
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  SideNav: undefined;
  ProductDetail: { product: Product };
} & AuthStackParamList;
