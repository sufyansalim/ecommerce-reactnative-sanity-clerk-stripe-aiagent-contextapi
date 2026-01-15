/**
 * Sanity Constants - Filters, Sort Options, and Configuration
 * Use these across the app for consistency
 */

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY FILTERS
// ═══════════════════════════════════════════════════════════════════════
export const CATEGORIES = {
  CUFFLINKS: 'cufflinks',
  PHONE_CASES: 'phone-cases',
  WATCH_WINDERS: 'watch-winders',
  PERFUMES: 'perfumes',
  WATCHES: 'watches',
  INTERIOR_DECOR: 'interior-decor',
};

export const CATEGORY_LABELS = {
  [CATEGORIES.CUFFLINKS]: 'Cufflinks',
  [CATEGORIES.PHONE_CASES]: 'Phone Cases',
  [CATEGORIES.WATCH_WINDERS]: 'Watch Winders',
  [CATEGORIES.PERFUMES]: 'Perfumes',
  [CATEGORIES.WATCHES]: 'Watches',
  [CATEGORIES.INTERIOR_DECOR]: 'Interior Decor',
};

export const CATEGORY_LIST = Object.entries(CATEGORY_LABELS).map(([slug, name]) => ({
  slug,
  name,
}));

// ═══════════════════════════════════════════════════════════════════════
// SORT OPTIONS
// ═══════════════════════════════════════════════════════════════════════
export const SORT_OPTIONS = {
  PRICE_LOW_HIGH: 'price_asc',
  PRICE_HIGH_LOW: 'price_desc',
  NAME_AZ: 'name_asc',
  NAME_ZA: 'name_desc',
  NEWEST: 'newest',
  FEATURED: 'featured',
};

export const SORT_LABELS = {
  [SORT_OPTIONS.PRICE_LOW_HIGH]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_HIGH_LOW]: 'Price: High to Low',
  [SORT_OPTIONS.NAME_AZ]: 'Name: A-Z',
  [SORT_OPTIONS.NAME_ZA]: 'Name: Z-A',
  [SORT_OPTIONS.NEWEST]: 'Newest First',
  [SORT_OPTIONS.FEATURED]: 'Featured',
};

export const SORT_LIST = Object.entries(SORT_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// ═══════════════════════════════════════════════════════════════════════
// PRICE RANGE FILTERS
// ═══════════════════════════════════════════════════════════════════════
export const PRICE_RANGES = [
  { id: 'under-500', label: 'Under 500 QAR', min: 0, max: 500 },
  { id: '500-1000', label: '500 - 1000 QAR', min: 500, max: 1000 },
  { id: '1000-2500', label: '1000 - 2500 QAR', min: 1000, max: 2500 },
  { id: '2500-5000', label: '2500 - 5000 QAR', min: 2500, max: 5000 },
  { id: 'over-5000', label: 'Over 5000 QAR', min: 5000, max: Infinity },
];

// ═══════════════════════════════════════════════════════════════════════
// STOCK FILTERS
// ═══════════════════════════════════════════════════════════════════════
export const STOCK_FILTERS = {
  ALL: 'all',
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const STOCK_LABELS = {
  [STOCK_FILTERS.ALL]: 'All Products',
  [STOCK_FILTERS.IN_STOCK]: 'In Stock',
  [STOCK_FILTERS.OUT_OF_STOCK]: 'Out of Stock',
};

// ═══════════════════════════════════════════════════════════════════════
// SANITY PROJECT CONFIG
// ═══════════════════════════════════════════════════════════════════════
export const SANITY_CONFIG = {
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID || 'n56u81sg',
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.EXPO_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // Disabled CDN to ensure fresh data
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN, // Required for private datasets
};

// ═══════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════
export const DEFAULTS = {
  PRODUCTS_PER_PAGE: 12,
  CURRENCY: 'QAR',
  SORT: SORT_OPTIONS.NEWEST,
};
