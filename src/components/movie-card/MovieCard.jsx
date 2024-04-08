import React, { useState } from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import FilmGeners from '../ui/Geners/FilmGenres';
import imageNotFound from '../../assets/images/image-not-found-scaled-1150x647.jpg';
import { getAverageVoteColor } from '../../utils/transform-data';
import { useDispatch } from 'react-redux';
import { onRatedMovies } from '../../store/movies';
import './MovieCard.css';

export function MovieCard({
  title,
  description,
  posterImage,
  date,
  id,
  average,
  rateMovie,
  genreIds,
  rating,
  index,
}) {
  const dispatch = useDispatch();
  const [isRated, setIsRated] = useState(false);

  const handleChange = (rate) => {
    if (!isRated) {
      dispatch(onRatedMovies(id, rate));
      setIsRated(true);
    }
  };

  const img = posterImage || imageNotFound;
  const text =
    description ||
    'description not found...  description not found...  description not found... description not found...  ';
  return (
    <li className={`Card movie-card fade-in delay-${index + 1}`} key={id}>
      <div className='CardBody'>
        <div className='CardItem1'>
          <a href='!#'>
            <img src={img} alt='Img' />
          </a>
        </div>
        <div className='CardItem2'>
          <h1>{title}</h1>
          <span>{date}</span>
          <FilmGeners genreIds={genreIds} />
        </div>
        <div className='CardItem3'>
          <p>{text}</p>
        </div>
        <div className='CardItem4'>
          <Rate
            count={10}
            value={rating}
            onChange={handleChange}
            rateMovie={rateMovie}
          />
        </div>
      </div>
      <div className='Rating'>
        <span style={{ border: `2px solid ${getAverageVoteColor(average)}` }}>
          {average}
        </span>
      </div>
    </li>
  );
}

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  posterImage: PropTypes.string,
  date: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  average: PropTypes.string.isRequired,
  rate: PropTypes.number,
  rateMovie: PropTypes.func,
  genreIds: PropTypes.array,
  rating: PropTypes.number,
  index: PropTypes.number,
};

MovieCard.defaultProps = {
  posterImage: null,
};
