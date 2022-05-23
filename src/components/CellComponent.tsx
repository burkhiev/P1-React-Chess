import React, { ReactElement, useState } from 'react';

import { CellStatus } from '../services/enums/CellStates';
import { ICell } from '../models/interfaces/ICell';
import CellCssManager from '../services/CellCssManager';
import FigureComponent from './FigureComponent';
import IChessGameInfo from '../models/interfaces/IChessGameInfo';

import '../css/components/cell.css';
import { ChessGameStates } from '../services/enums/ChessGameStates';
import EmptyFigureComponent from './EmptyFigureComponent';

interface ICellComponentProps {
  cell: ICell;

  currentStep: IChessGameInfo;

  // eslint-disable-next-line no-unused-vars
  onSelect: () => void;
}

export default function CellComponent(props: ICellComponentProps) {
  const { cell, onSelect, currentStep } = props;

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

  let onClick = onSelect;
  if (gameState === ChessGameStates.Checkmate || gameState === ChessGameStates.Mate) {
    // eslint-disable-next-line no-unused-vars
    onClick = () => { };
  }

  // Получаем список классов
  const arg = {
    figure,
    cellColor: cell.color,
    cellStatus: status,
    currentStepColor,
    gameState,
  };
  const cellCss = CellCssManager.getPreparedCssClasses(arg);

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
