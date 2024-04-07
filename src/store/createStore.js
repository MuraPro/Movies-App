import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moviesReducer from './movies';
import ratedMoviesReducer from './rated-movies';

const rootReducer = combineReducers({
  movies: moviesReducer,
  ratedMovies: ratedMoviesReducer,
});

export function createStore() {
  return configureStore({
    reducer: rootReducer,
  });
}
