import classNames from 'classnames';

import { Colors } from './enums/Colors';
import { CellStatus } from './enums/CellStates';
import { IFigure } from '../models/interfaces/IFigure';
import { ChessGameStates } from './enums/ChessGameStates';
import { FigureNames } from './enums/FigureNames';

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
    };
  }

  static resetBackgroundClasses(
    colorObj: ReturnType<typeof CellCssManager.getDefaultCellClasses>,
  ) {
    colorObj['bg-danger'] = false;
    colorObj['bg-dark'] = false;
    colorObj['bg-primary'] = false;
    colorObj['bg-white'] = false;
  }

  /**
     * Составляет список классов для CellComponent
     * @param props Объект, содержащий параметры
     * необходимые для составления списка классов.
     * @returns Список классов для CellComponent.
     */
  static getPreparedCssClasses(props: {
        figure: IFigure | undefined,
        cellColor: Colors,
        cellStatus: CellStatus,
        currentStepColor: Colors,
        gameState: ChessGameStates
    }) {
    const {
      figure, cellColor, cellStatus, currentStepColor, gameState,
    } = props;

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
      && figure?.figureName !== FigureNames.King
    ) {
      classesObj['cell-can-select'] = false;
    }

    // При окончании игры убираем возможность выделения
    if (gameState === ChessGameStates.Checkmate || gameState === ChessGameStates.Mate) {
      classesObj['cell-can-select'] = false;
    }

    const cellClasses = classNames(classesObj);

    return cellClasses;
  }
}
