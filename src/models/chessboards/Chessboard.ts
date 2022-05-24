import { ICell } from '../cells/ICell';
import IChessboard from './IChessboard';

export default class Chessboard implements IChessboard {
  cells: ICell[][];

  get size(): number { return this.cells.length; }

  constructor(cells: ICell[][]) {
    this.cells = cells;
  }
}
