import { useEffect, useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { assignGenres } from '../../utils/transform-data';

export const MoviesRatedList = () => {
  const {
    ratedMoviesList,
    getRatedMovies,
    currentPage,
    ganres,
    error,
    setError,
  } = useMovies();
  const [ratedMovies, setRatedMovies] = useState(null);

  useEffect(() => {
    if (!ratedMovies) {
      const storedMovies = localStorage.getItem('RatedMovies');
      if (storedMovies) {
        setRatedMovies(JSON.parse(storedMovies));
      } else {
        getRatedMovies(currentPage);
      }
    }
    // eslint-disable-next-line
  }, [currentPage, ratedMovies]);

  useEffect(() => {
    if (error !== null) {
      console.log(error);
      setError(null);
    }
  }, [error, setError]);

  const movies = assignGenres(ratedMovies || ratedMoviesList, ganres) || [];

  return (
    <>
      {movies.length > 0 ? (
        <>
          <SearchInput />
          <List list={movies} moviesToShow='100' />
        </>
      ) : (
        <h2 className='Missing'>Вы ещё не оценили ни одного фильма...</h2>
      )}
    </>
  );
};
