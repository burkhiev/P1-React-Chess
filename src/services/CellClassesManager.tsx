import classNames from 'classnames';

import { Colors } from './Colors';
import { CellStatus } from '../models/enums/CellStates';
import { IFigure } from '../models/interfaces/IFigure';

/**
 * Данный класс помогает с визуальной частью CellComponent
 */
export default class CellClassesManager {
  /**
     * Составляет список классов для CellComponent
     * @param props Объект, содержащий параметры
     * необходимые для составления списка классов.
     * @returns Список классов для CellComponent.
     */
  static getPreparedContent(props: {
        figure: IFigure | undefined,
        cellColor: Colors,
        status: CellStatus,
        currentStepColor: Colors
    }) {
    const {
      figure, cellColor, status, currentStepColor,
    } = props;

    // Устанавливаем классы по умолчанию
    const classesObj = this.getDefaultCellClasses();

    // Устанавливаем основной цвет клетки
    // По умолчанию белый.
    if (cellColor === Colors.Black) {
      classesObj['cell-black'] = true;
      classesObj['cell-white'] = false;
    }

    if (figure) {
      // Цвет выбранной клетки
      if (status === CellStatus.Active) {
        this.resetBackgroundClasses(classesObj);
        classesObj['bg-primary'] = true;

        // Цвет атакуемой клетки
      } else if (status === CellStatus.Target) {
        this.resetBackgroundClasses(classesObj);
        classesObj['bg-danger'] = true;
      }
    }

    // Переключение цвета клетки в зависимости от очередности.
    if (currentStepColor === figure?.color) {
      classesObj['cell-can-select'] = true;
    } else {
      classesObj['cell-can-select'] = false;
    }

    const cellClasses = classNames(classesObj);

    return { cellClasses };
  }

  static getDefaultCellClasses() {
    return {
      'col-1': true,
      'd-flex': true,
      'justify-content-center': true,
      'align-content-center': true,
      border: true,
      'bg-dark': false,
      'bg-white': false,
      'bg-primary': false,
      'bg-danger': false,
      btn: true,
      cell: true,
      'cell-white': true,
      'cell-black': false,
      'cell-can-select': false,
      'cell-target': false,
    };
  }

  static resetBackgroundClasses(
    colorObj: ReturnType<typeof CellClassesManager.getDefaultCellClasses>,
  ) {
    colorObj['bg-danger'] = false;
    colorObj['bg-dark'] = false;
    colorObj['bg-primary'] = false;
    colorObj['bg-white'] = false;
  }
}
