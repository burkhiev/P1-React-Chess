import { Colors } from '../services/Colors';
import { CellStatus } from './enums/CellStates';
import { FigureNames } from './enums/FigureNames';
import { ICell } from './interfaces/ICell';
import { ICurrentStep } from './interfaces/ICurrentStep';
import Pawn from './figures/Pawn';

export default class Chessboard {
  cells: ICell[][];

  private selected: boolean = false;

  private lastSelectedCell: ICell | undefined;

  private get size(): number { return this.cells.length; }

  currentStep: ICurrentStep = { color: Colors.White };

  constructor(cells: ICell[][]) {
    this.cells = cells;

    this.selectCell = this.selectCell.bind(this);
    this.setDefaultCellsState = this.setDefaultCellsState.bind(this);
    this.onAction = this.onAction.bind(this);
    this.setOnMoveAction = this.setOnMoveAction.bind(this);
    this.cancelSelect = this.cancelSelect.bind(this);

    this.markVerticalAndHorizontalSteps = this.markVerticalAndHorizontalSteps.bind(this);
    this.markDiagonalSteps = this.markDiagonalSteps.bind(this);
    this.markKnightSteps = this.markKnightSteps.bind(this);
    this.markKingSteps = this.markKingSteps.bind(this);
    this.markPawnSteps = this.markPawnSteps.bind(this);

    // Установка стандартного состояния для клеток доски
    this.setDefaultCellsState();
  }

  /**
   * (ВХОДНАЯ ТОЧКА В Chessboard)
   * Изменяет поведение клеток, в зависимости от различных условий.
   * @param cell Клетка, которая является инициатором действия.
   */
  onAction(cell: ICell) {
    // Случай, когда клетка уже выбрана
    if (this.selected) {
      switch (cell.status) {
        case CellStatus.Default: {
          this.setDefaultCellsState();
          const prevCell = this.lastSelectedCell;

          // Если следующей клеткой является союзник, переключаемся на него
          if (prevCell && this.isTeammates(prevCell, cell) && prevCell !== cell) {
            this.selectCell(cell);
            // Иначе отменяем выбор
          } else {
            this.cancelSelect();
          }
          break;
        }

        // Если нажали на ту же клетку, отменяем выбор
        case CellStatus.Active:
          this.cancelSelect();
          break;

        // Если игрок решил сделать ход, выполняем действие
        case CellStatus.OnWay:
        case CellStatus.Target:
          cell.onAction();
          this.cancelSelect();
          break;

        default:
          throw new Error('Unknown CellStatus value');
      }
    } else {
      // Выбор клетки с фигурой
      const isCellEnable = !cell.isEmpty
        && cell.status === CellStatus.Default
        && cell.figure?.color === this.currentStep.color;

      if (isCellEnable) {
        this.selectCell(cell);
      }
    }
  }

  /**
   * Устанавливает всем клеткам состояние по умолчанию, в зависимости от наличия фигуры.
   */
  private setDefaultCellsState() {
    const { cells } = this;

    for (let i = 0; i < cells.length; i += 1) {
      const row = cells[i];

      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];
        cell.status = CellStatus.Default;
        cell.onAction = () => { };
      }
    }
  }

  /**
   * Запускает обновление визуальной части клеток.
   */
  private updateAllCellComponentsStates() {
    const { cells, size } = this;

    for (let i = 0; i < size; i += 1) {
      const row = cells[i];
      for (let j = 0; j < size; j += 1) {
        const cell = row[j];
        cell.updateCellComponentStates();
      }
    }
  }

  /**
   * Выполняет необходимые действия для клетки, при перемещении фигуры.
   * @param from Клетка, из которой движется фигура.
   * @param to Клетка, в которую фигура движется.
   */
  private setOnMoveAction(from: ICell, to: ICell) {
    if (this.isTeammates(from, to)) {
      throw new Error('You cannot go to an friendly occupied cell.');
    }

    if (to.figure) {
      to.status = CellStatus.Target;
    } else {
      to.status = CellStatus.OnWay;
    }

    to.onAction = () => {
      to.figure = from.figure;
      from.figure = undefined;

      this.switchColor();

      if (to.figure?.figureName === FigureNames.Pawn) {
        (<Pawn>to.figure).moved = true;
      }
    };
  }

  /**
   * Переключает цвет текущего игрока.
   */
  private switchColor() {
    if (this.currentStep.color === Colors.White) {
      this.currentStep.color = Colors.Black;
    } else {
      this.currentStep.color = Colors.White;
    }
  }

  // Используется для пешек
  /**
   * Определяет враждебность клеток, в зависимости от находящихся на них фигур.
   * @param from Первая клетка
   * @param to Вторая клетка
   * @returns Если на клетках стоят фигуры из противоположных команд,
   * то возвращает true. Иначе - false.
   */
  private isEnemies(first: ICell, second: ICell) {
    return first.figure && second.figure && first.figure.color !== second.figure.color;
  }

  /**
   * Определяет дружелюбность клеток, в зависимости от находящихся на них фигур.
   * @param from Первая клетка
   * @param to Вторая клетка
   * @returns Если на клетках стоят фигуры из одной команды,
   * то возвращает true. Иначе - false.
   */
  private isTeammates(first: ICell, second: ICell) {
    return (first.figure && second.figure && first.figure.color === second.figure.color);
  }

  /**
   * Запускает действия при выборе клетки, которая находится в нейтральном состоянии.
   * @param cell Выбираемая клетка
   */
  private selectCell(cell: ICell) {
    if (cell.status !== CellStatus.Default) {
      throw new Error('cell.status must be CellStatus.Default');
    }

    cell.status = CellStatus.Active;

    switch (cell.figure?.figureName) {
      case FigureNames.Rook:
        this.markVerticalAndHorizontalSteps(cell);
        break;
      case FigureNames.Knight:
        this.markKnightSteps(cell);
        break;
      case FigureNames.Bishop:
        this.markDiagonalSteps(cell);
        break;
      case FigureNames.Queen:
        this.markVerticalAndHorizontalSteps(cell);
        this.markDiagonalSteps(cell);
        break;
      case FigureNames.King:
        this.markKingSteps(cell);
        break;
      case FigureNames.Pawn:
        this.markPawnSteps(cell);
        break;
      default:
        throw new Error('Unknown FigureName');
    }

    this.selected = true;
    this.lastSelectedCell = cell;
    this.updateAllCellComponentsStates();
  }

  /**
   * Отменяет выбор клетки
   */
  private cancelSelect() {
    this.selected = false;
    this.setDefaultCellsState();
    this.updateAllCellComponentsStates();
  }

  /**
   * Отмечает доступные по вертикали и горизонтали клетки.
   * @param cell Клетка, из которой ищем ходы.
   */
  private markVerticalAndHorizontalSteps(cell: ICell) {
    const { size, cells } = this;
    const { row, col } = cell;

    const isDirValid = (q: number) => q >= 0 && q < size;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      let nextRow = row + rowD;
      let nextCol = col + colD;

      while (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!this.isTeammates(cell, nextCell)) {
          this.setOnMoveAction(cell, nextCell);
        }

        if (nextCell.figure) {
          break;
        }

        nextRow += rowD;
        nextCol += colD;
      }
    }
  }

  /**
   * Отмечает доступные по диагонали клетки.
   * @param cell Клетка, из которой ищем ходы.
   */
  private markDiagonalSteps(cell: ICell) {
    const { size, cells } = this;
    const { row, col } = cell;

    const isDirValid = (q: number) => q >= 0 && q < size;
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      let nextRow = row + rowD;
      let nextCol = col + colD;

      while (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!this.isTeammates(cell, nextCell)) {
          this.setOnMoveAction(cell, nextCell);
        }

        if (nextCell.figure) {
          break;
        }

        nextRow += rowD;
        nextCol += colD;
      }
    }
  }

  /**
   * Отмечает доступные для Коня клетки.
   * @param cell Клетка, из которой ищем ходы.
   */
  private markKnightSteps(cell: ICell) {
    const { size, cells } = this;
    const { row, col } = cell;

    const directions = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
    const isDirValid = (q: number) => q >= 0 && q < size;

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      const nextRow = row + rowD;
      const nextCol = col + colD;

      if (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];

        if (!this.isTeammates(cell, nextCell)) {
          this.setOnMoveAction(cell, nextCell);
        }
      }
    }
  }

  /**
   * Отмечает доступные для Короля клетки.
   * @param cell Клетка, из которой ищем ходы.
   */
  private markKingSteps(cell: ICell) {
    const { size, cells } = this;
    const { row, col } = cell;

    const directions = [
      [1, 1], [1, 0], [1, -1],
      [0, 1], [0, 0], [0, -1],
      [-1, 1], [-1, 0], [-1, -1],
    ];
    const isDirValid = (q: number) => q >= 0 && q < size;

    for (let d = 0; d < directions.length; d += 1) {
      const [rowD, colD] = directions[d];

      const nextRow = row + rowD;
      const nextCol = col + colD;

      if (isDirValid(nextRow) && isDirValid(nextCol)) {
        const nextCell = cells[nextRow][nextCol];
        if (!this.isTeammates(cell, nextCell)) {
          this.setOnMoveAction(cell, nextCell);
        }
      }
    }
  }

  /**
   * Отмечает доступные для Пешки клетки.
   * @param cell Клетка, из которой ищем ходы.
   */
  private markPawnSteps(cell: ICell) {
    const isNotPawn = !(cell.figure && cell.figure.figureName === FigureNames.Pawn);
    if (isNotPawn) {
      return;
    }

    const { size, cells } = this;
    const { row, col } = cell;
    const { color, moved } = (<Pawn>cell.figure)!;

    let nextRow = row + (color === Colors.White ? -1 : 1);
    let nextCol = col;

    const isDirValid = (q: number) => q >= 0 && q < size;

    if (isDirValid(nextRow) && isDirValid(nextCol)) {
      let nextCell = cells[nextRow][nextCol];

      if (nextCell.isEmpty) {
        this.setOnMoveAction(cell, nextCell);
      }

      // если пешка не ходила и перед ней никого нет,
      // то есть возможность перешагнуть клетку.
      if (!moved && nextCell.isEmpty) {
        nextRow = row + (color === Colors.White ? -2 : 2);
        nextCol = col;

        // без проверки. если пешка не ходила, значит мы в начальной позиции.
        nextCell = cells[nextRow][nextCol];

        if (nextCell.isEmpty) {
          this.setOnMoveAction(cell, nextCell);
        }
      }
    }

    // смотрим противника слева
    nextCol = col + 1;
    nextRow = row + (color === Colors.White ? -1 : 1);

    if (isDirValid(nextRow) && isDirValid(nextCol)) {
      const nextCell = cells[nextRow][nextCol];

      if (this.isEnemies(cell, nextCell)) {
        this.setOnMoveAction(cell, nextCell);
      }
    }

    // смотрим противника справа
    nextCol = col - 1;
    nextRow = row + (color === Colors.White ? -1 : 1);

    if (isDirValid(nextRow) && isDirValid(nextCol)) {
      const nextCell = cells[nextRow][nextCol];

      if (this.isEnemies(cell, nextCell)) {
        this.setOnMoveAction(cell, nextCell);
      }
    }
  }
}
