import Cell from '../models/Cell';
import Chessboard from '../models/Chessboard';
import Bishop from '../models/figures/Bishop';
import King from '../models/figures/King';
import Knight from '../models/figures/Knight';
import Pawn from '../models/figures/Pawn';
import Queen from '../models/figures/Queen';
import Rook from '../models/figures/Rook';
import { Colors } from './Colors';
import { ICell } from '../models/interfaces/ICell';

export default class ChessboardFactory {
  private static size: number = 8;

  /**
     * Создает новую шахматную доску
     * @returns Новая подготовленная шахматная доска
     */
  static getNewBoard(): Chessboard {
    const chessboard = this.getClearBoard();

    this.fillWithWhiteFigures(chessboard);
    this.fillWithBlackFigures(chessboard);
    this.setDefaultActions(chessboard);

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
     * Заполняет белыми фигурами полученную доску
     * @param {Chessboard} chessboard Заполняемая доска
     */
  private static fillWithWhiteFigures(chessboard: Chessboard) {
    const color = Colors.White;
    const { cells } = chessboard;

    // заполнение пешками
    const pawnRowIndex = 6;
    let row = cells[pawnRowIndex];

    for (let i = 0; i < this.size; i += 1) {
      row[i].figure = new Pawn(color);
    }

    // заполнение тяжелыми фигурами
    const heavyRowIndex = 7;
    row = cells[heavyRowIndex];

    row[0].figure = new Rook(color);
    row[1].figure = new Knight(color);
    row[2].figure = new Bishop(color);
    row[3].figure = new King(color);
    row[4].figure = new Queen(color);
    row[5].figure = new Bishop(color);
    row[6].figure = new Knight(color);
    row[7].figure = new Rook(color);
  }

  /**
     * Заполняет черными фигурами полученную доску
     * @param {Chessboard} chessboard Заполняемая доска
     */
  private static fillWithBlackFigures(chessboard: Chessboard) {
    const color = Colors.Black;
    const { cells } = chessboard;

    // заполнение пешками
    const pawnRowIndex = 1;
    let row = cells[pawnRowIndex];

    for (let i = 0; i < this.size; i += 1) {
      row[i].figure = new Pawn(color);
    }

    // заполнение тяжелыми фигурами
    const heavyRowIndex = 0;
    row = cells[heavyRowIndex];

    row[0].figure = new Rook(color);
    row[1].figure = new Knight(color);
    row[2].figure = new Bishop(color);
    row[3].figure = new King(color);
    row[4].figure = new Queen(color);
    row[5].figure = new Bishop(color);
    row[6].figure = new Knight(color);
    row[7].figure = new Rook(color);
  }

  private static setDefaultActions(chessboard: Chessboard) {
    const cells = chessboard.cells;

    for (let i = 0; i < cells.length; i += 1) {
      const row = cells[i];
      
      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];

        cell.onAction = chessboard.setDefaultCellsState;
      }
    }
  }
}
