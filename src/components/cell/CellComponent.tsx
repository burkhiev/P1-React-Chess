import React, { ReactElement, useState } from 'react';

import { CellStatus } from '../../models/cells/CellStates';
import { ICell } from '../../models/cells/ICell';
import CellCssManager from './CellCssManager';
import FigureComponent from '../figure/FigureComponent';
import IChessGameInfo from '../../services/interfaces/IChessGameInfo';

import './cell.css';
import { ChessGameStates } from '../../services/enums/ChessGameStates';
import EmptyFigureComponent from '../figure/EmptyFigureComponent';

interface ICellComponentProps {
  cell: ICell;

  currentStep: IChessGameInfo;

  // eslint-disable-next-line no-unused-vars
  onSelect: () => void;
}

export default function CellComponent(props: ICellComponentProps) {
  const { cell, onSelect, currentStep } = props;

  // Извлечение полей для корректного обновления классов React компонента.
  const [figure, setFigure] = useState(cell.figure);
  const [status, setStatus] = useState(cell.status);
  const [gameState, setGameState] = useState(currentStep.gameState);
  const [currentStepColor, setCurrentStepColor] = useState(currentStep.currentTeamColor);

  // Установка действий для обновления состояния.
  // Данный метод используется для контроля визуальной части из Chessboard.
  cell.updateCellComponentStates = () => {
    if (currentStep.gameState === ChessGameStates.Checkmate
      || currentStep.gameState === ChessGameStates.Mate
    ) {
      setGameState(currentStep.gameState);
      return;
    }

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

    setCurrentStepColor(currentStep.currentTeamColor);
  };

  // Получаем список классов
  const cellCss = CellCssManager.getPreparedCssClasses(
    figure,
    cell.color,
    status,
    currentStepColor,
    gameState,
  );

  let content: ReactElement = <EmptyFigureComponent hasDot={false} />;

  if (figure) {
    content = (
      <FigureComponent
        figureName={figure.figureName}
        figureColor={figure.color}
      />
    );
  } else if (status === CellStatus.OnWay) {
    content = <EmptyFigureComponent hasDot />;
  }

  return (
    <div
      className={cellCss}
      onClick={onSelect}
      onKeyDown={onSelect}
      role="cell"
    >
      {content}
    </div>
  );
}
