import { Colors } from './enums/Colors';
import { ICell } from './interfaces/ICell';
import { IFigure } from './interfaces/IFigure';

export default class Cell implements ICell {
  figure: IFigure | undefined;

  color: Colors;

  constructor(color: Colors, figure?: IFigure) {
    this.color = color;
    this.figure = figure;
  }
}
