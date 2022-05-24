import classNames from 'classnames';

import { Colors } from '../../services/enums/Colors';
import { CellStatus } from '../../models/cells/CellStates';
import { IFigure } from '../../models/figures/IFigure';
import { ChessGameStates } from '../../services/enums/ChessGameStates';
import { FigureNames } from '../../models/figures/FigureNames';

/**
 * Данный класс помогает с визуальной частью CellComponent
 */
export default class CellCssManager {
  static getDefaultCellClasses() {
    return {
      'col-1': true,
      border: true,
      'bg-dark': false,
      'bg-white': false,
      'bg-primary': false,
      'bg-danger': false,
      'rounded-3': true,
      'w-100': true,
      'h-100': true,
      cell: true,
      'cell-white': true,
      'cell-black': false,
      'cell-can-select': false,
      'cell-target': false,
      'cell-king-on-attack': false,
    };
  }

  static resetBackgroundClasses(
    classesObj: ReturnType<typeof CellCssManager.getDefaultCellClasses>,
  ) {
    classesObj['bg-danger'] = false;
    classesObj['bg-dark'] = false;
    classesObj['bg-primary'] = false;
    classesObj['bg-white'] = false;
  }

  /**
     * Составляет список классов для CellComponent
     * @param props Объект, содержащий параметры
     * необходимые для составления списка классов.
     * @returns Список классов для CellComponent.
     */
  static getPreparedCssClasses(
    figure: IFigure | undefined,
    cellColor: Colors,
    cellStatus: CellStatus,
    currentStepColor: Colors,
    gameState: ChessGameStates,
  ) {
    // Устанавливаем классы по умолчанию
    const classesObj = this.getDefaultCellClasses();

    // Устанавливаем основной цвет клетки
    // По умолчанию белый.
    if (cellColor === Colors.Black) {
      classesObj['cell-black'] = true;
      classesObj['cell-white'] = false;
    }

    // Покраска активной/атакуемой клетки
    if (figure) {
      // Цвет выбранной клетки
      if (cellStatus === CellStatus.Active) {
        this.resetBackgroundClasses(classesObj);
        classesObj['bg-primary'] = true;

        // Цвет атакуемой клетки
      } else if (cellStatus === CellStatus.Target) {
        this.resetBackgroundClasses(classesObj);
        classesObj['bg-danger'] = true;
        classesObj['cell-target'] = true;
      }
    }

    // Переключение цвета клетки в зависимости от очередности
    if (currentStepColor === figure?.color) {
      classesObj['cell-can-select'] = true;
    } else {
      classesObj['cell-can-select'] = false;
    }

    if (gameState === ChessGameStates.Check
      && figure?.color === currentStepColor
      && figure.figureName === FigureNames.King
    ) {
      this.resetBackgroundClasses(classesObj);
      classesObj['cell-king-on-attack'] = true;
    }

    // При окончании игры убираем возможность выделения
    if (gameState === ChessGameStates.Checkmate || gameState === ChessGameStates.Mate) {
      classesObj['cell-can-select'] = false;
    }

    return classNames(classesObj);
  }
}
