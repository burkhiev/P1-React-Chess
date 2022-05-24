import { Colors } from '../../services/enums/Colors';
import { FigureNames } from './FigureNames';
import { IFigure } from './IFigure';

export default class Knight implements IFigure {
  readonly figureName: FigureNames;

  readonly color: Colors;

  constructor(color: Colors) {
    this.figureName = FigureNames.Knight;
    this.color = color;
  }
}
