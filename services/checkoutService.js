/**
 * Stripe Checkout Service
 * 
 * Creates Stripe Checkout sessions and handles payment flow.
 * The actual checkout session creation must happen on a backend server
 * for security (Stripe secret key should never be exposed to the client).
 * 
 * This service communicates with your backend API to create sessions.
 */

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Your backend API endpoint that creates Stripe Checkout sessions
// For development, you can use ngrok or similar to expose local server
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend.com';

/**
 * Create a Stripe Checkout session and redirect the user
 * @param {Object} params - Checkout parameters
 * @param {string} params.userId - Clerk user ID
 * @param {string} params.userEmail - User email
 * @param {string} params.userName - User name
 * @param {Array} params.cartItems - Array of cart items
 * @param {number} params.total - Cart total
 * @returns {Promise<Object>} - Result with success status
 */
export const createCheckoutSession = async ({ userId, userEmail, userName, cartItems, total }) => {
  try {
    // Format line items for Stripe
    const lineItems = cartItems.map(item => {
      // Parse price from various formats
      let price = item.numericPrice || item.price || 0;
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
      }
      return {
        productId: item._id || item.id,
        productSlug: item.slug,
        title: item.title,
        image: item.image || item.productImage || item.uri,
        quantity: item.quantity || 1,
        price: price,
        numericPrice: price,
      };
    });

    // Create success and cancel URLs using deep linking
    const successUrl = Linking.createURL('checkout/success');
    const cancelUrl = Linking.createURL('checkout/cancel');

    // Call your backend API to create Stripe Checkout session
    const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userEmail,
        userName,
        lineItems,
        total,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { checkoutUrl, sessionId, orderNumber } = await response.json();

    // Open Stripe Checkout in browser
    const result = await WebBrowser.openBrowserAsync(checkoutUrl, {
      showInRecents: true,
      createTask: true,
    });

    return {
      success: true,
      sessionId,
      orderNumber,
      result,
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Format currency for display
 * @param {number} amount - Amount in dollars
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};
