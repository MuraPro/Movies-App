import React, { Component } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

import './FilmsPagination.css';

class FilmsPagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };
  }

  onChangeHandle = (page) => {
    const { getMovies, query } = this.props;
    this.setState({ page });
    getMovies(query, page);
  };

  render() {
    const { totalDataItems } = this.props;
    const { page } = this.state;
    return (
      <div className="paginationArea">
        <Pagination
          total={totalDataItems > 10000 ? 10000 : totalDataItems}
          pageSize="20"
          showSizeChanger={false}
          onChange={this.onChangeHandle}
          hideOnSinglePage
          current={page}
          defaultCurrent={1}
        />
      </div>
    );
  }
}

FilmsPagination.propTypes = {
  totalDataItems: PropTypes.number,
  getMovies: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

FilmsPagination.defaultProps = {
  totalDataItems: 1,
};

export default FilmsPagination;
