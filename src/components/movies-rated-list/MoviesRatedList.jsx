import { useEffect, useMemo, useState } from 'react';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPage, getIsRate, getQuery } from '../../store/movies';
import './MoviesRatedList.css';

export const MoviesRatedList = () => {
  const dispatch = useDispatch();
  const [ratedMoviesList, setRatedMoviesList] = useState([]);
  const query = useSelector(getQuery());
  const currentPage = useSelector(getCurrentPage());
  const isRate = useSelector(getIsRate());
  const storedMovies = localStorage.getItem('RatedMovies');

  useEffect(() => {
    if (storedMovies) {
      setRatedMoviesList(JSON.parse(storedMovies));
    }
  }, [isRate, storedMovies, dispatch, query, currentPage]);

  const memoizedMovies =
    useMemo(() => ratedMoviesList, [ratedMoviesList]) || [];

  return (
    <>
      {storedMovies ? (
        <>
          <SearchInput />
          {memoizedMovies && <List list={memoizedMovies} moviesToShow='100' />}
        </>
      ) : (
        <h2 className='Missing'>Вы еще не оценили ни одного фильма...</h2>
      )}
    </>
  );
};
