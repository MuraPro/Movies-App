import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { MoviesRatedRender } from '../film-card-renders';
import Error from '../Error';
import MovieService from '../../services/data-service';
import './RatedFilmList.css';

class RatedFilmList extends Component {
  movieService = new MovieService();

  constructor(props) {
    super(props);

    this.state = {
      ratedMovies: [],
      loading: true,
      page: 1,
      totalDataItems: 0,
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
      loading: false,
    });
  };

  onPageChange = (page) => {
    this.setState({ page, loading: true });
    this.getRatedMovies(page);
  };

  render() {
    const { loading, page, totalDataItems, ratedMovies } = this.state;
    const { rateMovie, ratedMoviesId, hasError } = this.props;

    const hasData = !(loading || hasError);
    const errorMessage = hasError ? <Error /> : null;
    const spinner = loading ? <Spin /> : null;
    const content =
      hasData && ratedMovies.length !== 0 ? (
        <MoviesRatedRender
          key={rateMovie.id}
          rateMovie={rateMovie}
          ratedMoviesId={ratedMoviesId}
          ratedMovies={ratedMovies}
          onPageChange={this.onPageChange}
          page={page}
          totalDataItems={totalDataItems}
        />
      ) : null;

    const missing =
      hasData && ratedMovies.length === 0 ? (
        <h2 className="Missing">
          Страница для отображения оцененных фильмов. Вы еще не оценили ни одного фильма.
        </h2>
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

RatedFilmList.propTypes = {
  rateMovie: PropTypes.func.isRequired,
  ratedMoviesId: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default RatedFilmList;
