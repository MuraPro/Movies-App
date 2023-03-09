import React, { Component } from 'react';
import './app.css';
import { Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { debounce } from 'lodash';
import Error from '../Error';
import { GenresProvider } from '../genres-context';
import SearchFilmInput from '../film-search/SearchFilmsInput';
import FilmCardList from '../film-card-list/FilmCardList';
import RatedFilmList from '../film-card-rated-list/RatedFilmList';
import SessionService from '../../services/session-sevice';
import MovieService from '../../services/data-service';

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
  }

  componentDidMount() {
    if (!localStorage.getItem('sessionId')) {
      this.sessionService
        .getGuestSessionId()
        .then((data) => {
          localStorage.setItem('sessionId', data.guest_session_id);
        })
        .then(() => this.getRatedData(1))
        .catch(this.onError);
      return;
    }
    this.getRatedData(1);
  }

  getRatedData = () => {
    this.movieService
      .getRatedData(1)
      .then((res) => res.total_pages)
      .then((pages) => {
        const allMovies = [];

        for (let i = 1; i <= pages; i += 1) {
          allMovies.push(this.movieService.getRatedData(i));
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
      })
      .catch(this.onError);
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

  onPageChange = (page) => {
    this.setState({
      page,
      loading: true,
    });
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
              hasError={hasError}
            />
            <FilmCardList
              getDataMovies={this.getDataMovies}
              getGenresTitle={this.getGenresTitle}
              movies={movies}
              query={query}
              totalDataItems={totalDataItems}
              loading={loading}
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
          <RatedFilmList
            ratedMoviesId={ratedMovies}
            rateMovie={this.rateMovie}
            hasError={hasError}
          />
        ),
      },
    ];

    return (
      <div className="app">
        <Online>
          <GenresProvider value={genres}>
            <div className="wrapper container">
              <Tabs
                defaultActiveKey="1"
                centered
                items={items}
                destroyInactiveTabPane
                size="large"
              />
            </div>
          </GenresProvider>
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
