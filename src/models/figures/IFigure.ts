import { Colors } from '../../services/enums/Colors';
import { FigureNames } from './FigureNames';

/**
 * Интерфейс для шахматных фигур.
 */
export interface IFigure {
    // имя свойства name занято и выделяется как устаревшее(@types/react)
    readonly figureName: FigureNames,
    readonly color: Colors
}
