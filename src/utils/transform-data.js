import moment from 'moment';

export const getAverageVoteColor = (voteAverage) => {
  if (voteAverage >= 0 && voteAverage < 3) return '#E90000';
  if (voteAverage >= 3 && voteAverage < 5) return '#E97E00';
  if (voteAverage >= 5 && voteAverage < 7) return '#E9D100';
  if (voteAverage >= 7) return '#66E900';
  return '#000000';
};

export function assignGenres(arr, genres) {
  arr.forEach((movie) => {
    movie.genreIds.forEach((genreId, index) => {
      const foundGenre = genres.find((genre) => genre.id === genreId);
      if (foundGenre) {
        movie.genreIds[index] = { id: genreId, name: foundGenre.name };
      }
    });
  });
  return arr;
}

export function updateMoviesRating(moviesList, ratedMovies) {
  moviesList.forEach((movie) => {
    const ratedMovie = ratedMovies.find(
      (ratedMovie) => ratedMovie.id === movie.id
    );
    if (ratedMovie) {
      movie.rating = ratedMovie.rating;
    }
  });

  return moviesList;
}

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
