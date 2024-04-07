import { useEffect, useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { SearchInput } from '../ui/input';
import { List } from '../ui/List';
import { MoviesPagination } from '../ui/pagination';
import { assignGenres, updateMoviesRating } from '../../utils/transform-data';
import './MoviesList.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentPage,
  getGanresList,
  getMoviesList,
  getMoviesLoadingStatus,
} from '../../store/movies';
import { Spin } from 'antd';

export const MoviesList = () => {
  const [inputValue, setInputValue] = useState();
  const currentPage = useSelector(getCurrentPage());
  const movies = useSelector(getMoviesList());
  const ganres = useSelector(getGanresList());
  const loading = useSelector(getMoviesLoadingStatus());

  if (!loading && movies && ganres) {
    return (
      <>
        <SearchInput value={inputValue} setValue={setInputValue} />
        <List
          list={movies}
          moviesToShow='8'
          value={inputValue}
          setValue={setInputValue}
        />
        <MoviesPagination />
      </>
    );
  } else {
    // Рендер заглушки или индикатора загрузки
    return <Spin />;
  }
};
