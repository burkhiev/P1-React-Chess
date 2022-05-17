import React, { useState } from 'react';
import { Chessboard } from '../models/Chessboard';

export const ChessboardComponent = () => {
    const [chessboard, setChessboard] = useState(new Chessboard())
    const cells = chessboard.cells
    const content = cells.map((x, index) => {
        return (
            <div key={index}>
                {x.toString()}
            </div>
        )
    })

    return (
        <>
            {content}
        </>
    )
}