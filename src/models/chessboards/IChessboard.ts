import { ICell } from '../cells/ICell';

export default interface IChessboard {
  /** Все клетки доски в виде матрицы */
  cells: ICell[][];

  /** Размер стороны доски. Предполагается, что доска квадратная. */
  get size(): number;

// eslint-disable-next-line semi
}
