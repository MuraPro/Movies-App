import { Input } from 'antd';
import { useMovies } from '../../../hooks/useMovies';
import './input.css';

export const SearchInput = () => {
  const { onQueryChange, value } = useMovies();
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
