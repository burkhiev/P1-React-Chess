import { Colors } from "../interfaces/Colors";
import { FigureNames } from "../interfaces/FigureNames";
import { IFigure } from "../interfaces/IFigure";

export class Queen implements IFigure {
    readonly figureName: FigureNames;
    readonly color: Colors;

    constructor(color: Colors) {
        this.figureName = FigureNames.Queen
        this.color = color
    }
}