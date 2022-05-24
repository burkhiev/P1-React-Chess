/* eslint-disable no-unused-vars */
import { ICell } from './models/interfaces/ICell';
import { Colors } from './services/enums/Colors';

export const IS_TEST: boolean = false;

/**
 * Методы данного типа обрабатывают 2 клетки и
 * возвращают значение, указывающее либо на продолжение
 * обработки(true) либо на её прекращение(false).
 */
export type ChessProcessPredicate = (
    origin: ICell,
    next: ICell,
    color?: Colors
) => boolean;

export type Action = () => void;
