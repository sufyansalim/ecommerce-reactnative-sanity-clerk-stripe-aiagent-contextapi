/**
 * Sanity Constants - TypeScript Version
 * 
 * TYPESCRIPT CONCEPTS:
 * 
 * 1. `as const` - Makes the object/array immutable and creates literal types
 *    Without: { CUFFLINKS: string }
 *    With `as const`: { CUFFLINKS: "cufflinks" } (literal type)
 * 
 * 2. keyof typeof - Gets the keys of an object as a union type
 *    keyof typeof CATEGORIES = "CUFFLINKS" | "PHONE_CASES" | ...
 * 
 * 3. INTERFACE FOR CONFIG - Defines the shape of configuration objects
 */

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY FILTERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * `as const` makes this a "const assertion"
 * TypeScript will treat each value as a literal type instead of just `string`
 */
export const CATEGORIES = {
  CUFFLINKS: 'cufflinks',
  PHONE_CASES: 'phone-cases',
  WATCH_WINDERS: 'watch-winders',
  PERFUMES: 'perfumes',
  WATCHES: 'watches',
  INTERIOR_DECOR: 'interior-decor',
} as const;

/**
 * Type for category slugs - will be one of the CATEGORIES values
 * CategorySlug = "cufflinks" | "phone-cases" | "watch-winders" | ...
 */
export type CategorySlug = typeof CATEGORIES[keyof typeof CATEGORIES];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  [CATEGORIES.CUFFLINKS]: 'Cufflinks',
  [CATEGORIES.PHONE_CASES]: 'Phone Cases',
  [CATEGORIES.WATCH_WINDERS]: 'Watch Winders',
  [CATEGORIES.PERFUMES]: 'Perfumes',
  [CATEGORIES.WATCHES]: 'Watches',
  [CATEGORIES.INTERIOR_DECOR]: 'Interior Decor',
};

/**
 * Category item interface
 */
export interface CategoryItem {
  slug: CategorySlug;
  name: string;
}

export const CATEGORY_LIST: CategoryItem[] = Object.entries(CATEGORY_LABELS).map(([slug, name]) => ({
  slug: slug as CategorySlug,
  name,
}));

// ═══════════════════════════════════════════════════════════════════════
// SORT OPTIONS
// ═══════════════════════════════════════════════════════════════════════

export const SORT_OPTIONS = {
  DEFAULT: 'default',
  PRICE_LOW_HIGH: 'price_asc',
  PRICE_HIGH_LOW: 'price_desc',
  NAME_AZ: 'name_asc',
  NAME_ZA: 'name_desc',
  NEWEST: 'newest',
  FEATURED: 'featured',
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

export const SORT_LABELS: Record<SortOption, string> = {
  [SORT_OPTIONS.DEFAULT]: 'Default',
  [SORT_OPTIONS.PRICE_LOW_HIGH]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_HIGH_LOW]: 'Price: High to Low',
  [SORT_OPTIONS.NAME_AZ]: 'Name: A to Z',
  [SORT_OPTIONS.NAME_ZA]: 'Name: Z to A',
  [SORT_OPTIONS.NEWEST]: 'Newest First',
  [SORT_OPTIONS.FEATURED]: 'Featured',
};

export interface SortItem {
  id: SortOption;
  label: string;
}

export const SORT_LIST: SortItem[] = Object.entries(SORT_LABELS).map(([value, label]) => ({
  id: value as SortOption,
  label,
}));

// ═══════════════════════════════════════════════════════════════════════
// PRICE RANGE FILTERS
// ═══════════════════════════════════════════════════════════════════════

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: 'under-50', label: 'Under $50', min: 0, max: 50 },
  { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { id: '100-250', label: '$100 - $250', min: 100, max: 250 },
  { id: '250-500', label: '$250 - $500', min: 250, max: 500 },
  { id: 'over-500', label: 'Over $500', min: 500, max: Infinity },
];

// ═══════════════════════════════════════════════════════════════════════
// STOCK FILTERS
// ═══════════════════════════════════════════════════════════════════════

export const STOCK_FILTERS = {
  ALL: 'all',
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
} as const;

export type StockFilter = typeof STOCK_FILTERS[keyof typeof STOCK_FILTERS];

export const STOCK_LABELS: Record<StockFilter, string> = {
  [STOCK_FILTERS.ALL]: 'All Products',
  [STOCK_FILTERS.IN_STOCK]: 'In Stock',
  [STOCK_FILTERS.OUT_OF_STOCK]: 'Out of Stock',
};

// ═══════════════════════════════════════════════════════════════════════
// SANITY PROJECT CONFIG
// ═══════════════════════════════════════════════════════════════════════

/**
 * Configuration interface for Sanity client
 */
export interface SanityConfigType {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
  token?: string;
}

export const SANITY_CONFIG: SanityConfigType = {
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID || 'n56u81sg',
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.EXPO_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // Disabled CDN to ensure fresh data
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN, // Required for private datasets
};

// ═══════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════

export interface DefaultsConfig {
  PRODUCTS_PER_PAGE: number;
  CURRENCY: string;
  SORT: SortOption;
}

export const DEFAULTS: DefaultsConfig = {
  PRODUCTS_PER_PAGE: 12,
  CURRENCY: 'USD',
  SORT: SORT_OPTIONS.NEWEST,
};
