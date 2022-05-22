import React, { ReactElement, useState } from 'react';

import { CellStatus } from '../services/enums/CellStates';
import { ICell } from '../models/interfaces/ICell';
import CellClassesManager from '../services/CellClassesManager';
import DotComponent from './DotComponent';
import FigureComponent from './FigureComponent';
import IChessGameInfo from '../models/interfaces/IChessGameInfo';

import '../css/components/Cell/cell.css';
import { ChessGameStates } from '../services/enums/ChessGameStates';

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
  const { cellCss } = CellClassesManager.getPreparedCssClasses(arg);

  let content: ReactElement = <span />;
  if (figure) {
    // Отображаем фигуру
    content = <FigureComponent figure={figure} cellColor={cell.color} />;

    // Если фигуры в клетке нет, но она достижима, то ставим точку
  } else if (status === CellStatus.OnWay) {
    content = <DotComponent />;
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
