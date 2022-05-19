import {CellStatus} from '../enums/CellStates';
import { Colors } from '../../services/Colors';
import { IFigure } from './IFigure';

export interface ICell {
  figure: IFigure | undefined
  color: Colors
  status: CellStatus
  row: number,
  col: number,
  get isEmpty(): boolean
  updateCellComponentStates: () => void
  onAction: () => void
}
