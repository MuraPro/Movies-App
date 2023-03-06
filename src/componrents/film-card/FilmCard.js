import React from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import 'antd/dist/reset.css';
import './FilmCard.css';
import FilmGeners from '../film-geners/FilmGenres';
import imageNotFound from '../../assets/images/image-not-found-scaled-1150x647.jpg';

function FilmCard({
  title,
  description,
  posterImage,
  date,
  id,
  average,
  genreIds,
  rating,
  rateMovie,
}) {
  const onRatingChange = (rate) => {
    rateMovie(id, rate);
  };

  const getAverageVoteColor = (voteAverage) => {
    if (voteAverage >= 0 && voteAverage < 3) return '#E90000';
    if (voteAverage >= 3 && voteAverage < 5) return '#E97E00';
    if (voteAverage >= 5 && voteAverage < 7) return '#E9D100';
    if (voteAverage >= 7) return '#66E900';
    return '#000000';
  };

  const items = genreIds.map(({ name }) => {
    return <FilmGeners key={name} name={name} />;
  });

  const img = posterImage || imageNotFound;
  const text =
    description ||
    'description not found...  description not found...  description not found... description not found...  ';

  return (
    <li className="Card" key={id}>
      <div className="CardBody">
        <div className="CardItem1">
          <a href="!#">
            <img src={img} alt="Img" />
          </a>
        </div>
        <div className="CardItem2">
          <h1>{title}</h1>
          <span>{date}</span>
          <ul className="CardTitleList">{items}</ul>
        </div>
        <div className="CardItem3">
          <p>{text}</p>
        </div>
        <div className="CardItem4">
          <Rate count={10} value={rating} onChange={onRatingChange} rateMovie={rateMovie} />
        </div>
      </div>
      <div className="Rating">
        <span style={{ border: `2px solid ${getAverageVoteColor(average)}` }}>{average}</span>
      </div>
    </li>
  );
}

FilmCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  posterImage: PropTypes.string,
  date: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  average: PropTypes.string.isRequired,
};

FilmCard.defaultProps = {
  posterImage: null,
};

export default FilmCard;
