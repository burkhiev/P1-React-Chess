import React from 'react';
import classnames from 'classnames';

import ErrorBoundary from './services/ErrorBoundary';
import ChessboardComponent from './components/ChessboardComponent';

const classes = classnames(
  'container',
  'border',
  'border-1',
  'mt-5',
  'p-2',
  'bg-light',
);

export default function App() {
  return (
    <ErrorBoundary>
      <div className={classes}>
        <ChessboardComponent />
      </div>
    </ErrorBoundary>
  );
}
