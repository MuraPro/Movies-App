import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moviesService, {
  sendMovieRating,
  transformFilmInfo,
  transformRatedFilmInfo,
} from '../service/data-service';
import { generateError } from '../utils/generateError';
import { Spin } from 'antd';
import { debounce } from 'lodash';
import { assignGenres } from '../utils/transform-data';

const MovieContext = React.createContext();

export const useMovies = () => {
  return useContext(MovieContext);
};

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [ganres, setGanres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const moviesList = assignGenres(movies, ganres);
  const ratedMoviesList = assignGenres(ratedMovies, ganres);

  const debouncedQueryFetching = debounce((query, page) => {
    setQuery(query);
    getMovies(query, page);
  }, 300);

  const debouncedRatingFetching = debounce((id, rate) => {
    sendMovieRating(id, rate);

    setMovies((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id === id) {
          return { ...movie, rating: rate };
        }
        return movie;
      });
    });

    const currentRatedMovies =
      JSON.parse(localStorage.getItem('RatedMovies')) || [];

    const existingMovie = currentRatedMovies.find((movie) => movie.id === id);
    if (!existingMovie) {
      const findMovie = movies.find((movie) => movie.id === id);
      const transformFindMovie = { ...findMovie, rating: rate };
      const updatedMovies = [...currentRatedMovies, transformFindMovie];
      localStorage.setItem('RatedMovies', JSON.stringify(updatedMovies));
    }
  }, 500);

  const getMovies = useCallback(
    async (query, currentPage) => {
      try {
        const { results, total_results } = await moviesService.getMoviesList(
          query,
          currentPage
        );
        const movies = results.map((m) => transformFilmInfo(m));
        setMovies(movies);
        setTotalPages(total_results);
        setLoading(false);
      } catch ({ message }) {
        const errorMessage = generateError(message);
        console.log(errorMessage);
        errorCatcher(error);
      }
    },
    [error]
  );

  const getRatedMovies = async (page) => {
    try {
      const { results } = await moviesService.getRatedMoviesList(page);
      const movies = results.map((m) => transformRatedFilmInfo(m));
      setRatedMovies(movies);
      setLoading(false);
    } catch ({ message }) {
      console.log(message);
      const errorMessage = generateError(message);
      errorCatcher(errorMessage);
    }
  };

  const getGanres = useCallback(async () => {
    try {
      const { genres } = await moviesService.getGenres();
      setGanres(genres);
      setLoading(false);
    } catch ({ message }) {
      console.log(message);
      const errorMessage = generateError(message);
      errorCatcher(errorMessage);
    }
  }, []);

  useEffect(() => {
    getGanres();
  }, [getGanres]);

  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [value, currentPage]);

  useEffect(() => {
    if (error !== null) {
      console.log(error);
      setError(null);
    }
  }, [error, setError]);

  function errorCatcher(error) {
    setError(error);
    setLoading(false);
  }

  const setPage = (page) => {
    setCurrentPage(page);
  };

  const onPageChange = (page) => {
    getMovies(query, page);
    setPage(page);
  };

  const onRatingChange = (id, rate) => {
    debouncedRatingFetching(id, rate);
  };

  const onQueryChange = (e) => {
    debouncedQueryFetching(e.target.value, currentPage);
    setValue(e.target.value);
  };

  return (
    <MovieContext.Provider
      value={{
        error,
        loading,
        moviesList,
        ratedMoviesList,
        totalPages,
        currentPage,
        query,
        value,
        showSkeleton,
        ganres,
        onPageChange,
        onQueryChange,
        onRatingChange,
        getMovies,
        getRatedMovies,
        setError,
      }}
    >
      <div className='wrapper_spinner container'>
        {!loading ? children : <Spin />}
      </div>
    </MovieContext.Provider>
  );
};

MoviesProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default MoviesProvider;
