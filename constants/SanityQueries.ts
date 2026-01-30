/**
 * GROQ Queries for Sanity - TypeScript Version
 * 
 * These are all GROQ query strings used to fetch data from Sanity.
 * Since they're just strings, there's minimal TypeScript needed.
 * We'll just add `as const` to make them readonly.
 */

// ═══════════════════════════════════════════════════════════════════════
// PRODUCT QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all products with category and brand details
export const GET_ALL_PRODUCTS = `
  *[_type == "product"] {
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
      "slug": slug.current,
      image
    }
  }
` as const;

// Get products by category slug
export const GET_PRODUCTS_BY_CATEGORY = `
  *[_type == "product" && category->slug.current == $categorySlug] {
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
  }
` as const;

// Get products by brand slug
export const GET_PRODUCTS_BY_BRAND = `
  *[_type == "product" && brand->slug.current == $brandSlug] {
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
  }
` as const;

// Get single product by slug
export const GET_PRODUCT_BY_SLUG = `
  *[_type == "product" && slug.current == $slug][0] {
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
      "slug": slug.current,
      image
    }
  }
` as const;

// Get featured products for homepage
export const GET_FEATURED_PRODUCTS = `
  *[_type == "product" && featured == true] | order(_createdAt desc) [0...12] {
    _id,
    title,
    "slug": slug.current,
    price,
    image,
    "category": category->{ name, "slug": slug.current }
  }
` as const;

// Search products by title or description
export const SEARCH_PRODUCTS = `
  *[_type == "product" && (
    title match $searchTerm + "*" ||
    description match $searchTerm + "*"
  )] {
    _id,
    title,
    "slug": slug.current,
    price,
    image,
    "category": category->{ name, "slug": slug.current }
  }
` as const;

// Get filtered and sorted products (with pagination)
export const GET_FILTERED_PRODUCTS = `
  *[_type == "product"
    && ($categorySlug == "" || category->slug.current == $categorySlug)
    && ($minPrice == 0 || price >= $minPrice)
    && ($maxPrice == 0 || price <= $maxPrice)
    && ($inStockOnly == false || inStock == true)
  ] | order(
    select(
      $sortBy == "price_asc" => price asc,
      $sortBy == "price_desc" => price desc,
      $sortBy == "name_asc" => title asc,
      $sortBy == "name_desc" => title desc,
      $sortBy == "featured" => featured desc,
      _createdAt desc
    )
  ) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    price,
    image,
    inStock,
    featured,
    "category": category->{ name, "slug": slug.current }
  }
` as const;

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all categories
export const GET_ALL_CATEGORIES = `
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image
  }
` as const;

// Get category with its products
export const GET_CATEGORY_WITH_PRODUCTS = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    "products": *[_type == "product" && category._ref == ^._id] {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      inStock
    }
  }
` as const;

// Get category product counts
export const GET_CATEGORY_COUNTS = `
  *[_type == "category"] {
    _id,
    name,
    "slug": slug.current,
    "productCount": count(*[_type == "product" && category._ref == ^._id])
  }
` as const;

// ═══════════════════════════════════════════════════════════════════════
// BRAND QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all brands
export const GET_ALL_BRANDS = `
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image
  }
` as const;

// Get brand with its products
export const GET_BRAND_WITH_PRODUCTS = `
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    "products": *[_type == "product" && brand._ref == ^._id] {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      inStock
    }
  }
` as const;

// ═══════════════════════════════════════════════════════════════════════
// CELEBRITY QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all celebrities
export const GET_ALL_CELEBRITIES = `
  *[_type == "celebrity"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    bio
  }
` as const;

// Get celebrity with their products
export const GET_CELEBRITY_WITH_PRODUCTS = `
  *[_type == "celebrity" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    bio,
    "products": products[]->{
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      inStock
    }
  }
` as const;

// ═══════════════════════════════════════════════════════════════════════
// TV SHOW QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all TV shows
export const GET_ALL_TV_SHOWS = `
  *[_type == "tvShow"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    videoUrl
  }
` as const;

// Get TV show with its products
export const GET_TV_SHOW_WITH_PRODUCTS = `
  *[_type == "tvShow" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    videoUrl,
    "products": products[]->{
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      inStock
    }
  }
` as const;

// ═══════════════════════════════════════════════════════════════════════
// HOMEPAGE QUERY
// ═══════════════════════════════════════════════════════════════════════

// Get homepage data (featured products, categories, brands preview)
export const GET_HOMEPAGE_DATA = `
  {
    "featuredProducts": *[_type == "product" && featured == true] | order(_createdAt desc) [0...8] {
      _id,
      title,
      "slug": slug.current,
      price,
      image
    },
    "categories": *[_type == "category"] | order(name asc) [0...6] {
      _id,
      name,
      "slug": slug.current,
      image
    },
    "brands": *[_type == "brand"] | order(name asc) [0...6] {
      _id,
      name,
      "slug": slug.current,
      image
    },
    "celebrities": *[_type == "celebrity"] | order(name asc) [0...6] {
      _id,
      name,
      "slug": slug.current,
      image
    }
  }
` as const;

// Get orders by user ID
export const GET_ORDERS_BY_USER = `
  *[_type == "order" && userId == $userId] | order(_createdAt desc) {
    _id,
    orderNumber,
    userId,
    userEmail,
    items,
    subtotal,
    shipping,
    total,
    currency,
    status,
    shippingAddress,
    _createdAt
  }
` as const;