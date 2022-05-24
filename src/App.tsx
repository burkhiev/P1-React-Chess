import React from 'react';
import classnames from 'classnames';

import ErrorBoundary from './components/shared/ErrorBoundary';
import ChessboardComponent from './components/chessboard/ChessboardComponent';

const classes = classnames(
  'container',
  'border',
  'my-5',
  'p-3',
  'pb-2',
);

export default function App() {
  return (
    <ErrorBoundary>
      <div className={classes}>
        <div className="row text-center mt-2 mb-4">
          <h1 className="display-3">React chess</h1>
        </div>
        <ChessboardComponent />
      </div>
    </ErrorBoundary>
  );
}
