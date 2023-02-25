import React, { Component } from 'react';
import Error from '../Error/Error';

class ErrorBoundry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return <Error />;
    }
    return children;
  }
}

export default ErrorBoundry;
