import { WISHLIST_ADD, WISHLIST_REMOVE, WISHLIST_CLEAR } from '../reducers/wishlistReducer';

// Add product to wishlist
export const addToWishlist = (dispatch, product) => {
  dispatch({ type: WISHLIST_ADD, product });
};

// Remove product from wishlist
export const removeFromWishlist = (dispatch, productId) => {
  dispatch({ type: WISHLIST_REMOVE, productId });
};

// Clear entire wishlist
export const clearWishlist = (dispatch) => {
  dispatch({ type: WISHLIST_CLEAR });
};
