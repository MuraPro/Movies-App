import React from 'react';
import './FilmGenres.css';
function FilmGeners({ genreIds }) {
  const items = genreIds.map(({ name }) => {
    return <li key={name}>{name}</li>;
  });

  return <ul className='CardTitleList'>{items}</ul>;
}

export default FilmGeners;
