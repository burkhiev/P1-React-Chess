import { Behaviors } from "./interfaces/Behaviors";
import { IFigure } from "./interfaces/IFigure";

export class Pawn implements IFigure {
    readonly behavior: Behaviors = Behaviors.Pawn;
}