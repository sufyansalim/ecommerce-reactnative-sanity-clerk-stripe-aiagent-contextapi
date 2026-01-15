import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';

// Initialize Sanity client (lazy)
function getSanityClient() {
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
  });
}

// Initialize Anthropic client (lazy)
function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

// Get all categories and brands for context
async function getStoreContext() {
  const sanityClient = getSanityClient();
  const [categories, brands] = await Promise.all([
    sanityClient.fetch(`*[_type == "category"]{_id, name, "slug": slug.current}`),
    sanityClient.fetch(`*[_type == "brand"]{_id, name, "slug": slug.current}`),
  ]);
  return { categories, brands };
}

// Search products using GROQ
async function searchProducts(filters) {
  const {
    searchText,
    category,
    brand,
    minPrice,
    maxPrice,
    inStock,
    featured,
    limit = 20,
  } = filters;

  // Build dynamic GROQ query
  let conditions = ['_type == "product"'];

  if (searchText) {
    conditions.push(`(title match "*${searchText}*" || description match "*${searchText}*")`);
  }
  if (category) {
    conditions.push(`category->slug.current == "${category}"`);
  }
  if (brand) {
    conditions.push(`brand->slug.current == "${brand}"`);
  }
  if (minPrice !== undefined) {
    conditions.push(`price >= ${minPrice}`);
  }
  if (maxPrice !== undefined) {
    conditions.push(`price <= ${maxPrice}`);
  }
  if (inStock !== undefined) {
    conditions.push(`inStock == ${inStock}`);
  }
  if (featured !== undefined) {
    conditions.push(`featured == ${featured}`);
  }

  const query = `
    *[${conditions.join(' && ')}][0...${limit}] {
      _id,
      title,
      "slug": slug.current,
      price,
      description,
      image,
      images,
      inStock,
      featured,
      "category": category->{
        _id,
        name,
        "slug": slug.current
      },
      "brand": brand->{
        _id,
        name,
        "slug": slug.current
      }
    } | order(featured desc, title asc)
  `;

  const sanityClient = getSanityClient();
  const products = await sanityClient.fetch(query);
  return products;
}

// Define tools for Claude
const tools = [
  {
    name: 'search_products',
    description: `Search for products in the store. Use this to find products based on user queries.
    
Available categories: Perfumes, Watches, Cufflinks, Phone Cases, Interior Decor, Watch Winders
Available brands: Luxe Accessories, Chronolux, Artisan Home, Tempus Elite, Essence Arabia, Parfum Royal, Velour Living, TechShield, Horology House, Sterling & Co, Oro Watches, Maison Noir

Prices are in QAR (Qatari Riyal). Typical price ranges:
- Budget: under 200 QAR
- Mid-range: 200-500 QAR  
- Premium: 500-1000 QAR
- Luxury: over 1000 QAR`,
    input_schema: {
      type: 'object',
      properties: {
        searchText: {
          type: 'string',
          description: 'Text to search in product titles and descriptions',
        },
        category: {
          type: 'string',
          description: 'Category slug to filter by (e.g., "perfumes", "watches", "interior-decor")',
          enum: ['perfumes', 'watches', 'cufflinks', 'phone-cases', 'interior-decor', 'watch-winders'],
        },
        brand: {
          type: 'string', 
          description: 'Brand slug to filter by (e.g., "essence-arabia", "chronolux")',
          enum: ['luxe-accessories', 'chronolux', 'artisan-home', 'tempus-elite', 'essence-arabia', 'parfum-royal', 'velour-living', 'techshield', 'horology-house', 'sterling-co', 'oro-watches', 'maison-noir'],
        },
        minPrice: {
          type: 'number',
          description: 'Minimum price in QAR',
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price in QAR',
        },
        inStock: {
          type: 'boolean',
          description: 'Filter to only show in-stock products',
        },
        featured: {
          type: 'boolean',
          description: 'Filter to only show featured products',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of products to return (default: 20)',
        },
      },
      required: [],
    },
  },
];

// Process user query with Claude
async function processQuery(userQuery) {
  // Get store context for better responses
  const context = await getStoreContext();
  const anthropic = getAnthropicClient();
  
  const systemPrompt = `You are a helpful shopping assistant for Dokkani, a luxury goods store in Qatar.
Your job is to help customers find products based on their queries.

The store sells:
- Perfumes (brands: Essence Arabia, Parfum Royal, Maison Noir)
- Watches (brands: Chronolux, Tempus Elite, Oro Watches, Horology House)
- Watch Winders (brands: Horology House)
- Cufflinks (brands: Sterling & Co, Luxe Accessories)
- Phone Cases (brands: TechShield)
- Interior Decor (brands: Artisan Home, Velour Living)

Prices are in QAR (Qatari Riyal).

When a user asks about products:
1. Use the search_products tool to find matching items
2. Be helpful and suggest alternatives if exact matches aren't found
3. Always respond in a friendly, professional manner

Current categories: ${context.categories.map(c => c.name).join(', ')}
Current brands: ${context.brands.map(b => b.name).join(', ')}`;

  // First API call - let Claude decide what to search
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    tools,
    messages: [
      {
        role: 'user',
        content: userQuery,
      },
    ],
  });

  // Check if Claude wants to use tools
  let products = [];
  let aiMessage = '';
  let searchFilters = null;

  for (const block of response.content) {
    if (block.type === 'tool_use' && block.name === 'search_products') {
      // Execute the search
      searchFilters = block.input;
      products = await searchProducts(block.input);
      
      // Get Claude's response with search results
      const followUpResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        tools,
        messages: [
          {
            role: 'user',
            content: userQuery,
          },
          {
            role: 'assistant',
            content: response.content,
          },
          {
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: block.id,
                content: JSON.stringify({
                  count: products.length,
                  products: products.map(p => ({
                    title: p.title,
                    price: p.price,
                    category: p.category?.name,
                    brand: p.brand?.name,
                    inStock: p.inStock,
                  })),
                }),
              },
            ],
          },
        ],
      });

      // Extract text response
      for (const resultBlock of followUpResponse.content) {
        if (resultBlock.type === 'text') {
          aiMessage = resultBlock.text;
        }
      }
    } else if (block.type === 'text') {
      aiMessage = block.text;
    }
  }

  return {
    message: aiMessage,
    products,
    filters: searchFilters,
    productCount: products.length,
  };
}

// Main API handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, userId } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'ANTHROPIC_API_KEY environment variable is missing'
      });
    }

    console.log(`🔍 AI Search: "${query}" (user: ${userId || 'anonymous'})`);

    const result = await processQuery(query);

    console.log(`✅ Found ${result.productCount} products`);

    return res.status(200).json({
      success: true,
      query,
      ...result,
    });

  } catch (error) {
    console.error('❌ AI Search Error:', error);
    return res.status(500).json({
      error: 'Search failed',
      message: error.message,
    });
  }
}
