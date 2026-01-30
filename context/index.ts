/**
 * @deprecated This file is deprecated. Please import from '../store' instead.
 */

export { 
  AuthProvider, 
  useAuth,
  useCart,
  useWishlist,
  useAppData,
  useAppDispatch,
  useAppDispatch as useCartDispatch,
  useAppDispatch as useWishlistDispatch,
  addToCart,
  removeFromCart as deleteFromCart,
  clearCart,
  updateQuantity as updateCartQuantity,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  fetchBrands,
  fetchCelebrities,
  fetchTvShows,
  fetchSimilarProducts
} from '../store';

// Alias for backwards compatibility
export { useCart as useCartState } from '../store';
export { useWishlist as useWishlistState } from '../store';
export { useAppData as useAppState } from '../store';
