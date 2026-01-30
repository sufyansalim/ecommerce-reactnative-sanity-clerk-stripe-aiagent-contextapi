/**
 * Redux Store Configuration - TypeScript Version
 * 
 * NEW TYPESCRIPT CONCEPTS:
 * 
 * 1. ReturnType<typeof function> - Gets the return type of a function
 *    ReturnType<typeof store.getState> = the type of what getState() returns
 * 
 * 2. typeof - In TypeScript, gets the type of a value
 *    typeof store.dispatch = the type of the dispatch function
 * 
 * 3. TYPE EXPORTS - We export RootState and AppDispatch so other files
 *    can use them for typing their selectors and dispatch calls
 */

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import appReducer from './slices/appSlice';

/**
 * Configure the Redux store
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    app: appReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        // (Sanity data might contain non-serializable values)
        ignoredActions: [
          'app/fetchBrands/fulfilled', 
          'app/fetchCelebrities/fulfilled', 
          'app/fetchTvShows/fulfilled',
          'app/fetchSimilarProducts/fulfilled'
        ],
      },
    }),
});

/**
 * RootState TYPE
 * 
 * This type represents the entire state tree of the Redux store.
 * It's automatically inferred from the store configuration.
 * 
 * ReturnType<typeof store.getState> means:
 * "Whatever type store.getState() returns"
 * 
 * This will be:
 * {
 *   cart: CartState;
 *   wishlist: WishlistState;
 *   app: AppState;
 * }
 * 
 * Use this type when you need to access state in selectors:
 *   const mySelector = (state: RootState) => state.cart.cart;
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch TYPE
 * 
 * This type represents the dispatch function with all its capabilities,
 * including the ability to dispatch thunks (async actions).
 * 
 * typeof store.dispatch means:
 * "Whatever type store.dispatch is"
 * 
 * Use this type when you need a typed dispatch:
 *   const dispatch: AppDispatch = useDispatch();
 */
export type AppDispatch = typeof store.dispatch;

export default store;
