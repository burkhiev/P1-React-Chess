import React, { ReactElement, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';

import CellComponent from '../cell/CellComponent';
import { Colors } from '../../services/enums/Colors';

import './chessboard.css';
import '../shared/shared.css';
import { ChessGameStates } from '../../services/enums/ChessGameStates';
import { AppConfirms } from '../../globals';
import ChessboardManager from '../../services/chessboard/ChessboardManager';
import ChessboardFactory from '../../services/chessboard/ChessboardFactory';

const getDefaultStatusBarCss = () => ({
  'py-4': true,
  'border-bottom': true,
  'text-center': true,
});

const getDefaultTeamHeaderCss = () => ({
  'col-4': true,
  'display-6': true,
  'border-bottom': true,
  'p-2': true,
  'text-muted': false,
  'cursor-default': true,
  'chessboard-team-header-on': false,
  'chessboard-team-header-off': false,
});

export default function ChessboardComponent() {
  const [chessManager] = useState(new ChessboardManager(ChessboardFactory.getNewBoard()));
  const [cells, setCells] = useState(chessManager.cells);
  const [gameInfo, setGameInfo] = useState(chessManager.gameInfo);
  const [currentColor, setCurrentColor] = useState(Colors.White);

  // Необходимо выделить gameState отдельно от gameInfo,
  // чтобы была возможность обновить компонент после изменения gameState.
  const [gameState, setGameState] = useState(chessManager.gameInfo.gameState);

  function setDefaultComponentStates() {
    const chessboard = ChessboardFactory.getNewBoard();
    setCells(chessManager.setNewChessboard(chessboard));
    setGameInfo(chessManager.gameInfo);
    setGameState(chessManager.gameInfo.gameState);
    setCurrentColor(Colors.White);
  }

  const startNewGameBtnOnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (AppConfirms.confirmRestartGame()) {
      setDefaultComponentStates();
    }
  };

  const startNewGameAtTheEndBtnOnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDefaultComponentStates();
  };

  chessManager.onSwitchPlayerCallback = () => {
    setCurrentColor(gameInfo.currentTeamColor);
  };

  chessManager.onGameEndCallback = () => {
    setGameState(gameInfo.gameState);
  };

  const whiteTeamHeaderCss = getDefaultTeamHeaderCss();
  const blackTeamHeaderCss = getDefaultTeamHeaderCss();

  // выделение текущей команды
  if (currentColor === Colors.White) {
    blackTeamHeaderCss['text-muted'] = true;

    whiteTeamHeaderCss['chessboard-team-header-on'] = true;
    whiteTeamHeaderCss['chessboard-team-header-off'] = false;

    blackTeamHeaderCss['chessboard-team-header-off'] = true;
    blackTeamHeaderCss['chessboard-team-header-on'] = false;
  } else {
    whiteTeamHeaderCss['text-muted'] = true;

    blackTeamHeaderCss['chessboard-team-header-on'] = true;
    blackTeamHeaderCss['chessboard-team-header-off'] = false;

    whiteTeamHeaderCss['chessboard-team-header-off'] = true;
    whiteTeamHeaderCss['chessboard-team-header-on'] = false;
  }

  const rawWhiteTeamHeaderCss = classNames(whiteTeamHeaderCss);
  const rawBlackTeamHeaderCss = classNames(blackTeamHeaderCss, 'offset-4');
  const rawStatusBarCss = classNames(getDefaultStatusBarCss());

  let statusBar: ReactElement;

  // изменение statusbar при окончании/продолжении игры.
  if (gameState === ChessGameStates.Default
    || gameState === ChessGameStates.InProcess
    || gameState === ChessGameStates.Check) {
    statusBar = (
      <div className="row m-2 p-2">
        <div className={rawWhiteTeamHeaderCss}>
          White
        </div>
        <div className={rawBlackTeamHeaderCss}>
          Black
        </div>
      </div>
    );
  } else {
    let endGameHeader = (
      <>
        {Colors[currentColor]}
        {' '}
        team win!
      </>
    );

    if (gameState === ChessGameStates.Draw) {
      endGameHeader = <>Draw</>;
    }

    statusBar = (
      <div className="row m-2 p-2">
        <h3>
          {endGameHeader}
          <br />
        </h3>
        <span>Do you want to play again?</span>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            id="startNewGameAtEndBtn"
            name="startNewGameAtEndBtn"
            className="col-4 btn btn-warning mt-3"
            onClick={startNewGameAtTheEndBtnOnClick}
          >
            Yes, I do!
          </button>
        </div>
      </div>
    );
  }

  const contentArray = cells.map((row) => {
    const result = (
      <div
        key={nanoid()}
        className="d-flex"
      >
        {
          row.map((cell) => (
            <div
              key={nanoid()}
              className="m-1"
            >
              <CellComponent
                cell={cell}
                onSelect={() => chessManager.onAction(cell)}
                currentStep={gameInfo}
              />
            </div>
          ))
        }
      </div>
    );

    return result;
  });

  return (
    <div className="row justify-content-center border bg-light">
      <div className={rawStatusBarCss}>
        {statusBar}
      </div>
      <div className="py-5 col-10 col-md-7 col-lg-5">
        {contentArray.map((renderedRow) => renderedRow)}
      </div>
      <div className="mt-3 p-2">
        <div className="d-flex justify-content-end border-top p-3">
          <button
            type="button"
            id="startNewGameBtn"
            name="startNewGameBtn"
            className="btn btn-outline-secondary mt-3"
            onClick={startNewGameBtnOnClick}
          >
            Start new game
          </button>
        </div>
      </div>
    </div>
  );
}
