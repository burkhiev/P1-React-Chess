import Chessboard from '../../models/chessboards/Chessboard';
import { ICell } from '../../models/cells/ICell';
import { ChessProcessPredicate, Action } from '../../globals';
import { FigureNames } from '../../models/figures/FigureNames';
import Pawn from '../../models/figures/Pawn';
import { Colors } from '../enums/Colors';
import { CellStatus } from '../../models/cells/CellStates';

interface IMoveActionOptions {
  preMoveAction?: () => void,
  postMoveAction?: () => void,
}

/**
 * Данный класс отвечает за логику передвижения шахматных фигур
 */
export default class ChessMovesManager {
  /** Шахматная доска */
  private chessboard: Chessboard;

  /**
   * Устанавливает для текущего экземпляра класса указанную шахматную доску.
   * @param chessboard Шахматная доска.
   */
  setChessboard(chessboard: Chessboard) {
    if (!chessboard) {
      throw new Error('\'chessboard\' argument cannot be empty.');
    }

    this.chessboard = chessboard;
  }

  constructor(chessboard: Chessboard) {
    this.chessboard = chessboard;

    this.processForVerticalAndHorizontalPatterns = this
      .processForVerticalAndHorizontalPatterns.bind(this);
    this.processForDiagonalPatterns = this.processForDiagonalPatterns.bind(this);

    this.processForRookPatterns = this.processForRookPatterns.bind(this);
    this.processForBishopPatterns = this.processForBishopPatterns.bind(this);
    this.processForQueenPatterns = this.processForQueenPatterns.bind(this);
    this.processForKnightPatterns = this.processForKnightPatterns.bind(this);
    this.processForKingPatterns = this.processForKingPatterns.bind(this);
    this.processForPawnPatterns = this.processForPawnPatterns.bind(this);

    this.setOnMoveAction = this.setOnMoveAction.bind(this);
    this.canMoveFromCell = this.canMoveFromCell.bind(this);
    this.getReachingEnemyCells = this.getReachingEnemyCells.bind(this);
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
  setOnMoveAction(from: ICell, to: ICell, options?: IMoveActionOptions) {
    if (this.isTeammates(from, to)) {
      throw new Error('You cannot go to an friendly occupied cell.');
    }

    if (to.figure?.figureName === FigureNames.King) {
      // Короля нельзя бить.
      throw new Error('You couldn\'t set move action on cell which has the King.');
    }

    if (to.figure) {
      to.status = CellStatus.Target;
    } else {
      to.status = CellStatus.OnWay;
    }

    to.action = this.getOnMoveAction(from, to, options);
  }

  /**
   * Возвращает функцию, предназначающуюся для action поля экземпляра класса Cell.
   * Данная функция удобна для тестирования.
   * @param from Клетка, из которой движется фигура.
   * @param to Клетка, в которую фигура движется.
   * @param options (Необязательный параметр) Хранит в себе действия, которые могут выполняться
   * перед или после передвижения фигуры
   */
  getOnMoveAction(from: ICell, to: ICell, options?: IMoveActionOptions): () => void {
    // без деконструкции, т.к. options может быть пустым
    let preMoveAction: Action | undefined;
    let postMoveAction: Action | undefined;

    if (options) {
      preMoveAction = options.preMoveAction;
      postMoveAction = options.postMoveAction;
    }

    return () => {
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
   * @param origin Проверяемая клетка.
   * @returns Если фигура на указанной клетке потенциально может сделать ход,
   * то возвращает true, иначе - false.
   */
  canMoveFromCell(origin: ICell): boolean {
    if (!origin.figure) {
      return false;
    }

    const enemyColor = origin.figure.color === Colors.Black ? Colors.White : Colors.Black;

    // Для записи результата callback'и снизу используют в данную переменную.
    let canMove = false;

    if (origin.figure.figureName === FigureNames.King) {
      // Обработка клетки с королём

      // callback для обработки клеток вокруг короля.
      const processFreePlaceAroundKing: ChessProcessPredicate = (king: ICell, nearKing: ICell) => {
        // Если в клетке рядом стоит союзник, то её необходимо пропустить.
        if (this.isTeammates(king, nearKing)) {
          return true;
        }

        // Ищем противников, достающих обрабатываемую клетку
        const reachingEnemiesCells = this.getReachingEnemyCells(nearKing, enemyColor, king);

        // Если таковых нет - клетка свободна
        if (reachingEnemiesCells.length === 0) {
          canMove = true;
          return false; // прерываем обработку
        }

        return true;
      };

      this.processForKingPatterns(origin, enemyColor, processFreePlaceAroundKing);
    } else {
      // callback для обработки всех остальных клеток
      const processCanMove: ChessProcessPredicate = (currentCell: ICell, nextCell: ICell) => {
        if (!this.isTeammates(currentCell, nextCell)) {
          canMove = true;
          return false; // прерываем обработку
        }
        return true;
      };

      switch (origin.figure.figureName) {
        case FigureNames.Rook:
          this.processForRookPatterns(origin, enemyColor, processCanMove);
          break;
        case FigureNames.Knight:
          this.processForKnightPatterns(origin, enemyColor, processCanMove);
          break;
        case FigureNames.Bishop:
          this.processForDiagonalPatterns(origin, enemyColor, processCanMove);
          break;
        case FigureNames.Queen:
          this.processForQueenPatterns(origin, enemyColor, processCanMove);
          break;
        case FigureNames.Pawn:
          this.processForPawnPatterns(origin, enemyColor, processCanMove);
          break;
        default:
          throw new Error('Unknown FigureName value.');
      }
    }

    return canMove;
  }

  /**
   * Проверяет клетку на доступность для атаки фигурами указанного цвета.
   * Если одна из фигур указанного цвета, находится в клетке,
   * передаваемой 1-ым параметром, то она не учитывается.
   * @param cell Клетка, проверяемая на доступность для атаки.
   * @param enemyColor Цвет фигур.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно вражеских фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   * @returns Массив клеток, которые содержат фигуры цвета enemyColor,
   * а также способные достичь указанной клетки.
   */
  getReachingEnemyCells(cell: ICell, enemyColor: Colors, ignoredCell?: ICell): ICell[] {
    if (!cell || !enemyColor) {
      throw new Error('Parameters cannot be null or undefined.');
    }

    const foundedEnemyCells: ICell[] = [];

    // Поиск по горизонтали и вертикали.
    // Поиск ведётся по всей длине, поэтому короли рассматриваются отдельно.
    const findEnemyRooksAndQueens: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      const enemyReaches = next.figure?.color === enemyColor
                && (
                  next.figure?.figureName === FigureNames.Rook
                    || next.figure?.figureName === FigureNames.Queen
                );

      if (enemyReaches) {
        foundedEnemyCells.push(next);
      }
      return true;
    };

    this.processForVerticalAndHorizontalPatterns(
      cell,
      enemyColor,
      findEnemyRooksAndQueens,
      ignoredCell,
    );

    // Поиск по диагонали
    // Поиск ведётся по всей длине, поэтому пешки и короли рассматриваются отдельно.
    const findEnemyBishopsAndQueens: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      const enemyReaches = next.figure?.color === enemyColor
                && (
                  next.figure?.figureName === FigureNames.Bishop
                    || next.figure?.figureName === FigureNames.Queen
                );

      if (enemyReaches) {
        foundedEnemyCells.push(next);
      }
      return true;
    };

    this.processForDiagonalPatterns(
      cell,
      enemyColor,
      findEnemyBishopsAndQueens,
      ignoredCell,
    );

    // Поиск Королей
    const findEnemyKings: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      const enemyReaches = next.figure?.color === enemyColor
                && next.figure?.figureName === FigureNames.King;

      if (enemyReaches) {
        foundedEnemyCells.push(next);
      }
      return true;
    };

    this.processForKingPatterns(
      cell,
      enemyColor,
      findEnemyKings,
      ignoredCell,
    );

    // Поиск Коней
    const findEnemyKnights: ChessProcessPredicate = (origin: ICell, next: ICell) => {
      if (next.figure?.color === enemyColor && next.figure?.figureName === FigureNames.Knight) {
        foundedEnemyCells.push(next);
      }
      return true;
    };

    this.processForKnightPatterns(
      cell,
      enemyColor,
      findEnemyKnights,
    );

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
          foundedEnemyCells.push(leftUpperCell);
        }
      }

      // Смотрим пешку справа наверху
      row = cell.row - 1;
      col = cell.col + 1;

      if (isDirValid(row) && isDirValid(col)) {
        const rightUpperCell = cells[row][col];

        if (rightUpperCell.figure && rightUpperCell.figure.color === enemyColor) {
          foundedEnemyCells.push(rightUpperCell);
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
          foundedEnemyCells.push(leftLowerCell);
        }
      }

      // Смотрим пешку справа внизу
      row = cell.row + 1;
      col = cell.col + 1;

      if (isDirValid(row) && isDirValid(col)) {
        const rightLowerCell = cells[row][col];

        if (rightLowerCell.figure && rightLowerCell.figure.color === enemyColor) {
          foundedEnemyCells.push(rightLowerCell);
        }
      }
    }

    return foundedEnemyCells;
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
   * Обрабатывает доступные ходы для фигуры внутри указанной клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  processForCellsFigurePattern(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
    if (!cell.figure) {
      throw new Error('Cell should has a figure inside.');
    }

    switch (cell.figure.figureName) {
      case FigureNames.Rook:
        this.processForRookPatterns(cell, enemyColor, process, ignoredCell);
        break;
      case FigureNames.Knight:
        this.processForKnightPatterns(cell, enemyColor, process);
        break;
      case FigureNames.Bishop:
        this.processForBishopPatterns(cell, enemyColor, process, ignoredCell);
        break;
      case FigureNames.Queen:
        this.processForQueenPatterns(cell, enemyColor, process, ignoredCell);
        break;
      case FigureNames.King:
        this.processForKingPatterns(cell, enemyColor, process, ignoredCell);
        break;
      case FigureNames.Pawn:
        this.processForPawnPatterns(cell, enemyColor, process);
        break;
      default:
        throw new Error('Unknown FigureName');
    }
  }

  /**
   * Обрабатывает доступные для Ладьи клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  processForRookPatterns(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
    this.processForVerticalAndHorizontalPatterns(cell, enemyColor, process, ignoredCell);
  }

  /**
   * Обрабатывает предикатом process доступные для Ладьи клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  processForBishopPatterns(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
    this.processForDiagonalPatterns(cell, enemyColor, process, ignoredCell);
  }

  /**
   * Обрабатывает предикатом process доступные для Ферзя клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  processForQueenPatterns(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
    this.processForVerticalAndHorizontalPatterns(cell, enemyColor, process, ignoredCell);
    this.processForDiagonalPatterns(cell, enemyColor, process, ignoredCell);
  }

  /**
   * Обрабатывает предикатом process доступные для Коня клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   */
  processForKnightPatterns(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
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

        if (nextCell.isEmpty || enemyColor === nextCell.figure?.color) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }
      }
    }
  }

  /**
   * Обрабатывает предикатом process доступные для Короля клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  processForKingPatterns(
    cell: ICell,
    enemyColor: Colors,
    process: ChessProcessPredicate,
    ignoredCell?: ICell,
  ) {
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

        if (nextCell === ignoredCell) {
          continue;
        }

        if (nextCell.isEmpty || enemyColor === nextCell.figure?.color) {
          const canContinue = process(cell, nextCell);
          if (!canContinue) return;
        }
      }
    }
  }

  /**
   * Обрабатывает предикатом process доступные для Пешки клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути пешки, т.к. пешка имеет различное количество
   * вариантов ходов в зависимости от наличия противника в некоторых клетках.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   */
  processForPawnPatterns(cell: ICell, enemyColor: Colors, process: ChessProcessPredicate) {
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
   * Обрабатывает предикатом process доступные по вертикали и горизонтали клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод обработчик.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  private processForVerticalAndHorizontalPatterns(
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

      let nextRow = row;
      let nextCol = col;

      while (true) {
        nextRow += rowD;
        nextCol += colD;

        if (!(isDirValid(nextRow) && isDirValid(nextCol))) {
          break;
        }

        const nextCell = cells[nextRow][nextCol];

        if (nextCell === ignoredCell) {
          continue;
        }

        if (nextCell.isEmpty || enemyColor === nextCell.figure?.color) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }

        if (nextCell.figure) {
          break;
        }
      }
    }
  }

  /**
   * Обрабатывает предикатом process доступные по диагонали клетки.
   * Клетка указанная 1-ым параметром не учитывается.
   * @param cell Клетка, из которой ищем ходы.
   * @param enemyColor Цвет противника. Данный параметр используется
   * для расчета пути из клетки, на которой либо стоит противник, либо на которой никого нет.
   * @param process Метод, обрабатывающий любые 2 клетки.
   * Если нужно прервать обработку возвращает false, иначе - true.
   * @param ignoredCell (Опциональный параметр) Игнорируемая фигура.
   * Используется для корректного расчета безопасного хода короля,
   * относительно фигур, имеющих нефиксированную дистанцию атаки(Ферзь, Ладья, Слон).
   */
  private processForDiagonalPatterns(
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

      let nextRow = row;
      let nextCol = col;

      while (true) {
        nextRow += rowD;
        nextCol += colD;

        if (!(isDirValid(nextRow) && isDirValid(nextCol))) {
          break;
        }

        const nextCell = cells[nextRow][nextCol];

        if (nextCell === ignoredCell) {
          continue;
        }

        if (nextCell.isEmpty || enemyColor === nextCell.figure?.color) {
          const canContinue = process(cell, nextCell);

          if (!canContinue) return;
        }

        if (nextCell.figure) {
          break;
        }
      }
    }
  }
}
