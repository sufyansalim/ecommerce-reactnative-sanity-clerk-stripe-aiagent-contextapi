// App Action Types
export const FETCH_BRANDS_START = 'FETCH_BRANDS_START';
export const FETCH_BRANDS_SUCCESS = 'FETCH_BRANDS_SUCCESS';
export const FETCH_BRANDS_FAIL = 'FETCH_BRANDS_FAIL';

export const FETCH_CELEBRITIES_START = 'FETCH_CELEBRITIES_START';
export const FETCH_CELEBRITIES_SUCCESS = 'FETCH_CELEBRITIES_SUCCESS';
export const FETCH_CELEBRITIES_FAIL = 'FETCH_CELEBRITIES_FAIL';

export const FETCH_TV_SHOWS_START = 'FETCH_TV_SHOWS_START';
export const FETCH_TV_SHOWS_SUCCESS = 'FETCH_TV_SHOWS_SUCCESS';
export const FETCH_TV_SHOWS_FAIL = 'FETCH_TV_SHOWS_FAIL';

export const SET_BRAND_PRODUCTS = 'SET_BRAND_PRODUCTS';
export const SET_CELEBRITY_PRODUCTS = 'SET_CELEBRITY_PRODUCTS';
export const SET_TV_PRODUCTS = 'SET_TV_PRODUCTS';
export const SET_SIMILAR_PRODUCTS = 'SET_SIMILAR_PRODUCTS';

// Initial State
export const initialAppState = {
  // Brands
  brands: [],
  brandsLoading: true,
  brandsError: null,
  brandProducts: [],
  
  // Celebrities
  celebrities: [],
  celebritiesLoading: true,
  celebritiesError: null,
  celebrityProducts: [],
  
  // TV Shows
  tvShows: [],
  tvShowsLoading: true,
  tvShowsError: null,
  tvProducts: [],
  
  // Products
  similarProducts: [],
  productsLoading: false,
};

// Reducer
export const appReducer = (state, action) => {
  switch (action.type) {
    // Brands
    case FETCH_BRANDS_START:
      return { ...state, brandsLoading: true, brandsError: null };
    case FETCH_BRANDS_SUCCESS:
      return { ...state, brandsLoading: false, brands: action.payload };
    case FETCH_BRANDS_FAIL:
      return { ...state, brandsLoading: false, brandsError: action.error };
    case SET_BRAND_PRODUCTS:
      return { ...state, brandProducts: action.payload, productsLoading: false };

    // Celebrities
    case FETCH_CELEBRITIES_START:
      return { ...state, celebritiesLoading: true, celebritiesError: null };
    case FETCH_CELEBRITIES_SUCCESS:
      return { ...state, celebritiesLoading: false, celebrities: action.payload };
    case FETCH_CELEBRITIES_FAIL:
      return { ...state, celebritiesLoading: false, celebritiesError: action.error };
    case SET_CELEBRITY_PRODUCTS:
      return { ...state, celebrityProducts: action.payload, productsLoading: false };

    // TV Shows
    case FETCH_TV_SHOWS_START:
      return { ...state, tvShowsLoading: true, tvShowsError: null };
    case FETCH_TV_SHOWS_SUCCESS:
      return { ...state, tvShowsLoading: false, tvShows: action.payload };
    case FETCH_TV_SHOWS_FAIL:
      return { ...state, tvShowsLoading: false, tvShowsError: action.error };
    case SET_TV_PRODUCTS:
      return { ...state, tvProducts: action.payload, productsLoading: false };

    // Similar Products
    case SET_SIMILAR_PRODUCTS:
      return { ...state, similarProducts: action.payload };

    default:
      return state;
  }
};
