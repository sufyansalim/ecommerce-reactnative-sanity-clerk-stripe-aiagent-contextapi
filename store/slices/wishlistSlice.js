import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: [],
  loading: false,
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const productId = action.payload.id || action.payload._id;
      const exists = state.wishlist.find(item => {
        const itemId = item.id || item._id;
        return itemId === productId;
      });
      
      if (!exists) {
        state.wishlist.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(item => {
        const itemId = item.id || item._id;
        return itemId !== productId;
      });
    },
    
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setWishlistError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  setWishlistLoading,
  setWishlistError 
} = wishlistSlice.actions;

export const selectWishlist = (state) => state.wishlist?.wishlist || [];
export const selectWishlistLoading = (state) => state.wishlist?.loading || false;
export const selectWishlistError = (state) => state.wishlist?.error || null;
export const selectWishlistCount = (state) => state.wishlist?.wishlist?.length || 0;
export const selectIsInWishlist = (productId) => (state) => 
  (state.wishlist?.wishlist || []).some(item => (item.id || item._id) === productId);

export default wishlistSlice.reducer;
