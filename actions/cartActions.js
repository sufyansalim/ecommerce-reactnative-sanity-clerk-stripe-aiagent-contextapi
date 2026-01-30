import { CART_ADD, CART_DELETE, CART_CLEAR, CART_UPDATE_QUANTITY } from '../reducers/cartReducer';

// Add item to cart (will increase quantity if item already exists)
export const addToCart = (dispatch, data) => {
  dispatch({ type: CART_ADD, data });
};

// Update item quantity in cart
export const updateCartQuantity = (dispatch, index, quantity) => {
  dispatch({ type: CART_UPDATE_QUANTITY, index, quantity });
};

// Delete item from cart by index
export const deleteFromCart = (dispatch, index) => {
  dispatch({ type: CART_DELETE, index });
};

// Clear entire cart
export const clearCart = (dispatch) => {
  dispatch({ type: CART_CLEAR });
};
