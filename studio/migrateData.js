/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOKKANI - SANITY MIGRATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This script pushes all mock data to Sanity CMS with proper relationships.
 * 
 * SETUP:
 * 1. Create a token at: https://www.sanity.io/manage/project/n56u81sg/api#tokens
 * 2. Run: SANITY_TOKEN=your_token_here node migrateData.js
 * 
 * OR set in .env file:
 *    SANITY_TOKEN=your_token_here
 * 
 * DATA SUMMARY:
 * - 6 Categories
 * - 12 Brands  
 * - 24 Products (4 per category)
 * - 12 Celebrities (with product endorsements)
 * - 3 TV Shows (with featured products)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const { createClient } = require('@sanity/client');

// Load .env if available
try { require('dotenv').config(); } catch (e) {}

const client = createClient({
  projectId: 'n56u81sg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// Validate token
if (!process.env.SANITY_TOKEN) {
  console.error('❌ ERROR: SANITY_TOKEN environment variable is required');
  console.log('\nGet a token from: https://www.sanity.io/manage/project/n56u81sg/api#tokens');
  console.log('Then run: SANITY_TOKEN=your_token node migrateData.js\n');
  process.exit(1);
}

// Helper to create slug from string
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ═══════════════════════════════════════════════════════════════════════════
// DATA - Categories
// ═══════════════════════════════════════════════════════════════════════════
const categories = [
  { name: 'Cufflinks', image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&h=400&fit=crop' },
  { name: 'Phone Cases', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600&h=400&fit=crop' },
  { name: 'Watch Winders', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=400&fit=crop' },
  { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop' },
  { name: 'Interior Decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop' },
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA - Brands
// ═══════════════════════════════════════════════════════════════════════════
const brands = [
  { name: 'Maison Noir', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=300&fit=crop', description: 'Luxury accessories for the modern gentleman' },
  { name: 'Chronolux', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=300&fit=crop', description: 'Swiss precision timepieces' },
  { name: 'Artisan Home', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=300&fit=crop', description: 'Handcrafted home essentials' },
  { name: 'Velour Living', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop', description: 'Premium interior decor' },
  { name: 'Tempus Elite', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=300&fit=crop', description: 'Exclusive watch collections' },
  { name: 'TechShield', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=300&fit=crop', description: 'Premium tech accessories' },
  { name: 'Oro Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=300&fit=crop', description: 'Golden timepieces' },
  { name: 'Parfum Royal', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=300&fit=crop', description: 'Royal fragrances from Arabia' },
  { name: 'Sterling & Co', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=300&fit=crop', description: 'Fine silver accessories' },
  { name: 'Horology House', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=300&fit=crop', description: 'Watch winders and storage' },
  { name: 'Luxe Accessories', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&h=300&fit=crop', description: 'Designer phone cases and tech' },
  { name: 'Essence Arabia', image: 'https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=800&h=300&fit=crop', description: 'Arabian oud and perfumes' },
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA - Products (24 total, 4 per category)
// ═══════════════════════════════════════════════════════════════════════════
const products = [
  // Cufflinks (4)
  { title: 'Royal Gold Cufflinks', price: 450, category: 'Cufflinks', brand: 'Maison Noir', description: 'Elegant 18k gold cufflinks with intricate detailing.', image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&h=400&fit=crop', featured: true },
  { title: 'Diamond Elite Cufflinks', price: 1200, category: 'Cufflinks', brand: 'Sterling & Co', description: 'Premium diamond-studded cufflinks.', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&fit=crop', featured: true },
  { title: 'Silver Classic Cufflinks', price: 320, category: 'Cufflinks', brand: 'Sterling & Co', description: 'Timeless sterling silver cufflinks.', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&h=400&fit=crop', featured: false },
  { title: 'Onyx Prestige Cufflinks', price: 580, category: 'Cufflinks', brand: 'Maison Noir', description: 'Black onyx cufflinks in white gold.', image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&h=400&fit=crop', featured: false },
  
  // Phone Cases (4)
  { title: 'Croco Leather Case', price: 185, category: 'Phone Cases', brand: 'Luxe Accessories', description: 'Genuine crocodile leather phone case.', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop', featured: true },
  { title: 'Carbon Shield Pro', price: 150, category: 'Phone Cases', brand: 'TechShield', description: 'Military-grade carbon fiber case.', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop', featured: true },
  { title: 'Alcantara Slim Case', price: 120, category: 'Phone Cases', brand: 'Luxe Accessories', description: 'Ultra-slim Alcantara suede case.', image: 'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=400&h=400&fit=crop', featured: false },
  { title: 'Gold Trim Edition', price: 250, category: 'Phone Cases', brand: 'Luxe Accessories', description: 'Leather case with 24k gold trim.', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop', featured: false },
  
  // Watch Winders (4)
  { title: 'Solo Watch Winder', price: 350, category: 'Watch Winders', brand: 'Horology House', description: 'Single watch winder with quiet motor.', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop', featured: true },
  { title: 'Duo Automatic Winder', price: 650, category: 'Watch Winders', brand: 'Horology House', description: 'Dual watch winder with rotation settings.', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=400&fit=crop', featured: true },
  { title: 'Prestige Collection Box', price: 1500, category: 'Watch Winders', brand: 'Horology House', description: 'Luxury 4-watch winder in piano black.', image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&h=400&fit=crop', featured: false },
  { title: 'Travel Watch Winder', price: 480, category: 'Watch Winders', brand: 'Horology House', description: 'Compact portable winder with USB.', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop', featured: false },
  
  // Perfumes (4)
  { title: 'Royal Oud Intense', price: 380, category: 'Perfumes', brand: 'Parfum Royal', description: 'Rich Arabian oud with rose accents.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', featured: true },
  { title: 'French Riviera', price: 450, category: 'Perfumes', brand: 'Essence Arabia', description: 'Fresh citrus and marine notes.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop', featured: false },
  { title: 'Arabian Nights Musk', price: 320, category: 'Perfumes', brand: 'Essence Arabia', description: 'Warm white musk with amber.', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop', featured: false },
  { title: 'Desert Rose Elixir', price: 520, category: 'Perfumes', brand: 'Parfum Royal', description: 'Rare Taif rose with precious woods.', image: 'https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=400&h=400&fit=crop', featured: false },
  
  // Watches (4)
  { title: 'Chronograph Elite', price: 2500, category: 'Watches', brand: 'Tempus Elite', description: 'Swiss automatic chronograph.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', featured: true },
  { title: 'Smart Executive Watch', price: 850, category: 'Watches', brand: 'Chronolux', description: 'Hybrid smartwatch with classic design.', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop', featured: false },
  { title: 'Classic Moonphase', price: 1800, category: 'Watches', brand: 'Oro Watches', description: 'Elegant moonphase complication.', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', featured: false },
  { title: 'Diver Professional', price: 1950, category: 'Watches', brand: 'Tempus Elite', description: '300m water resistant diver watch.', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop', featured: false },
  
  // Interior Decor (4)
  { title: 'Crystal Orchid Vase', price: 380, category: 'Interior Decor', brand: 'Velour Living', description: 'Hand-blown crystal vase.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', featured: false },
  { title: 'Gilded Photo Frame', price: 250, category: 'Interior Decor', brand: 'Artisan Home', description: '24k gold-plated frame.', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop', featured: false },
  { title: 'Bronze Horse Sculpture', price: 720, category: 'Interior Decor', brand: 'Artisan Home', description: 'Limited edition bronze sculpture.', image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop', featured: false },
  { title: 'Marble Chess Set', price: 950, category: 'Interior Decor', brand: 'Velour Living', description: 'Hand-carved marble chess set.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', featured: false },
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA - Celebrities
// ═══════════════════════════════════════════════════════════════════════════
const celebrities = [
  { name: 'Sheikh Ahmed Al-Thani', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=300&fit=crop', productIndices: [0, 16] },
  { name: 'Omar Khalid', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=300&fit=crop', productIndices: [1, 18] },
  { name: 'Hassan bin Rashid', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=300&fit=crop', productIndices: [4, 12] },
  { name: 'Faisal Al-Saud', image: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=800&h=300&fit=crop', productIndices: [8, 19] },
  { name: 'Khalid bin Mohammed', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=300&fit=crop', productIndices: [5, 20] },
  { name: 'Abdulaziz Al-Maktoum', image: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=800&h=300&fit=crop', productIndices: [9, 17] },
  { name: 'Sultan Al-Nahyan', image: 'https://images.unsplash.com/photo-1480429370612-39b7fba4ba00?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1480429370612-39b7fba4ba00?w=800&h=300&fit=crop', productIndices: [10, 13] },
  { name: 'Tariq Al-Jaber', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=300&fit=crop', productIndices: [21, 6] },
  { name: 'Mohammed Al-Attiyah', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&h=300&fit=crop', productIndices: [22, 14] },
  { name: 'Yusuf bin Hamad', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=300&fit=crop', productIndices: [23, 2] },
  { name: 'Sheikha Fatima', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=300&fit=crop', productIndices: [15, 7] },
  { name: 'Princess Noura', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=300&fit=crop', productIndices: [11, 3] },
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA - TV Shows
// ═══════════════════════════════════════════════════════════════════════════
const tvShows = [
  { name: 'Luxury Life Qatar', image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=225&fit=crop', videoUrl: 'https://player.vimeo.com/video/123456789', productIndices: [16, 0, 12, 18] },
  { name: 'Arabian Elegance', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop', videoUrl: 'https://player.vimeo.com/video/234567890', productIndices: [1, 8, 19, 20] },
  { name: 'Style Icons GCC', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&fit=crop', videoUrl: 'https://player.vimeo.com/video/345678901', productIndices: [4, 9, 15, 22] },
];

// ═══════════════════════════════════════════════════════════════════════════
// MIGRATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Store created IDs for references
const createdIds = {
  categories: {},
  brands: {},
  products: [],
};

async function migrateCategories() {
  console.log('\n📦 Migrating Categories...');
  
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const id = `category-${slugify(cat.name)}`;
    
    const doc = {
      _type: 'category',
      _id: id,
      name: cat.name,
      slug: { _type: 'slug', current: slugify(cat.name) },
      image: cat.image,
      order: i,
    };
    
    try {
      await client.createOrReplace(doc);
      createdIds.categories[cat.name] = id;
      console.log(`  ✓ ${cat.name}`);
    } catch (error) {
      console.error(`  ✗ ${cat.name}: ${error.message}`);
    }
  }
}

async function migrateBrands() {
  console.log('\n🏷️  Migrating Brands...');
  
  for (const brand of brands) {
    const id = `brand-${slugify(brand.name)}`;
    
    const doc = {
      _type: 'brand',
      _id: id,
      name: brand.name,
      slug: { _type: 'slug', current: slugify(brand.name) },
      image: brand.image,
      banner: brand.banner,
      description: brand.description,
    };
    
    try {
      await client.createOrReplace(doc);
      createdIds.brands[brand.name] = id;
      console.log(`  ✓ ${brand.name}`);
    } catch (error) {
      console.error(`  ✗ ${brand.name}: ${error.message}`);
    }
  }
}

async function migrateProducts() {
  console.log('\n🛍️  Migrating Products...');
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const id = `product-${slugify(product.title)}`;
    
    const categoryId = createdIds.categories[product.category];
    const brandId = createdIds.brands[product.brand];
    
    const doc = {
      _type: 'product',
      _id: id,
      title: product.title,
      slug: { _type: 'slug', current: slugify(product.title) },
      price: product.price,
      description: product.description,
      image: product.image,
      images: [product.image],
      category: categoryId ? { _type: 'reference', _ref: categoryId } : undefined,
      brand: brandId ? { _type: 'reference', _ref: brandId } : undefined,
      inStock: true,
      featured: product.featured,
    };
    
    try {
      await client.createOrReplace(doc);
      createdIds.products[i] = id;
      console.log(`  ✓ ${product.title}`);
    } catch (error) {
      console.error(`  ✗ ${product.title}: ${error.message}`);
    }
  }
}

async function migrateCelebrities() {
  console.log('\n⭐ Migrating Celebrities...');
  
  for (const celeb of celebrities) {
    const id = `celebrity-${slugify(celeb.name)}`;
    
    const productRefs = celeb.productIndices.map((idx, i) => ({
      _type: 'reference',
      _ref: createdIds.products[idx],
      _key: `prod-${i}`,
    })).filter(ref => ref._ref);
    
    const doc = {
      _type: 'celebrity',
      _id: id,
      name: celeb.name,
      slug: { _type: 'slug', current: slugify(celeb.name) },
      image: celeb.image,
      banner: celeb.banner,
      products: productRefs,
    };
    
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${celeb.name} (${productRefs.length} products)`);
    } catch (error) {
      console.error(`  ✗ ${celeb.name}: ${error.message}`);
    }
  }
}

async function migrateTvShows() {
  console.log('\n📺 Migrating TV Shows...');
  
  for (const show of tvShows) {
    const id = `tvshow-${slugify(show.name)}`;
    
    const productRefs = show.productIndices.map((idx, i) => ({
      _type: 'reference',
      _ref: createdIds.products[idx],
      _key: `tv-${i}`,
    })).filter(ref => ref._ref);
    
    const doc = {
      _type: 'tvShow',
      _id: id,
      name: show.name,
      slug: { _type: 'slug', current: slugify(show.name) },
      image: show.image,
      videoUrl: show.videoUrl,
      products: productRefs,
    };
    
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${show.name} (${productRefs.length} products)`);
    } catch (error) {
      console.error(`  ✗ ${show.name}: ${error.message}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN MIGRATION
// ═══════════════════════════════════════════════════════════════════════════

async function runMigration() {
  console.log('🚀 DOKKANI - Sanity Data Migration\n');
  console.log('═'.repeat(50));
  console.log(`Project: n56u81sg`);
  console.log(`Dataset: production`);
  console.log('═'.repeat(50));
  
  try {
    // Order matters! Categories and brands first, then products, then relationships
    await migrateCategories();
    await migrateBrands();
    await migrateProducts();
    await migrateCelebrities();
    await migrateTvShows();
    
    console.log('\n' + '═'.repeat(50));
    console.log('✅ Migration Complete!\n');
    console.log('Summary:');
    console.log(`  • ${categories.length} Categories`);
    console.log(`  • ${brands.length} Brands`);
    console.log(`  • ${products.length} Products`);
    console.log(`  • ${celebrities.length} Celebrities`);
    console.log(`  • ${tvShows.length} TV Shows`);
    console.log('\n📍 View in Studio: cd studio && npm run dev');
    console.log('═'.repeat(50) + '\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
