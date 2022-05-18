import React from 'react';
import { Colors } from '../models/enums/Colors';
import { FigureNames } from '../models/enums/FigureNames';
import { IFigure } from '../models/interfaces/IFigure';

interface IFigureComponentProps {
    figure: IFigure
}

export default function FigureComponent(props: IFigureComponentProps) {
  const { figure } = props;
  const strFigure = FigureNames[figure.figureName];
  const strColor = Colors[figure.color];

  return (
    <div>
      <span>{strFigure}</span>
      <br />
      <span>{strColor}</span>
    </div>
  );
}
