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

    const content = chessboard.cells.map((row, rowIndex) => {
        const result = (
            <div
                key={rowIndex}
                className={rowClasses}>
            {
                row.map((cell, cellIndex) => {
                    return (
                        <CellComponent key={cellIndex} />
                    )
                })
            }
            </div>
        )

        return result
    })

    return (
        <>
            {content}
        </>
    )
}