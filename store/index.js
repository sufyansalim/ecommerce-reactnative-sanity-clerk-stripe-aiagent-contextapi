// Main store exports
export { store, default } from './store';

// Re-export hooks for easy imports
export { 
  useAppDispatch, 
  useAppSelector,
  useCart,
  useWishlist,
  useAppData,
  // Actions
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
  clearSimilarProducts,
  // Selectors
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
} from './hooks';

// Re-export AuthProvider for convenience (from context)
export { AuthProvider, useAuth } from '../context/AuthContext';
