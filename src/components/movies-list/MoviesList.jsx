import { useEffect, useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { MoviesPagination } from '../ui/pagination';
import { updateMoviesRating } from '../../utils/transform-data';
import './MoviesList.css';

export const MoviesList = () => {
  const {
    getMovies,
    moviesList,
    loading,
    currentPage,
    query,
    error,
    setError,
  } = useMovies();
  const [ratedMovies] = useState(
    JSON.parse(localStorage.getItem('RatedMovies')) || []
  );

  useEffect(() => {
    if (error !== null) {
      console.log(error);
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    getMovies(query, currentPage);
    // eslint-disable-next-line
  }, [query, currentPage]);

  const updatedMoviesList = updateMoviesRating(moviesList, ratedMovies);

  if (!loading) {
    return (
      <>
        <SearchInput />
        <List list={updatedMoviesList} moviesToShow='8' />
        <MoviesPagination page={currentPage} />
      </>
    );
  }
};
