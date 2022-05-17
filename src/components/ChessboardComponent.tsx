import classNames from 'classnames';
import React, { useState } from 'react';
import { ChessboardFactory } from '../services/ChessboardFactory';
import CellComponent from './CellComponent';

export const ChessboardComponent = () => {
    const [chessboard, setChessboard] = useState(() => ChessboardFactory.getInitialState())

    const rowClasses = classNames(
        'row',
        'justify-content-center'
    )

    const contentArray = chessboard.cells.map((row, rowIndex) => {
        const result = (
            <div
                key={rowIndex}
                className={rowClasses}
            >
                {
                    row.map((cell, cellIndex) => {
                        return (
                            <CellComponent key={cellIndex} cell={cell} />
                        )
                    })
                }
            </div>
        )

        return result
    })

    return (
        <>
            {contentArray.map((renderedRow) => {
                return renderedRow
            })}
        </>
    )
}