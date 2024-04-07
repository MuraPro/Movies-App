import { Input } from 'antd';
import { useMovies } from '../../../hooks/useMovies';
import './input.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  debouncedQueryFetching,
  getCurrentPage,
  getQuery,
  onPageChange,
} from '../../../store/movies';
import { useState } from 'react';

export const SearchInput = ({ value, setValue }) => {
  const currentPage = useSelector(getCurrentPage());
  const query = useSelector(getQuery());
  const dispatch = useDispatch();

  const onQueryChange = (e) => {
    dispatch(debouncedQueryFetching(e.target.value, currentPage));
    setValue(e.target.value);
  };

  return (
    <Input
      placeholder='Type to search...'
      value={value}
      className='SearchFilmInput'
      size='large'
      onChange={onQueryChange}
    />
  );
};
