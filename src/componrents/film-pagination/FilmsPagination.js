import React, { Component } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import './FilmsPagination.css';

class FilmsPagination extends Component {
  setPage = (page) => {
    const { onPageChange } = this.props;
    onPageChange(page);
  };

  onChangeHandle = (page) => {
    const { getDataMovies, query } = this.props;
    getDataMovies(query, page);
    this.setPage(page);
  };

  render() {
    const { totalDataItems, page } = this.props;
    return (
      <div className="paginationArea">
        <Pagination
          total={totalDataItems > 10000 ? 10000 : totalDataItems}
          pageSize="20"
          showSizeChanger={false}
          onChange={this.onChangeHandle}
          hideOnSinglePage
          current={page}
          defaultCurrent={page}
        />
      </div>
    );
  }
}

FilmsPagination.propTypes = {
  totalDataItems: PropTypes.number,
  getDataMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

FilmsPagination.defaultProps = {
  totalDataItems: 1,
};

export default FilmsPagination;
