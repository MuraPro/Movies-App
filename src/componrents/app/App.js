import React, { Component } from 'react';
import './app.css';
import { Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { debounce } from 'lodash';
import Error from '../Error';
import SearchFilmInput from '../search-films/SearchFilmsInput';
import FilmCardList from '../film-card-list/FilmCardList';
import RatedFilmList from '../film-rated';
import SessionService from '../../services/SessionSevice';
import MovieService from '../../services';

export default class App extends Component {
  debouncedFetching = debounce((id, rating) => {
    this.movieService.sendMovieRate(id, rating);
  }, 500);

  constructor() {
    super();

    this.sessionService = new SessionService();
    this.movieService = new MovieService();

    this.state = {
      movies: [],
      query: '',
      totalDataItems: 0,
      loading: false,
      genres: null,
      ratedMovies: {},
      hasError: false,
      page: 1,
    };

    this.getDataMovies = this.getDataMovies.bind(this);
    this.getGenresTitle = this.getGenresTitle.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('sessionId')) {
      this.sessionService
        .getGuestSessionId()
        .then((data) => {
          localStorage.setItem('sessionId', data.guest_session_id);
        })
        .then(() => this.getRatingData(1));
      return;
    }
    this.getRatingData(1);
  }

  getRatingData = () => {
    this.movieService
      .getRatingData(1)
      .then((res) => res.total_pages)
      .then((pages) => {
        const allMovies = [];

        for (let i = 1; i <= pages; i += 1) {
          allMovies.push(this.movieService.getRatingData(i));
        }

        Promise.all(allMovies).then((res) => {
          this.setState({
            ratedMovies: res
              .reduce((accum, page) => [...accum, ...page.results], [])
              .map((movie) => ({ [movie.id]: movie.rating }))
              .reduce(
                (accum, obj) => ({ ...accum, [Object.keys(obj)[0]]: obj[Object.keys(obj)[0]] }),
                {},
              ),
          });
        });
      });
  };

  onMoviesLoaded = ({ results, totalPages }) => {
    this.setState({
      movies: results,
      totalDataItems: totalPages,
      loading: false,
    });
  };

  getDataMovies = (query, page) => {
    this.setState({ loading: true });
    this.movieService
      .getDataMovies(query, page)
      .then((data) => this.onMoviesLoaded(data))
      .catch(this.onError);
  };

  onError = () => {
    this.setState({
      hasError: true,
      loading: false,
    });
  };

  getGenresTitle = () => {
    this.movieService
      .getGenres()
      .then((genres) => {
        this.setState({
          genres,
        });
      })
      .catch(this.onError);
  };

  setQuery = (query) => {
    this.setState({ query });
  };

  rateMovie = (id, rating) => {
    this.debouncedFetching(id, rating);
    this.setState((state) => ({
      ratedMovies: { ...state.ratedMovies, [id]: rating },
    }));
  };

  render() {
    const { movies, query, totalDataItems, loading, genres, ratedMovies, hasError, page } =
      this.state;

    const items = [
      {
        label: 'Search',
        key: '1',
        children: (
          <>
            <SearchFilmInput
              movies={movies}
              setQuery={this.setQuery}
              getDataMovies={this.getDataMovies}
            />
            <FilmCardList
              getDataMovies={this.getDataMovies}
              getGenresTitle={this.getGenresTitle}
              movies={movies}
              query={query}
              totalDataItems={totalDataItems}
              loading={loading}
              genres={genres}
              ratedMovies={ratedMovies}
              rateMovie={this.rateMovie}
              page={page}
              onPageChange={this.onPageChange}
              hasError={hasError}
            />
          </>
        ),
      },
      {
        label: 'Rated',
        key: '2',
        children: (
          <RatedFilmList ratedMoviesId={ratedMovies} rateMovie={this.rateMovie} genres={genres} />
        ),
      },
    ];

    return (
      <div className="app">
        <Online>
          <div className="wrapper container">
            <Tabs defaultActiveKey="1" centered items={items} destroyInactiveTabPane size="large" />
          </div>
        </Online>
        <Offline>
          <div className="offline-message-area container">
            <Error />
          </div>
        </Offline>
      </div>
    );
  }
}
