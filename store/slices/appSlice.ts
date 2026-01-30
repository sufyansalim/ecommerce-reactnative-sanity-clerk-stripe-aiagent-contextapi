/**
 * App Slice - TypeScript Version
 * 
 * TYPESCRIPT CONCEPTS EXPLAINED:
 * 
 * 1. INTERFACES - Define the "shape" of objects
 *    interface Person { name: string; age: number; }
 * 
 * 2. TYPE ANNOTATIONS - Tell TypeScript what type a variable/parameter is
 *    const name: string = "John";
 *    function greet(name: string): string { return `Hello ${name}`; }
 * 
 * 3. GENERICS - Reusable type patterns (the <T> syntax)
 *    Array<string> means "an array of strings"
 *    PayloadAction<Product[]> means "an action with Product[] as payload"
 * 
 * 4. | (Union) - Can be one of multiple types
 *    string | null means "can be a string OR null"
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sanityClient } from '../../constants/SanityClient';
import { Brand, Celebrity, TvShow, Product } from '../../types';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Parameters for fetchSimilarProducts
 * This interface defines what arguments the function expects
 */
interface FetchSimilarProductsParams {
  categoryName: string;
  excludeProductId?: string; // The ? means this is optional
}

/**
 * Loading state for each data type
 * Record<string, boolean> means "an object with string keys and boolean values"
 * But we want specific keys, so we define them explicitly
 */
interface LoadingState {
  brands: boolean;
  celebrities: boolean;
  tvShows: boolean;
  similarProducts: boolean;
}

/**
 * Error state - same structure but values can be string or null
 */
interface ErrorState {
  brands: string | null;
  celebrities: string | null;
  tvShows: string | null;
  similarProducts: string | null;
}

/**
 * The complete state shape for this slice
 * This is important because Redux Toolkit uses this for type inference
 */
interface AppState {
  brands: Brand[];
  celebrities: Celebrity[];
  tvShows: TvShow[];
  similarProducts: Product[];
  loading: LoadingState;
  error: ErrorState;
}

// ============================================
// INITIAL STATE
// ============================================

/**
 * We type the initial state using our interface
 * The `: AppState` tells TypeScript "this object must match AppState"
 */
const initialState: AppState = {
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

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * createAsyncThunk<ReturnType, ArgumentType>
 * 
 * Brand[] = what this function returns on success
 * void = no arguments needed (use `_` as placeholder)
 * 
 * The third generic (optional) is for thunkAPI configuration
 * { rejectValue: string } tells TypeScript what type rejectWithValue returns
 */
export const fetchBrands = createAsyncThunk<
  Brand[], // Return type on success
  void,    // Argument type (void = no argument)
  { rejectValue: string } // ThunkAPI config
>(
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
      const brands = await sanityClient.fetch<Brand[]>(query);
      return brands;
    } catch (error) {
      // Type guard: check if error is an Error object
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchCelebrities = createAsyncThunk<
  Celebrity[],
  void,
  { rejectValue: string }
>(
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
      const celebrities = await sanityClient.fetch<Celebrity[]>(query);
      return celebrities;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchTvShows = createAsyncThunk<
  TvShow[],
  void,
  { rejectValue: string }
>(
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
      const tvShows = await sanityClient.fetch<TvShow[]>(query);
      return tvShows;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk<
  Product[],
  FetchSimilarProductsParams, // Now TypeScript knows the argument shape
  { rejectValue: string }
>(
  'app/fetchSimilarProducts',
  async ({ categoryName, excludeProductId }, { rejectWithValue }) => {
    try {
      const query = `*[_type == "product" && category->name match $categoryName && _id != $excludeProductId][0...4]{
        _id,
        title,
        price,
        "productImage": image,
        description,
        "category": category->name,
        "images": images
      }`;
      const products = await sanityClient.fetch<Product[]>(query, { 
        categoryName: categoryName + "*",
        excludeProductId: excludeProductId || ""
      });
      return products;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// ============================================
// SLICE
// ============================================

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /**
     * Regular reducers are typed automatically by Redux Toolkit
     * The `state` parameter is inferred from initialState
     */
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
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<Brand[]>) => {
        state.loading.brands = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading.brands = false;
        state.error.brands = action.payload ?? 'Failed to fetch brands';
      })
    
    // Celebrities
    builder
      .addCase(fetchCelebrities.pending, (state) => {
        state.loading.celebrities = true;
        state.error.celebrities = null;
      })
      .addCase(fetchCelebrities.fulfilled, (state, action: PayloadAction<Celebrity[]>) => {
        state.loading.celebrities = false;
        state.celebrities = action.payload;
      })
      .addCase(fetchCelebrities.rejected, (state, action) => {
        state.loading.celebrities = false;
        state.error.celebrities = action.payload ?? 'Failed to fetch celebrities';
      })
    
    // TV Shows
    builder
      .addCase(fetchTvShows.pending, (state) => {
        state.loading.tvShows = true;
        state.error.tvShows = null;
      })
      .addCase(fetchTvShows.fulfilled, (state, action: PayloadAction<TvShow[]>) => {
        state.loading.tvShows = false;
        state.tvShows = action.payload;
      })
      .addCase(fetchTvShows.rejected, (state, action) => {
        state.loading.tvShows = false;
        state.error.tvShows = action.payload ?? 'Failed to fetch TV shows';
      })
    
    // Similar Products
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading.similarProducts = true;
        state.error.similarProducts = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading.similarProducts = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading.similarProducts = false;
        state.error.similarProducts = action.payload ?? 'Failed to fetch similar products';
      });
  }
});

export const { clearSimilarProducts, clearAppErrors } = appSlice.actions;

// ============================================
// SELECTORS
// ============================================

/**
 * Selectors with typed state
 * 
 * RootState is the type of the entire Redux store
 * We'll define it properly in store/index.ts
 * For now, we use a simple approach
 */
interface RootState {
  app: AppState;
}

export const selectBrands = (state: RootState): Brand[] => state.app.brands;
export const selectCelebrities = (state: RootState): Celebrity[] => state.app.celebrities;
export const selectTvShows = (state: RootState): TvShow[] => state.app.tvShows;
export const selectSimilarProducts = (state: RootState): Product[] => state.app.similarProducts;
export const selectBrandsLoading = (state: RootState): boolean => state.app.loading.brands;
export const selectCelebritiesLoading = (state: RootState): boolean => state.app.loading.celebrities;
export const selectTvShowsLoading = (state: RootState): boolean => state.app.loading.tvShows;
export const selectSimilarProductsLoading = (state: RootState): boolean => state.app.loading.similarProducts;
export const selectAppErrors = (state: RootState): ErrorState => state.app.error;

export default appSlice.reducer;
