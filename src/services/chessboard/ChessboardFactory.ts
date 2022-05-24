import Cell from '../../models/cells/Cell';
import Chessboard from '../../models/chessboards/Chessboard';
import Bishop from '../../models/figures/Bishop';
import King from '../../models/figures/King';
import Knight from '../../models/figures/Knight';
import Pawn from '../../models/figures/Pawn';
import Queen from '../../models/figures/Queen';
import Rook from '../../models/figures/Rook';
import { Colors } from '../enums/Colors';
import { ICell } from '../../models/cells/ICell';
import IChessboard from '../../models/chessboards/IChessboard';

export default class ChessboardFactory {
  private static size: number = 8;

  /**
     * Создает новую шахматную доску
     * @returns Новая подготовленная шахматная доска
     */
  static getNewBoard(): Chessboard {
    const chessboard = this.getClearBoard();

    this.fillWithBlackFigures(chessboard);
    this.fillWithWhiteFigures(chessboard);

    return chessboard;
  }

  /**
   * Заполняет указанную шахматную доску фигурами в специфичном порядке.
   * Данный метод используется для ручного тестирования.
   * @param chessboard Заполняемая шахматная доска.
   */
  private static specificFill(chessboard: IChessboard) {
    const { cells } = chessboard;

    cells[0][1].figure = new King(Colors.Black);
    cells[0][7].figure = new Rook(Colors.Black);
    cells[7][7].figure = new Rook(Colors.Black);

    cells[2][1].figure = new King(Colors.White);
  }

  /**
     * Создает чистую шахматную доску заполненную клетками
     * @returns шахматная доска
     */
  static getClearBoard(): Chessboard {
    const cells: ICell[][] = [];

    let colorCounter = 0;

    for (let i = 0; i < this.size; i += 1) {
      cells.push([]);

      for (let j = 0; j < this.size; j += 1) {
        let color = Colors.White;
        if (colorCounter % 2 === 1) {
          color = Colors.Black;
        }

        cells[i].push(new Cell(color, i, j));
        colorCounter += 1;
      }

      // меняем порядок покраски клеток
      colorCounter += 1;
    }

    return new Chessboard(cells);
  }

  /**
     * Заполняет белыми фигурами полученную доску
     * @param {Chessboard} chessboard Заполняемая доска
     */
  private static fillWithWhiteFigures(chessboard: IChessboard) {
    const { cells } = chessboard;

    // заполнение пешками
    const pawnRowIndex = 6;
    let row = cells[pawnRowIndex];

    for (let i = 0; i < this.size; i += 1) {
      row[i].figure = new Pawn(Colors.White);
    }

    // заполнение тяжелыми фигурами
    const heavyRowIndex = 7;
    row = cells[heavyRowIndex];

    row[0].figure = new Rook(Colors.White);
    row[1].figure = new Knight(Colors.White);
    row[2].figure = new Bishop(Colors.White);
    row[3].figure = new King(Colors.White);
    row[4].figure = new Queen(Colors.White);
    row[5].figure = new Bishop(Colors.White);
    row[6].figure = new Knight(Colors.White);
    row[7].figure = new Rook(Colors.White);
  }

  /**
     * Заполняет черными фигурами полученную доску
     * @param {Chessboard} chessboard Заполняемая доска
     */
  private static fillWithBlackFigures(chessboard: IChessboard) {
    const { cells } = chessboard;

    // заполнение пешками
    const pawnRowIndex = 1;
    let row = cells[pawnRowIndex];

    for (let i = 0; i < this.size; i += 1) {
      row[i].figure = new Pawn(Colors.Black);
    }

    // заполнение тяжелыми фигурами
    const heavyRowIndex = 0;
    row = cells[heavyRowIndex];

    row[0].figure = new Rook(Colors.Black);
    row[1].figure = new Knight(Colors.Black);
    row[2].figure = new Bishop(Colors.Black);
    row[3].figure = new King(Colors.Black);
    row[4].figure = new Queen(Colors.Black);
    row[5].figure = new Bishop(Colors.Black);
    row[6].figure = new Knight(Colors.Black);
    row[7].figure = new Rook(Colors.Black);
  }
}
