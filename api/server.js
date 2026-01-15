/**
 * Backend API Server for Dokkani
 * 
 * This Express server handles:
 * 1. Creating Stripe Checkout sessions
 * 2. Processing Stripe webhooks to create orders in Sanity
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret from Stripe Dashboard
 * - SANITY_PROJECT_ID: Sanity project ID
 * - SANITY_DATASET: Sanity dataset (e.g., 'production')
 * - SANITY_TOKEN: Sanity API token with write access
 * 
 * To run locally:
 * 1. cd api
 * 2. npm install
 * 3. npm start
 * 
 * For production, deploy to Vercel, Railway, or similar.
 */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@sanity/client');
const Stripe = require('stripe');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'n56u81sg',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for mobile app
  credentials: true,
}));

// Important: Webhook endpoint needs raw body, so parse it before other middleware
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Parse JSON for other routes
app.use(express.json());

/**
 * Create Stripe Checkout Session
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { userId, userEmail, userName, lineItems, total, successUrl, cancelUrl } = req.body;

    if (!userId || !lineItems || lineItems.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Helper function to parse price from various formats
    const parsePrice = (price) => {
      if (typeof price === 'number') return price;
      if (typeof price === 'string') {
        // Remove currency symbols and non-numeric characters except decimal point
        return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
      }
      return 0;
    };

    // Create Stripe line items
    const stripeLineItems = lineItems.map(item => {
      const price = parsePrice(item.numericPrice || item.price);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
            metadata: {
              productId: item.productId,
              productSlug: item.productSlug,
            },
          },
          unit_amount: Math.round(price * 100), // Stripe uses cents
        },
        quantity: item.quantity || 1,
      };
    });

    // Generate order number
    const orderNumber = `DK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      customer_email: userEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'QA', 'AE', 'SA', 'KW', 'BH', 'OM'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15
              currency: 'usd',
            },
            display_name: 'Express shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      success_url: successUrl || `${process.env.APP_URL || 'dokkani://'}checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'dokkani://'}checkout/cancel`,
      metadata: {
        userId,
        userEmail,
        userName,
        orderNumber,
        lineItems: JSON.stringify(lineItems),
      },
    });

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      orderNumber,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Stripe Webhooks
 */
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

/**
 * Handle successful checkout - Create order in Sanity
 */
async function handleCheckoutComplete(session) {
  try {
    const { userId, userEmail, userName, orderNumber, lineItems: lineItemsJson } = session.metadata;
    const lineItems = JSON.parse(lineItemsJson);

    // Get shipping address from Stripe session
    const shippingDetails = session.shipping_details || session.customer_details;
    const shippingAddress = shippingDetails?.address ? {
      name: shippingDetails.name || userName,
      line1: shippingDetails.address.line1,
      line2: shippingDetails.address.line2 || '',
      city: shippingDetails.address.city,
      state: shippingDetails.address.state || '',
      postalCode: shippingDetails.address.postal_code,
      country: shippingDetails.address.country,
    } : null;

    // Calculate totals
    const subtotal = session.amount_subtotal / 100;
    const shippingCost = session.shipping_cost?.amount_total / 100 || 0;
    const total = session.amount_total / 100;

    // Create order document in Sanity
    const order = await sanityClient.create({
      _type: 'order',
      orderNumber,
      userId,
      userEmail,
      userName,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      lineItems: lineItems.map(item => ({
        _key: `item-${item.productId}-${Date.now()}`,
        productId: item.productId,
        productSlug: item.productSlug,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      shippingCost,
      tax: 0,
      total,
      currency: session.currency || 'usd',
      shippingAddress,
      status: 'paid',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });

    console.log('Order created in Sanity:', order._id, orderNumber);
    return order;
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    throw error;
  }
}

/**
 * Get order by ID (for MyOrders screen)
 */
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await sanityClient.fetch(
      `*[_type == "order" && userId == $userId] | order(createdAt desc) {
        _id,
        orderNumber,
        status,
        total,
        currency,
        lineItems,
        shippingAddress,
        trackingNumber,
        createdAt,
        paidAt
      }`,
      { userId }
    );

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});

module.exports = app;
