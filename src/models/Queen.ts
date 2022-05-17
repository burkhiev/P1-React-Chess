import { Behaviors } from "./interfaces/Behaviors";
import { IFigure } from "./interfaces/IFigure";

export class Queen implements IFigure {
    readonly behavior: Behaviors = Behaviors.Queen;
}