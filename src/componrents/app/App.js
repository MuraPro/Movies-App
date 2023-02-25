import React, { Component } from 'react';
import './app.css';
import { Spin, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import Error from '../Error';
import SearchFilmInput from '../search-films/SearchFilmsInput';
import FilmCardList from '../film-card-list/FilmCardList';
import RatedFilmList from '../RatedFilmList/RatedFilmList';
import SessionService from '../../services/SessionSevice';
import MovieService from '../../services';

export default class App extends Component {
  constructor() {
    super();

    this.sessionService = new SessionService();
    this.movieService = new MovieService();

    this.state = {
      movies: [],
      query: '',
      totalDataItems: 0,
      loading: true,
      genres: null,
      ratedMovies: {},
      hasError: false,
    };
    this.getMovies = this.getMovies.bind(this);
    this.getGenresTitle = this.getGenresTitle.bind(this);
  }

  //   componentDidMount() {
  //     this.getGenresTitle();
  //     this.getMovies('', 1);
  //   }

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

    this.getRatedMovies();
    this.getMovies('', 1);
    this.getGenresTitle();
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

  getMovies = (query, page) => {
    this.movieService
      .getMovies(query, page)
      .then((movies) =>
        this.setState({
          movies,
          loading: false,
        }),
      )
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
    this.movieService.sendMovieRate(id, rating);
    this.setState((state) => ({
      ratedMovies: { ...state.ratedMovies, [id]: rating },
    }));
  };

  render() {
    const { movies, query, totalDataItems, loading, genres, ratedMovies, hasError } = this.state;
    console.log(ratedMovies);
    const error = hasError ? <Error /> : null;
    const spinner = loading ? <Spin /> : null;
    const hasData = !(loading || hasError);

    const searchinput = hasData ? (
      <SearchFilmInput movies={movies} setQuery={this.setQuery} getMovies={this.getMovies} />
    ) : null;

    const content = hasData ? (
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
    ) : null;

    const items = [
      {
        label: 'Search',
        key: '1',
        children: (
          <>
            {error}
            {spinner}
            {searchinput}
            {content}
          </>
        ),
      },
      {
        label: 'Rated',
        key: '2',
        children: <RatedFilmList ratedMoviesId={ratedMovies} rateMovie={this.rateMovie} />,
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
