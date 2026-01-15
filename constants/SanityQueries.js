/**
 * GROQ Queries for Sanity
 * All queries used across the Dokkani app
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
`;

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
`;

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
`;

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
`;

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
`;

// Search products by title
export const SEARCH_PRODUCTS = `
  *[_type == "product" && title match $searchTerm + "*"] {
    _id,
    title,
    "slug": slug.current,
    price,
    image,
    "category": category->{ name }
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all categories
export const GET_ALL_CATEGORIES = `
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    image
  }
`;

// Get category with its products
export const GET_CATEGORY_WITH_PRODUCTS = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    "products": *[_type == "product" && references(^._id)] {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      inStock
    }
  }
`;

// Get category product count
export const GET_CATEGORY_COUNTS = `
  *[_type == "category"] {
    _id,
    name,
    "slug": slug.current,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// BRAND QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all brands with their products
export const GET_ALL_BRANDS = `
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    description,
    "products": *[_type == "product" && references(^._id)] {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      images,
      description,
      inStock,
      "category": category->{ _id, name, "slug": slug.current }
    }
  }
`;

// Get brand with its products
export const GET_BRAND_WITH_PRODUCTS = `
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    description,
    "products": *[_type == "product" && references(^._id)] {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      inStock,
      "category": category->{ name }
    }
  }
`;

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
    banner,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      images,
      description,
      inStock,
      "category": category->{ _id, name, "slug": slug.current },
      "brand": brand->{ _id, name, "slug": slug.current }
    }
  }
`;

// Get celebrity with endorsed products
export const GET_CELEBRITY_WITH_PRODUCTS = `
  *[_type == "celebrity" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      "category": category->{ name },
      "brand": brand->{ name }
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// TV SHOW QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all TV shows
export const GET_ALL_TV_SHOWS = `
  *[_type == "tvShow"] {
    _id,
    name,
    "slug": slug.current,
    image,
    videoUrl,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      images,
      description,
      inStock,
      "category": category->{ _id, name, "slug": slug.current }
    },
    "productCount": count(products)
  }
`;

// Get TV show with featured products
export const GET_TV_SHOW_WITH_PRODUCTS = `
  *[_type == "tvShow" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    videoUrl,
    "products": products[]-> {
      _id,
      title,
      "slug": slug.current,
      price,
      image,
      "category": category->{ name },
      "brand": brand->{ name }
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// FILTER & SORT QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Products with filters (category, price range, stock)
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
`;

// ═══════════════════════════════════════════════════════════════════════
// HOMEPAGE QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get all homepage data in one query
export const GET_HOMEPAGE_DATA = `
{
  "categories": *[_type == "category"] | order(order asc) [0...6] {
    _id,
    name,
    "slug": slug.current,
    image
  },
  "featuredProducts": *[_type == "product" && featured == true] | order(_createdAt desc) [0...8] {
    _id,
    title,
    "slug": slug.current,
    price,
    image
  },
  "brands": *[_type == "brand"] | order(name asc) [0...12] {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    "products": *[_type == "product" && references(^._id)] {
      _id,
      title,
      price,
      image,
      description,
      inStock
    }
  },
  "celebrities": *[_type == "celebrity"] | order(name asc) [0...12] {
    _id,
    name,
    "slug": slug.current,
    image,
    banner,
    "products": products[]-> {
      _id,
      title,
      price,
      image,
      description,
      inStock
    }
  },
  "tvShows": *[_type == "tvShow"] [0...3] {
    _id,
    name,
    image,
    videoUrl
  }
}
`;

// ═══════════════════════════════════════════════════════════════════════
// ORDER QUERIES
// ═══════════════════════════════════════════════════════════════════════

// Get orders by user ID (Clerk userId)
export const GET_ORDERS_BY_USER = `
  *[_type == "order" && userId == $userId] | order(createdAt desc) {
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
  }
`;
