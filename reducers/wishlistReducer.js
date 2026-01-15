// Wishlist Action Types
export const WISHLIST_ADD = 'WISHLIST_ADD';
export const WISHLIST_REMOVE = 'WISHLIST_REMOVE';
export const WISHLIST_CLEAR = 'WISHLIST_CLEAR';

// Initial State
export const initialWishlistState = {
  wishlist: [],
  loading: false,
  error: null
};

// Reducer
export const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ADD:
      // Check if product already exists in wishlist
      const exists = state.wishlist.find(item => item.id === action.product.id);
      if (exists) {
        return state; // Don't add duplicates
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.product]
      };

    case WISHLIST_REMOVE:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.productId)
      };

    case WISHLIST_CLEAR:
      return {
        ...state,
        wishlist: []
      };

    default:
      return state;
  }
};
