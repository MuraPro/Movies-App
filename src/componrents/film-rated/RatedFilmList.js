import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Spin } from 'antd';
import FilmCard from '../film-card/FilmCard';
import Error from '../Error';
import MovieService from '../../services';
import './RatedFilmList.css';

class RatedFilmList extends Component {
  movieService = new MovieService();

  constructor() {
    super();
    this.state = {
      ratedMovies: [],
      loading: true,
      page: 1,
      totalDataItems: 0,
      hasError: false,
    };
  }

  componentDidMount() {
    this.getRatedMovies(1);
  }

  onMoviesLoaded = (ratedMovies) => {
    this.setState({
      ratedMovies,
      loading: false,
    });
  };

  getRatedMovies = (page) => {
    this.setState({ loading: true });
    this.movieService
      .getRatedMovies(page)
      .then((ratedMovies) => this.onMoviesLoaded(ratedMovies))
      .catch(this.onError);
    this.movieService
      .getRatedPages(page)
      .then((totalDataItems) => {
        this.setState({
          totalDataItems,
        });
      })
      .catch(this.onError);
  };

  onError = () => {
    this.setState({
      hasError: true,
      loading: false,
    });
  };

  onPageChange = (page) => {
    this.setState({ page, loading: true });
    this.getRatedMovies(page);
  };

  render() {
    const { ratedMovies, loading, page, totalDataItems, hasError } = this.state;
    const { rateMovie, ratedMoviesId, genres } = this.props;

    const error = hasError ? <Error /> : null;
    const spinner = loading ? <Spin /> : null;
    const hasData = !(loading || hasError);
    const content = hasData ? (
      <ContentView
        ratedMovies={ratedMovies}
        rateMovie={rateMovie}
        ratedMoviesId={ratedMoviesId}
        genres={genres}
      />
    ) : null;
    const pagination = hasData ? (
      <div className="Pagination">
        <Pagination
          current={page}
          pageSize="20"
          total={totalDataItems > 10000 ? 10000 : totalDataItems}
          onChange={this.onPageChange}
        />
      </div>
    ) : null;

    return (
      <>
        {error}
        {spinner}
        {content}
        {pagination}
      </>
    );
  }
}

function ContentView({ rateMovie, ratedMoviesId, genres, ratedMovies }) {
  const items = ratedMovies.map(
    ({ title, description, average, posterImage, date, id, genreIds }) => (
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
    ),
  );

  return <ul className="CardList">{items}</ul>;
}

RatedFilmList.propTypes = {
  rateMovie: PropTypes.func.isRequired,
  ratedMoviesId: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default RatedFilmList;
