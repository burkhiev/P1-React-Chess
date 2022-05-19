import { Colors } from '../../services/Colors';
import { FigureNames } from '../enums/FigureNames';
import { IFigure } from '../interfaces/IFigure';

export default class Pawn implements IFigure {
  readonly figureName: FigureNames;

  readonly color: Colors;

  moved: boolean;

  constructor(color: Colors) {
    this.figureName = FigureNames.Pawn;
    this.color = color;
    this.moved = false;
  }
}
