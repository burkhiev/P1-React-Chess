import { ICell } from './interfaces/ICell';

export default class Chessboard {
  /** Все клетки доски в виде матрицы */
  cells: ICell[][];

  /** Размер стороны доски. Предполагается, что доска квадратная. */
  get size(): number { return this.cells.length; }

  constructor(cells: ICell[][]) {
    this.cells = cells;
  }
}
