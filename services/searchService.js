/**
 * AI Search Service
 * Handles AI-powered product search via the backend API
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Perform an AI-powered search for products
 * @param {string} query - Natural language search query
 * @param {string} userId - Optional user ID for personalization
 * @returns {Promise<{success: boolean, message: string, products: Array, filters: Object}>}
 */
export async function aiSearch(query, userId = null) {
  try {
    if (!API_URL) {
      throw new Error('API URL not configured');
    }

    const response = await fetch(`${API_URL}/api/ai-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Search failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Search Error:', error);
    throw error;
  }
}

/**
 * Get search suggestions based on partial query
 * @param {string} partialQuery - Partial search text
 * @returns {Promise<Array<string>>}
 */
export function getSearchSuggestions(partialQuery) {
  // Common search suggestions - these could be fetched from API
  const suggestions = [
    'luxury watches under 2000 QAR',
    'perfumes for men',
    'interior decor items',
    'premium cufflinks',
    'phone cases for iPhone',
    'watch winders',
    'featured products',
    'products in stock',
    'Arabian perfumes',
    'gift ideas under 500 QAR',
  ];

  if (!partialQuery) {
    return suggestions.slice(0, 5);
  }

  const query = partialQuery.toLowerCase();
  return suggestions.filter(s => 
    s.toLowerCase().includes(query)
  ).slice(0, 5);
}

/**
 * Example queries users can try
 */
export const exampleQueries = [
  "Show me luxury watches under 2000 QAR",
  "I'm looking for Arabian perfumes",
  "Find phone cases",
  "What interior decor do you have?",
  "Premium cufflinks for a gift",
  "Featured products in stock",
];
