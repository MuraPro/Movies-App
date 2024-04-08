import { useState } from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { queryChange } from '../../../store/movies';
import './input.css';

export const SearchInput = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const onQueryChange = (e) => {
    setInputValue(e.target.value);
    dispatch(queryChange(e.target.value, 1));
  };

  return (
    <Input
      placeholder='Type to search...'
      value={inputValue}
      className='SearchFilmInput'
      size='large'
      onChange={onQueryChange}
    />
  );
};
