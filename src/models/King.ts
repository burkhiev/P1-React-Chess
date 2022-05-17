import { Behaviors } from "./interfaces/Behaviors";
import { IFigure } from "./interfaces/IFigure";

export class King implements IFigure {
    readonly behavior: Behaviors = Behaviors.King;
}