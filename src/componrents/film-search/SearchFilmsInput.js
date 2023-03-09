import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { debounce } from 'lodash';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import Error from '../Error';
import 'antd/dist/reset.css';
import './SearchFilmsInput.css';

class SearchFilmInput extends Component {
  debouncedFetching = debounce((query, page) => {
    const { getDataMovies, setQuery } = this.props;
    setQuery(query);
    getDataMovies(query, page);
  }, 500);

  constructor() {
    super();
    this.state = {
      inputValue: '',
    };
  }

  onChangeHandle = (e) => {
    this.debouncedFetching(e.target.value, 1);
    this.setState({ inputValue: e.target.value });
  };

  render() {
    const { inputValue } = this.state;
    const { hasError } = this.props;

    const content = hasError ? (
      <Error />
    ) : (
      <Input
        placeholder="Type to search..."
        value={inputValue}
        className="SearchFilmInput"
        size="large"
        onChange={this.onChangeHandle}
      />
    );

    return <ErrorBoundary>{content}</ErrorBoundary>;
  }
}

SearchFilmInput.propTypes = {
  getDataMovies: PropTypes.func.isRequired,
  setQuery: PropTypes.func.isRequired,
};

export default SearchFilmInput;
