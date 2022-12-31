import React from 'react';

function FilmGeners({ name }) {
  return <li key={name}>{name}</li>;
}

export default FilmGeners;
