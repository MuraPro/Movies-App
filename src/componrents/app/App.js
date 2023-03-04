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
    };

    this.getMovies = this.getMovies.bind(this);
    this.getGenresTitle = this.getGenresTitle.bind(this);
    this.getRatedMovies = this.getRatedMovies.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('sessionId')) {
      this.sessionService
        .getGuestSessionId()
        .then((data) => {
          localStorage.setItem('sessionId', data.guest_session_id);
        })
        .then(() => this.getRatedMovies());
      return;
    }
    this.getRatedMovies(1);
  }

  getRatedMovies = () => {
    this.movieService
      .getRatedMovies(1)
      .then((res) => res.total_pages)
      .then((pages) => {
        const allMovies = [];

        for (let i = 1; i <= pages; i += 1) {
          allMovies.push(this.movieService.getRatedMovies(i));
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

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
    });
  };

  getMovies = (query, page) => {
    this.setState({ loading: true });
    this.movieService
      .getMovies(query, page)
      .then((movies) => this.onMoviesLoaded(movies))
      .catch(this.onError);
    this.movieService
      .getPages(query, page)
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
    const { movies, query, totalDataItems, loading, genres, ratedMovies, hasError } = this.state;
    const items = [
      {
        label: 'Search',
        key: '1',
        children: (
          <>
            <SearchFilmInput movies={movies} setQuery={this.setQuery} getMovies={this.getMovies} />
            <FilmCardList
              getMovies={this.getMovies}
              getGenresTitle={this.getGenresTitle}
              movies={movies}
              query={query}
              totalDataItems={totalDataItems}
              loading={loading}
              genres={genres}
              ratedMovies={ratedMovies}
              rateMovie={this.rateMovie}
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
      <div className="app  ">
        <Online>
          <div className="wrapper container">
            <Tabs defaultActiveKey="1" centered items={items} destroyInactiveTabPane />
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
