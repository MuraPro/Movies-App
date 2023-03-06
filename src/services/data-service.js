import moment from 'moment';

export default class MovieService {
  constructor() {
    this.API_KEY = '282e31062bfb9d0dbaeaf8fdb2231950';
    this.BASE_URL = 'https://api.themoviedb.org/3';
  }

  async getResource(url) {
    const { BASE_URL } = this;
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url} received ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  async getDataMovies(query, page) {
    const { API_KEY } = this;
    const finalQuery = query;

    let url = `/search/movie?api_key=${API_KEY}&query=${finalQuery}&page=${page}`;

    if (!query && query === '') {
      url = `/movie/popular?api_key=${API_KEY}&page=${page}`;
    }
    const films = await this.getResource(url);

    const totalPages = films.total_results;
    const results = films.results.map((item) => this.transformFilmInfo(item));
    return { results, totalPages };
  }

  async getGenres() {
    const { API_KEY } = this;
    const results = await this.getResource(`/genre/movie/list?api_key=${API_KEY}`).then(
      (res) => res.genres,
    );
    return results;
  }

  async getRatedMovies(page) {
    const { API_KEY } = this;

    const sessionId = localStorage.getItem('sessionId');
    const url = `/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}&page=${page}`;

    const films = await this.getResource(url);

    const results = films.results.map((item) => this.transformFilmInfo(item));
    return results;
  }

  async getRatingData(page) {
    const { API_KEY } = this;

    const sessionId = localStorage.getItem('sessionId');

    const url = `/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}&page=${page}`;

    const res = await this.getResource(url);
    return res;
  }

  async getRatedPages(page) {
    const { API_KEY } = this;
    const sessionId = localStorage.getItem('sessionId');

    const films = await this.getResource(
      `/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}&page=${page}`,
    );
    const pages = films.total_results;
    return pages;
  }

  async sendMovieRate(movieId, rate) {
    const { API_KEY } = this;

    const sessionId = localStorage.getItem('sessionId');

    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`;

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        value: rate,
      }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (!res.ok) {
      throw new Error('server error');
    }

    return res.json();
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
