/**
 * Cart Slice - TypeScript Version
 * 
 * NEW TYPESCRIPT CONCEPTS:
 * 
 * 1. TYPE GUARDS - Functions that narrow down types
 *    if (typeof x === 'string') { ... } // TypeScript now knows x is string
 * 
 * 2. OPTIONAL CHAINING TYPE SAFETY
 *    item?.price - TypeScript knows this could be undefined
 * 
 * 3. PAYLOAD ACTION TYPING
 *    PayloadAction<CartItem> - The action carries a CartItem as payload
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Variant selection for products (size, color, etc.)
 */
interface SelectedVariant {
  size?: string;
  color?: string;
  [key: string]: string | undefined; // Allow other variant options
}

/**
 * Extended CartItem with optional properties for matching
 */
interface CartItemWithVariant extends CartItem {
  selectedVariant?: SelectedVariant;
  id?: string;        // Some items might use 'id' instead of '_id'
  productId?: string; // Some items might use 'productId'
  numericPrice?: number;
}

/**
 * Payload for updating quantity
 */
interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}

/**
 * Cart state shape
 */
interface CartState {
  cart: CartItemWithVariant[];
  loading: boolean;
  error: string | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Helper function to get a consistent ID from an item
 * Items might have _id, id, or productId depending on the source
 */
const getItemId = (item: CartItemWithVariant): string | undefined => {
  return item._id || item.id || item.productId;
};

/**
 * Helper function to check if item exists in cart
 * Returns the index of the matching item, or -1 if not found
 */
const findItemIndex = (cart: CartItemWithVariant[], newItem: CartItemWithVariant): number => {
  return cart.findIndex(item => {
    const itemId = getItemId(item);
    const newItemId = getItemId(newItem);
    
    // If neither has an ID, try to match by properties
    if (!itemId || !newItemId) {
      const titleMatch = item.title === newItem.title;
      const priceMatch = item.price === newItem.price;
      const imageMatch = item.productImage === newItem.productImage;
      
      if (titleMatch && priceMatch && imageMatch) {
        // Also check variants match
        const itemVariant = JSON.stringify(item.selectedVariant || {});
        const newItemVariant = JSON.stringify(newItem.selectedVariant || {});
        return itemVariant === newItemVariant;
      }
      return false;
    }
    
    // IDs don't match - not the same item
    if (itemId !== newItemId) {
      return false;
    }
    
    // IDs match - also check if variants match
    // (same product, different size = different cart item)
    const itemVariant = JSON.stringify(item.selectedVariant || {});
    const newItemVariant = JSON.stringify(newItem.selectedVariant || {});
    
    return itemVariant === newItemVariant;
  });
};

// ============================================
// INITIAL STATE
// ============================================

const initialState: CartState = {
  cart: [],
  loading: false,
  error: null
};

// ============================================
// SLICE
// ============================================

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or increase quantity if already exists
     */
    addToCart: (state, action: PayloadAction<CartItemWithVariant>) => {
      const existingIndex = findItemIndex(state.cart, action.payload);
      
      if (existingIndex >= 0) {
        // Item exists - increase quantity
        const currentQty = state.cart[existingIndex].quantity || 1;
        const addQty = action.payload.quantity || 1;
        state.cart[existingIndex].quantity = currentQty + addQty;
      } else {
        // New item - add to cart
        state.cart.push({ 
          ...action.payload, 
          quantity: action.payload.quantity || 1 
        });
      }
      state.loading = false;
    },
    
    /**
     * Update quantity of a specific item
     * If quantity is 0 or less, remove the item
     */
    updateCartQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      
      const index = state.cart.findIndex(item => {
        const itemId = getItemId(item);
        return itemId === productId;
      });
      
      if (index >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.cart.splice(index, 1);
        } else {
          state.cart[index].quantity = quantity;
        }
      }
    },
    
    /**
     * Remove item from cart by ID
     */
    deleteFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => {
        const itemId = getItemId(item);
        return itemId !== productId;
      });
    },
    
    /**
     * Clear all items from cart
     */
    clearCart: (state) => {
      state.cart = [];
    },
    
    /**
     * Set loading state
     */
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Set error state
     */
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// ============================================
// EXPORTS
// ============================================

export const { 
  addToCart, 
  updateCartQuantity, 
  deleteFromCart, 
  clearCart,
  setCartLoading,
  setCartError 
} = cartSlice.actions;

// ============================================
// SELECTORS
// ============================================

/**
 * RootState interface for selectors
 * Defines the shape of the entire Redux store state
 */
interface RootState {
  cart: CartState;
}

/**
 * Select the cart array
 */
export const selectCart = (state: RootState): CartItemWithVariant[] => 
  state.cart?.cart || [];

/**
 * Select loading state
 */
export const selectCartLoading = (state: RootState): boolean => 
  state.cart?.loading || false;

/**
 * Select error state
 */
export const selectCartError = (state: RootState): string | null => 
  state.cart?.error || null;

/**
 * Calculate total price of all items in cart
 * Uses numericPrice if available, otherwise parses the price string
 */
export const selectCartTotal = (state: RootState): number => {
  const cart = state.cart?.cart || [];
  return cart.reduce((total, item) => {
    // Try numericPrice first, then parse the price string
    const price = item.numericPrice || parseFloat(String(item.price)) || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

/**
 * Count total number of items in cart (including quantities)
 */
export const selectCartItemCount = (state: RootState): number => {
  const cart = state.cart?.cart || [];
  return cart.reduce((count, item) => count + (item.quantity || 1), 0);
};

export default cartSlice.reducer;
