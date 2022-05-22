import { Colors } from '../../services/enums/Colors';
import { FigureNames } from '../../services/enums/FigureNames';
import { IFigure } from '../interfaces/IFigure';

export default class King implements IFigure {
  readonly figureName: FigureNames;

  readonly color: Colors;

  constructor(color: Colors) {
    this.figureName = FigureNames.King;
    this.color = color;
  }
}
