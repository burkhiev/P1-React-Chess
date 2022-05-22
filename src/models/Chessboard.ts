import { Colors } from '../services/enums/Colors';
import { CellStatus } from '../services/enums/CellStates';
import { FigureNames } from '../services/enums/FigureNames';
import { ICell } from './interfaces/ICell';
import { ChessProcessPredicate } from '../globals';
import { ChessGameStates } from '../services/enums/ChessGameStates';
import ChessMovesManager from '../services/ChessMovesManager';
import IChessGameInfo from './interfaces/IChessGameInfo';

export default class Chessboard {
  /** Указывает, выбрана ли фигура в данный момент. */
  private selected: boolean;

  /** Хранит в себе последнюю выбранную клетку. */
  private lastSelectedCell: ICell | undefined;

  private movesManager: ChessMovesManager;

  /** Все клетки доски в виде матрицы */
  cells: ICell[][];

  /** Размер стороны доски. Предполагается, что доска квадратная. */
  get size(): number { return this.cells.length; }

  /** Хранит информацию о текущем шаге. */
  gameInfo: IChessGameInfo;

  /** Предназначен для изменения визуальной части при смене игрока. */
  onSwitchPlayerCallback = () => { };

  /** Предназначен для изменения визуальной части при окончании игры. */
  onGameEndCallback = () => { };

  constructor(cells: ICell[][]) {
    this.cells = cells;

    this.selectCell = this.selectCell.bind(this);
    this.cancelSelect = this.cancelSelect.bind(this);
    this.setDefaultCellsState = this.setDefaultCellsState.bind(this);
    this.onAction = this.onAction.bind(this);

    this.getNextGameState = this.getNextGameState.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);

    // Установка стандартного состояния для клеток доски
    this.setDefaultCellsState();

    this.selected = false;
    this.movesManager = new ChessMovesManager(this);
    this.gameInfo = {
      currentTeamColor: Colors.White,
      gameState: ChessGameStates.InProcess,
    };
  }

  /**
   * Изменяет поведение клеток, в зависимости от различных условий.
   * Данный метод служит в качестве onClick callback для React компонентов клеток.
   * @param cell Клетка, которая является инициатором действия.
   */
  onAction(cell: ICell) {
    // Случай, когда клетка уже выбрана
    if (this.selected) {
      switch (cell.status) {
        case CellStatus.Default: {
          this.setDefaultCellsState();
          const prevCell = this.lastSelectedCell;

          // Если следующей клеткой является союзник
          // и если не шах, то переключаемся на него
          if (this.gameInfo.gameState !== ChessGameStates.Check
            && prevCell
            && this.movesManager.isTeammates(prevCell, cell)) {
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
      // Определяем доступность действий в зависимости от ситуации
      const { gameState } = this.gameInfo;

      const isCurrentTeamCell = !cell.isEmpty
        && cell.status === CellStatus.Default
        && cell.figure?.color === this.gameInfo.currentTeamColor;

      if (isCurrentTeamCell) {
        if (gameState === ChessGameStates.Default
          || gameState === ChessGameStates.InProcess) {
          this.selectCell(cell);
        }

        if (gameState === ChessGameStates.Check
          && cell.figure?.figureName === FigureNames.King) {
          this.selectCell(cell);
        }
      }
    }

    this.updateAllCellComponentsStates();
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
   * Переключает цвет текущего игрока.
   */
  private switchPlayer() {
    if (this.gameInfo.currentTeamColor === Colors.White) {
      this.gameInfo.currentTeamColor = Colors.Black;
    } else {
      this.gameInfo.currentTeamColor = Colors.White;
    }

    this.gameInfo.gameState = this.getNextGameState(this.gameInfo.currentTeamColor);

    if (this.gameInfo.gameState === ChessGameStates.Mate
      || this.gameInfo.gameState === ChessGameStates.Checkmate) {
      this.setDefaultCellsState();
      this.onGameEndCallback();
    } else {
      this.onSwitchPlayerCallback();
    }
  }

  /**
   * Проверяет проигрышный статус указанного цвета.
   * @param teamColor Цвет проверяемой команды.
   * @returns Возвращает значение перечисления ChessGameStates.
   * Если шах тогда возвращает ChessGameStates.Check.
   * Если мат - ChessGameStates.Mate.
   * Если шах и мат - ChessGameStates.Checkmate.
   * Иначе - ChessGameStates.InProcess.
   */
  private getNextGameState(teamColor: Colors): ChessGameStates {
    const { cells } = this;
    const kingCell = this.movesManager.findKingCell(teamColor);
    const enemyColor = kingCell.figure?.color === Colors.White ? Colors.Black : Colors.White;

    // Должен ли король убегать?
    const kingMustMove = this.movesManager.doEnemyReachesSpecialCell(kingCell, enemyColor);

    // Сначала проверка на шах/мат
    if (kingMustMove) {
      const canMove = this.movesManager.canMoveFromCell(kingCell);
      if (canMove) {
        return ChessGameStates.Check; // Шах
      }
      return ChessGameStates.Checkmate; // Шах и мат
    }

    // Если король не в опасности проверяем
    // возможность игрока совершить любой ход
    for (let i = 0; i < cells.length; i += 1) {
      const row = cells[i];
      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];

        if (cell.figure?.color === teamColor) {
          if (this.movesManager.canMoveFromCell(cell)) {
            return ChessGameStates.InProcess; // Игра не закончена
          }
        }
      }
    }

    return ChessGameStates.Mate; // Мат
  }

  /**
   * Запускает действия при выборе клетки, которая находится в нейтральном состоянии.
   * @param cell Выбираемая клетка
   */
  private selectCell(cell: ICell) {
    if (cell.status !== CellStatus.Default) {
      throw new Error('cell.status must be CellStatus.Default');
    }

    if (!cell.figure) {
      throw new Error('Cell must has a figure.');
    }

    cell.status = CellStatus.Active;

    // Данная ф-я устанавливает на клетки обработчики
    // для перемещения фигур
    const process: ChessProcessPredicate = (current: ICell, next: ICell) => {
      const options = {
        postMoveAction: () => {
          this.switchPlayer();
          this.updateAllCellComponentsStates();
        },
      };

      this.movesManager.setOnMoveAction(current, next, options);

      return true; // указываем, что процесс не будет прерываться
    };

    const enemyColor = cell.figure.color === Colors.Black ? Colors.White : Colors.Black;

    switch (cell.figure.figureName) {
      case FigureNames.Rook:
        this.movesManager.processRookSteps(cell, enemyColor, process);
        break;
      case FigureNames.Knight:
        this.movesManager.processKnightSteps(cell, enemyColor, process);
        break;
      case FigureNames.Bishop:
        this.movesManager.processBishopSteps(cell, enemyColor, process);
        break;
      case FigureNames.Queen:
        this.movesManager.processQueenSteps(cell, enemyColor, process);
        break;
      case FigureNames.King:
        this.movesManager.processKingSteps(cell, enemyColor, process);
        break;
      case FigureNames.Pawn:
        this.movesManager.processPawnSteps(cell, enemyColor, process);
        break;
      default:
        throw new Error('Unknown FigureName');
    }

    this.selected = true;
    this.lastSelectedCell = cell;
  }

  /**
   * Отменяет выбор клетки
   */
  private cancelSelect() {
    this.selected = false;
    this.setDefaultCellsState();
  }
}
