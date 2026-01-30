/**
 * Wishlist Slice - TypeScript Version
 * 
 * NEW TYPESCRIPT CONCEPTS:
 * 
 * 1. RETURNING FUNCTIONS (Higher-Order Functions)
 *    selectIsInWishlist is a "selector factory" - it returns another function
 *    (productId: string) => (state: RootState) => boolean
 *    This means: call with productId, get back a function that takes state
 * 
 * 2. .some() ARRAY METHOD TYPING
 *    TypeScript infers the item type from the array type
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem } from '../../types';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Extended wishlist item that might have 'id' instead of '_id'
 * depending on where the data comes from
 */
interface WishlistItemExtended extends WishlistItem {
  id?: string; // Alternative ID field
}

/**
 * Wishlist state shape
 */
interface WishlistState {
  wishlist: WishlistItemExtended[];
  loading: boolean;
  error: string | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get consistent ID from wishlist item
 */
const getItemId = (item: WishlistItemExtended): string | undefined => {
  return item._id || item.id;
};

// ============================================
// INITIAL STATE
// ============================================

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null
};

// ============================================
// SLICE
// ============================================

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    /**
     * Add item to wishlist (if not already present)
     */
    addToWishlist: (state, action: PayloadAction<WishlistItemExtended>) => {
      const productId = getItemId(action.payload);
      
      // Check if already in wishlist
      const exists = state.wishlist.find(item => {
        const itemId = getItemId(item);
        return itemId === productId;
      });
      
      // Only add if not already present
      if (!exists) {
        state.wishlist.push(action.payload);
      }
    },
    
    /**
     * Remove item from wishlist by ID
     */
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(item => {
        const itemId = getItemId(item);
        return itemId !== productId;
      });
    },
    
    /**
     * Clear all items from wishlist
     */
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    
    /**
     * Set loading state
     */
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Set error state
     */
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// ============================================
// EXPORTS
// ============================================

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  setWishlistLoading,
  setWishlistError 
} = wishlistSlice.actions;

// ============================================
// SELECTORS
// ============================================

/**
 * RootState interface for selectors
 */
interface RootState {
  wishlist: WishlistState;
}

/**
 * Select the wishlist array
 */
export const selectWishlist = (state: RootState): WishlistItemExtended[] => 
  state.wishlist?.wishlist || [];

/**
 * Select loading state
 */
export const selectWishlistLoading = (state: RootState): boolean => 
  state.wishlist?.loading || false;

/**
 * Select error state
 */
export const selectWishlistError = (state: RootState): string | null => 
  state.wishlist?.error || null;

/**
 * Count items in wishlist
 */
export const selectWishlistCount = (state: RootState): number => 
  state.wishlist?.wishlist?.length || 0;

/**
 * Check if a specific product is in the wishlist
 * 
 * This is a SELECTOR FACTORY - it returns a selector function
 * 
 * Usage in component:
 *   const isInWishlist = useSelector(selectIsInWishlist(productId));
 * 
 * The type signature means:
 *   - Takes a productId (string)
 *   - Returns a function that takes state (RootState) and returns boolean
 */
export const selectIsInWishlist = (productId: string) => (state: RootState): boolean => 
  (state.wishlist?.wishlist || []).some(item => getItemId(item) === productId);

export default wishlistSlice.reducer;
