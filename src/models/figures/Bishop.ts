import { Colors } from '../../services/Colors';
import { FigureNames } from '../enums/FigureNames';
import { IFigure } from '../interfaces/IFigure';

export default class Bishop implements IFigure {
  readonly figureName: FigureNames;
  readonly color: Colors;

  constructor(color: Colors) {
    this.figureName = FigureNames.Bishop;
    this.color = color;
  }
}
