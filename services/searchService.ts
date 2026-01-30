/**
 * AI Search Service
 * Handles AI-powered product search via the backend API
 */

import { Product } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface SearchResult {
  success: boolean;
  message: string;
  products: Product[];
  productCount?: number;
  filters?: SearchFilters;
}

/**
 * Perform an AI-powered search for products
 * @param query - Natural language search query
 * @param userId - Optional user ID for personalization
 * @returns Search result with products and filters
 */
export async function aiSearch(query: string, userId: string | null = null): Promise<SearchResult> {
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

    const data: SearchResult = await response.json();
    return data;
  } catch (error) {
    console.error('AI Search Error:', error);
    throw error;
  }
}

/**
 * Get search suggestions based on partial query
 * @param partialQuery - Partial search text
 * @returns Array of suggestion strings
 */
export function getSearchSuggestions(partialQuery: string): string[] {
  // Common search suggestions - these could be fetched from API
  const suggestions: string[] = [
    'luxury watches under $500',
    'perfumes for men',
    'interior decor items',
    'premium cufflinks',
    'phone cases for iPhone',
    'watch winders',
    'featured products',
    'products in stock',
    'Arabian perfumes',
    'gift ideas under $120',
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
export const exampleQueries: string[] = [
  "Show me luxury watches under $500",
  "I'm looking for Arabian perfumes",
  "Find phone cases",
  "What interior decor do you have?",
  "Premium cufflinks for a gift",
  "Featured products in stock",
];
