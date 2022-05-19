import { Colors } from '../../services/Colors';
import { FigureNames } from '../enums/FigureNames';

export interface IFigure {
    // имя свойства name занято и выделяется как устаревшее(@types/react)
    readonly figureName: FigureNames,
    readonly color: Colors
}
