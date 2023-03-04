import React, { Component } from 'react';
import './FilmCardList.css';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import Error from '../Error';
import FilmCard from '../film-card/FilmCard';
import FilmsPagination from '../film-pagination';

class FilmCardList extends Component {
  componentDidMount() {
    const { getMovies, getGenresTitle } = this.props;
    getGenresTitle();
    getMovies('', 1);
  }

  render() {
    const {
      movies,
      getMovies,
      query,
      totalDataItems,
      genres,
      ratedMovies,
      rateMovie,
      hasError,
      loading,
    } = this.props;

    const spinner = loading ? <Spin /> : null;
    const errormesage = hasError ? <Error /> : null;
    const hasData = !(loading || hasError);
    const missing =
      hasData && movies.length === 0 ? (
        <h2 className="Missing">Nothing was found for your query. Try again!</h2>
      ) : null;
    const content = hasData ? (
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
        {spinner}
        {missing}
        {content}
      </>
    );
  }
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
    }),
  ).isRequired,
  totalDataItems: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  getMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default FilmCardList;
