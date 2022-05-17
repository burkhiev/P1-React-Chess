import { ICell } from './interfaces/ICell';
import { IFigure } from './interfaces/IFigure';

export class Cell implements ICell {
    figure: IFigure | undefined;
    
    constructor(figure?: IFigure) {
        this.figure = figure
    }
}