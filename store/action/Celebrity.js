import * as actionTypes from './ActionTypes';
import { getCelebrities as fetchCelebritiesFromSanity } from '../../constants/SanityClient';

export const getCelebrity = () => async dispatch => {
  try {
    // Fetch from Sanity CMS
    const { data, error } = await fetchCelebritiesFromSanity();
    
    if (error) throw new Error(error);
    
    // Transform Sanity data to match expected format
    const celebrities = data.map(celeb => ({
      id: celeb._id,
      name: celeb.name,
      uri: celeb.image,
      banner: celeb.banner,
      products: celeb.products || [],
      slug: celeb.slug?.current,
    }));
    
    console.log("Celebrities (Sanity):", celebrities);
    dispatch({
      type: actionTypes.FETCHED_CELEBRITY_SUCCESS,
      response: celebrities
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCHED_CELEBRITY_FAIL,
      err: err?.message || String(err)
    });
  }
};