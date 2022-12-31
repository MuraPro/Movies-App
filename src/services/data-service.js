import moment from 'moment';

export default class MovieService {
  async getResource(url) {
    const res = await fetch(`${this.BASE_URL}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url} received ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  constructor() {
    this.API_KEY = '5a2ff74dfa53b7281db30326bddc6e34';
    this.BASE_URL = 'https://api.themoviedb.org/3/';
  }

  async getMovies(query, page) {
    const { API_KEY } = this;
    let finalQuery = query;

    if (!query && query === '') {
      finalQuery = 'return';
    }
    const films = await this.getResource(
      `/search/movie?api_key=${API_KEY}&query=${finalQuery}&page=${page}`,
    );
    const results = films.results.map((item) => this.transformFilmInfo(item));
    return results;
  }

  async getPages(query, page) {
    const { API_KEY } = this;
    let finalQuery = query;

    if (!query && query === '') {
      finalQuery = 'return';
    }
    const films = await this.getResource(
      `/search/movie?api_key=${API_KEY}&query=${finalQuery}&page=${page}`,
    );
    const pages = films.total_results;
    return pages;
  }

  async getMovie(id) {
    const { API_KEY } = this;
    const movie = await this.getResource(`movie/${id}?api_key=${API_KEY}&language=en-US`);
    return this.transformFilmInfo(movie);
  }

  async getGenres() {
    const { API_KEY } = this;
    const results = await this.getResource(`/genre/movie/list?api_key=${API_KEY}`).then(
      (res) => res.genres,
    );
    return results;
  }

  transformFilmInfo(movie) {
    return {
      title: movie.title,
      description: movie.overview,
      average: movie.vote_average.toFixed(1),
      date: this.transformDate(movie.release_date),
      id: movie.id,
      posterImage: movie.poster_path
        ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
        : null,
      genreIds: movie.genre_ids,
    };
  }

  transformDate(str) {
    return moment(new Date(str)).format(`MMMM D, YYYY`);
  }
}
