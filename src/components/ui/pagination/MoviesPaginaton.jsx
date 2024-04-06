import { useMovies } from '../../../hooks/useMovies';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import './MoviesPagination.css';

export const MoviesPagination = ({ page }) => {
  const { totalPages, onPageChange } = useMovies();
  return (
    <div className='paginationArea'>
      <Pagination
        total={totalPages > 10000 ? 10000 : totalPages}
        pageSize='10'
        showSizeChanger={false}
        onChange={onPageChange}
        hideOnSinglePage
        current={page}
        defaultCurrent={1}
      />
    </div>
  );
};

MoviesPagination.propTypes = {
  page: PropTypes.number,
};
