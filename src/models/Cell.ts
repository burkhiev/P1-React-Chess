import { CellStatus } from './enums/CellStates';
import { Colors } from '../services/Colors';
import { ICell } from './interfaces/ICell';
import { IFigure } from './interfaces/IFigure';

export default class Cell implements ICell {
  figure: IFigure | undefined;

  color: Colors;

  status: CellStatus;

  row: number;

  col: number;

  get isEmpty(): boolean {
    return !this.figure;
  }

  constructor(color: Colors, row: number, col: number, figure?: IFigure) {
    this.color = color;
    this.figure = figure;
    this.status = CellStatus.Default;
    this.row = row;
    this.col = col;
  }

  updateCellComponentStates = () => { };

  onAction = () => { };
}
