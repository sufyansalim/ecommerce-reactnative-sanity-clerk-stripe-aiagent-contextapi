/**
 * Sanity Client - API connection for Dokkani
 */
import { createClient } from '@sanity/client';
import { SANITY_CONFIG } from './SanityConstants';

// Create the Sanity client
export const sanityClient = createClient({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  apiVersion: SANITY_CONFIG.apiVersion,
  useCdn: SANITY_CONFIG.useCdn,
  token: SANITY_CONFIG.token, // Required for private datasets
});

// Helper function to run queries
export const fetchSanity = async (query, params = {}) => {
  try {
    const result = await sanityClient.fetch(query, params);
    return { data: result, error: null };
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return { data: null, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════════════
// PRODUCT HELPERS
// ═══════════════════════════════════════════════════════════════════════
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_BRAND,
  GET_PRODUCT_BY_SLUG,
  GET_FEATURED_PRODUCTS,
  SEARCH_PRODUCTS,
  GET_FILTERED_PRODUCTS,
} from './SanityQueries';

export const getProducts = () => fetchSanity(GET_ALL_PRODUCTS);

export const getProductsByCategory = (categorySlug) =>
  fetchSanity(GET_PRODUCTS_BY_CATEGORY, { categorySlug });

export const getProductsByBrand = (brandSlug) =>
  fetchSanity(GET_PRODUCTS_BY_BRAND, { brandSlug });

export const getProduct = (slug) =>
  fetchSanity(GET_PRODUCT_BY_SLUG, { slug });

export const getFeaturedProducts = () =>
  fetchSanity(GET_FEATURED_PRODUCTS);

export const searchProducts = (searchTerm) =>
  fetchSanity(SEARCH_PRODUCTS, { searchTerm });

export const getFilteredProducts = ({
  categorySlug = '',
  minPrice = 0,
  maxPrice = 0,
  inStockOnly = false,
  sortBy = 'newest',
  page = 1,
  perPage = 12,
}) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return fetchSanity(GET_FILTERED_PRODUCTS, {
    categorySlug,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    start,
    end,
  });
};

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY HELPERS
// ═══════════════════════════════════════════════════════════════════════
import {
  GET_ALL_CATEGORIES,
  GET_CATEGORY_WITH_PRODUCTS,
  GET_CATEGORY_COUNTS,
} from './SanityQueries';

export const getCategories = () => fetchSanity(GET_ALL_CATEGORIES);

export const getCategoryWithProducts = (slug) =>
  fetchSanity(GET_CATEGORY_WITH_PRODUCTS, { slug });

export const getCategoryCounts = () => fetchSanity(GET_CATEGORY_COUNTS);

// ═══════════════════════════════════════════════════════════════════════
// BRAND HELPERS
// ═══════════════════════════════════════════════════════════════════════
import { GET_ALL_BRANDS, GET_BRAND_WITH_PRODUCTS } from './SanityQueries';

export const getBrands = () => fetchSanity(GET_ALL_BRANDS);

export const getBrandWithProducts = (slug) =>
  fetchSanity(GET_BRAND_WITH_PRODUCTS, { slug });

// ═══════════════════════════════════════════════════════════════════════
// CELEBRITY HELPERS
// ═══════════════════════════════════════════════════════════════════════
import { GET_ALL_CELEBRITIES, GET_CELEBRITY_WITH_PRODUCTS } from './SanityQueries';

export const getCelebrities = () => fetchSanity(GET_ALL_CELEBRITIES);

export const getCelebrityWithProducts = (slug) =>
  fetchSanity(GET_CELEBRITY_WITH_PRODUCTS, { slug });

// ═══════════════════════════════════════════════════════════════════════
// TV SHOW HELPERS
// ═══════════════════════════════════════════════════════════════════════
import { GET_ALL_TV_SHOWS, GET_TV_SHOW_WITH_PRODUCTS } from './SanityQueries';

export const getTvShows = () => fetchSanity(GET_ALL_TV_SHOWS);

export const getTvShowWithProducts = (slug) =>
  fetchSanity(GET_TV_SHOW_WITH_PRODUCTS, { slug });

// ═══════════════════════════════════════════════════════════════════════
// HOMEPAGE HELPER
// ═══════════════════════════════════════════════════════════════════════
import { GET_HOMEPAGE_DATA } from './SanityQueries';

export const getHomepageData = () => fetchSanity(GET_HOMEPAGE_DATA);
