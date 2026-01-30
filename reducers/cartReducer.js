// Cart Action Types
export const CART_ADD = 'CART_ADD';
export const CART_DELETE = 'CART_DELETE';
export const CART_CLEAR = 'CART_CLEAR';
export const CART_UPDATE_QUANTITY = 'CART_UPDATE_QUANTITY';

// Initial State
export const initialCartState = {
  cart: [],
  loading: false,
  error: null
};

// Helper function to check if item exists in cart
const findItemIndex = (cart, newItem) => {
  return cart.findIndex(item => {
    // Get the unique identifier for each item - try multiple possible ID fields
    const itemId = item._id || item.id || item.productId;
    const newItemId = newItem._id || newItem.id || newItem.productId;
    
    // If no valid IDs found, also compare by title and price as fallback
    if (!itemId || !newItemId) {
      const titleMatch = item.title === newItem.title;
      const priceMatch = item.price === newItem.price;
      const imageMatch = item.productImage === newItem.productImage;
      
      if (titleMatch && priceMatch && imageMatch) {
        // Additional check for variants
        const itemVariant = JSON.stringify(item.selectedVariant || {});
        const newItemVariant = JSON.stringify(newItem.selectedVariant || {});
        return itemVariant === newItemVariant;
      }
      return false;
    }
    
    // Both items have valid IDs - they must match
    if (itemId !== newItemId) {
      return false;
    }
    
    // Also check if variants match (for products with variants)
    const itemVariant = JSON.stringify(item.selectedVariant || {});
    const newItemVariant = JSON.stringify(newItem.selectedVariant || {});
    
    return itemVariant === newItemVariant;
  });
};

// Reducer
export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ADD:
      const existingItemIndex = findItemIndex(state.cart, action.data);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + (action.data.quantity || 1)
        };
        
        return {
          ...state,
          loading: false,
          cart: updatedCart
        };
      } else {
        // New item, add to cart with quantity
        return {
          ...state,
          loading: false,
          cart: [...state.cart, { ...action.data, quantity: action.data.quantity || 1 }]
        };
      }

    case CART_DELETE:
      return {
        ...state,
        cart: state.cart.filter((item, idx) => idx !== action.index)
      };

    case CART_UPDATE_QUANTITY:
      const updatedCart = [...state.cart];
      if (action.index >= 0 && action.index < updatedCart.length) {
        updatedCart[action.index] = {
          ...updatedCart[action.index],
          quantity: Math.max(1, action.quantity) // Ensure minimum quantity of 1
        };
      }
      return {
        ...state,
        cart: updatedCart
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
