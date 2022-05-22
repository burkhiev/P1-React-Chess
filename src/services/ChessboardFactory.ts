import Cell from '../models/Cell';
import Chessboard from '../models/Chessboard';
import Bishop from '../models/figures/Bishop';
import King from '../models/figures/King';
import Knight from '../models/figures/Knight';
import Pawn from '../models/figures/Pawn';
import Queen from '../models/figures/Queen';
import Rook from '../models/figures/Rook';
import { Colors } from './enums/Colors';
import { ICell } from '../models/interfaces/ICell';

import { IS_TEST } from '../globals';

export default class ChessboardFactory {
  private static size: number = 8;

  /**
     * Создает новую шахматную доску
     * @returns Новая подготовленная шахматная доска
     */
  static getNewBoard(): Chessboard {
    const chessboard = this.getClearBoard();

    if (IS_TEST) {
      this.specificFill(chessboard);
    } else {
      this.fillWithWhiteFigures(chessboard);
      this.fillWithBlackFigures(chessboard);
    }

    return chessboard;
  }

  /**
     * Создает чистую шахматную доску заполненную клетками
     * @returns шахматная доска
     */
  private static getClearBoard(): Chessboard {
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
   * Специальный заполнитель. Служит для целей тестирования.
   * @param chessboard шахматная доска
   */
  private static specificFill(chessboard: Chessboard) {
    const { cells } = chessboard;

    // chessboard.currentMove.color = Colors.Black;

    cells[0][1].figure = new King(Colors.Black);

    cells[2][0].figure = new King(Colors.White);
    cells[1][2].figure = new Rook(Colors.White);
    cells[2][2].figure = new Rook(Colors.White);
  }

  /**
     * Заполняет белыми фигурами полученную доску
     * @param {Chessboard} chessboard Заполняемая доска
     */
  private static fillWithWhiteFigures(chessboard: Chessboard) {
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
  private static fillWithBlackFigures(chessboard: Chessboard) {
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
