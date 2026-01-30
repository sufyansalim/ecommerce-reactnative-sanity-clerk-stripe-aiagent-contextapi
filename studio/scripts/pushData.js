#!/usr/bin/env node

/**
 * Sanity Data Push Script
 * 
 * Matches the Sanity client mutation pattern used in Admin Apps.
 * 
 * Usage:
 *   node scripts/pushData.js                    # Push all data
 *   node scripts/pushData.js --type=product     # Push only products
 *   node scripts/pushData.js --type=category    # Push only categories
 *   node scripts/pushData.js --dry-run          # Preview without pushing
 */

const { createClient } = require('@sanity/client');
const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'n56u81sg',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// ═══════════════════════════════════════════════════════════════════════
// DATA DEFINITIONS - Edit these to match your content
// ═══════════════════════════════════════════════════════════════════════

const categories = [
  { name: 'Watches', slug: 'watches', order: 1, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop' },
  { name: 'Perfumes', slug: 'perfumes', order: 2, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop' },
  { name: 'Cufflinks', slug: 'cufflinks', order: 3, image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&h=400&fit=crop' },
  { name: 'Phone Cases', slug: 'phone-cases', order: 4, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop' },
  { name: 'Watch Winders', slug: 'watch-winders', order: 5, image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop' },
  { name: 'Interior Decor', slug: 'interior-decor', order: 6, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop' },
];

const brands = [
  { name: 'Chronolux', slug: 'chronolux', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
  { name: 'Luxe Accessories', slug: 'luxe-accessories', image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=200&h=200&fit=crop' },
  { name: 'Artisan Home', slug: 'artisan-home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop' },
];

const products = [
  {
    title: 'Classic Moonphase Watch',
    slug: 'classic-moonphase',
    price: 485,
    description: 'Elegant moonphase complication with Swiss movement',
    categorySlug: 'watches',
    brandSlug: 'chronolux',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    title: 'Royal Oud Intense',
    slug: 'royal-oud-intense',
    price: 102,
    description: 'Premium Arabian oud fragrance',
    categorySlug: 'perfumes',
    brandSlug: 'luxe-accessories',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    title: 'Bronze Horse Sculpture',
    slug: 'bronze-horse-sculpture',
    price: 195,
    description: 'Hand-crafted bronze sculpture',
    categorySlug: 'interior-decor',
    brandSlug: 'artisan-home',
    image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
  },
];

const celebrities = [
  {
    name: 'Sophia Martinez',
    slug: 'sophia-martinez',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop',
  },
  {
    name: 'Omar Al Farsi',
    slug: 'omar-al-farsi',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
  },
  {
    name: 'Isabella Chen',
    slug: 'isabella-chen',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
  },
  {
    name: 'Lucas Thompson',
    slug: 'lucas-thompson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop',
  },
  {
    name: 'Amira Al Thani',
    slug: 'amira-al-thani',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=400&fit=crop',
  },
  {
    name: 'James Rodriguez',
    slug: 'james-rodriguez',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  },
  {
    name: 'Zara Al Qassimi',
    slug: 'zara-al-qassimi',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
  },
  {
    name: 'Ethan Williams',
    slug: 'ethan-williams',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=400&fit=crop',
  },
  {
    name: 'Layla Al Nahyan',
    slug: 'layla-al-nahyan',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=400&fit=crop',
  },
  {
    name: 'Alexander Brooks',
    slug: 'alexander-brooks',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=400&fit=crop',
  },
  {
    name: 'Maya Patel',
    slug: 'maya-patel',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop',
  },
  {
    name: 'Khalid Al Mansour',
    slug: 'khalid-al-mansour',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
  },
];

const tvShows = [
  {
    name: 'Luxury Life Qatar',
    slug: 'luxury-life-qatar',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=225&fit=crop',
    videoUrl: 'https://www.dailymotion.com/embed/video/x8m3d4s',
  },
  {
    name: 'Style Icons GCC',
    slug: 'style-icons-gcc',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&fit=crop',
    videoUrl: 'https://www.dailymotion.com/embed/video/x7tgad0',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// PUSH FUNCTIONS - Using Sanity mutations (same pattern as Admin App SDK)
// ═══════════════════════════════════════════════════════════════════════

async function pushCategories(dryRun = false) {
  console.log('\n📁 Pushing Categories...');
  
  for (const cat of categories) {
    const doc = {
      _type: 'category',
      _id: `category-${cat.slug}`,
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      order: cat.order,
      image: cat.image,
    };
    
    if (dryRun) {
      console.log(`  [DRY] Would create: ${cat.name}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✅ Created: ${cat.name}`);
    }
  }
}

async function pushBrands(dryRun = false) {
  console.log('\n🏷️  Pushing Brands...');
  
  for (const brand of brands) {
    const doc = {
      _type: 'brand',
      _id: `brand-${brand.slug}`,
      name: brand.name,
      slug: { _type: 'slug', current: brand.slug },
      image: brand.image,
      banner: brand.banner || brand.image,
    };
    
    if (dryRun) {
      console.log(`  [DRY] Would create: ${brand.name}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✅ Created: ${brand.name}`);
    }
  }
}

async function pushProducts(dryRun = false) {
  console.log('\n🛍️  Pushing Products...');
  
  for (const product of products) {
    const doc = {
      _type: 'product',
      _id: `product-${product.slug}`,
      title: product.title,
      slug: { _type: 'slug', current: product.slug },
      price: product.price,
      description: product.description,
      image: product.image,
      images: [product.image],
      inStock: product.inStock,
      featured: product.featured,
      // References
      category: { _type: 'reference', _ref: `category-${product.categorySlug}` },
      brand: { _type: 'reference', _ref: `brand-${product.brandSlug}` },
    };
    
    if (dryRun) {
      console.log(`  [DRY] Would create: ${product.title}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✅ Created: ${product.title}`);
    }
  }
}

async function pushCelebrities(dryRun = false) {
  console.log('\n⭐ Pushing Celebrities...');
  
  // First, get some product IDs to reference
  const productDocs = await client.fetch('*[_type == "product"][0...3]._id');
  
  for (const celeb of celebrities) {
    const doc = {
      _type: 'celebrity',
      _id: `celebrity-${celeb.slug}`,
      name: celeb.name,
      slug: { _type: 'slug', current: celeb.slug },
      image: celeb.image,
      banner: celeb.banner,
      products: productDocs.slice(0, 2).map((id, idx) => ({
        _type: 'reference',
        _ref: id,
        _key: `celeb-prod-${idx}`,
      })),
    };
    
    if (dryRun) {
      console.log(`  [DRY] Would create: ${celeb.name}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✅ Created: ${celeb.name}`);
    }
  }
}

async function pushTvShows(dryRun = false) {
  console.log('\n📺 Pushing TV Shows...');
  
  // Get some product IDs to reference
  const productDocs = await client.fetch('*[_type == "product"][0...4]._id');
  
  for (const show of tvShows) {
    const doc = {
      _type: 'tvShow',
      _id: `tvshow-${show.slug}`,
      name: show.name,
      slug: { _type: 'slug', current: show.slug },
      image: show.image,
      videoUrl: show.videoUrl,
      products: productDocs.map((id, idx) => ({
        _type: 'reference',
        _ref: id,
        _key: `tv-prod-${idx}`,
      })),
    };
    
    if (dryRun) {
      console.log(`  [DRY] Would create: ${show.name}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✅ Created: ${show.name}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// BATCH MUTATIONS - More efficient for large datasets
// ═══════════════════════════════════════════════════════════════════════

async function pushAllWithTransaction(dryRun = false) {
  console.log('\n🚀 Pushing all data with batch transaction...');
  
  if (dryRun) {
    console.log('  [DRY RUN] Would push:');
    console.log(`    - ${categories.length} categories`);
    console.log(`    - ${brands.length} brands`);
    console.log(`    - ${products.length} products`);
    console.log(`    - ${celebrities.length} celebrities`);
    console.log(`    - ${tvShows.length} TV shows`);
    return;
  }
  
  const transaction = client.transaction();
  
  // Categories
  categories.forEach(cat => {
    transaction.createOrReplace({
      _type: 'category',
      _id: `category-${cat.slug}`,
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      order: cat.order,
      image: cat.image,
    });
  });
  
  // Brands
  brands.forEach(brand => {
    transaction.createOrReplace({
      _type: 'brand',
      _id: `brand-${brand.slug}`,
      name: brand.name,
      slug: { _type: 'slug', current: brand.slug },
      image: brand.image,
      banner: brand.banner || brand.image,
    });
  });
  
  // Products
  products.forEach(product => {
    transaction.createOrReplace({
      _type: 'product',
      _id: `product-${product.slug}`,
      title: product.title,
      slug: { _type: 'slug', current: product.slug },
      price: product.price,
      description: product.description,
      image: product.image,
      images: [product.image],
      inStock: product.inStock,
      featured: product.featured,
      category: { _type: 'reference', _ref: `category-${product.categorySlug}` },
      brand: { _type: 'reference', _ref: `brand-${product.brandSlug}` },
    });
  });
  
  await transaction.commit();
  console.log('  ✅ Batch 1 committed (categories, brands, products)');
  
  // Second transaction for documents with product references
  const transaction2 = client.transaction();
  const productIds = products.map(p => `product-${p.slug}`);
  
  // Celebrities
  celebrities.forEach((celeb, idx) => {
    transaction2.createOrReplace({
      _type: 'celebrity',
      _id: `celebrity-${celeb.slug}`,
      name: celeb.name,
      slug: { _type: 'slug', current: celeb.slug },
      image: celeb.image,
      banner: celeb.banner,
      products: productIds.slice(0, 2).map((id, i) => ({
        _type: 'reference',
        _ref: id,
        _key: `celeb-${idx}-prod-${i}`,
      })),
    });
  });
  
  // TV Shows
  tvShows.forEach((show, idx) => {
    transaction2.createOrReplace({
      _type: 'tvShow',
      _id: `tvshow-${show.slug}`,
      name: show.name,
      slug: { _type: 'slug', current: show.slug },
      image: show.image,
      videoUrl: show.videoUrl,
      products: productIds.map((id, i) => ({
        _type: 'reference',
        _ref: id,
        _key: `tv-${idx}-prod-${i}`,
      })),
    });
  });
  
  await transaction2.commit();
  console.log('  ✅ Batch 2 committed (celebrities, TV shows)');
}

// ═══════════════════════════════════════════════════════════════════════
// UTILITY: Update specific fields (like Admin App mutations)
// ═══════════════════════════════════════════════════════════════════════

async function updateField(type, field, value, dryRun = false) {
  console.log(`\n🔄 Updating ${field} on all ${type} documents...`);
  
  const docs = await client.fetch(`*[_type == "${type}"]{ _id, ${field} }`);
  
  if (dryRun) {
    console.log(`  [DRY] Would update ${docs.length} documents`);
    return;
  }
  
  const transaction = client.transaction();
  docs.forEach(doc => {
    transaction.patch(doc._id, { set: { [field]: value } });
  });
  
  await transaction.commit();
  console.log(`  ✅ Updated ${docs.length} documents`);
}

async function updateStock(productId, inStock, dryRun = false) {
  console.log(`\n📦 Updating stock for ${productId}...`);
  
  if (dryRun) {
    console.log(`  [DRY] Would set inStock = ${inStock}`);
    return;
  }
  
  await client.patch(productId).set({ inStock }).commit();
  console.log(`  ✅ Stock updated`);
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { type: null, dryRun: false, batch: true };
  
  args.forEach(arg => {
    if (arg.startsWith('--type=')) options.type = arg.split('=')[1];
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--no-batch') options.batch = false;
  });
  
  return options;
}

async function main() {
  const opts = parseArgs();
  
  console.log('\n🔌 Sanity Data Push Script');
  console.log(`   Project: ${process.env.SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.SANITY_DATASET}`);
  
  if (!process.env.SANITY_TOKEN) {
    console.error('\n❌ SANITY_TOKEN not found in .env file');
    process.exit(1);
  }
  
  if (opts.dryRun) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }
  
  try {
    if (opts.type) {
      // Push specific type
      switch (opts.type) {
        case 'category': await pushCategories(opts.dryRun); break;
        case 'brand': await pushBrands(opts.dryRun); break;
        case 'product': await pushProducts(opts.dryRun); break;
        case 'celebrity': await pushCelebrities(opts.dryRun); break;
        case 'tvShow': await pushTvShows(opts.dryRun); break;
        default: console.log(`❌ Unknown type: ${opts.type}`);
      }
    } else if (opts.batch) {
      // Push all with batch transaction (more efficient)
      await pushAllWithTransaction(opts.dryRun);
    } else {
      // Push all individually
      await pushCategories(opts.dryRun);
      await pushBrands(opts.dryRun);
      await pushProducts(opts.dryRun);
      await pushCelebrities(opts.dryRun);
      await pushTvShows(opts.dryRun);
    }
    
    console.log('\n✨ Done!\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
