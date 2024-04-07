import { useMovies } from '../../../hooks/useMovies';
import { Skeleton } from 'antd';
import { MovieCard } from '../../movie-card';
import './List.css';
import { useSelector } from 'react-redux';
import { getCurrentPage, getMoviesLoadingStatus } from '../../../store/movies';
import { useEffect, useState } from 'react';

export const List = ({ list, moviesToShow, value }) => {
  //   const { loading, showSkeleton } = useMovies();
  const currentPage = useSelector(getCurrentPage());
  const [showSkeleton, setShowSkeleton] = useState(true);
  const loading = useSelector(getMoviesLoadingStatus());

  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [value, currentPage]);
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
