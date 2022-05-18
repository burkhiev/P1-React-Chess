import { Colors } from '../enums/Colors';
import { FigureNames } from '../enums/FigureNames';
import { IFigure } from '../interfaces/IFigure';

export class Rook implements IFigure {
  readonly figureName: FigureNames;

  readonly color: Colors;

  constructor(color: Colors) {
    this.figureName = FigureNames.Rook;
    this.color = color;
  }
}
