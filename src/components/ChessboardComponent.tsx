import React, { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';

import CellComponent from './CellComponent';
import ChessboardFactory from '../services/ChessboardFactory';

export default function ChessboardComponent() {
  const [chessboard] = useState(ChessboardFactory.getNewBoard());
  const rowClasses = classNames(
    'd-flex',
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
            <CellComponent
              key={nanoid()}
              cell={cell}
              onSelect={() => chessboard.onAction(cell)}
            />
          ))
        }
      </div>
    );

    return result;
  });

  return (
    <div className="p-2">
      {contentArray.map((renderedRow) => renderedRow)}
    </div>
  );
}
