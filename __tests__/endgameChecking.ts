// Отключение предупреждений для удобной работы с jest
/* eslint-disable no-undef */
import 'jest';

import ChessboardManager from '../src/services/chessboard/ChessboardManager';
import ChessboardFactory from '../src/services/chessboard/ChessboardFactory';
import { Colors } from '../src/services/enums/Colors';
import { ChessGameStates } from '../src/services/enums/ChessGameStates';

import { ICell } from '../src/models/cells/ICell';
import King from '../src/models/figures/King';
import Rook from '../src/models/figures/Rook';
import Cell from '../src/models/cells/Cell';
import Chessboard from '../src/models/chessboards/Chessboard';
import Bishop from '../src/models/figures/Bishop';

describe('Game end tests', () => {
  function getNewBoardMockImp() {
    const cells: ICell[][] = [];

    let colorCounter = 0;

    for (let i = 0; i < 8; i += 1) {
      cells.push([]);

      for (let j = 0; j < 8; j += 1) {
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

    const chessboard = new Chessboard(cells);
    return chessboard;
  }

  jest.spyOn(ChessboardFactory, 'getNewBoard').mockImplementation(getNewBoardMockImp);

  // Король под ударом, но не может убежать.
  test('Checkmate-1', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][0];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][1];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[1][2];
    whiteRookCell.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell); // кликаем на клетку с белой ладьей
    cells[0][2].action(); // перемещаем ладью на позицию [0][2]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Checkmate);
  });

  // Король под ударом фигуры, стоящей рядом с ним, но
  // он не может освободиться съев эту фигуру, т.к.
  // она находится под ударом другой.
  test('Checkmate-2', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][1];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][0];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell1 = cells[2][2];
    whiteRookCell1.figure = new Rook(Colors.White);

    const whiteRookCell2 = cells[1][2];
    whiteRookCell2.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell2); // кликаем на клетку с белой ладьей
    cells[0][2].action(); // перемещаем ладью на позицию [0][2]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Checkmate);
  });

  // Ситуация, когда фигура бьющая короля, не учитывает клетки стоящие за королем.
  // В следствие чего король может свободно туда пройти.
  test('Checkmate-3', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][1];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][1];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[1][4];
    whiteRookCell.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell); // кликаем на клетку с белой ладьей
    cells[0][4].action(); // перемещаем ладью на позицию [0][4]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Checkmate);
  });

  // Король под ударом, но он может пройти в свободную клетку.
  test('Check-1', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][1];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][0];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[2][2];
    whiteRookCell.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell); // кликаем на клетку с белой ладьей
    cells[2][1].action(); // перемещаем ладью на позицию [2][1]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Check);
  });

  // Король под ударом, но он может освободиться, съев фигуру, бьющую её.
  test('Check-2', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][0];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][0];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[2][1];
    whiteRookCell.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell); // кликаем на клетку с белой ладьей
    cells[0][1].action(); // перемещаем ладью на позицию [0][1]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Check);
  });

  // Король под ударом, но он может остаться в безопасности,
  // если любая союзная фигура может съесть бьющую короля.
  test('Check-3', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][0];
    blackKingCell.figure = new King(Colors.Black);

    const blackRookCell = cells[0][6];
    blackRookCell.figure = new Rook(Colors.Black);

    const whiteKingCell = cells[2][0];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[1][4];
    whiteRookCell.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell); // кликаем на клетку с белой ладьей
    cells[0][4].action(); // перемещаем ладью на позицию [0][4]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Check);
  });

  // Король не под ударом, но не может совершить ход.
  test('Mate-1', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][0];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][0];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[2][2];
    whiteRookCell.figure = new Rook(Colors.White);

    // act
    manager.onAction(whiteRookCell); // кликаем на клетку с белой ладьей
    cells[2][1].action(); // перемещаем ладью на позицию [2][1]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.Mate);
  });

  // Король не под ударом и есть возможность совершить ход.
  test('InProcess-1', () => {
    // arrange
    const manager = new ChessboardManager(ChessboardFactory.getNewBoard());
    const { cells } = manager;

    const blackKingCell = cells[0][1];
    blackKingCell.figure = new King(Colors.Black);

    const whiteKingCell = cells[2][0];
    whiteKingCell.figure = new King(Colors.White);

    const whiteRookCell = cells[2][2];
    whiteRookCell.figure = new Rook(Colors.White);

    const whiteBishopCell = cells[1][3];
    whiteBishopCell.figure = new Bishop(Colors.White);

    // act
    manager.onAction(whiteBishopCell); // кликаем на клетку с белым слоном
    cells[0][2].action(); // перемещаем слона на позицию [0][2]

    // assert
    expect(manager.gameInfo.gameState).toBe(ChessGameStates.InProcess);
  });
});
