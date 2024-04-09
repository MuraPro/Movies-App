import { useEffect, useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { assignGenres } from '../../utils/transform-data';

export const MoviesRatedList = () => {
  const { ratedMoviesList, currentPage, ganres } = useMovies();
  const [ratedMovies, setRatedMovies] = useState(null);
  const storedMovies = localStorage.getItem('RatedMovies');

  useEffect(() => {
    if (storedMovies) {
      setRatedMovies(JSON.parse(storedMovies));
    }
  }, [currentPage, storedMovies]);

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
