import React from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import 'antd/dist/reset.css';
import './FilmCard.css';
import FilmGeners from '../film-geners/FilmGenres';
import imageNotFound from '../../assets/images/image-not-found-scaled-1150x647.jpg';

function FilmCard({ title, description, posterImage, date, id, average, genreIds }) {
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
          <Rate count={10} />
        </div>
      </div>
      <div className="Rating">
        <span>{average}</span>
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
  average: PropTypes.string,
};

FilmCard.defaultProps = {
  average: 0,
  posterImage: null,
};

export default FilmCard;
