import React, { ReactElement, useState } from 'react';

import { CellStatus } from '../models/enums/CellStates';
import { ICell } from '../models/interfaces/ICell';
import { ICurrentStep } from '../models/interfaces/ICurrentStep';
import CellClassesManager from '../services/CellClassesManager';
import DotComponent from './DotComponent';
import FigureComponent from './FigureComponent';

interface ICellComponentProps {
  cell: ICell;

  currentStep: ICurrentStep;

  // eslint-disable-next-line no-unused-vars
  onSelect: () => void;
}

export default function CellComponent(props: ICellComponentProps) {
  const { cell, onSelect, currentStep } = props;

  const [figure, setFigure] = useState(cell.figure);
  const [status, setStatus] = useState(cell.status);
  const [currentStepColor, setCurrentStepColor] = useState(currentStep.color);

  // Установка действий для обновления состояния.
  // Данный метод используется для контроля визуальной части из Chessboard.
  cell.updateCellComponentStates = () => {
    switch (cell.status) {
      case CellStatus.Active:
        setStatus(CellStatus.Active);
        break;
      case CellStatus.Default:
        setStatus(CellStatus.Default);
        break;
      case CellStatus.OnWay:
        setStatus(CellStatus.OnWay);
        break;
      case CellStatus.Target:
        setStatus(CellStatus.Target);
        break;
      default:
        throw new Error('Unknown cell status');
    }

    if (cell.isEmpty) {
      setFigure(undefined);
    } else {
      setFigure(cell.figure);
    }

    setCurrentStepColor(currentStep.color);
  };

  // Получаем список классов
  const arg = {
    figure, cellColor: cell.color, status, currentStepColor,
  };
  const { cellClasses } = CellClassesManager.getPreparedContent(arg);

  let content: ReactElement = <span />;
  if (figure) {
    // Отображаем фигуру
    content = <FigureComponent figure={figure} cellColor={cell.color} />;

    // Если фигуры в клетке нет и она достижима, то ставим точку
  } else if (status === CellStatus.OnWay) {
    content = <DotComponent />;
  }

  return (
    <div
      className={cellClasses}
      onClick={onSelect}
      onKeyDown={onSelect}
      role="cell"
    >
      {content}
    </div>
  );
}
