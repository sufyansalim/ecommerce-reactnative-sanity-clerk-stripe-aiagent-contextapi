// Mock data for the app
// 12 Celebrities, 12 Brands, 24+ Products across all categories
// All images are from Unsplash for easy Sanity migration

// ============================================
// PRODUCT IMAGES BY CATEGORY (Unsplash)
// ============================================
const productImages = {
  'Cufflinks': [
    'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&h=400&fit=crop',
  ],
  'Phone Cases': [
    'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=400&h=400&fit=crop',
  ],
  'Watch Winders': [
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&h=400&fit=crop',
  ],
  'Perfumes': [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=400&h=400&fit=crop',
  ],
  'Watches': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop',
  ],
  'Interior Decor': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop',
  ],
};

// ============================================
// CATEGORY IMAGES (Unsplash)
// ============================================
export const mockCategories = [
  { name: 'Cufflinks', uri: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&h=400&fit=crop' },
  { name: 'Phone Cases', uri: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600&h=400&fit=crop' },
  { name: 'Watch Winders', uri: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=400&fit=crop' },
  { name: 'Perfumes', uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop' },
  { name: 'Watches', uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop' },
  { name: 'Interior Decor', uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop' },
];

// ============================================
// 24 PRODUCTS (4 per category)
// ============================================
export const mockProducts = [
  // Cufflinks (4)
  { id: 1, title: 'Royal Gold Cufflinks', price: '450.00 QAR', numericPrice: 450, category: 'Cufflinks', productImage: productImages['Cufflinks'][0], description: 'Elegant 18k gold cufflinks with intricate detailing. Perfect for formal occasions.', stock: true },
  { id: 2, title: 'Diamond Elite Cufflinks', price: '1200.00 QAR', numericPrice: 1200, category: 'Cufflinks', productImage: productImages['Cufflinks'][1], description: 'Premium diamond-studded cufflinks for the distinguished gentleman.', stock: true },
  { id: 3, title: 'Silver Classic Cufflinks', price: '320.00 QAR', numericPrice: 320, category: 'Cufflinks', productImage: productImages['Cufflinks'][2], description: 'Timeless sterling silver cufflinks with a polished finish.', stock: true },
  { id: 4, title: 'Onyx Prestige Cufflinks', price: '580.00 QAR', numericPrice: 580, category: 'Cufflinks', productImage: productImages['Cufflinks'][0], description: 'Black onyx cufflinks set in white gold. Sophisticated and bold.', stock: true },

  // Phone Cases (4)
  { id: 5, title: 'Croco Leather Case', price: '185.00 QAR', numericPrice: 185, category: 'Phone Cases', productImage: productImages['Phone Cases'][0], description: 'Genuine crocodile leather phone case with premium stitching.', stock: true },
  { id: 6, title: 'Carbon Shield Pro', price: '150.00 QAR', numericPrice: 150, category: 'Phone Cases', productImage: productImages['Phone Cases'][1], description: 'Military-grade carbon fiber case with shock absorption.', stock: true },
  { id: 7, title: 'Alcantara Slim Case', price: '120.00 QAR', numericPrice: 120, category: 'Phone Cases', productImage: productImages['Phone Cases'][2], description: 'Ultra-slim Alcantara suede case with soft-touch finish.', stock: true },
  { id: 8, title: 'Gold Trim Edition', price: '250.00 QAR', numericPrice: 250, category: 'Phone Cases', productImage: productImages['Phone Cases'][0], description: 'Leather case with 24k gold trim accents.', stock: true },

  // Watch Winders (4)
  { id: 9, title: 'Solo Watch Winder', price: '350.00 QAR', numericPrice: 350, category: 'Watch Winders', productImage: productImages['Watch Winders'][0], description: 'Single watch winder with quiet Japanese motor.', stock: true },
  { id: 10, title: 'Duo Automatic Winder', price: '650.00 QAR', numericPrice: 650, category: 'Watch Winders', productImage: productImages['Watch Winders'][1], description: 'Dual watch winder with multiple rotation settings.', stock: true },
  { id: 11, title: 'Prestige Collection Box', price: '1500.00 QAR', numericPrice: 1500, category: 'Watch Winders', productImage: productImages['Watch Winders'][2], description: 'Luxury 4-watch winder in piano black lacquer finish.', stock: true },
  { id: 12, title: 'Travel Watch Winder', price: '480.00 QAR', numericPrice: 480, category: 'Watch Winders', productImage: productImages['Watch Winders'][0], description: 'Compact portable winder with USB charging.', stock: true },

  // Perfumes (4)
  { id: 13, title: 'Royal Oud Intense', price: '380.00 QAR', numericPrice: 380, category: 'Perfumes', productImage: productImages['Perfumes'][0], description: 'Rich Arabian oud with smoky undertones and rose accents.', stock: true },
  { id: 14, title: 'French Riviera', price: '450.00 QAR', numericPrice: 450, category: 'Perfumes', productImage: productImages['Perfumes'][1], description: 'Fresh citrus and marine notes inspired by the Mediterranean.', stock: true },
  { id: 15, title: 'Arabian Nights Musk', price: '320.00 QAR', numericPrice: 320, category: 'Perfumes', productImage: productImages['Perfumes'][2], description: 'Warm white musk with amber and sandalwood.', stock: true },
  { id: 16, title: 'Desert Rose Elixir', price: '520.00 QAR', numericPrice: 520, category: 'Perfumes', productImage: productImages['Perfumes'][3], description: 'Rare Taif rose blended with precious woods.', stock: true },

  // Watches (4)
  { id: 17, title: 'Chronograph Elite', price: '2500.00 QAR', numericPrice: 2500, category: 'Watches', productImage: productImages['Watches'][0], description: 'Swiss automatic chronograph with sapphire crystal.', stock: true },
  { id: 18, title: 'Smart Executive Watch', price: '850.00 QAR', numericPrice: 850, category: 'Watches', productImage: productImages['Watches'][1], description: 'Hybrid smartwatch with classic design and modern features.', stock: true },
  { id: 19, title: 'Classic Moonphase', price: '1800.00 QAR', numericPrice: 1800, category: 'Watches', productImage: productImages['Watches'][2], description: 'Elegant moonphase complication with leather strap.', stock: true },
  { id: 20, title: 'Diver Professional', price: '1950.00 QAR', numericPrice: 1950, category: 'Watches', productImage: productImages['Watches'][3], description: '300m water resistant with rotating bezel.', stock: true },

  // Interior Decor (4)
  { id: 21, title: 'Crystal Orchid Vase', price: '380.00 QAR', numericPrice: 380, category: 'Interior Decor', productImage: productImages['Interior Decor'][0], description: 'Hand-blown crystal vase with orchid motif.', stock: true },
  { id: 22, title: 'Gilded Photo Frame', price: '250.00 QAR', numericPrice: 250, category: 'Interior Decor', productImage: productImages['Interior Decor'][1], description: '24k gold-plated frame for 8x10 photos.', stock: true },
  { id: 23, title: 'Bronze Horse Sculpture', price: '720.00 QAR', numericPrice: 720, category: 'Interior Decor', productImage: productImages['Interior Decor'][2], description: 'Limited edition bronze Arabian horse sculpture.', stock: true },
  { id: 24, title: 'Marble Chess Set', price: '950.00 QAR', numericPrice: 950, category: 'Interior Decor', productImage: productImages['Interior Decor'][0], description: 'Hand-carved marble chess set with onyx pieces.', stock: true },
];

// Add images array and categories array to each product
mockProducts.forEach(product => {
  const catImages = productImages[product.category] || productImages['Watches'];
  product.images = catImages.map(src => ({ src }));
  product.categories = [product.category];
});

// ============================================
// 12 BRANDS (Unsplash images)
// ============================================
export const mockBrands = [
  {
    id: 1,
    name: 'Maison Noir',
    uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=300&fit=crop',
    products: [{ ID: 1 }, { ID: 17 }],
    ids: [1, 17]
  },
  {
    id: 2,
    name: 'Chronolux',
    uri: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=300&fit=crop',
    products: [{ ID: 18 }, { ID: 19 }],
    ids: [18, 19]
  },
  {
    id: 3,
    name: 'Artisan Home',
    uri: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=300&fit=crop',
    products: [{ ID: 9 }, { ID: 10 }],
    ids: [9, 10]
  },
  {
    id: 4,
    name: 'Velour Living',
    uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop',
    products: [{ ID: 21 }, { ID: 22 }],
    ids: [21, 22]
  },
  {
    id: 5,
    name: 'Tempus Elite',
    uri: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=300&fit=crop',
    products: [{ ID: 17 }, { ID: 20 }],
    ids: [17, 20]
  },
  {
    id: 6,
    name: 'TechShield',
    uri: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=300&fit=crop',
    products: [{ ID: 5 }, { ID: 6 }],
    ids: [5, 6]
  },
  {
    id: 7,
    name: 'Oro Watches',
    uri: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=300&fit=crop',
    products: [{ ID: 18 }, { ID: 19 }],
    ids: [18, 19]
  },
  {
    id: 8,
    name: 'Parfum Royal',
    uri: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=300&fit=crop',
    products: [{ ID: 13 }, { ID: 14 }],
    ids: [13, 14]
  },
  {
    id: 9,
    name: 'Sterling & Co',
    uri: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=300&fit=crop',
    products: [{ ID: 1 }, { ID: 2 }],
    ids: [1, 2]
  },
  {
    id: 10,
    name: 'Horology House',
    uri: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&h=300&fit=crop',
    products: [{ ID: 11 }, { ID: 12 }],
    ids: [11, 12]
  },
  {
    id: 11,
    name: 'Luxe Accessories',
    uri: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&h=300&fit=crop',
    products: [{ ID: 3 }, { ID: 4 }],
    ids: [3, 4]
  },
  {
    id: 12,
    name: 'Essence Arabia',
    uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=300&fit=crop',
    products: [{ ID: 15 }, { ID: 16 }],
    ids: [15, 16]
  },
];

// ============================================
// 12 CELEBRITIES (Unsplash images - people/fashion)
// ============================================
export const mockCelebrities = [
  {
    id: 1,
    name: 'Layla Al Rashid',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=300&fit=crop',
    products: [{ ID: 13 }, { ID: 14 }, { ID: 21 }],
    ids: [13, 14, 21]
  },
  {
    id: 2,
    name: 'Omar Al Farsi',
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop',
    products: [{ ID: 17 }, { ID: 1 }],
    ids: [17, 1]
  },
  {
    id: 3,
    name: 'Fatima Al Hamad',
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=300&fit=crop',
    products: [{ ID: 5 }, { ID: 15 }, { ID: 22 }],
    ids: [5, 15, 22]
  },
  {
    id: 4,
    name: 'Khalid Al Mansour',
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=300&fit=crop',
    products: [{ ID: 9 }, { ID: 18 }],
    ids: [9, 18]
  },
  {
    id: 5,
    name: 'Nora Al Thani',
    uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=300&fit=crop',
    products: [{ ID: 16 }, { ID: 23 }, { ID: 8 }],
    ids: [16, 23, 8]
  },
  {
    id: 6,
    name: 'Ahmed Al Sabah',
    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=300&fit=crop',
    products: [{ ID: 2 }, { ID: 19 }],
    ids: [2, 19]
  },
  {
    id: 7,
    name: 'Mariam Al Qassimi',
    uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=300&fit=crop',
    products: [{ ID: 6 }, { ID: 14 }, { ID: 24 }],
    ids: [6, 14, 24]
  },
  {
    id: 8,
    name: 'Sultan Al Maktoum',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=300&fit=crop',
    products: [{ ID: 10 }, { ID: 20 }],
    ids: [10, 20]
  },
  {
    id: 9,
    name: 'Hessa Al Nahyan',
    uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=300&fit=crop',
    products: [{ ID: 7 }, { ID: 13 }, { ID: 21 }],
    ids: [7, 13, 21]
  },
  {
    id: 10,
    name: 'Rashid Al Dhaheri',
    uri: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=300&fit=crop',
    products: [{ ID: 3 }, { ID: 11 }],
    ids: [3, 11]
  },
  {
    id: 11,
    name: 'Dana Al Suwaidi',
    uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=300&fit=crop',
    products: [{ ID: 15 }, { ID: 22 }, { ID: 4 }],
    ids: [15, 22, 4]
  },
  {
    id: 12,
    name: 'Saeed Al Ketbi',
    uri: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop',
    products: [{ ID: 12 }, { ID: 17 }],
    ids: [12, 17]
  },
];

// ============================================
// TV SHOWS
// ============================================
export const mockTvShows = [
  {
    id: 1,
    name: 'Fashion Week Live',
    uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    video: 'https://player.vimeo.com/video/76979871',
    products: [{ ID: 13 }, { ID: 14 }],
    ids: [13, 14]
  },
  {
    id: 2,
    name: 'Tech Unboxing',
    uri: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
    video: 'https://player.vimeo.com/video/76979871',
    products: [{ ID: 5 }, { ID: 6 }],
    ids: [5, 6]
  },
  {
    id: 3,
    name: 'Luxury Lifestyle',
    uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    video: 'https://player.vimeo.com/video/76979871',
    products: [{ ID: 17 }, { ID: 21 }],
    ids: [17, 21]
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get product by ID
export const getMockProduct = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      resolve(product || null);
    }, 300);
  });
};

// Get multiple products by IDs
export const getMockProducts = (ids) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = ids.map(id => mockProducts.find(p => p.id === id)).filter(Boolean);
      resolve(products);
    }, 300);
  });
};

// Get products by category
export const getMockProductsByCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = mockProducts.filter(p => p.category === category);
      resolve(products);
    }, 300);
  });
};

// Get all products
export const getAllMockProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 300);
  });
};

// Get two TV products (for product detail page)
export const getMockTwoTvProducts = (category) => {
  const products = mockProducts.filter(p => p.category === (category || 'Watches')).slice(0, 2);
  return products.length ? products : mockProducts.slice(0, 2);
};

// Get brand by ID
export const getMockBrand = (id) => {
  return mockBrands.find(b => b.id === id);
};

// Get celebrity by ID  
export const getMockCelebrity = (id) => {
  return mockCelebrities.find(c => c.id === id);
};

export default {
  mockProducts,
  mockBrands,
  mockCelebrities,
  mockTvShows,
  getMockProduct,
  getMockProducts,
  getMockProductsByCategory,
  getAllMockProducts,
  getMockTwoTvProducts,
  getMockBrand,
  getMockCelebrity,
};
