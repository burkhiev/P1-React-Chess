import { ICell } from './interfaces/ICell';
import { IChessboard } from './interfaces/IChessboard';

export default class Chessboard implements IChessboard {
  cells: ICell[][];

  constructor(cells: ICell[][]) {
    this.cells = cells;
  }
}
