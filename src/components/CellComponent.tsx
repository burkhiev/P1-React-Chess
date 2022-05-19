import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { CellStatus } from '../models/enums/CellStates';
import { Colors } from '../services/Colors';
import { ICell } from '../models/interfaces/ICell';
import DotComponent from './DotComponent';
import FigureComponent from './FigureComponent';

const defaultCellClasses = classNames(
  'd-flex',
  'border',
  'border-secondary',
  'rounded-3',
  'btn',
  'cell',
);

interface ICellColorObject {
  'bg-dark': boolean,
  'bg-white': boolean,
  'bg-primary': boolean,
  'bg-danger': boolean,
}

function resetBackgroundClasses(colorObj: ICellColorObject) {
  colorObj['bg-danger'] = false;
  colorObj['bg-dark'] = false;
  colorObj['bg-primary'] = false;
  colorObj['bg-white'] = false;
}

interface ICellComponentProps {
  cell: ICell,
  // eslint-disable-next-line no-unused-vars
  selectCell: (cell: ICell) => void,
  setDefaultState: () => void
}

export default function CellComponent(props: ICellComponentProps) {
  const { cell, selectCell, setDefaultState } = props;

  const [figure, setFigure] = useState(() => cell.figure);
  const [status, setStatus] = useState(() => cell.status);

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
  };

  const onClick = () => {
    cell.onAction();
    setDefaultState();

    if (cell.status === CellStatus.Default) {
      selectCell(cell);
    }
  };

  const bgColor: ICellColorObject = {
    'bg-dark': false,
    'bg-white': false,
    'bg-primary': false,
    'bg-danger': false,
  };

  const { color } = cell;
  let classes = defaultCellClasses;

  if (color === Colors.Black) {
    bgColor['bg-dark'] = true;
  } else {
    bgColor['bg-white'] = true;
  }

  let content: ReactElement | undefined;
  if (figure) {
    content = <FigureComponent figure={figure} cellColor={color} />;

    if (status === CellStatus.Active) {
      resetBackgroundClasses(bgColor);
      bgColor['bg-primary'] = true;
    } else if (status === CellStatus.Target) {
      resetBackgroundClasses(bgColor);
      bgColor['bg-danger'] = true;
    }
  } else if (status === CellStatus.OnWay) {
    content = <DotComponent />;
  }

  classes = classNames(classes, bgColor);

  return (
    <div className={classes} onClick={onClick} onKeyDown={onClick} role="cell">
      {content}
    </div>
  );
}
