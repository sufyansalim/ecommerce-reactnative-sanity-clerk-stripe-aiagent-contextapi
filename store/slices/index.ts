/**
 * Slices Index - TypeScript Version
 * 
 * Re-exports all slice reducers and actions from a single entry point
 * This makes imports cleaner throughout the app:
 * 
 * Instead of:
 *   import { addToCart } from '../store/slices/cartSlice';
 *   import { addToWishlist } from '../store/slices/wishlistSlice';
 * 
 * You can do:
 *   import { addToCart, addToWishlist } from '../store/slices';
 */

// Cart exports
export { 
  default as cartReducer,
  addToCart, 
  updateCartQuantity,
  deleteFromCart, 
  clearCart,
  setCartLoading,
  setCartError,
  selectCart, 
  selectCartLoading,
  selectCartError,
  selectCartTotal,
  selectCartItemCount
} from './cartSlice';

// Wishlist exports
export { 
  default as wishlistReducer,
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
  selectWishlist,
  selectWishlistLoading,
  selectWishlistError,
  selectWishlistCount,
  selectIsInWishlist 
} from './wishlistSlice';

// App exports
export { 
  default as appReducer,
  fetchBrands, 
  fetchCelebrities, 
  fetchTvShows, 
  fetchSimilarProducts, 
  clearSimilarProducts,
  clearAppErrors,
  selectBrands, 
  selectCelebrities, 
  selectTvShows, 
  selectSimilarProducts, 
  selectBrandsLoading, 
  selectCelebritiesLoading, 
  selectTvShowsLoading, 
  selectSimilarProductsLoading,
  selectAppErrors
} from './appSlice';
