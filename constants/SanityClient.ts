/**
 * Sanity Client - TypeScript Version
 * 
 * TYPESCRIPT CONCEPTS:
 * 
 * 1. GENERICS IN FUNCTIONS - <T> allows the function to return different types
 *    fetchSanity<Product[]>(query) - T is Product[], so data is Product[]
 *    fetchSanity<Category>(query) - T is Category, so data is Category
 * 
 * 2. INTERFACE FOR API RESPONSE - Defines success/error structure
 */

import { createClient, SanityClient } from '@sanity/client';
import { SANITY_CONFIG } from './SanityConstants';
import { Product, Category, Brand, Celebrity, TvShow } from '../types';

// Import queries
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_BRAND,
  GET_PRODUCT_BY_SLUG,
  GET_FEATURED_PRODUCTS,
  SEARCH_PRODUCTS,
  GET_FILTERED_PRODUCTS,
  GET_ALL_CATEGORIES,
  GET_CATEGORY_WITH_PRODUCTS,
  GET_CATEGORY_COUNTS,
  GET_ALL_BRANDS,
  GET_BRAND_WITH_PRODUCTS,
  GET_ALL_CELEBRITIES,
  GET_CELEBRITY_WITH_PRODUCTS,
  GET_ALL_TV_SHOWS,
  GET_TV_SHOW_WITH_PRODUCTS,
  GET_HOMEPAGE_DATA,
} from './SanityQueries';

// ═══════════════════════════════════════════════════════════════════════
// CLIENT SETUP
// ═══════════════════════════════════════════════════════════════════════

/**
 * Create the Sanity client
 */
export const sanityClient: SanityClient = createClient({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  apiVersion: SANITY_CONFIG.apiVersion,
  useCdn: SANITY_CONFIG.useCdn,
  token: SANITY_CONFIG.token,
});

// ═══════════════════════════════════════════════════════════════════════
// FETCH HELPER
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generic response type for API calls
 * The <T> is a "type parameter" - it gets replaced with the actual type
 * when you call the function
 */
export interface SanityResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Generic fetch helper
 * 
 * @template T - The expected return type (e.g., Product[], Category)
 * @param query - GROQ query string
 * @param params - Query parameters object
 * @returns Promise with data or error
 * 
 * Usage:
 *   const result = await fetchSanity<Product[]>(GET_ALL_PRODUCTS);
 *   if (result.data) {
 *     // result.data is typed as Product[]
 *   }
 */
export const fetchSanity = async <T>(
  query: string, 
  params: Record<string, unknown> = {}
): Promise<SanityResponse<T>> => {
  try {
    const result = await sanityClient.fetch<T>(query, params);
    return { data: result, error: null };
  } catch (error) {
    console.error('Sanity fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { data: null, error: errorMessage };
  }
};

// ═══════════════════════════════════════════════════════════════════════
// PRODUCT HELPERS
// ═══════════════════════════════════════════════════════════════════════

export const getProducts = (): Promise<SanityResponse<Product[]>> => 
  fetchSanity<Product[]>(GET_ALL_PRODUCTS);

export const getProductsByCategory = (categorySlug: string): Promise<SanityResponse<Product[]>> =>
  fetchSanity<Product[]>(GET_PRODUCTS_BY_CATEGORY, { categorySlug });

export const getProductsByBrand = (brandSlug: string): Promise<SanityResponse<Product[]>> =>
  fetchSanity<Product[]>(GET_PRODUCTS_BY_BRAND, { brandSlug });

export const getProduct = (slug: string): Promise<SanityResponse<Product | null>> =>
  fetchSanity<Product | null>(GET_PRODUCT_BY_SLUG, { slug });

export const getFeaturedProducts = (): Promise<SanityResponse<Product[]>> =>
  fetchSanity<Product[]>(GET_FEATURED_PRODUCTS);

export const searchProducts = (searchTerm: string): Promise<SanityResponse<Product[]>> =>
  fetchSanity<Product[]>(SEARCH_PRODUCTS, { searchTerm });

/**
 * Parameters for filtered products
 */
export interface FilteredProductsParams {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: string;
  page?: number;
  perPage?: number;
}

export const getFilteredProducts = ({
  categorySlug = '',
  minPrice = 0,
  maxPrice = 0,
  inStockOnly = false,
  sortBy = 'newest',
  page = 1,
  perPage = 12,
}: FilteredProductsParams): Promise<SanityResponse<Product[]>> => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return fetchSanity<Product[]>(GET_FILTERED_PRODUCTS, {
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

export const getCategories = (): Promise<SanityResponse<Category[]>> => 
  fetchSanity<Category[]>(GET_ALL_CATEGORIES);

/**
 * Category with nested products
 */
export interface CategoryWithProducts extends Category {
  products: Product[];
}

export const getCategoryWithProducts = (slug: string): Promise<SanityResponse<CategoryWithProducts | null>> =>
  fetchSanity<CategoryWithProducts | null>(GET_CATEGORY_WITH_PRODUCTS, { slug });

/**
 * Category with product count
 */
export interface CategoryCount extends Category {
  productCount: number;
}

export const getCategoryCounts = (): Promise<SanityResponse<CategoryCount[]>> => 
  fetchSanity<CategoryCount[]>(GET_CATEGORY_COUNTS);

// ═══════════════════════════════════════════════════════════════════════
// BRAND HELPERS
// ═══════════════════════════════════════════════════════════════════════

export const getBrands = (): Promise<SanityResponse<Brand[]>> => 
  fetchSanity<Brand[]>(GET_ALL_BRANDS);

/**
 * Brand with nested products
 */
export interface BrandWithProducts extends Brand {
  products: Product[];
}

export const getBrandWithProducts = (slug: string): Promise<SanityResponse<BrandWithProducts | null>> =>
  fetchSanity<BrandWithProducts | null>(GET_BRAND_WITH_PRODUCTS, { slug });

// ═══════════════════════════════════════════════════════════════════════
// CELEBRITY HELPERS
// ═══════════════════════════════════════════════════════════════════════

export const getCelebrities = (): Promise<SanityResponse<Celebrity[]>> => 
  fetchSanity<Celebrity[]>(GET_ALL_CELEBRITIES);

/**
 * Celebrity with nested products
 */
export interface CelebrityWithProducts extends Celebrity {
  products: Product[];
  bio?: string;
}

export const getCelebrityWithProducts = (slug: string): Promise<SanityResponse<CelebrityWithProducts | null>> =>
  fetchSanity<CelebrityWithProducts | null>(GET_CELEBRITY_WITH_PRODUCTS, { slug });

// ═══════════════════════════════════════════════════════════════════════
// TV SHOW HELPERS
// ═══════════════════════════════════════════════════════════════════════

export const getTvShows = (): Promise<SanityResponse<TvShow[]>> => 
  fetchSanity<TvShow[]>(GET_ALL_TV_SHOWS);

/**
 * TV Show with nested products
 */
export interface TvShowWithProducts extends TvShow {
  products: Product[];
}

export const getTvShowWithProducts = (slug: string): Promise<SanityResponse<TvShowWithProducts | null>> =>
  fetchSanity<TvShowWithProducts | null>(GET_TV_SHOW_WITH_PRODUCTS, { slug });

// ═══════════════════════════════════════════════════════════════════════
// HOMEPAGE HELPER
// ═══════════════════════════════════════════════════════════════════════

/**
 * Homepage data structure
 */
export interface HomepageData {
  featuredProducts: Product[];
  categories: Category[];
  brands: Brand[];
  celebrities: Celebrity[];
}

export const getHomepageData = (): Promise<SanityResponse<HomepageData>> => 
  fetchSanity<HomepageData>(GET_HOMEPAGE_DATA);
