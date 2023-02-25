import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Spin } from 'antd';
import FilmCard from '../film-card/FilmCard';

import MovieService from '../../services';
import styles from './RatedFilmList.module.css';

class RatedFilmList extends Component {
  movieService = new MovieService();

  constructor() {
    super();
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

  getRatedMovies = (page) => {
    this.movieService.getRatedMovies(page).then((data) => {
      this.setState({
        ratedMovies: data.results.map((movie) => ({
          title: movie.original_title,
          description: movie.overview,
          voteAverage: Math.floor(movie.vote_average * 10) / 10,
          posterImage: movie.poster_path
            ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
            : null,
          date: movie.release_date,
          id: movie.id,
          genreIds: movie.genre_ids,
        })),
        loading: false,
        totalDataItems: data.total_results,
      });
    });
  };

  onPageChange = (page) => {
    this.setState({ page, loading: true });
    this.getRatedMovies(page);
  };

  render() {
    const { ratedMovies, loading, page, totalDataItems } = this.state;
    const { rateMovie, ratedMoviesId } = this.props;

    const moviesCardsWithPagination = (
      <div className="card-list-global">
        {ratedMovies.map(({ title, description, voteAverage, posterImage, date, id, genreIds }) => (
          <FilmCard
            title={title}
            description={description}
            rating={ratedMoviesId[id]}
            posterImage={posterImage}
            voteAverage={voteAverage}
            date={date}
            key={id}
            rateMovie={rateMovie}
            id={id}
            genreIds={genreIds}
          />
        ))}
        {!loading && ratedMovies.length !== 0 && (
          <div className={styles.pagination}>
            <Pagination
              current={page}
              pageSize="20"
              total={totalDataItems > 10000 ? 10000 : totalDataItems}
              onChange={this.onPageChange}
            />
          </div>
        )}
      </div>
    );

    const spinner = loading ? (
      <div className="loader-area">
        <Spin size="large" />
      </div>
    ) : null;
    const content = ratedMovies.length > 0 ? { moviesCardsWithPagination } : null;
    const missing =
      !loading && ratedMovies.length === 0 ? <h2>Вы пока не оценили ни один фильм</h2> : null;

    return (
      <div>
        {spinner}
        {content}
        {missing}
      </div>
    );
  }
}

RatedFilmList.propTypes = {
  rateMovie: PropTypes.func.isRequired,
  ratedMoviesId: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default RatedFilmList;
