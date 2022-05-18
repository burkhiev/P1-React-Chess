import React, { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';

import ChessboardFactory from '../services/ChessboardFactory';
// import Chessboard from '../models/Chessboard';
import CellComponent from './CellComponent';

export default function ChessboardComponent() {
  const [chessboard] = useState(() => ChessboardFactory.getNewBoard());

  const rowClasses = classNames(
    'row',
    'justify-content-center',
  );

  const contentArray = chessboard.cells.map((row) => {
    const result = (
      <div
        key={nanoid()}
        className={rowClasses}
      >
        {
          row.map((cell) => (
            <CellComponent key={nanoid()} cell={cell} />
          ))
        }
      </div>
    );

    return result;
  });

  return (
    <>
      {contentArray.map((renderedRow) => renderedRow)}
    </>
  );
}
