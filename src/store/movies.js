import { createAction, createSlice } from '@reduxjs/toolkit';
import { generateError } from '../utils/generateError';
import { setSessionId } from '../service/localStorage.service';
import moviesService, {
  sendMovieRating,
  transformFilmInfo,
} from '../service/data-service';
import { debounce } from 'lodash';
import { assignGenres, updateMoviesRating } from '../utils/transform-data';

const initialState = {
  entities: null,
  isLoading: true,
  status: null,
  error: null,
  totalPages: null,
  currentPage: 1,
  ganres: null,
  query: '',
  isRate: false,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    moviesRequested: (state) => {
      state.isLoading = true;
    },
    moviesReceived: (state, action) => {
      state.entities = action.payload.moviesList;
      state.totalPages = action.payload.total_results;
      state.isLoading = false;
    },
    moviesRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    moviesUpdate: (state, action) => {
      state.entities = action.payload;
    },
    ganresRequested: (state) => {
      state.isLoading = true;
    },
    ganresReceived: (state, action) => {
      state.ganres = action.payload;
      state.isLoading = false;
    },
    ganresRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    ratingCreateReceived: (state, action) => {
      state.status = action.payload;
      state.isRate = true;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    changeCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

const { reducer: moviesReducer, actions } = moviesSlice;
const {
  moviesRequested,
  moviesReceived,
  moviesRequestFailed,
  moviesUpdate,
  ganresRequested,
  ganresReceived,
  ganresRequestFailed,
  ratingCreateReceived,
  changeCurrentPage,
  setQuery,
} = actions;

const ratingCreateRequested = createAction('movies/ratingCreateRequested');
const ratingCreateFailed = createAction('movies/ratingCreateFailed');
const sessionCreateRequested = createAction('movies/sessionCreateRequested');
const sessionCreateReceived = createAction('movies/sessionCreateReceived');
const sessionCreateFailed = createAction('movies/sessionCreateFailed');

export const sessionId = () => async (dispatch) => {
  dispatch(sessionCreateRequested());
  try {
    const { guest_session_id } = await moviesService.getGuestSessionId();
    setSessionId(guest_session_id);
    dispatch(sessionCreateReceived());
  } catch ({ message }) {
    const errorMessage = generateError(message);
    dispatch(sessionCreateFailed(errorMessage));
  }
};

export const getGanres = () => async (dispatch) => {
  dispatch(ganresRequested());
  try {
    const { genres } = await moviesService.getGenres();
    dispatch(ganresReceived(genres));
  } catch ({ message }) {
    console.log(message);
    const errorMessage = generateError(message);
    dispatch(ganresRequestFailed(errorMessage));
  }
};

export const getMovies = (query, page) => async (dispatch, getState) => {
  dispatch(moviesRequested());
  const ratedMovies = JSON.parse(localStorage.getItem('RatedMovies')) || [];

  try {
    const { results, total_results } = await moviesService.getMoviesList(
      query,
      page
    );
    const movies = results.map((m) => transformFilmInfo(m));
    const transformMovies = assignGenres(movies, getState().movies.ganres);
    if (ratedMovies) {
      const moviesList = updateMoviesRating(transformMovies, ratedMovies);
      dispatch(moviesReceived({ moviesList, total_results }));
    } else {
      dispatch(moviesReceived({ transformMovies, total_results }));
    }
  } catch ({ message }) {
    console.log(message);
    const errorMessage = generateError(message);
    dispatch(moviesRequestFailed(errorMessage));
  }
};

const debouncedFetching = debounce((query, page, dispatch) => {
  dispatch(setQuery(query));
  dispatch(getMovies(query, page));
}, 500);

export const queryChange = (query, page) => (dispatch) => {
  debouncedFetching(query, page, dispatch);
};

export const debouncedRatingFetching = debounce((id, rate, dispatch) => {
  sendMovieRating(id, rate);
}, 500);

export const onRatedMovies = (id, rate) => (dispatch, getState) => {
  debouncedRatingFetching(id, rate, dispatch);
  const movies = getState().movies.entities;

  const updateMovies = (movies) => {
    return movies.map((movie) => {
      if (movie.id === id) {
        return { ...movie, rating: rate };
      }
      return movie;
    });
  };
  dispatch(moviesUpdate(updateMovies(movies)));

  const currentRatedMovies =
    JSON.parse(localStorage.getItem('RatedMovies')) || [];

  const existingMovie = currentRatedMovies.find((movie) => movie.id === id);
  if (!existingMovie) {
    const findMovie = movies.find((movie) => movie.id === id);
    const transformFindMovie = { ...findMovie, rating: rate };
    const updatedMovies = [...currentRatedMovies, transformFindMovie];
    localStorage.setItem('RatedMovies', JSON.stringify(updatedMovies));
  }
};
export const onPageChange = (query, page) => (dispatch) => {
  dispatch(getMovies(query, page));
  dispatch(changeCurrentPage(page));
};

export const getIsRate = () => (state) => state.movies.isRate;
export const getMoviesList = () => (state) => state.movies.entities;
export const getTotalPages = () => (state) => state.movies.totalPages;
export const getGanresList = () => (state) => state.movies.ganres;
export const getCurrentPage = () => (state) => state.movies.currentPage;
export const getQuery = () => (state) => state.movies.query;

export const getMoviesById = (movieId) => (state) => {
  if (state.movies.entities) {
    return state.movies.entities.find((m) => m._id === movieId);
  }
};

export const getMoviesLoadingStatus = () => (state) => state.movies.isLoading;

export default moviesReducer;
