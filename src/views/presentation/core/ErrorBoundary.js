import React from 'react';
import { ErrorBuilding } from '../ErrorsPages/ErrorBuilding';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return <ErrorBuilding />;
    }
    return this.props.children;
  }
}
