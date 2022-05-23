import React, { ReactElement, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';

import CellComponent from './CellComponent';
import ChessboardFactory from '../services/ChessboardFactory';
import { Colors } from '../services/enums/Colors';

import '../css/components/chessboard.css';
import '../css/shared.css';
import { ChessGameStates } from '../services/enums/ChessGameStates';
import ChessConfirms from '../services/ChessConfirms';

const getDefaultChessboardStatusBarCss = () => ({
  'py-4': true,
  'border-bottom': true,
  'text-center': true,
});

const getDefaultChessboardTeamHeaderCss = () => ({
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
  const [chessboard, setChessboard] = useState(ChessboardFactory.getNewBoard());
  const [gameState, setGameState] = useState(ChessGameStates.Default);
  const [currentColor, setCurrentColor] = useState(Colors.White);

  function setDefaultComponentState() {
    setChessboard(ChessboardFactory.getNewBoard());
    setGameState(ChessGameStates.Default);
    setCurrentColor(Colors.White);
  }

  const startNewGameBtnOnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (ChessConfirms.confirmRestartGame()) {
      setDefaultComponentState();
    }
  };

  const startNewGameAtEndBtnOnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDefaultComponentState();
  };

  chessboard.onSwitchPlayerCallback = () => {
    setCurrentColor(chessboard.gameInfo.currentTeamColor);
  };

  chessboard.onGameEndCallback = () => {
    setGameState(chessboard.gameInfo.gameState);
  };

  const whiteTeamHeaderCss = getDefaultChessboardTeamHeaderCss();
  const blackTeamHeaderCss = getDefaultChessboardTeamHeaderCss();

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

  const rawStatusBarCss = classNames(getDefaultChessboardStatusBarCss());

  let statusBar: ReactElement;
  if (gameState === ChessGameStates.Default
    || gameState === ChessGameStates.InProcess) {
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
    statusBar = (
      <div className="row m-2 p-2">
        <h3>
          {Colors[currentColor]}
          {' '}
          team win!
          <br />
          Do you want to play again?
        </h3>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            id="startNewGameAtEndBtn"
            name="startNewGameAtEndBtn"
            className="col-4 btn btn-outline-warning mt-3"
            onClick={startNewGameAtEndBtnOnClick}
          >
            Yes, I do!
          </button>
        </div>
      </div>
    );
  }

  const contentArray = chessboard.cells.map((row) => {
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
                onSelect={() => chessboard.onAction(cell)}
                currentStep={chessboard.gameInfo}
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
      <div className="py-5 col-10 col-md-7">
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
