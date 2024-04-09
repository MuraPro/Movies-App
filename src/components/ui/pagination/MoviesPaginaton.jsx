import { Pagination } from 'antd';
import './MoviesPagination.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentPage,
  getQuery,
  getTotalPages,
  onPageChange,
} from '../../../store/movies';

export const MoviesPagination = () => {
  const dispatch = useDispatch();
  const query = useSelector(getQuery());
  const currentPage = useSelector(getCurrentPage());
  const totalPages = useSelector(getTotalPages());

  const handleChange = (currentPage) => {
    dispatch(onPageChange(query, currentPage));
  };

  return (
    <div className='paginationArea'>
      <Pagination
        total={totalPages > 10000 ? 10000 : totalPages}
        pageSize='20'
        showSizeChanger={false}
        onChange={handleChange}
        hideOnSinglePage
        current={currentPage}
        defaultCurrent={1}
      />
    </div>
  );
};
