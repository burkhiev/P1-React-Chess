import { Colors } from '../../services/enums/Colors';
import { FigureNames } from './FigureNames';
import { IFigure } from './IFigure';

export default class Pawn implements IFigure {
  readonly figureName: FigureNames;

  readonly color: Colors;

  /** Данный флаг влияет на поведение пешки при её первом ходе. */
  moved: boolean;

  constructor(color: Colors) {
    this.figureName = FigureNames.Pawn;
    this.color = color;
    this.moved = false;
  }
}
