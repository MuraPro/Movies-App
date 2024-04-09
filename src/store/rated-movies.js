import { createSlice } from '@reduxjs/toolkit';
import { generateError } from '../utils/generateError';
import moviesService from '../service/data-service';
import { transformRatedFilmInfo } from '../utils/transform-data';

const initialState = {
  entities: null,
  isLoading: true,
  error: null,
  totalPages: null,
  currentPage: 1,
  query: '',
};

const ratedMoviesSlice = createSlice({
  name: 'ratedMovies',
  initialState,
  reducers: {
    ratedMoviesRequested: (state) => {
      state.isLoading = true;
    },
    ratedMoviesReceived: (state, action) => {
      state.entities = action.payload.movies;
      state.totalPages = action.payload.total_results;
      state.isLoading = false;
    },
    ratedMoviesRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { reducer: ratedMoviesReducer, actions } = ratedMoviesSlice;
const { ratedMoviesRequested, ratedMoviesReceived, ratedMoviesRequestFailed } =
  actions;

export const getRatedMovies = (page) => async (dispatch) => {
  dispatch(ratedMoviesRequested());
  try {
    const { results, total_results } = await moviesService.getRatedMoviesList(
      page
    );
    const movies = results.map((m) => transformRatedFilmInfo(m));
    dispatch(ratedMoviesReceived({ movies, total_results }));
  } catch ({ message }) {
    console.log(message);
    const errorMessage = generateError(message);
    dispatch(ratedMoviesRequestFailed(errorMessage));
  }
};

export const getRatedMoviesList = () => (state) => state.ratedMovies.entities;
export const getRatedMoviesLoadingStatus = () => (state) =>
  state.ratedMovies.isLoading;

export default ratedMoviesReducer;
