import { Behaviors } from "./interfaces/Behaviors";
import { IFigure } from "./interfaces/IFigure";

export class Knight implements IFigure {
    readonly behavior: Behaviors = Behaviors.Knight;
}