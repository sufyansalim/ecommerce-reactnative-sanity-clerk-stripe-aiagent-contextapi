/**
 * Store Index - TypeScript Version
 * 
 * This is the main entry point for all Redux-related imports.
 * Import everything from here instead of from individual files.
 * 
 * Usage:
 *   import { store, useCart, addToCart, RootState } from './store';
 */

// Export store and types
export { store, default } from './store';
export type { RootState, AppDispatch } from './store';

// Re-export hooks and everything from hooks
export { 
  // Typed base hooks
  useAppDispatch, 
  useAppSelector,
  
  // Custom hooks
  useCart,
  useWishlist,
  useAppData,
  
  // Cart actions
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  
  // Wishlist actions
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  
  // App data actions
  fetchBrands,
  fetchCelebrities,
  fetchTvShows,
  fetchSimilarProducts,
  clearSimilarProducts,
  
  // Cart selectors
  selectCart,
  selectCartCount,
  selectCartTotal,
  
  // Wishlist selectors
  selectWishlist,
  selectWishlistCount,
  selectIsInWishlist,
  
  // App data selectors
  selectBrands,
  selectCelebrities,
  selectTvShows,
  selectSimilarProducts,
  selectBrandsLoading,
  selectCelebritiesLoading,
  selectTvShowsLoading,
  selectSimilarProductsLoading
} from './hooks';

// Re-export AuthProvider for convenience (from context)
export { AuthProvider, useAuth } from '../context/AuthContext';
