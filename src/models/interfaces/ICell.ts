import { Colors } from '../enums/Colors';
import { IFigure } from './IFigure';

export interface ICell {
    figure: IFigure | undefined
    color: Colors
}
