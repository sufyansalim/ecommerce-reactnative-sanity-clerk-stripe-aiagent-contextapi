import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sanityClient } from '../../constants/SanityClient';

// Async Thunks
export const fetchBrands = createAsyncThunk(
  'app/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const query = `*[_type == "brand"]{
        _id,
        name,
        "uri": image,
        banner,
        "products": *[_type == "product" && brand._ref == ^._id]{
          _id,
          title,
          "productImage": image,
          "images": images,
          price,
          description,
          "category": category->name
        }
      }`;
      const brands = await sanityClient.fetch(query);
      return brands;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCelebrities = createAsyncThunk(
  'app/fetchCelebrities',
  async (_, { rejectWithValue }) => {
    try {
      const query = `*[_type == "celebrity"]{
        _id,
        name,
        "uri": image,
        banner,
        "products": products[]->{
          _id,
          title,
          "productImage": image,
          "images": images,
          price,
          description,
          "category": category->name
        }
      }`;
      const celebrities = await sanityClient.fetch(query);
      return celebrities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTvShows = createAsyncThunk(
  'app/fetchTvShows',
  async (_, { rejectWithValue }) => {
    try {
      const query = `*[_type == "tvShow"]{
        _id,
        name,
        "uri": image,
        videoUrl,
        "products": products[]->{
          _id,
          title,
          "productImage": image,
          "images": images,
          price,
          description,
          "category": category->name
        }
      }`;
      const tvShows = await sanityClient.fetch(query);
      return tvShows;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  'app/fetchSimilarProducts',
  async ({ categoryName, excludeProductId }, { rejectWithValue }) => {
    try {
      // Get products in the same category, excluding the current product
      const query = `*[_type == "product" && category->name match $categoryName && _id != $excludeProductId][0...4]{
        _id,
        title,
        price,
        "productImage": image,
        description,
        "category": category->name,
        "images": images
      }`;
      const products = await sanityClient.fetch(query, { 
        categoryName: categoryName + "*",
        excludeProductId: excludeProductId || ""
      });
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  brands: [],
  celebrities: [],
  tvShows: [],
  similarProducts: [],
  loading: {
    brands: false,
    celebrities: false,
    tvShows: false,
    similarProducts: false
  },
  error: {
    brands: null,
    celebrities: null,
    tvShows: null,
    similarProducts: null
  }
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearSimilarProducts: (state) => {
      state.similarProducts = [];
    },
    clearAppErrors: (state) => {
      state.error = {
        brands: null,
        celebrities: null,
        tvShows: null,
        similarProducts: null
      };
    }
  },
  extraReducers: (builder) => {
    // Brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading.brands = true;
        state.error.brands = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading.brands = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading.brands = false;
        state.error.brands = action.payload;
      })
    
    // Celebrities
    builder
      .addCase(fetchCelebrities.pending, (state) => {
        state.loading.celebrities = true;
        state.error.celebrities = null;
      })
      .addCase(fetchCelebrities.fulfilled, (state, action) => {
        state.loading.celebrities = false;
        state.celebrities = action.payload;
      })
      .addCase(fetchCelebrities.rejected, (state, action) => {
        state.loading.celebrities = false;
        state.error.celebrities = action.payload;
      })
    
    // TV Shows
    builder
      .addCase(fetchTvShows.pending, (state) => {
        state.loading.tvShows = true;
        state.error.tvShows = null;
      })
      .addCase(fetchTvShows.fulfilled, (state, action) => {
        state.loading.tvShows = false;
        state.tvShows = action.payload;
      })
      .addCase(fetchTvShows.rejected, (state, action) => {
        state.loading.tvShows = false;
        state.error.tvShows = action.payload;
      })
    
    // Similar Products
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading.similarProducts = true;
        state.error.similarProducts = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading.similarProducts = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading.similarProducts = false;
        state.error.similarProducts = action.payload;
      });
  }
});

export const { clearSimilarProducts, clearAppErrors } = appSlice.actions;

// Selectors
export const selectBrands = (state) => state.app.brands;
export const selectCelebrities = (state) => state.app.celebrities;
export const selectTvShows = (state) => state.app.tvShows;
export const selectSimilarProducts = (state) => state.app.similarProducts;
export const selectBrandsLoading = (state) => state.app.loading.brands;
export const selectCelebritiesLoading = (state) => state.app.loading.celebrities;
export const selectTvShowsLoading = (state) => state.app.loading.tvShows;
export const selectSimilarProductsLoading = (state) => state.app.loading.similarProducts;
export const selectAppErrors = (state) => state.app.error;

export default appSlice.reducer;
