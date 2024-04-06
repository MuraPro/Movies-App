import { useMovies } from '../../../hooks/useMovies';
import { Skeleton } from 'antd';
import { MovieCard } from '../../movie-card';
import './List.css';

export const List = ({ list, moviesToShow }) => {
  const { loading, showSkeleton } = useMovies();
  return (
    <ul className='CardList'>
      {loading || showSkeleton
        ? Array.from({ length: moviesToShow }).map((_, index) => (
            <Skeleton key={index} active />
          ))
        : list
            .slice(0, moviesToShow)
            .map((movie, index) => (
              <MovieCard key={movie.id} {...movie} index={index} />
            ))}
    </ul>
  );
};
