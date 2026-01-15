import React, { createContext, useContext, useReducer } from 'react';
import { cartReducer, initialCartState } from '../reducers';

// Create Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hooks
export const useCartState = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context.state;
};

export const useCartDispatch = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context.dispatch;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
