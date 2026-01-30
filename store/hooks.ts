/**
 * Redux Hooks - TypeScript Version
 * 
 * TYPESCRIPT CONCEPTS:
 * 
 * 1. TYPED HOOKS - We create typed versions of useDispatch and useSelector
 *    This gives us autocomplete and type checking throughout the app
 * 
 * 2. TypedUseSelectorHook<RootState> - A specialized useSelector that knows
 *    about our store's state shape
 * 
 * 3. CUSTOM HOOK RETURN TYPES - We define interfaces for what each hook returns
 *    This helps with documentation and autocomplete
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Import actions from slices
import { 
  addToCart, 
  deleteFromCart as removeFromCart, 
  updateCartQuantity as updateQuantity, 
  clearCart,
  selectCart,
  selectCartItemCount as selectCartCount,
  selectCartTotal 
} from './slices/cartSlice';

import { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  selectWishlist,
  selectWishlistCount,
  selectIsInWishlist 
} from './slices/wishlistSlice';

import {
  fetchBrands,
  fetchCelebrities,
  fetchTvShows,
  fetchSimilarProducts,
  clearSimilarProducts,
  selectBrands,
  selectCelebrities,
  selectTvShows,
  selectSimilarProducts,
  selectBrandsLoading,
  selectCelebritiesLoading,
  selectTvShowsLoading,
  selectSimilarProductsLoading
} from './slices/appSlice';

// Import types
import { Product, CartItem, WishlistItem, Brand, Celebrity, TvShow } from '../types';

// ============================================
// TYPED BASE HOOKS
// ============================================

/**
 * Typed dispatch hook
 * 
 * Use this instead of plain useDispatch() to get proper typing
 * for async thunks and regular actions
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed selector hook
 * 
 * Use this instead of plain useSelector() to get autocomplete
 * for state.cart, state.wishlist, state.app, etc.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================
// TYPE DEFINITIONS FOR CUSTOM HOOKS
// ============================================

/**
 * Return type for useCart hook
 */
interface UseCartReturn {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * Return type for useWishlist hook
 */
interface UseWishlistReturn {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

/**
 * Parameters for fetchSimilarProducts
 */
interface FetchSimilarProductsParams {
  categoryName: string;
  excludeProductId?: string;
}

/**
 * Return type for useAppData hook
 */
interface UseAppDataReturn {
  brands: Brand[];
  celebrities: Celebrity[];
  tvShows: TvShow[];
  similarProducts: Product[];
  brandsLoading: boolean;
  celebritiesLoading: boolean;
  tvShowsLoading: boolean;
  similarProductsLoading: boolean;
  fetchBrands: () => void;
  fetchCelebrities: () => void;
  fetchTvShows: () => void;
  fetchSimilarProducts: (params: FetchSimilarProductsParams) => void;
  clearSimilarProducts: () => void;
}

// ============================================
// CUSTOM HOOKS
// ============================================

/**
 * Custom hook for cart operations
 * 
 * Provides access to cart state and actions in a single, easy-to-use hook
 * 
 * Usage:
 *   const { cart, cartTotal, addToCart } = useCart();
 *   addToCart(product);
 */
export const useCart = (): UseCartReturn => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart: (product: CartItem) => dispatch(addToCart(product)),
    removeFromCart: (productId: string) => dispatch(removeFromCart(productId)),
    updateQuantity: (productId: string, quantity: number) => 
      dispatch(updateQuantity({ productId, quantity })),
    clearCart: () => dispatch(clearCart())
  };
};

/**
 * Custom hook for wishlist operations
 * 
 * Usage:
 *   const { wishlist, isInWishlist, addToWishlist } = useWishlist();
 *   if (!isInWishlist(productId)) addToWishlist(product);
 */
export const useWishlist = (): UseWishlistReturn => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(selectWishlist);
  const wishlistCount = useAppSelector(selectWishlistCount);

  return {
    wishlist,
    wishlistCount,
    addToWishlist: (product: WishlistItem) => dispatch(addToWishlist(product)),
    removeFromWishlist: (productId: string) => dispatch(removeFromWishlist(productId)),
    clearWishlist: () => dispatch(clearWishlist()),
    isInWishlist: (productId: string) => 
      wishlist.some(item => (item._id) === productId)
  };
};

/**
 * Custom hook for app data (brands, celebrities, TV shows)
 * 
 * Usage:
 *   const { brands, brandsLoading, fetchBrands } = useAppData();
 *   useEffect(() => { fetchBrands(); }, []);
 */
export const useAppData = (): UseAppDataReturn => {
  const dispatch = useAppDispatch();
  const brands = useAppSelector(selectBrands);
  const celebrities = useAppSelector(selectCelebrities);
  const tvShows = useAppSelector(selectTvShows);
  const similarProducts = useAppSelector(selectSimilarProducts);
  const brandsLoading = useAppSelector(selectBrandsLoading);
  const celebritiesLoading = useAppSelector(selectCelebritiesLoading);
  const tvShowsLoading = useAppSelector(selectTvShowsLoading);
  const similarProductsLoading = useAppSelector(selectSimilarProductsLoading);

  return {
    brands,
    celebrities,
    tvShows,
    similarProducts,
    brandsLoading,
    celebritiesLoading,
    tvShowsLoading,
    similarProductsLoading,
    fetchBrands: () => dispatch(fetchBrands()),
    fetchCelebrities: () => dispatch(fetchCelebrities()),
    fetchTvShows: () => dispatch(fetchTvShows()),
    fetchSimilarProducts: (params: FetchSimilarProductsParams) => 
      dispatch(fetchSimilarProducts(params)),
    clearSimilarProducts: () => dispatch(clearSimilarProducts())
  };
};

// ============================================
// RE-EXPORTS
// ============================================

// Re-export actions for direct use
export {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  fetchBrands,
  fetchCelebrities,
  fetchTvShows,
  fetchSimilarProducts,
  clearSimilarProducts
};

// Re-export selectors
export {
  selectCart,
  selectCartCount,
  selectCartTotal,
  selectWishlist,
  selectWishlistCount,
  selectIsInWishlist,
  selectBrands,
  selectCelebrities,
  selectTvShows,
  selectSimilarProducts,
  selectBrandsLoading,
  selectCelebritiesLoading,
  selectTvShowsLoading,
  selectSimilarProductsLoading
};
