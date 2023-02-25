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

  async getMovies(query, page) {
    const { API_KEY } = this;
    const finalQuery = query;
    let finalUrl = `/search/movie?api_key=${API_KEY}&query=${finalQuery}&page=${page}`;

    if (!query && query === '') {
      finalUrl = `/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    }
    const films = await this.getResource(finalUrl);
    const results = films.results.map((item) => this.transformFilmInfo(item));
    return results;
  }

  async getPages(query, page) {
    const { API_KEY } = this;
    let finalQuery = query;

    if (!query && query === '') {
      finalQuery = '';
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

  async getRatedMovies(page) {
    const { API_KEY } = this;

    const sessionId = localStorage.getItem('sessionId');

    const url = `/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}&page=${page}`;

    const res = this.getResource(url);

    if (!res.ok) {
      throw new Error('server error');
    }

    return res;
  }

  async sendMovieRate(movieId, rate) {
    const { BASE_URL, API_KEY } = this;

    const sessionId = localStorage.getItem('sessionId');

    const url = `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`;

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
