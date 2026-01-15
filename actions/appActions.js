import { 
  getBrands as fetchBrandsFromSanity, 
  getCelebrities as fetchCelebritiesFromSanity,
  getTvShows as fetchTvShowsFromSanity,
  getProducts as fetchProductsFromSanity
} from '../constants/SanityClient';

import {
  FETCH_BRANDS_START,
  FETCH_BRANDS_SUCCESS,
  FETCH_BRANDS_FAIL,
  FETCH_CELEBRITIES_START,
  FETCH_CELEBRITIES_SUCCESS,
  FETCH_CELEBRITIES_FAIL,
  FETCH_TV_SHOWS_START,
  FETCH_TV_SHOWS_SUCCESS,
  FETCH_TV_SHOWS_FAIL,
  SET_BRAND_PRODUCTS,
  SET_CELEBRITY_PRODUCTS,
  SET_TV_PRODUCTS,
  SET_SIMILAR_PRODUCTS
} from '../reducers/appReducer';

// =================== Brands Actions ===================

// Fetch Brands from Sanity
export const fetchBrands = async (dispatch) => {
  dispatch({ type: FETCH_BRANDS_START });
  try {
    const { data, error } = await fetchBrandsFromSanity();
    if (error) throw new Error(error);
    
    const brands = data.map(brand => ({
      id: brand._id,
      name: brand.name,
      uri: brand.image,
      banner: brand.banner,
      description: brand.description,
      products: brand.products || [],
      slug: brand.slug?.current,
    }));
    
    console.log("Brands (Sanity):", brands);
    dispatch({ type: FETCH_BRANDS_SUCCESS, payload: brands });
  } catch (err) {
    dispatch({ type: FETCH_BRANDS_FAIL, error: err?.message || String(err) });
  }
};

// Set Brand Products (products passed from navigation params)
export const setBrandProducts = (dispatch, products) => {
  const productStore = (products || []).map(product => ({
    id: product._id,
    title: product.title,
    price: `${product.price} QAR`,
    numericPrice: product.price,
    productImage: product.image,
    uri: product.image,
    description: product.description,
    inStock: product.inStock,
  }));
  
  console.log("Brand products (Sanity):", productStore);
  dispatch({ type: SET_BRAND_PRODUCTS, payload: productStore });
};

// =================== Celebrities Actions ===================

// Fetch Celebrities from Sanity
export const fetchCelebrities = async (dispatch) => {
  dispatch({ type: FETCH_CELEBRITIES_START });
  try {
    const { data, error } = await fetchCelebritiesFromSanity();
    if (error) throw new Error(error);
    
    const celebrities = data.map(celeb => ({
      id: celeb._id,
      name: celeb.name,
      uri: celeb.image,
      banner: celeb.banner,
      products: celeb.products || [],
      slug: celeb.slug?.current,
    }));
    
    console.log("Celebrities (Sanity):", celebrities);
    dispatch({ type: FETCH_CELEBRITIES_SUCCESS, payload: celebrities });
  } catch (err) {
    dispatch({ type: FETCH_CELEBRITIES_FAIL, error: err?.message || String(err) });
  }
};

// Set Celebrity Products
export const setCelebrityProducts = (dispatch, products) => {
  const productStore = (products || []).map(product => ({
    id: product._id,
    title: product.title,
    price: `${product.price} QAR`,
    numericPrice: product.price,
    productImage: product.image,
    uri: product.image,
    description: product.description,
    inStock: product.inStock,
  }));
  
  console.log("Celebrity products (Sanity):", productStore);
  dispatch({ type: SET_CELEBRITY_PRODUCTS, payload: productStore });
};

// =================== TV Shows Actions ===================

// Fetch TV Shows from Sanity
export const fetchTvShows = async (dispatch) => {
  dispatch({ type: FETCH_TV_SHOWS_START });
  try {
    const { data, error } = await fetchTvShowsFromSanity();
    if (error) throw new Error(error);
    
    const tvShows = data.map(show => ({
      id: show._id,
      name: show.name,
      uri: show.image,
      video: show.videoUrl,
      videoUrl: show.videoUrl,
      products: show.products || [],
      slug: show.slug?.current,
    }));
    
    console.log("TV Shows (Sanity):", tvShows);
    dispatch({ type: FETCH_TV_SHOWS_SUCCESS, payload: tvShows });
  } catch (err) {
    dispatch({ type: FETCH_TV_SHOWS_FAIL, error: err?.message || String(err) });
  }
};

// Set TV Products
export const setTvProducts = (dispatch, products) => {
  const productStore = (products || []).map(product => ({
    id: product._id,
    title: product.title,
    price: `${product.price} QAR`,
    numericPrice: product.price,
    productImage: product.image,
    uri: product.image,
    description: product.description,
    inStock: product.inStock,
  }));
  
  console.log("TV products (Sanity):", productStore);
  dispatch({ type: SET_TV_PRODUCTS, payload: productStore });
};

// =================== Products Actions ===================

// Fetch Similar Products (for product detail page)
export const fetchSimilarProducts = async (dispatch, categoryName, excludeProductId) => {
  try {
    const { data, error } = await fetchProductsFromSanity();
    if (error) throw new Error(error);
    
    console.log("Looking for similar products in category:", categoryName, "excluding:", excludeProductId);
    
    // Filter products by category and exclude current product, take 2
    let filteredProducts = data
      .filter(p => {
        const productCategory = p.category?.name || '';
        const matchesCategory = categoryName && productCategory.toLowerCase().includes(categoryName.toLowerCase());
        const isNotCurrentProduct = p._id !== excludeProductId;
        return matchesCategory && isNotCurrentProduct;
      })
      .slice(0, 2)
      .map(product => ({
        id: product._id,
        _id: product._id,
        title: product.title,
        price: `${product.price} QAR`,
        numericPrice: product.price,
        productImage: product.image,
        uri: product.image,
        image: product.image,
        images: product.images,
        description: product.description,
        category: product.category,
      }));
    
    // If no category matches, just get 2 random products (excluding current)
    if (filteredProducts.length === 0) {
      filteredProducts = data
        .filter(p => p._id !== excludeProductId)
        .slice(0, 2)
        .map(product => ({
          id: product._id,
          _id: product._id,
          title: product.title,
          price: `${product.price} QAR`,
          numericPrice: product.price,
          productImage: product.image,
          uri: product.image,
          image: product.image,
          images: product.images,
          description: product.description,
          category: product.category,
        }));
    }
    
    console.log("Similar products found:", filteredProducts.length, filteredProducts);
    dispatch({ type: SET_SIMILAR_PRODUCTS, payload: filteredProducts });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    dispatch({ type: SET_SIMILAR_PRODUCTS, payload: [] });
  }
};
