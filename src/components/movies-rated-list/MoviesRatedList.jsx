import { useEffect, useMemo, useState } from 'react';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { getRatedMovies, getRatedMoviesList } from '../../store/rated-movies';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPage, getIsRate, getQuery } from '../../store/movies';
import './MoviesRatedList.css';

export const MoviesRatedList = () => {
  const dispatch = useDispatch();
  const [ratedMoviesList, setRatedMoviesList] = useState([]);
  const query = useSelector(getQuery());
  const currentPage = useSelector(getCurrentPage());
  const ratedMovies = useSelector(getRatedMoviesList());
  const isRate = useSelector(getIsRate());

  useEffect(() => {
    if (!ratedMovies) {
      const storedMovies = localStorage.getItem('RatedMovies');
      if (!storedMovies) {
        dispatch(getRatedMovies(query, currentPage));
      } else {
        setRatedMoviesList(JSON.parse(storedMovies));
      }
    }
  }, [isRate, ratedMovies, dispatch, query, currentPage]);

  const memoizedMovies =
    useMemo(() => ratedMoviesList, [ratedMoviesList]) || [];

  return (
    <>
      <SearchInput />
      {memoizedMovies.length > 0 ? (
        <List list={memoizedMovies} moviesToShow='100' />
      ) : (
        <h2 className='Missing'>Вы еще не оценили ни одного фильма...</h2>
      )}
    </>
  );
};
