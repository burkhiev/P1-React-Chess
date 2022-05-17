import { Cell } from './Cell';
import { ICell } from './interfaces/ICell';
import { IChessboard } from './interfaces/IChessboard';

export class Chessboard implements IChessboard {
    cells: ICell[][]

    constructor(cells: ICell[][]) {
        this.cells = cells
    }
}