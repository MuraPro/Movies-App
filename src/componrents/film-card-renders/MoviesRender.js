import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { GenresConsumer } from '../genres-context';
import FilmCard from '../film-card/FilmCard';
import FilmsPagination from '../film-pagination';

function MoviesRender({
  movies,
  getDataMovies,
  query,
  totalDataItems,
  ratedMovies,
  rateMovie,
  page,
  onPageChange,
}) {
  const items = movies.map(({ title, description, posterImage, date, id, genreIds, average }) => {
    return (
      <GenresConsumer key={id}>
        {(genres) => {
          return (
            <FilmCard
              rateMovie={rateMovie}
              key={id}
              id={id}
              date={date}
              title={title}
              description={description}
              rating={ratedMovies[id]}
              posterImage={posterImage}
              average={average}
              genreIds={genreIds.map((elem) => {
                return genres.find((item) => item.id === elem);
              })}
            />
          );
        }}
      </GenresConsumer>
    );
  });

  return (
    <ErrorBoundary>
      <ul className="CardList">{items}</ul>
      <FilmsPagination
        totalDataItems={totalDataItems}
        getDataMovies={getDataMovies}
        query={query}
        page={page}
        onPageChange={onPageChange}
      />
    </ErrorBoundary>
  );
}

MoviesRender.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.string,
      id: PropTypes.number,
      posterImage: PropTypes.string,
      genreIds: PropTypes.arrayOf(PropTypes.number),
    }),
  ).isRequired,
  totalDataItems: PropTypes.number.isRequired,
  getDataMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  ratedMovies: PropTypes.objectOf(PropTypes.number).isRequired,
  rateMovie: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default MoviesRender;
