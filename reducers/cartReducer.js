// Cart Action Types
export const CART_ADD = 'CART_ADD';
export const CART_DELETE = 'CART_DELETE';
export const CART_CLEAR = 'CART_CLEAR';

// Initial State
export const initialCartState = {
  cart: [],
  loading: false,
  error: null
};

// Reducer
export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ADD:
      return {
        ...state,
        loading: false,
        cart: [...state.cart, action.data]
      };

    case CART_DELETE:
      return {
        ...state,
        cart: state.cart.filter((item, idx) => idx !== action.index)
      };

    case CART_CLEAR:
      return {
        ...state,
        cart: []
      };

    default:
      return state;
  }
};
