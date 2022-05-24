import { CellStatus } from './CellStates';
import { Colors } from '../../services/enums/Colors';
import { IFigure } from '../figures/IFigure';

export interface ICell {
  figure: IFigure | undefined
  color: Colors
  status: CellStatus
  row: number,
  col: number,
  get isEmpty(): boolean
  updateCellComponentStates: (() => void) | undefined
  action: (() => void) | undefined
}
