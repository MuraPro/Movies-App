import React, { Component } from 'react';
import './FilmCardList.css';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import Error from '../Error';
import FilmCard from '../film-card/FilmCard';
import FilmsPagination from '../film-pagination';

class FilmCardList extends Component {
  componentDidMount() {
    const { getDataMovies, getGenresTitle, page } = this.props;
    getGenresTitle();
    getDataMovies('', page);
  }

  render() {
    const {
      movies,
      getDataMovies,
      query,
      totalDataItems,
      genres,
      ratedMovies,
      rateMovie,
      page,
      loading,
      onPageChange,
    } = this.props;

    const spinner = loading ? <Spin /> : null;
    const missing =
      !loading && movies.length === 0 ? (
        <h2 className="Missing">По вашему запросу данные отсутствуют. Попробуйте еще раз!</h2>
      ) : null;
    const content =
      !loading && movies.length !== 0 ? (
        <Content
          movies={movies}
          getDataMovies={getDataMovies}
          query={query}
          totalDataItems={totalDataItems}
          genres={genres}
          ratedMovies={ratedMovies}
          rateMovie={rateMovie}
          page={page}
          onPageChange={onPageChange}
        />
      ) : null;

    return (
      <ErrorBoundary>
        {spinner}
        {missing}
        {content}
      </ErrorBoundary>
    );
  }
}

function Content({
  movies,
  getDataMovies,
  query,
  totalDataItems,
  ratedMovies,
  rateMovie,
  genres,
  page,
  onPageChange,
}) {
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
      <FilmsPagination
        totalDataItems={totalDataItems}
        getDataMovies={getDataMovies}
        query={query}
        page={page}
        onPageChange={onPageChange}
      />
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
    }),
  ).isRequired,
  totalDataItems: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  getDataMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default FilmCardList;
