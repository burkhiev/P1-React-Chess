import { ChessProcessPredicate } from '../../globals';
import ChessMovesManager from './ChessMovesManager';

import Chessboard from '../../models/chessboards/Chessboard';
import { ICell } from '../../models/cells/ICell';
import IChessGameInfo from '../interfaces/IChessGameInfo';
import { CellStatus } from '../../models/cells/CellStates';
import { ChessGameStates } from '../enums/ChessGameStates';
import { Colors } from '../enums/Colors';
import { FigureNames } from '../../models/figures/FigureNames';

/** Класс отвечает за логику взаимодействия с шахматной доской. */
export default class ChessboardManager {
  /** Шахматная доска */
  private chessboard: Chessboard;

  /** Отвечает за логику ходов шахмат */
  private movesManager: ChessMovesManager;

  get cells(): ICell[][] {
    if (!this.chessboard?.cells) {
      throw new Error('There are no cells in the chessboard.');
    }

    return this.chessboard.cells;
  }

  /** Указывает, выбрана ли фигура в данный момент. */
  selected: boolean = false;

  /** Хранит в себе последнюю выбранную клетку. */
  lastSelectedCell: ICell | undefined;

  /** Хранит остальную информацию о текущей ситуации на доске. */
  gameInfo: IChessGameInfo;

  /** Предназначен для изменения визуальной части при смене игрока. */
  onSwitchPlayerCallback = () => { };

  /** Предназначен для изменения визуальной части при окончании игры. */
  onGameEndCallback = () => { };

  constructor(chessboard: Chessboard) {
    if (!chessboard) {
      throw new Error('chessboard argument couldn\'t be empty.');
    }

    this.selectCell = this.selectCell.bind(this);
    this.cancelSelect = this.cancelSelect.bind(this);
    this.setDefaultCellsState = this.setDefaultCellsState.bind(this);
    this.updateAllCellComponentsStates = this.updateAllCellComponentsStates.bind(this);
    this.getNextGameState = this.getNextGameState.bind(this);

    this.onAction = this.onAction.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);

    // Данный код дублируется из метода setNewChessboard,
    // т.к. компилятор требует установки начальных значений
    // для полей класса в конструкторе явно(не через ф-ю).
    this.chessboard = chessboard;
    this.movesManager = new ChessMovesManager(this.chessboard);
    this.gameInfo = {
      currentTeamColor: Colors.White,
      gameState: ChessGameStates.Default,
      priorityTargetCell: undefined,
    };

    this.setDefaultCellsState();
  }

  /**
   * Изменяет поведение клеток, в зависимости от различных условий.
   * Данный метод служит в качестве универсального onClick callback для React компонентов клеток.
   * @param cell Клетка, которая является инициатором действия.
   */
  onAction(cell: ICell) {
    const { selected, gameInfo, lastSelectedCell } = this;

    if (selected) {
      // Случай, когда клетка уже выделена

      switch (cell.status) {
        case CellStatus.Default: {
          this.setDefaultCellsState();

          const prevCell = lastSelectedCell;
          const { gameState } = gameInfo;

          const isNextTeammate = prevCell && this.movesManager.isTeammates(prevCell, cell);

          // Если следующей клеткой является союзник, то переключаемся на него
          if (isNextTeammate) {
            if (gameState === ChessGameStates.Check) {
              // При шахе передвигаются только те фигуры, ход которых может спасти короля
              if (this.canBeatPriorityTarget(cell)) {
                this.selectCell(cell);
              } else {
                this.cancelSelect();
              }
            } else {
              // Обычное переключение на союзника
              this.selectCell(cell);
            }
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
          cell.action?.call(undefined);
          this.cancelSelect();
          break;

        default:
          throw new Error('Unknown CellStatus value');
      }
    } else {
      // Случай, когда клетку нужно выделить

      const { gameState, currentTeamColor } = gameInfo;

      const isCurrentTeamCell = cell.figure
        && cell.status === CellStatus.Default
        && cell.figure.color === currentTeamColor;

      if (isCurrentTeamCell) {
        if (gameState === ChessGameStates.Default
          || gameState === ChessGameStates.InProcess) {
          this.selectCell(cell);
        } else if (gameState === ChessGameStates.Check) {
          // При шахе передвигаются только те фигуры, ход которых может спасти короля
          const itIsKing = cell.figure?.figureName === FigureNames.King;
          const canMove = this.movesManager.canMoveFromCell(cell);

          if ((itIsKing && canMove) || this.canBeatPriorityTarget(cell)) {
            this.selectCell(cell);
          }
        }
      }
    }

    this.updateAllCellComponentsStates();
  }

  /**
   * Создает новую шахматную доску и ставит её под управление текущему экземпляру класса.
   */
  setNewChessboard(chessboard: Chessboard): ICell[][] {
    if (!chessboard) {
      throw new Error('chessboard argument couldn\'t be empty.');
    }

    this.chessboard = chessboard;
    this.movesManager = new ChessMovesManager(this.chessboard);
    this.gameInfo = {
      currentTeamColor: Colors.White,
      gameState: ChessGameStates.Default,
      priorityTargetCell: undefined,
    };

    this.setDefaultCellsState();

    return this.cells;
  }

  /**
   * Устанавливает всем клеткам состояние по умолчанию, в зависимости от наличия фигуры.
   */
  private setDefaultCellsState() {
    const { cells } = this.chessboard;

    for (let i = 0; i < cells.length; i += 1) {
      const row = cells[i];

      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];
        cell.status = CellStatus.Default;
        cell.action = undefined;
      }
    }
  }

  /**
   * Запускает обновление визуальной части клеток.
   */
  private updateAllCellComponentsStates() {
    const { cells, size } = this.chessboard;

    for (let i = 0; i < size; i += 1) {
      const row = cells[i];
      for (let j = 0; j < size; j += 1) {
        const cell = row[j];
        cell.updateCellComponentStates?.call(undefined);
      }
    }
  }

  /**
   * Выполняет действия для переключения текущего игрока.
   */
  private switchPlayer() {
    const { gameInfo } = this;

    if (gameInfo.currentTeamColor === Colors.White) {
      gameInfo.currentTeamColor = Colors.Black;
    } else {
      gameInfo.currentTeamColor = Colors.White;
    }

    gameInfo.gameState = this.getNextGameState(gameInfo.currentTeamColor);

    if (gameInfo.gameState === ChessGameStates.Mate
      || gameInfo.gameState === ChessGameStates.Checkmate
      || gameInfo.gameState === ChessGameStates.Draw
    ) {
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
    const kingCell = this.movesManager.findKingCell(teamColor);
    const enemyColor = kingCell.figure?.color === Colors.White ? Colors.Black : Colors.White;
    const reachingEnemyCells = this.movesManager.getBeatingEnemyCells(kingCell, enemyColor);

    // Проверка на шах/шахмат
    if (reachingEnemyCells.length) {
      const canMove = this.movesManager.canMoveFromCell(kingCell);
      [this.gameInfo.priorityTargetCell] = reachingEnemyCells;

      if (canMove) {
        return ChessGameStates.Check; // Шах
      }

      // Поиск союзной фигуры, которая готова помочь королю.
      const enemyCell = reachingEnemyCells[0];
      const reachingAlliesCells = this.movesManager
        .getBeatingEnemyCells(enemyCell, teamColor, kingCell);

      if (reachingAlliesCells.length) {
        return ChessGameStates.Check; // Шах
      }

      return ChessGameStates.Checkmate; // Шахмат
    }

    // Король в безопасности
    this.gameInfo.priorityTargetCell = undefined;

    // Проверка на ничью
    const teamCells = this.getOneTeamCells(teamColor);
    const enemyCells = this.getOneTeamCells(enemyColor);

    if (teamCells.length === 1 && enemyCells.length === 1) {
      // Проверка на корректность.
      // Последние фигуры могут быть только королями.
      if (teamCells[0].figure?.figureName !== FigureNames.King
        || enemyCells[0].figure?.figureName !== FigureNames.King) {
        throw new Error('Last figures in teams could be only Kings.');
      }

      return ChessGameStates.Draw;
    }

    // Далее проверяем возможность игрока совершить любой ход
    for (let i = 0; i < teamCells.length; i += 1) {
      const cell = teamCells[i];
      if (this.movesManager.canMoveFromCell(cell)) {
        return ChessGameStates.InProcess;
      }
    }

    // Игрок не может двигаться - Мат
    return ChessGameStates.Mate;
  }

  /**
   * Ищет на шахматной доске фигуры из одной команды указанного цвета.
   * Результат возвращает в виде массива.
   * Если таковых не нашлось возвращает пустой массив.
   * @param teamColor Цвет команды.
   * @returns Массив клеток с фигурами указанного цвета.
   */
  private getOneTeamCells(teamColor: Colors): ICell[] {
    if (teamColor !== Colors.White && teamColor !== Colors.Black) {
      throw new Error('teamColor must be Colors.White or Colors.Black.');
    }

    const { cells } = this.chessboard;
    const result: ICell[] = [];

    for (let i = 0; i < cells.length; i += 1) {
      const row = cells[i];
      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];

        if (cell.figure?.color === teamColor) {
          result.push(cell);
        }
      }
    }

    return result;
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
    const enemyColor = cell.figure.color === Colors.Black ? Colors.White : Colors.Black;

    // Данная ф-я устанавливает на клетки обработчики события для перемещения фигур
    const process: ChessProcessPredicate = (current: ICell, next: ICell) => {
      // Для короля проверяем следующую клетку на безопасность
      if (current.figure?.figureName === FigureNames.King) {
        const reachingEnemies = this.movesManager.getBeatingEnemyCells(next, enemyColor, current);
        if (reachingEnemies.length) {
          return true; // продолжить обработку
        }
      }

      // Можно сделать ход если:
      if (
        !this.gameInfo.priorityTargetCell // 1. Нет приоритетной цели(фигура бьющая короля)
        || this.gameInfo.priorityTargetCell === next // 2. Цель есть, и она на следующей клетке
        || current.figure?.figureName === FigureNames.King // 3. Король всегда имеет право на ход.
      ) {
        const options = {
          postMoveAction: () => {
            this.switchPlayer();
            this.updateAllCellComponentsStates();
          },
        };
        this.movesManager.setOnMoveAction(current, next, options);
      }

      return true; // продолжить обработку
    };

    this.movesManager.processForInCellFigurePattern(cell, enemyColor, process);
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

  /**
   * Проверяет, можно ли фигурой из указанной клетки атаковать приоритетную цель.
   * Приоритетная цель - это клетка, которая является угрозой для короля текущей команды.
   * @param cell Клетка из которой ищем ход к приоритетной цели.
   * @returns true, если цель можно атаковать, иначе - false.
   */
  private canBeatPriorityTarget(cell: ICell): boolean {
    const { priorityTargetCell } = this.gameInfo;

    if (!priorityTargetCell) {
      throw new Error('Priority target should be set for this method invoking.');
    }

    if (!priorityTargetCell.figure) {
      throw new Error('Priority target must has a figure inside.');
    }

    if (!cell.figure) {
      throw new Error('Cell should has a figure inside.');
    }

    if (cell.figure.color === priorityTargetCell.figure?.color) {
      throw new Error('Figure in cell can beat priorityTargetCell\'s figure'
        + 'only if figures in these cells are enemies for each other');
    }

    let canBeat = false;

    const priorityTargetCellSearchProcess
      : ChessProcessPredicate = (current: ICell, next: ICell) => {
        if (next === priorityTargetCell) {
          canBeat = true;
          return false;
        }
        return true;
      };

    this.movesManager.processForInCellFigurePattern(
      cell,
      priorityTargetCell.figure.color,
      priorityTargetCellSearchProcess,
    );

    return canBeat;
  }
}
