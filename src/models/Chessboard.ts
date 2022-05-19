import { CellStatus } from './enums/CellStates';
import { ICell } from './interfaces/ICell';

export default class Chessboard {
  cells: ICell[][];

  private selected: boolean = false;

  private get size(): number { return this.cells.length; }

  constructor(cells: ICell[][]) {
    this.cells = cells;

    this.selectCell = this.selectCell.bind(this);
    this.setDefaultCellsState = this.setDefaultCellsState.bind(this);
    this.markRookSteps = this.markRookSteps.bind(this);
    this.setOnMoveAction = this.setOnMoveAction.bind(this);
  }

  onAction(cell: ICell) {
    if (this.selected) {
      if (cell.status === CellStatus.OnWay || cell.status === CellStatus.Target) {
        cell.onAction();
      }

      this.selected = false;
      this.setDefaultCellsState();
      this.updateAllCellComponentsStates();
    } else if (!cell.isEmpty && cell.status === CellStatus.Default) {
      this.selected = true;
      this.selectCell(cell);
      this.updateAllCellComponentsStates();
    }
  }

  private updateAllCellComponentsStates() {
    for (let i = 0; i < this.cells.length; i += 1) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];
        cell.updateCellComponentStates();
      }
    }
  }

  private selectCell(cell: ICell) {
    this.markRookSteps(cell);
  }

  /**
   * Устанавливает всем клеткам состояние по умолчанию (в зависимости от наличия фигуры).
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
   * Отмечает доступные по вертикали и горизонтали клетки.
   * @param cell Клетка, из которой ищем ходы.
   */
  private markRookSteps(cell: ICell) {
    const { size, cells } = this;
    const { row, col } = cell;

    cell.status = CellStatus.Active;
    cell.updateCellComponentStates();

    // Отмечаем шаги вверх
    for (let i = row - 1; i >= 0; i -= 1) {
      const nextCell = cells[i][col];

      if (cell.figure && nextCell.figure && cell.figure.color === nextCell.figure.color) {
        break;
      }

      this.setOnMoveAction(cell, nextCell);

      if (nextCell.figure) {
        break;
      }
    }

    // Отмечаем шаги вниз
    for (let i = row + 1; i < size; i += 1) {
      const nextCell = cells[i][col];

      if (cell.figure && nextCell.figure && cell.figure.color === nextCell.figure.color) {
        break;
      }

      this.setOnMoveAction(cell, nextCell);

      if (nextCell.figure) {
        break;
      }
    }

    // Отмечаем шаги влево
    for (let j = col - 1; j >= 0; j -= 1) {
      const nextCell = cells[row][j];

      if (cell.figure && nextCell.figure && cell.figure.color === nextCell.figure.color) {
        break;
      }

      this.setOnMoveAction(cell, nextCell);

      if (nextCell.figure) {
        break;
      }
    }

    // Отмечаем шаги вправо
    for (let j = col + 1; j < size; j += 1) {
      const nextCell = cells[row][j];

      if (cell.figure && nextCell.figure && cell.figure.color === nextCell.figure.color) {
        break;
      }

      this.setOnMoveAction(cell, nextCell);

      if (nextCell.figure) {
        break;
      }
    }
  }

  /**
   * Устанавливает необходимые действия для клетки, при перемещении фигуры.
   * @param from Клетка, из которой движется фигура.
   * @param to Клетка, в которую фигура движется.
   */
  private setOnMoveAction(from: ICell, to: ICell) {
    if (to.figure) {
      to.status = CellStatus.Target;
    } else {
      to.status = CellStatus.OnWay;
    }

    to.onAction = () => {
      to.figure = from.figure;
      from.figure = undefined;
    };
  }
}
