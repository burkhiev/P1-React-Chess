import React from 'react';
import classNames from 'classnames';

import { Colors } from '../services/enums/Colors';
import { FigureNames } from '../services/enums/FigureNames';
import { FigureImageSourcesManager } from '../services/FigureImageSourcesManager';
import { getImageContainerCss, getImageCss } from './CellImageCss';

import DotComponent from './DotComponent';

interface IEmptyCellComponent {
  hasDot: boolean
}

export default function EmptyFigureComponent(props: IEmptyCellComponent) {
  const { hasDot } = props;

  const img = FigureImageSourcesManager
    .getFigureImageSource(FigureNames.Empty, Colors.White);

  const rawImgContainerCss = classNames(getImageContainerCss());
  const rawImgCss = classNames(getImageCss());

  return (
    <div className={rawImgContainerCss}>
      <img src={img} className={rawImgCss} alt="Empty figure" />
      {hasDot && <DotComponent />}
    </div>
  );
}
