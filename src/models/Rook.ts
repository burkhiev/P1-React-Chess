import { Behaviors } from "./interfaces/Behaviors";
import { IFigure } from "./interfaces/IFigure";

export class Rook implements IFigure {
    readonly behavior: Behaviors = Behaviors.Rook;
}