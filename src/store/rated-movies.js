import { createSlice } from '@reduxjs/toolkit';
import { generateError } from '../utils/generateError';
import moviesService, { transformRatedFilmInfo } from '../service/data-service';

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
    moviesRequested: (state) => {
      state.isLoading = true;
    },
    moviesReceived: (state, action) => {
      state.entities = action.payload.movies;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },
    moviesRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { reducer: ratedMoviesReducer, actions } = ratedMoviesSlice;
const { ratedMoviesRequested, ratedMoviesReceived, ratedMoviesRequestFailed } =
  actions;

export const getRatedMovies = (query, currentPage) => async (dispatch) => {
  dispatch(ratedMoviesRequested());
  try {
    const { results, total_results } = await moviesService.getRatedMoviesList(
      query,
      currentPage
    );
    const movies = results.map((m) => transformRatedFilmInfo);
    dispatch(ratedMoviesReceived({ movies, total_results }));
  } catch ({ message }) {
    console.log(message);
    const errorMessage = generateError(message);
    dispatch(ratedMoviesRequestFailed(errorMessage));
  }
};

export const getRatedMoviesList = () => (state) => state.ratedMovies.entities;

export const getRatedMoviesById = (movieId) => (state) => {
  if (state.ratedMovies.entities) {
    return state.ratedMovies.entities.find((m) => m._id === movieId);
  }
};

export const getRatedMoviesLoadingStatus = () => (state) =>
  state.ratedMovies.isLoading;

export default ratedMoviesReducer;
