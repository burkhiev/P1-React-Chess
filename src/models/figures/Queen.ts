import { Colors } from "../enums/Colors";
import { FigureNames } from "../enums/FigureNames";
import { IFigure } from "../interfaces/IFigure";

export class Queen implements IFigure {
    readonly figureName: FigureNames;
    readonly color: Colors;

    constructor(color: Colors) {
        this.figureName = FigureNames.Queen
        this.color = color
    }
}