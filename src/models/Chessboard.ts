import { Cell } from './Cell';
import { ICell } from './interfaces/ICell';
import { IChessboard } from './interfaces/IChessBoard';

export class Chessboard implements IChessboard {
    cells: ICell[][]

    constructor() {
        const size = 12
        const cells: ICell[][] = []

        for (let i = 0; i < size; i++) {
            cells.push([])
            const row = cells[i];
            
            for (let j = 0; j < size; j++) {
                row.push(new Cell())
            }
        }

        this.cells = cells
    }
}