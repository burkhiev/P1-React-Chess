import React from 'react';
import classnames from 'classnames';
import { Provider } from 'react-redux';

import ErrorBoundary from './components/ErrorBoundary';
import ChessboardComponent from './components/ChessboardComponent';
import store from './store';

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
      <Provider store={store}>
        <div className={classes}>
          <div className="row text-center mt-2 mb-4">
            <h1 className="display-3">React chess</h1>
          </div>
          <ChessboardComponent />
        </div>
      </Provider>
    </ErrorBoundary>
  );
}
