import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Spin } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import FilmCard from '../film-card/FilmCard';
import MovieService from '../../services';
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
    const { rateMovie, ratedMoviesId, genres } = this.props;

    const spinner = loading ? <Spin /> : null;
    const content =
      !loading && ratedMovies.length !== 0 ? (
        <div>
          <ContentView
            rateMovie={rateMovie}
            ratedMoviesId={ratedMoviesId}
            genres={genres}
            ratedMovies={ratedMovies}
          />
          <div className="Pagination">
            <Pagination
              current={page}
              pageSize="20"
              total={totalDataItems > 10000 ? 10000 : totalDataItems}
              onChange={this.onPageChange}
            />
          </div>
        </div>
      ) : null;

    const missing =
      !loading && ratedMovies.length === 0 ? (
        <h2 className="Missing">
          Страница для отображения оцененных фильмов. Вы еще не оценили ни одного фильма.
        </h2>
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

export default RatedFilmList;
