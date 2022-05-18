import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { Colors } from '../models/enums/Colors';
import { ICell } from '../models/interfaces/ICell';
import FigureComponent from './FigureComponent';

const defaultCellClasses = classNames(
  'border',
  'border-secondary',
  'cell',
);

interface ICellComponentProps {
    cell: ICell
}

export default function CellComponent(props: ICellComponentProps) {
  const { cell: { figure, color } } = props;

  let classes = defaultCellClasses;
  if (color === Colors.Black) {
    classes = classNames(classes, 'bg-dark');
  } else {
    classes = classNames(classes, 'bg-white');
  }

  let content: ReactElement | undefined;
  if (figure) {
    content = <FigureComponent figure={figure} />;
  }

  return (
    <div className={classes}>
      {content}
    </div>
  );
}
