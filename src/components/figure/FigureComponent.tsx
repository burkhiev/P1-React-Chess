import React from 'react';
import classNames from 'classnames';

import { Colors } from '../../services/enums/Colors';
import { FigureNames } from '../../models/figures/FigureNames';
import { FigureImageSourcesManager } from '../../services/figure/FigureImageSourcesManager';
import FigureCssManager from './FigureCssManager';

export interface IFigureComponentProps {
  figureName: FigureNames,
  figureColor: Colors
}

export default function FigureComponent(props: IFigureComponentProps) {
  const { figureName, figureColor } = props;
  const figureImg = FigureImageSourcesManager
    .getFigureImageSource(figureName, figureColor);

  const rawImgContainerCss = classNames(FigureCssManager.getImageContainerCss());
  const rawImgCss = classNames(FigureCssManager.getImageCss());

  const altText = `${Colors[figureColor]} ${FigureNames[figureName]}`;

  return (
    <div className={rawImgContainerCss}>
      <img src={figureImg} className={rawImgCss} alt={altText} />
    </div>
  );
}
