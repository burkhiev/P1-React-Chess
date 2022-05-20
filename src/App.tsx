import React from 'react';
import classnames from 'classnames';
import { Provider } from 'react-redux';

import ErrorBoundary from './components/ErrorBoundary';
import ChessboardComponent from './components/ChessboardComponent';
import store from './store';

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
      <Provider store={store}>
        <div className={classes}>
          <ChessboardComponent />
        </div>
      </Provider>
    </ErrorBoundary>
  );
}
