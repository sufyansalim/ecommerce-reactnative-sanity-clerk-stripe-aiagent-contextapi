/**
 * @deprecated This file is deprecated. Please import from '../store' instead.
 * 
 * Migration Guide:
 * - Old: import { useCartState, useCartDispatch } from '../context'
 * - New: import { useCartState, useAppDispatch } from '../store'
 * 
 * Key Changes:
 * - useCartDispatch, useWishlistDispatch, useAppDispatch → useAppDispatch (single dispatch)
 * - Actions are now called with dispatch(actionName(payload)) instead of actionName(dispatch, payload)
 * - All providers replaced with single Redux Provider in App.js
 */

// Re-export from store for backwards compatibility during migration
export { 
  AuthProvider, 
  useAuth,
  useCartState,
  useWishlistState,
  useAppState,
  useAppDispatch,
  useAppDispatch as useCartDispatch, // Alias for migration
  useAppDispatch as useWishlistDispatch, // Alias for migration
  useCart,
  useWishlist,
  addToCart,
  deleteFromCart,
  clearCart,
  updateCartQuantity,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  fetchBrands,
  setBrandProducts,
  fetchCelebrities,
  setCelebrityProducts,
  fetchTvShows,
  setTvProducts,
  fetchSimilarProducts
} from '../store';

// Legacy exports - these no longer exist, included for reference
// CartProvider, WishlistProvider, AppProvider - Replaced by Redux Provider
