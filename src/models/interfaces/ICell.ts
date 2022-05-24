import { CellStatus } from '../../services/enums/CellStates';
import { Colors } from '../../services/enums/Colors';
import { IFigure } from './IFigure';

export interface ICell {
  figure: IFigure | undefined
  color: Colors
  status: CellStatus
  row: number,
  col: number,
  get isEmpty(): boolean
  updateCellComponentStates: () => void
  action: () => void
}
