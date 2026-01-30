import { useDispatch, useSelector } from 'react-redux';
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

// Base hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Cart hooks
export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart: (product) => dispatch(addToCart(product)),
    removeFromCart: (productId) => dispatch(removeFromCart(productId)),
    updateQuantity: (productId, quantity) => dispatch(updateQuantity({ productId, quantity })),
    clearCart: () => dispatch(clearCart())
  };
};

// Wishlist hooks
export const useWishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const wishlistCount = useSelector(selectWishlistCount);

  return {
    wishlist,
    wishlistCount,
    addToWishlist: (product) => dispatch(addToWishlist(product)),
    removeFromWishlist: (productId) => dispatch(removeFromWishlist(productId)),
    clearWishlist: () => dispatch(clearWishlist()),
    isInWishlist: (productId) => wishlist.some(item => (item.id || item._id) === productId)
  };
};

// App data hooks
export const useAppData = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const celebrities = useSelector(selectCelebrities);
  const tvShows = useSelector(selectTvShows);
  const similarProducts = useSelector(selectSimilarProducts);
  const brandsLoading = useSelector(selectBrandsLoading);
  const celebritiesLoading = useSelector(selectCelebritiesLoading);
  const tvShowsLoading = useSelector(selectTvShowsLoading);
  const similarProductsLoading = useSelector(selectSimilarProductsLoading);

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
    fetchSimilarProducts: ({ categoryName, excludeProductId }) => dispatch(fetchSimilarProducts({ categoryName, excludeProductId })),
    clearSimilarProducts: () => dispatch(clearSimilarProducts())
  };
};

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
