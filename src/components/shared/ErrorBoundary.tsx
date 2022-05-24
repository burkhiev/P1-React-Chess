import React from 'react';

interface IErrorBoundaryProps {
    children: any
}

interface IErrorBoundaryState {
    hasError: boolean
}

export default class ErrorBoundary extends
  React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
    console.error(info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (<h2>Что-то пошло не так ...</h2>);
    }

    return (
      <React.StrictMode>
        {children}
      </React.StrictMode>
    );
  }
}
