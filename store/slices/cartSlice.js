import { createSlice } from '@reduxjs/toolkit';

// Helper function to check if item exists in cart
const findItemIndex = (cart, newItem) => {
  return cart.findIndex(item => {
    const itemId = item._id || item.id || item.productId;
    const newItemId = newItem._id || newItem.id || newItem.productId;
    
    if (!itemId || !newItemId) {
      const titleMatch = item.title === newItem.title;
      const priceMatch = item.price === newItem.price;
      const imageMatch = item.productImage === newItem.productImage;
      
      if (titleMatch && priceMatch && imageMatch) {
        const itemVariant = JSON.stringify(item.selectedVariant || {});
        const newItemVariant = JSON.stringify(newItem.selectedVariant || {});
        return itemVariant === newItemVariant;
      }
      return false;
    }
    
    if (itemId !== newItemId) {
      return false;
    }
    
    const itemVariant = JSON.stringify(item.selectedVariant || {});
    const newItemVariant = JSON.stringify(newItem.selectedVariant || {});
    
    return itemVariant === newItemVariant;
  });
};

const initialState = {
  cart: [],
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingIndex = findItemIndex(state.cart, action.payload);
      
      if (existingIndex >= 0) {
        state.cart[existingIndex].quantity = 
          (state.cart[existingIndex].quantity || 1) + (action.payload.quantity || 1);
      } else {
        state.cart.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      state.loading = false;
    },
    
    updateCartQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (state.cart[index]) {
        if (quantity <= 0) {
          state.cart.splice(index, 1);
        } else {
          state.cart[index].quantity = quantity;
        }
      }
    },
    
    deleteFromCart: (state, action) => {
      state.cart.splice(action.payload, 1);
    },
    
    clearCart: (state) => {
      state.cart = [];
    },
    
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setCartError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { 
  addToCart, 
  updateCartQuantity, 
  deleteFromCart, 
  clearCart,
  setCartLoading,
  setCartError 
} = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotal = (state) => 
  state.cart.cart.reduce((total, item) => {
    const price = item.numericPrice || parseFloat(item.price) || 0;
    return total + (price * (item.quantity || 1));
  }, 0);
export const selectCartItemCount = (state) => 
  state.cart.cart.reduce((count, item) => count + (item.quantity || 1), 0);

export default cartSlice.reducer;
