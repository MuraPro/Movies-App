import { useEffect, useState } from 'react';
import { MovieCard } from '../../movie-card';
import { getCurrentPage, getMoviesLoadingStatus } from '../../../store/movies';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import './List.css';

export const List = ({ list, moviesToShow, value }) => {
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
