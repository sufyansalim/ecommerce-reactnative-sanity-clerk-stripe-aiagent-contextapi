// Context exports (providers and hooks only)
export { CartProvider, useCartState, useCartDispatch, useCart } from './CartContext';
export { WishlistProvider, useWishlistState, useWishlistDispatch, useWishlist } from './WishlistContext';
export { AppProvider, useAppState, useAppDispatch, useApp } from './AppContext';
export { AuthProvider, useAuth } from './AuthContext';

// Re-export actions for convenience
export { addToCart, deleteFromCart, clearCart } from '../actions/cartActions';
export { addToWishlist, removeFromWishlist, clearWishlist } from '../actions/wishlistActions';
export { 
  fetchBrands, 
  setBrandProducts,
  fetchCelebrities, 
  setCelebrityProducts,
  fetchTvShows, 
  setTvProducts,
  fetchSimilarProducts 
} from '../actions/appActions';
