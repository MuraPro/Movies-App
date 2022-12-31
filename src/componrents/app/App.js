import React, { Component } from 'react';
import './app.css';
import { Spin, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import Error from '../Error';
import FilmRated from '../film-rated';
import SearchFilmInput from '../search-films/SearchFilmsInput';
import FilmCardList from '../film-card-list';
import MovieService from '../../services';

export default class App extends Component {
  constructor() {
    super();
    this.movieService = new MovieService();
    this.state = {
      movies: [],
      query: '',
      totalDataItems: 0,
      loading: true,
      genres: null,
      hasError: false,
    };
    this.getMovies = this.getMovies.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.getGenresTitle = this.getGenresTitle.bind(this);
    this.getGenresTitle();
  }

  componentDidMount() {
    this.getMovies('', 1);
  }

  getMovies = (query, page) => {
    this.movieService
      .getMovies(query, page)
      .then((movies) =>
        this.setState({
          movies,
          loading: false,
        }),
      )
      .catch(() => this.setState({ hasError: true }));
    this.movieService
      .getPages(query, page)
      .then((totalDataItems) => {
        this.setState({
          totalDataItems,
        });
      })
      .catch(() => this.setState({ hasError: true }));
  };

  getGenresTitle = () => {
    this.movieService
      .getGenres()
      .then((genres) => {
        this.setState({
          genres,
        });
      })
      .catch(() => this.setState({ hasError: true }));
  };

  setQuery = (query) => {
    this.setState({ query });
  };

  render() {
    const { movies, query, totalDataItems, loading, genres, hasError } = this.state;

    const hasData = !(loading || hasError);
    const error = hasError ? <Error /> : null;
    const spinner = loading && !hasError ? <Spin /> : null;
    const searchinput = hasData ? (
      <SearchFilmInput movies={movies} setQuery={this.setQuery} getMovies={this.getMovies} />
    ) : null;

    const content = hasData ? (
      <FilmCardList
        movies={movies}
        getMovies={this.getMovies}
        query={query}
        totalDataItems={totalDataItems}
        loading={loading}
        genres={genres}
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
        children: <FilmRated />,
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
