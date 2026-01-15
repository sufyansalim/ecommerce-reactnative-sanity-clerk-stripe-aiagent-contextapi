import React, { createContext, useContext, useReducer } from 'react';
import { wishlistReducer, initialWishlistState } from '../reducers';

// Create Context
const WishlistContext = createContext();

// Provider Component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialWishlistState);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom Hooks
export const useWishlistState = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistState must be used within a WishlistProvider');
  }
  return context.state;
};

export const useWishlistDispatch = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistDispatch must be used within a WishlistProvider');
  }
  return context.dispatch;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
