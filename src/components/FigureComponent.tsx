import React from 'react';
import { Colors } from '../services/enums/Colors';
import { FigureNames } from '../services/enums/FigureNames';
import { IFigure } from '../models/interfaces/IFigure';

interface IFigureComponentProps {
  figure: IFigure,
  cellColor: Colors
}

export default function FigureComponent(props: IFigureComponentProps) {
  const { figure, cellColor } = props;

  let strFigure;
  let strColor = '';

  if (figure) {
    strFigure = FigureNames[figure.figureName];
    strColor = Colors[figure.color];
  }

  return (
    <div className={cellColor === Colors.Black ? 'text-white' : 'text-dark'}>
      <span>{strFigure}</span>
      <br />
      <span>{strColor}</span>
    </div>
  );
}
