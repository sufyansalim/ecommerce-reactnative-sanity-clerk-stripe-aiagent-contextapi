import { CART_ADD, CART_DELETE, CART_CLEAR } from '../reducers/cartReducer';

// Add item to cart
export const addToCart = (dispatch, data) => {
  dispatch({ type: CART_ADD, data });
};

// Delete item from cart by index
export const deleteFromCart = (dispatch, index) => {
  dispatch({ type: CART_DELETE, index });
};

// Clear entire cart
export const clearCart = (dispatch) => {
  dispatch({ type: CART_CLEAR });
};
