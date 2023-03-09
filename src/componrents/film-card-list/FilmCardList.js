import React, { Component } from 'react';
import './FilmCardList.css';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import Error from '../Error';
import { MoviesRender } from '../film-card-renders';

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
      ratedMovies,
      rateMovie,
      page,
      loading,
      hasError,
      onPageChange,
    } = this.props;

    const hasData = !(loading || hasError);
    const errorMessage = hasError ? <Error /> : null;
    const spinner = loading ? <Spin /> : null;
    const missing =
      hasData && movies.length === 0 ? (
        <h2 className="Missing">По вашему запросу данные отсутствуют. Попробуйте еще раз!</h2>
      ) : null;
    const content =
      hasData && movies.length !== 0 ? (
        <MoviesRender
          movies={movies}
          getDataMovies={getDataMovies}
          query={query}
          totalDataItems={totalDataItems}
          ratedMovies={ratedMovies}
          rateMovie={rateMovie}
          page={page}
          onPageChange={onPageChange}
        />
      ) : null;

    return (
      <ErrorBoundary>
        {spinner}
        {errorMessage}
        {missing}
        {content}
      </ErrorBoundary>
    );
  }
}

FilmCardList.propTypes = {
  movies: PropTypes.instanceOf(Array).isRequired,
  totalDataItems: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  getDataMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  hasError: PropTypes.bool.isRequired,
};

export default FilmCardList;
