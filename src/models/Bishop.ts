import { Behaviors } from "./interfaces/Behaviors";
import { IFigure } from "./interfaces/IFigure";

export class Bishop implements IFigure {
    readonly behavior: Behaviors = Behaviors.Bishop;
}