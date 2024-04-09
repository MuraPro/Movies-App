import React, { useMemo } from 'react';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { MoviesPagination } from '../ui/pagination';
import { useSelector } from 'react-redux';
import { getMoviesList } from '../../store/movies';
import './MoviesList.css';

export const MoviesList = () => {
  const movies = useSelector(getMoviesList());
  const memoizedMovies = useMemo(() => movies, [movies]) || [];

  return (
    <>
      <SearchInput />
      {movies && <List list={memoizedMovies} moviesToShow='8' />}
      <MoviesPagination />
    </>
  );
};
