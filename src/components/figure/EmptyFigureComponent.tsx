import React from 'react';
import classNames from 'classnames';

import { Colors } from '../../services/enums/Colors';
import { FigureNames } from '../../models/figures/FigureNames';
import { FigureImageSourcesManager } from '../../services/figure/FigureImageSourcesManager';
import FigureCssManager from './FigureCssManager';

import DotComponent from '../dot/DotComponent';

interface IEmptyCellComponent {
  hasDot: boolean
}

export default function EmptyFigureComponent(props: IEmptyCellComponent) {
  const { hasDot } = props;

  const img = FigureImageSourcesManager
    .getFigureImageSource(FigureNames.Empty, Colors.White);

  const rawImgContainerCss = classNames(FigureCssManager.getImageContainerCss());
  const rawImgCss = classNames(FigureCssManager.getImageCss());

  return (
    <div className={rawImgContainerCss}>
      <img src={img} className={rawImgCss} alt="Empty figure" />
      {hasDot && <DotComponent />}
    </div>
  );
}
