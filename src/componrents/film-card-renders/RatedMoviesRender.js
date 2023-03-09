import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { GenresConsumer } from '../genres-context';
import FilmCard from '../film-card/FilmCard';

function MoviesRatedRender({
  rateMovie,
  ratedMoviesId,
  ratedMovies,
  onPageChange,
  page,
  totalDataItems,
}) {
  const items = ratedMovies.map(
    ({ title, description, average, posterImage, date, id, genreIds }) => (
      <GenresConsumer>
        {(genres) => {
          return (
            <FilmCard
              title={title}
              description={description}
              rating={ratedMoviesId[id]}
              posterImage={posterImage}
              average={average}
              date={date}
              key={id}
              rateMovie={rateMovie}
              id={id}
              genreIds={genreIds.map((elem) => {
                return genres.find((item) => item.id === elem);
              })}
            />
          );
        }}
      </GenresConsumer>
    ),
  );

  return (
    <ErrorBoundary>
      <ul className="CardList">{items}</ul>;
      <div className="Pagination">
        <Pagination
          current={page}
          pageSize="20"
          total={totalDataItems > 10000 ? 10000 : totalDataItems}
          onChange={onPageChange}
        />
      </div>
    </ErrorBoundary>
  );
}

MoviesRatedRender.propTypes = {
  ratedMovies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.string,
      id: PropTypes.number,
      posterImage: PropTypes.string,
      genreIds: PropTypes.arrayOf(PropTypes.number),
    }),
  ).isRequired,
  rateMovie: PropTypes.func.isRequired,
  ratedMoviesId: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default MoviesRatedRender;
