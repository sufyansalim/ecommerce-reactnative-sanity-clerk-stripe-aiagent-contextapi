# Dokkani.co - E-Commerce Mobile App

A React Native e-commerce application with Stripe payments, Sanity CMS backend, Clerk authentication, and **AI-powered product search**.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Development Workflow](#development-workflow)
- [Stripe Webhook Setup](#stripe-webhook-setup)
- [AI Product Search](#-ai-product-search)
- [Troubleshooting](#troubleshooting)
- [Optional: Vercel API Deployment](#️-optional-vercel-api-deployment-no-ngrok-needed)

---

## 🔧 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Expo CLI** - `npm install -g expo-cli`
- **ngrok** - For local webhook testing - `brew install ngrok` (macOS)
- **Git**

### Required Accounts

1. **Clerk** - Authentication - [clerk.com](https://clerk.com)
2. **Stripe** - Payments - [stripe.com](https://stripe.com)
3. **Sanity** - CMS Backend - [sanity.io](https://sanity.io)
4. **ngrok** - Webhook tunneling - [ngrok.com](https://ngrok.com)

---

## 📁 Project Structure

```
dokkani.co/
├── api/                    # Backend API server
│   ├── server.js          # Express server with Stripe & Sanity
│   ├── package.json       # API dependencies
│   └── .env               # API environment variables
├── studio/                 # Sanity Studio
│   ├── schemaTypes/       # Sanity schema definitions
│   └── sanity.config.ts   # Sanity configuration
├── screens/               # React Native screens
├── components/            # Reusable components
├── context/               # React Context (Auth, Cart, Wishlist)
├── navigation/            # React Navigation config
├── constants/             # App constants (Colors, Sanity client)
├── services/              # API services (checkout)
├── App.js                 # Main app entry
├── app.json               # Expo configuration
└── .env                   # App environment variables
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dokkani.co
```

### 2. Install React Native Dependencies

```bash
npm install
```

### 3. Install API Server Dependencies

```bash
cd api
npm install
cd ..
```

### 4. Install Sanity Studio Dependencies

```bash
cd studio
npm install
cd ..
```

### 5. Install ngrok (if not installed)

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### 6. Configure ngrok Authentication

```bash
# Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
ngrok config add-authtoken YOUR_AUTHTOKEN
```

---

## 🔐 Environment Variables

### Main App (.env)

Create a `.env` file in the root directory:

```env
# Sanity Configuration
EXPO_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
EXPO_PUBLIC_SANITY_DATASET=production
EXPO_PUBLIC_SANITY_API_VERSION=2024-01-01
EXPO_PUBLIC_SANITY_TOKEN=your_sanity_token

# Clerk Configuration
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# Stripe Configuration
STRIPE_PUBLIC_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Configuration (update with ngrok URL when running locally)
EXPO_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app
```

### API Server (api/.env)

Create a `.env` file in the `api/` directory:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret

# Sanity
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_sanity_token

# Server
PORT=3001
```

---

## 🏃 Running the App

### Complete Step-by-Step Startup Guide

Follow these steps **in order** every time you start development:

---

#### 📍 STEP 1: Start the API Server

Open **Terminal 1** and run:

```bash
cd /Users/sufyansaleem/Downloads/dokkani.co/api
node server.js
```

✅ **Expected output:** `🚀 API server running on port 3001`

> **If you get "Address already in use" error:**
> ```bash
> lsof -ti:3001 | xargs kill -9
> node server.js
> ```

---

#### 📍 STEP 2: Start ngrok Tunnel

Open **Terminal 2** and run:

```bash
ngrok http 3001
```

✅ **Expected output:** You'll see a screen like this:
```
Session Status                online
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:3001
```

📋 **COPY the `https://xxx.ngrok-free.app` part only** - you'll need it in the next steps!

⚠️ **Important:** The ngrok URL does NOT include `/api/webhook` - you will add that yourself in Step 4!

---

#### 📍 STEP 3: Update Your .env File

Open the `.env` file in the **root** of the project and update:

```bash
# Change this line with YOUR ngrok URL from Step 2:
EXPO_PUBLIC_API_URL=https://abc123xyz.ngrok-free.app
```

Save the file.

---

#### 📍 STEP 4: Update Stripe Webhook URL

1. Open your browser and go to: **https://dashboard.stripe.com/webhooks**

2. **If this is your FIRST TIME:**
   - Click **"Add endpoint"**
   - Skip to step 4

3. **If you already have a webhook:**
   - Click on your existing endpoint
   - Click the **"..."** menu (top right)
   - Click **"Update details"**

4. In the **"Endpoint URL"** field, you need to **ADD `/api/webhook` yourself**:
   
   **Example:** If your ngrok shows:
   ```
   https://abc123xyz.ngrok-free.app -> http://localhost:3001
   ```
   
   Then you enter in Stripe:
   ```
   https://abc123xyz.ngrok-free.app/api/webhook
   ```
   
   ⚠️ **Don't forget the `/api/webhook` at the end!**

5. **For new webhooks only:** Under "Select events", click **"+ Select events"**
   - Search for `checkout.session.completed`
   - Check the box next to it
   - Click **"Add events"**

6. Click **"Add endpoint"** or **"Update endpoint"**

---

#### 📍 STEP 5: Copy Webhook Signing Secret (First Time Only)

> ⚠️ **Skip this step if you've already done it before** - the secret doesn't change!

1. On the Stripe Webhooks page, click on your webhook endpoint

2. Under **"Signing secret"**, click **"Reveal"**

3. Copy the value that starts with `whsec_...`

4. Open `api/.env` and paste it:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
   ```

5. Save the file

6. **Restart the API server** (go to Terminal 1):
   ```bash
   # Press Ctrl+C to stop, then:
   node server.js
   ```

---

#### 📍 STEP 6: Start the React Native App

Open **Terminal 3** and run:

```bash
cd /Users/sufyansaleem/Downloads/dokkani.co
npm start
```

Then press:
- `a` - to open on Android emulator
- `i` - to open on iOS simulator
- Scan QR code with Expo Go app on your phone

---

### ✅ Startup Checklist

| Terminal | Command | Status |
|----------|---------|--------|
| 1 | `node server.js` | 🚀 API server running on port 3001 |
| 2 | `ngrok http 3001` | 🔗 Forwarding https://xxx.ngrok-free.app |
| 3 | `npm start` | 📱 Metro bundler running |

| Config | Updated? |
|--------|----------|
| `.env` → `EXPO_PUBLIC_API_URL` | ✅ |
| Stripe Webhook URL | ✅ |
| `api/.env` → `STRIPE_WEBHOOK_SECRET` | ✅ (first time only) |

---

### 🔄 Quick Restart (After First Setup)

Once you've done the full setup, here's what to do each time:

```bash
# Terminal 1: Start API
cd api && node server.js

# Terminal 2: Start ngrok
ngrok http 3001

# Terminal 3: Start Expo
npm start
```

**Every time you restart ngrok, the URL changes!** So you must:
1. Copy new ngrok URL (e.g., `https://newurl123.ngrok-free.app`)
2. Update `.env` → `EXPO_PUBLIC_API_URL=https://newurl123.ngrok-free.app`
3. Update Stripe webhook URL to `https://newurl123.ngrok-free.app/api/webhook`
4. Restart Expo with `npm start`

---

### Quick Start (3 Terminals)

You need **3 terminal windows** running simultaneously:

#### Terminal 1: API Server
```bash
cd api
node server.js
```
Expected output: `🚀 API server running on port 3001`

#### Terminal 2: ngrok Tunnel
```bash
ngrok http 3001
```
Copy the `https://xxxx.ngrok-free.app` URL and update:
- Main `.env` → `EXPO_PUBLIC_API_URL`
- Stripe Dashboard → Webhook endpoint URL

#### Terminal 3: React Native App
```bash
npm start
# or
npx expo start
```
Then press `a` for Android or `i` for iOS simulator.

### Sanity Studio (Optional - for content management)

```bash
cd studio
npm run dev
```
Opens at `http://localhost:3333`

---

## 🔄 Development Workflow

### Daily Development Steps

1. **Start API Server**
   ```bash
   cd api && node server.js
   ```

2. **Start ngrok** (same terminal or new one)
   ```bash
   ngrok http 3001
   ```

3. **Update API URL** - Copy ngrok URL to `.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://xxxx.ngrok-free.app
   ```

4. **Update Stripe Webhook** (if ngrok URL changed):
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Update endpoint URL to `https://xxxx.ngrok-free.app/api/webhook`

5. **Start Expo**
   ```bash
   npm start
   ```

### One-liner to Start API (kills existing process)
```bash
lsof -ti:3001 | xargs kill -9 2>/dev/null; cd api && node server.js
```

---

## 💳 Stripe Webhook Setup

### 1. Create Webhook Endpoint

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://your-ngrok-url.ngrok-free.app/api/webhook`
4. Select event: `checkout.session.completed`
5. Click "Add endpoint"

### 2. Copy Signing Secret

1. Click on your webhook endpoint
2. Under "Signing secret", click "Reveal"
3. Copy the `whsec_...` value
4. Paste into `api/.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Restart API Server

```bash
# Kill existing and restart
lsof -ti:3001 | xargs kill -9; cd api && node server.js
```

### Test Cards (Stripe Test Mode)

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 3220` | 3D Secure authentication |
| `4000 0000 0000 9995` | Declined payment |

Use any future expiry date and any 3-digit CVC.

---

## 🏗️ Sanity Setup

### Deploy Schema

```bash
cd studio
npx sanity schema deploy
```

### Schema Types

The app uses these Sanity document types:
- `product` - Products with title, price, images
- `category` - Product categories
- `brand` - Product brands
- `celebrity` - Celebrity collections
- `order` - Customer orders (created by webhook)

### Sanity Studio Commands

```bash
# Start development server
npm run dev

# Deploy studio to Sanity hosting
npm run deploy

# Deploy schema only
npx sanity schema deploy

# Export data
npx sanity dataset export production ./backup.tar.gz

# Import data
npx sanity dataset import ./data.ndjson production
```

---

## 📱 Expo/React Native Commands

```bash
# Start development server
npm start

# Start with cache clear
npx expo start -c

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Install a package
npx expo install package-name

# Create production build
eas build --platform all
```

---

## 🤖 AI Product Search

The app features an AI-powered natural language product search using **Anthropic Claude**. Users can search with queries like:

- "Show me luxury watches under 2000 QAR"
- "I'm looking for Arabian perfumes"
- "Find phone cases"
- "Premium cufflinks for a gift"

### How It Works

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Expo App   │────▶│  Vercel API     │────▶│   Claude AI  │
│  (Search)   │     │  /api/ai-search │     │   (Anthropic)│
└─────────────┘     └────────┬────────┘     └──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Sanity CMS    │
                    │   (Products)    │
                    └─────────────────┘
```

1. **User enters query** in the search screen
2. **Expo app** sends query to `/api/ai-search` endpoint
3. **Claude AI** interprets the natural language query
4. **AI calls tools** to search Sanity with GROQ filters
5. **Products returned** with AI-generated response message

### Architecture

| Component | File | Purpose |
|-----------|------|---------|
| API Endpoint | `vercel-api/api/ai-search.js` | Handles AI search requests |
| Search Service | `services/searchService.js` | Expo service to call API |
| Search Screen | `screens/SearchScreen.js` | UI with AI search |

### Environment Variable Required

Add this to your **Vercel environment variables**:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your API key from [console.anthropic.com](https://console.anthropic.com)

### API Endpoint

**POST** `/api/ai-search`

Request:
```json
{
  "query": "Show me watches under 1000 QAR",
  "userId": "user_abc123"
}
```

Response:
```json
{
  "success": true,
  "query": "Show me watches under 1000 QAR",
  "message": "I found 3 watches under 1000 QAR for you...",
  "products": [
    {
      "_id": "...",
      "title": "Classic Gold Watch",
      "price": 850,
      "category": { "name": "Watches" },
      "brand": { "name": "Chronolux" },
      "image": "https://...",
      "inStock": true
    }
  ],
  "filters": {
    "category": "watches",
    "maxPrice": 1000
  },
  "productCount": 3
}
```

### Supported Search Filters

The AI can interpret and apply these filters:

| Filter | Example Query |
|--------|---------------|
| Category | "perfumes", "watches", "interior decor" |
| Brand | "Essence Arabia perfumes", "Chronolux watches" |
| Price Range | "under 500 QAR", "between 200 and 800" |
| Stock Status | "in stock only" |
| Featured | "featured products" |

### Testing AI Search

```bash
curl -X POST https://your-vercel-url.vercel.app/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query": "luxury watches under 2000 QAR"}'
```

---

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Address already in use" (Port 3001)
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### ngrok Authentication Error
```bash
# Add your authtoken
ngrok config add-authtoken YOUR_TOKEN
```

### Stripe Webhook Not Working
1. Check ngrok is running and URL is correct
2. Verify webhook secret in `api/.env`
3. Check Stripe Dashboard → Webhooks → Recent deliveries
4. Restart API server after changing `.env`

### Sanity Client Error
1. Verify `EXPO_PUBLIC_SANITY_PROJECT_ID` is correct
2. Check Sanity token has correct permissions
3. Ensure dataset name matches

### Navigation Errors
The app uses nested navigation. Correct patterns:
```javascript
// Navigate to tab screen
navigation.navigate('Main', { screen: 'HomeStack' });
navigation.navigate('Main', { screen: 'CartStack' });

// Navigate to stack screen
navigation.navigate('Checkout');
navigation.navigate('AuthSignin');
```

### Metro Bundler Cache Issues
```bash
# Clear cache and restart
npx expo start -c
```

---

## ☁️ Optional: Vercel API Deployment (No ngrok needed!)

If you want a **permanent API URL** that doesn't change (no more updating ngrok URLs every time), you can deploy the API to Vercel.

### Why Use Vercel?

| Approach | Pros | Cons |
|----------|------|------|
| **Local + ngrok** | Easy to debug, see logs | URL changes every restart |
| **Vercel** | Permanent URL, always online | Need to redeploy for changes |

### Vercel API Structure

The `vercel-api/` folder contains serverless functions:

```
vercel-api/
├── api/
│   ├── create-checkout-session.js  # Creates Stripe checkout
│   ├── webhook.js                   # Handles Stripe webhooks
│   └── orders.js                    # Fetches user orders
├── package.json
├── vercel.json
└── README.md
```

### Deployment Steps

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy to Vercel

```bash
cd vercel-api
vercel
```

Follow the prompts:
- Link to existing project? → **No**
- Project name? → `dokkani-api` (or your choice)
- Directory? → `./` (current directory)

#### 3. Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (your Stripe secret key) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Stripe webhook - see step 5) |
| `SANITY_PROJECT_ID` | `n56u81sg` |
| `SANITY_DATASET` | `production` |
| `SANITY_TOKEN` | `sk...` (your Sanity token) |

#### 4. Redeploy with Environment Variables

```bash
cd vercel-api
vercel --prod
```

Your API will be live at: `https://your-project.vercel.app`

#### 5. Create Stripe Webhook for Vercel

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://your-project.vercel.app/api/webhook`
4. Select event: `checkout.session.completed`
5. Click **"Add endpoint"**
6. Copy the signing secret (`whsec_...`)
7. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
8. Redeploy: `vercel --prod`

#### 6. Update App to Use Vercel API

Update your `.env` file:

```env
EXPO_PUBLIC_API_URL=https://your-project.vercel.app
```

### Testing the Vercel API

```bash
# Test checkout endpoint
curl -X POST https://your-project.vercel.app/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"name": "Test Product", "price": 100, "quantity": 1}],
    "userId": "test-user",
    "successUrl": "https://example.com/success",
    "cancelUrl": "https://example.com/cancel"
  }'
```

Expected response:
```json
{
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_...",
  "orderNumber": "DK-..."
}
```

### Vercel vs Local Development

You can use **both** approaches:

- **Development:** Use local `api/server.js` + ngrok for debugging
- **Production/Testing:** Use Vercel for stable, always-on API

Just switch the `EXPO_PUBLIC_API_URL` in `.env` between:
```env
# For local development
EXPO_PUBLIC_API_URL=https://xxx.ngrok-free.app

# For Vercel (production)
EXPO_PUBLIC_API_URL=https://your-project.vercel.app
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | React Native framework |
| `@clerk/clerk-expo` | Authentication |
| `@stripe/stripe-react-native` | Stripe SDK |
| `@sanity/client` | Sanity CMS client |
| `@react-navigation/native` | Navigation |
| `native-base` | UI components |
| `expo-web-browser` | Stripe checkout browser |
| `expo-linking` | Deep linking |

---

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👥 Support

For issues or questions, please contact the development team.
