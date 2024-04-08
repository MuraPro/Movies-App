import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import { getSessionId, setSessionId } from './localStorage.service';
import { generateError } from '../utils/generateError';

const BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Njg2NTUxYjA5NWI1NjYxMDE2OTRlYWZlZmViZDc2NCIsInN1YiI6IjYzOTU4YTE3OGE4OGIyMDA4YTJmZjgxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IHBIX5wfJoOvk-lvzZaMqRuEscuFEaYy5jl7nE08s6I';
const BASE_URL = 'https://api.themoviedb.org/3';

const moviesService = {
  getGuestSessionId: async () => {
    const options = {
      method: 'GET',
      url: `${BASE_URL}/authentication/guest_session/new`,
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      },
    };
    const { data } = await axios.request(options);
    return data;
  },

  getRatedMoviesList: async (page) => {
    const sessionId = getSessionId();
    const options = {
      method: 'GET',
      params: { page },
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      },
    };
    const data = await axios.request(
      `${BASE_URL}/guest_session/${sessionId}/rated/movies`,
      options
    );
    return data;
  },

  getMoviesList: async (query, page) => {
    const finalQuery = query;
    let urlQ = `/search/movie?query=${finalQuery}`;

    if (!query && query === '') {
      urlQ = `/movie/popular?`;
    }

    const options = {
      method: 'GET',
      url: `${BASE_URL}${urlQ}`,
      params: { page },
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      },
    };

    const { data } = await axios.request(options);
    return data;
  },

  getGenres: async () => {
    const options = {
      method: 'GET',
      url: `${BASE_URL}/genre/movie/list`,
      params: {},
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      },
    };
    const { data } = await axios.request(options);
    return data;
  },

  async sendMovieRate(movieId, rate) {
    const sessionId = getSessionId();
    const options = {
      method: 'POST',
      url: `${BASE_URL}/movie/${movieId}/rating`,
      params: { guest_session_id: sessionId },
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: BEARER_TOKEN,
      },
      data: JSON.stringify({
        value: rate,
      }),
    };
    const { data } = await axios.request(options);
    return data;
  },
};

function transformDate(str) {
  return moment(new Date(str)).format(`MMMM D, YYYY`);
}
export function transformFilmInfo(movie) {
  return {
    title: movie.title,
    description: movie.overview,
    average: movie.vote_average.toFixed(1),
    date: transformDate(movie.release_date),
    id: movie.id,
    posterImage: movie.poster_path
      ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
      : null,
    genreIds: movie.genre_ids,
    rating: movie.rating,
  };
}
export function transformRatedFilmInfo(movie) {
  return {
    title: movie.title,
    description: movie.overview,
    average: movie.vote_average.toFixed(1),
    date: transformDate(movie.release_date),
    id: movie.id,
    posterImage: movie.poster_path
      ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
      : null,
    genreIds: movie.genre_ids,
    rating: movie.rating,
  };
}

export const sessionId = async () => {
  try {
    const data = await moviesService.getGuestSessionId();
    setSessionId(data.guest_session_id);
  } catch ({ message }) {
    const errorMessage = generateError(message);
    toast.error(errorMessage);
  }
};

export const sendMovieRating = async (movieId, rate) => {
  try {
    const data = await moviesService.sendMovieRate(movieId, rate);
    return data;
  } catch ({ message }) {
    console.log(message);
    const errorMessage = generateError(message);
    toast.info(errorMessage);
  }
};

export default moviesService;
