import { useEffect, useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';

export const MoviesRatedList = () => {
  const { currentPage } = useMovies();
  const [ratedMovies, setRatedMovies] = useState([]);
  const storedMovies = localStorage.getItem('RatedMovies');

  useEffect(() => {
    if (storedMovies) {
      setRatedMovies(JSON.parse(storedMovies));
    }
  }, [currentPage, storedMovies]);

  return (
    <>
      {storedMovies ? (
        <>
          <SearchInput />
          {ratedMovies && <List list={ratedMovies} moviesToShow='100' />}
        </>
      ) : (
        <h2 className='Missing'>Вы еще не оценили ни одного фильма...</h2>
      )}
    </>
  );
};
