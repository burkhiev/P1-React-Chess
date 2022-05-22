import Chessboard from '../models/Chessboard';
import { ICell } from '../models/interfaces/ICell';
import { ChessProcessPredicate, Action } from '../globals';
import { FigureNames } from './enums/FigureNames';
import Pawn from '../models/figures/Pawn';
import { Colors } from './enums/Colors';
import { CellStatus } from './enums/CellStates';

export default class ChessMovesManager {
  private chessboard: Chessboard;

  constructor(chessboard: Chessboard) {
    this.chessboard = chessboard;

    this.processVerticalAndHorizontalSteps = this.processVerticalAndHorizontalSteps.bind(this);
    this.processDiagonalSteps = this.processDiagonalSteps.bind(this);

    this.processRookSteps = this.processRookSteps.bind(this);
    this.processBishopSteps = this.processBishopSteps.bind(this);
    this.processQueenSteps = this.processQueenSteps.bind(this);
    this.processKnightSteps = this.processKnightSteps.bind(this);
    this.processKingSteps = this.processKingSteps.bind(this);
    this.processPawnSteps = this.processPawnSteps.bind(this);

    this.setOnMoveAction = this.setOnMoveAction.bind(this);
    this.canMoveFromCell = this.canMoveFromCell.bind(this);
    this.doEnemyReachesSpecialCell = this.doEnemyReachesSpecialCell.bind(this);
    this.isEnemies = this.isEnemies.bind(this);
    this.isTeammates = this.isTeammates.bind(this);
    this.findKingCell = this.findKingCell.bind(this);
  }

  /**
   * Выполняет необходимые действия для клетки, при перемещении фигуры.
   * @param from Клетка, из которой движется фигура.
   * @param to Клетка, в которую фигура движется.
   * @param options (Необязательный параметр) Хранит в себе действия, которые могут выполняться
   * перед или после передвижения фигуры
   */
  setOnMoveAction(
    from: ICell,
    to: ICell,
    options?: {
            preMoveAction?: () => void,
            postMoveAction?: () => void,
        },
  ) {
    if (this.isTeammates(from, to)) {
      throw new Error('You cannot go to an friendly occupied cell.');
    }

    // Для Короля необходимо убедиться в безопасности хода.
    if (from.figure && from.figure?.figureName === FigureNames.King) {
      const { color } = from.figure;
      const enemyColor = color === Colors.White ? Colors.Black : Colors.White;

      if (this.doEnemyReachesSpecialCell(to, enemyColor, from)) {
        // Король не в безопасности, поэтому не устанавливаем никакого действия.
        return;
      }
    }

    if (to.figure) {
      to.status = CellStatus.Target;
    } else {
      to.status = CellStatus.OnWay;
    }

    // без деконструкции, т.к. options может быть пустым
    let preMoveAction: Action | undefined;
    let postMoveAction: Action | undefined;

    if (options) {
      preMoveAction = options.preMoveAction;
      postMoveAction = options.postMoveAction;
    }

    to.onAction = () => {
      if (preMoveAction) {
        preMoveAction();
      }

      to.figure = from.figure;
      from.figure = undefined;

      if (to.figure?.figureName === FigureNames.Pawn) {
        (<Pawn>to.figure).moved = true;
      }

      if (postMoveAction) {
        postMoveAction();
      }
    };
  }

  /**
   * Проверяет, может ли фигура на указанной клетке потенциально совершить любой ход
   * (вне зависимости от цвета текущей команды).
   * @param cell Проверяемая клетка.
   * @returns Если фигура на указанной клетке потенциально может сделать ход,
   * то возвращает true, иначе - false.
   */
  canMoveFromCell(cell: ICell): boolean {
    if (!cell.figure) {
      return false;
    }

    const enemyColor = cell.figure.color === Colors.Black ? Colors.White : Colors.Black;

    // Для записи результата обработчики снизу используют в данную переменную.
    let canMove = false;

    if (cell.figure.figureName === FigureNames.King) {
      // Обработка клетки с королём

      // Рассматриваем все клетки вокруг короля. Находятся ли они под ударом?
      const processFreePlaceAroundKing: ChessProcessPredicate = (king: ICell, nearKing: ICell) => {
        // Если в клетке рядом стоит союзник, то её необходимо пропустить.
        if (this.isTeammates(king, nearKing)) {
          return true;
        }

        // Проверка, безопасна ли указанная клетка
        const cellIsSafe = !this.doEnemyReachesSpecialCell(nearKing, enemyColor, king);

        if (cellIsSafe) {
          canMove = true;
          return false; // прерываем обработку
        }
        return true;
      };

      this.processKingSteps(cell, enemyColor, processFreePlaceAroundKing);
    } else {
      // Обработка все остальных клеток
      const processCanMove: ChessProcessPredicate = (currentCell: ICell, nextCell: ICell) => {
        if (!this.isTeammates(currentCell, nextCell)) {
          canMove = true;
          return false; // прерываем обработку
        }
        return true;
      };

      switch (cell.figure.figureName) {
        case FigureNames.Rook:
          this.processRookSteps(cell, enemyColor, processCanMove);
          break;
        case FigureNames.Knight:
          this.processKnightSteps(cell, enemyColor, processCanMove);
          break;
        case FigureNames.Bishop:
          this.processDiagonalSteps(cell, enemyColor, processCanMove);
          break;
        case FigureNames.Queen:
          this.processQueenSteps(cell, enemyColor, processCanMove);
          break;
        case FigureNames.Pawn:
          this.processPawnSteps(cell, enemyColor, processCanMove);
          break;
        default:
          throw new Error('Unknown FigureName value.');
      }
    }

    return canMove;
  }

  /**
     * Проверяет клетку на доступность для фигур указанного цвета.
     * Фигура, которая находится в клетке, указанной 1-ым параметром,
     * не учитывается.
     * @param cell Клетка, проверяемая на доступность.
     * @param enemyColor Цвет фигур.
     * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
     * Используется для корректного расчета безопасного хода короля,
     * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
     * @returns true, если хотя бы одна фигура указанного цвета достает клетку. false - если нет.
     */
  doEnemyReachesSpecialCell(
    cell: ICell,
    enemyColor: Colors,
    ignoredCell?: ICell,
  ): boolean {
    if (!cell || !enemyColor) {
      throw new Error('Parameters cannot be null or undefined.');
    }

    let enemyFound = false;

    // Поиск по горизонтали и вертикали.
    // Поиск ведётся по всей длине, поэтому короли рассматриваются отдельно.
    const findEnemyRooksAndQueens: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      const enemyReach = next.figure?.color === enemyColor
                && (
                  next.figure?.figureName === FigureNames.Rook
                    || next.figure?.figureName === FigureNames.Queen
                );

      if (enemyReach) {
        enemyFound = true;
        return false; // прерывание поиска
      }
      return true;
    };

    this.processVerticalAndHorizontalSteps(
      cell,
      enemyColor,
      findEnemyRooksAndQueens,
      ignoredCell,
    );
    if (enemyFound) {
      return true;
    }

    // Поиск по диагонали
    // Поиск ведётся по всей длине, поэтому пешки и короли рассматриваются отдельно.
    const findEnemyBishopsAndQueens: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      const enemyReach = next.figure?.color === enemyColor
                && (
                  next.figure?.figureName === FigureNames.Bishop
                    || next.figure?.figureName === FigureNames.Queen
                );

      if (enemyReach) {
        enemyFound = true;
        return false; // прерывание поиска
      }
      return true;
    };

    this.processDiagonalSteps(
      cell,
      enemyColor,
      findEnemyBishopsAndQueens,
      ignoredCell,
    );
    if (enemyFound) {
      return true;
    }

    // Поиск Королей
    const findEnemyKings: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      const enemyReach = next.figure?.color === enemyColor
                && next.figure?.figureName === FigureNames.King;

      if (enemyReach) {
        enemyFound = true;
        return false; // прерывание поиска
      }
      return true;
    };

    this.processKingSteps(
      cell,
      enemyColor,
      findEnemyKings,
    );
    if (enemyFound) {
      return true;
    }

    // Поиск Коней
    const findEnemyKnights: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      if (next.figure?.color === enemyColor && next.figure?.figureName === FigureNames.Knight) {
        enemyFound = true;
        return false; // прерывание поиска
      }
      return true;
    };

    this.processKnightSteps(
      cell,
      enemyColor,
      findEnemyKnights,
    );
    if (enemyFound) {
      return true;
    }

    // Поиск Пешек
    const isDirValid = (q: number) => q >= 0 && q < this.chessboard.size;
    const { cells } = this.chessboard;

    // Случай с белыми пешками
    if (enemyColor === Colors.White) {
      // Смотрим пешку слева наверху
      let row = cell.row - 1;
      let col = cell.col - 1;

      if (isDirValid(row) && isDirValid(col)) {
        const leftUpperCell = cells[row][col];

        if (leftUpperCell.figure && leftUpperCell.figure.color === enemyColor) {
          enemyFound = true;
        }
      }

      if (!enemyFound) {
        // Смотрим пешку справа наверху
        row = cell.row - 1;
        col = cell.col + 1;

        if (isDirValid(row) && isDirValid(col)) {
          const rightUpperCell = cells[row][col];

          if (rightUpperCell.figure && rightUpperCell.figure.color === enemyColor) {
            enemyFound = true;
          }
        }
      }

      // Случай с черными пешками
    } else {
      // Смотрим пешку слева снизу
      let row = cell.row + 1;
      let col = cell.col - 1;

      if (isDirValid(row) && isDirValid(col)) {
        const leftLowerCell = cells[row][col];

        if (leftLowerCell.figure && leftLowerCell.figure.color === enemyColor) {
          enemyFound = true;
        }
      }

      if (!enemyFound) {
        // Смотрим пешку справа внизу
        row = cell.row + 1;
        col = cell.col + 1;

        if (isDirValid(row) && isDirValid(col)) {
          const rightLowerCell = cells[row][col];

          if (rightLowerCell.figure && rightLowerCell.figure.color === enemyColor) {
            enemyFound = true;
          }
        }
      }
    }

    return enemyFound;
  }

  /**
     * Выполняет поиск короля указанного цвета.
     * @param color Цвет искомого короля.
     * @returns Клетка с королём.
     */
  findKingCell(color: Colors): ICell {
    const { cells } = this.chessboard;

    for (let i = 0; i < cells.length; i += 1) {
      const row = cells[i];

      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];
        const { figure } = cell;

        const kingFound = figure
                    && figure.figureName === FigureNames.King
                    && figure.color === color;

        if (kingFound) {
          return cell;
        }
      }
    }

    throw new Error('All Kings must be on the chessboard.');
  }

  /**
     * Определяет враждебность клеток, в зависимости от находящихся на них фигур.
     * @param from Первая клетка
     * @param to Вторая клетка
     * @returns Если на клетках стоят фигуры из противоположных команд,
     * то возвращает true. Иначе - false.
     */
  isEnemies(first: ICell, second: ICell) {
    return first.figure && second.figure && first.figure.color !== second.figure.color;
  }

  /**
     * Определяет дружелюбность клеток, в зависимости от находящихся на них фигур.
     * @param from Первая клетка
     * @param to Вторая клетка
     * @returns Если на клетках стоят фигуры из одной команды,
     * то возвращает true. Иначе - false.
     */
  isTeammates(first: ICell, second: ICell) {
    return (first.figure && second.figure && first.figure.color === second.figure.color);
  }

  /**
     * Отмечает доступные для Ладьи клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  processRookSteps(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
    this.processVerticalAndHorizontalSteps(cell, enemyColor, process);
  }

  /**
     * Отмечает доступные для Ладьи клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  processBishopSteps(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
    this.processDiagonalSteps(cell, enemyColor, process);
  }

  /**
     * Отмечает доступные для Ферзя клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  processQueenSteps(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
    this.processVerticalAndHorizontalSteps(cell, enemyColor, process);
    this.processDiagonalSteps(cell, enemyColor, process);
  }

  /**
     * Отмечает доступные для Коня клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  processKnightSteps(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
    const { size, cells } = this.chessboard;
    const { row, col } = cell;

    const directions = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
    const isDirValid = (q: number) => q >= 0 && q < size;

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      const nextRow = row + rowD;
      const nextCol = col + colD;

      if (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!nextCell.figure || enemyColor === nextCell.figure.color) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }
      }
    }
  }

  /**
     * Отмечает доступные для Короля клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  processKingSteps(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
    const { size, cells } = this.chessboard;
    const { row, col } = cell;

    const directions = [
      [1, 1], [1, 0], [1, -1],
      [0, 1], [0, -1],
      [-1, 1], [-1, 0], [-1, -1],
    ];
    const isDirValid = (q: number) => q >= 0 && q < size;

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      const nextRow = row + rowD;
      const nextCol = col + colD;

      if (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!nextCell.figure || enemyColor === nextCell.figure.color) {
          // const isCellDanger = this.doEnemyFiguresReachSpecialCell(nextCell, )

          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }
      }
    }
  }

  /**
     * Отмечает доступные для Пешки клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  processPawnSteps(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
    const isNotPawn = !(cell.figure && cell.figure.figureName === FigureNames.Pawn);
    if (isNotPawn) {
      return;
    }

    const { size, cells } = this.chessboard;
    const { row, col } = cell;
    const { color, moved } = (<Pawn>cell.figure)!;

    let nextRow = row + (enemyColor === Colors.White ? 1 : -1);
    let nextCol = col;

    const isDirValid = (q: number) => q >= 0 && q < size;

    if (isDirValid(nextRow) && isDirValid(nextCol)) {
      let nextCell = cells[nextRow][nextCol];

      if (nextCell.isEmpty) {
        const canContinue = process(cell, nextCell);

        if (!canContinue) return;
      }

      // если пешка не ходила и перед ней никого нет,
      // то есть возможность перешагнуть клетку.
      if (!moved && nextCell.isEmpty) {
        nextRow = row + (enemyColor === Colors.White ? 2 : -2);
        nextCol = col;

        // без проверки. если пешка не ходила, значит мы в начальной позиции.
        nextCell = cells[nextRow][nextCol];

        if (nextCell.isEmpty) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }
      }
    }

    // смотрим противника слева
    nextCol = col + 1;
    nextRow = row + (enemyColor === Colors.White ? 1 : -1);

    if (isDirValid(nextRow) && isDirValid(nextCol)) {
      const nextCell = cells[nextRow][nextCol];

      if (nextCell.figure && enemyColor === nextCell.figure.color) {
        const canContinue = process(cell, nextCell);

        if (!canContinue) return;
      }
    }

    // смотрим противника справа
    nextCol = col - 1;
    nextRow = row + (color === Colors.White ? -1 : 1);

    if (isDirValid(nextRow) && isDirValid(nextCol)) {
      const nextCell = cells[nextRow][nextCol];

      if (nextCell.figure && enemyColor === nextCell.figure.color) {
        process(cell, nextCell);

        // Проверка отсутствует, т.к. мы не в цикле
        // const canContinue = process(cell, nextCell);
        // if (!canContinue)
        //   return;
      }
    }
  }

  /**
     * Отмечает доступные по вертикали и горизонтали клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод обработчик.
     * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
     * Используется для корректного расчета безопасного хода короля,
     * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  private processVerticalAndHorizontalSteps(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
    const { size, cells } = this.chessboard;
    const { row, col } = cell;

    const isDirValid = (q: number) => q >= 0 && q < size;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      let nextRow = row + rowD;
      let nextCol = col + colD;

      while (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!nextCell.figure || enemyColor === nextCell.figure.color) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }

        if (nextCell.figure && nextCell !== ignoredCell) {
          break;
        }

        nextRow += rowD;
        nextCol += colD;
      }
    }
  }

  /**
     * Отмечает доступные по диагонали клетки.
     * Клетка указанная 1-ым параметром не учитывается.
     * @param cell Клетка, из которой ищем ходы.
     * @param enemyColor Цвет противника. Данный параметр используется
     * для расчета пути из клетки, в которой стоит противник.
     * @param process Метод, обрабатывающий любые 2 клетки.
     * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
     * Используется для корректного расчета безопасного хода короля,
     * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
     * Если нужно прервать обработку возвращает false, иначе - true.
     */
  private processDiagonalSteps(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
    const { size, cells } = this.chessboard;
    const { row, col } = cell;

    const isDirValid = (q: number) => q >= 0 && q < size;
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      let nextRow = row + rowD;
      let nextCol = col + colD;

      while (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!nextCell.figure || enemyColor === nextCell.figure.color) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }

        if (nextCell.figure && nextCell !== ignoredCell) {
          break;
        }

        nextRow += rowD;
        nextCol += colD;
      }
    }
  }
}
