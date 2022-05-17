import { Colors } from "../interfaces/Colors";
import { FigureNames } from "../interfaces/FigureNames";
import { IFigure } from "../interfaces/IFigure";

export class Rook implements IFigure {
    readonly figureName: FigureNames;
    readonly color: Colors;

    constructor(color: Colors) {
        this.figureName = FigureNames.Rook
        this.color = color
    }
}