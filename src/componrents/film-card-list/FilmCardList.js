import React from 'react';
import './FilmCardList.css';
import PropTypes from 'prop-types';
import Error from '../Error';
import FilmCard from '../film-card/FilmCard';
import FilmsPagination from '../film-pagination';

function FilmCardList({
  movies,
  getMovies,
  query,
  totalDataItems,
  genres,
  ratedMovies,
  rateMovie,
  hasError,
  loading,
}) {
  const errormesage = hasError ? <Error /> : null;
  const missing =
    !loading && !hasError && movies.length === 0 ? (
      <h2 className="Missing">По вашему запросу ничего не было найдено. Попробуй еще раз!</h2>
    ) : null;
  const content = !hasError ? (
    <Content
      movies={movies}
      getMovies={getMovies}
      query={query}
      totalDataItems={totalDataItems}
      genres={genres}
      ratedMovies={ratedMovies}
      rateMovie={rateMovie}
    />
  ) : null;
  return (
    <>
      {errormesage}
      {missing}
      {content}
    </>
  );
}

function Content({ movies, getMovies, query, totalDataItems, ratedMovies, rateMovie, genres }) {
  const items = movies.map(({ title, description, posterImage, date, id, genreIds, average }) => (
    <FilmCard
      title={title}
      description={description}
      posterImage={posterImage}
      date={date}
      key={id}
      id={id}
      rating={ratedMovies[id]}
      rateMovie={rateMovie}
      average={average}
      genreIds={genreIds.map((elem) => {
        return genres.find((item) => item.id === elem);
      })}
    />
  ));
  return (
    <>
      <ul className="CardList">{items}</ul>
      <FilmsPagination totalDataItems={totalDataItems} getMovies={getMovies} query={query} />
    </>
  );
}

FilmCardList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.string,
      id: PropTypes.number,
      posterImage: PropTypes.string,
      genreIds: PropTypes.arrayOf(PropTypes.number),
      average: PropTypes.string,
    }),
  ).isRequired,
  totalDataItems: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  getMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default FilmCardList;
