import { Cell } from '../models/Cell';
import { Chessboard } from '../models/Chessboard';
import { Bishop } from '../models/figures/Bishop';
import { King } from '../models/figures/King';
import { Knight } from '../models/figures/Knight';
import { Pawn } from '../models/figures/Pawn';
import { Queen } from '../models/figures/Queen';
import { Rook } from '../models/figures/Rook';
import { Colors } from '../models/enums/Colors';
import { ICell } from '../models/interfaces/ICell';
import { IChessboard } from '../models/interfaces/IChessboard';

export class ChessboardFactory {
    private static size: number = 8

    /**
     * Создает новую шахматную доску
     * @returns Новая подготовленная шахматная доска
     */
    static getInitialState(): Chessboard {
        const chessboard = this.getClearBoard()

        this.fillWithWhiteFigures(chessboard)
        this.fillWithBlackFigures(chessboard)

        return chessboard
    }

    /**
     * Создает чистую шахматную доску заполненную клетками
     * @returns шахматная доска
     */
    private static getClearBoard(): Chessboard {
        const cells: ICell[][] = new Array<Array<ICell>>()

        let colorCounter = 0
        
        for (let i = 0; i < this.size; i++) {
            cells.push([])

            for (let j = 0; j < this.size; j++) {
                let color = Colors.White
                if (colorCounter % 2 === 1) {
                    color = Colors.Black
                }

                cells[i].push(new Cell(color))
                colorCounter++
            }

            // меняем порядок покраски клеток
            colorCounter++
        }
        
        return new Chessboard(cells)
    }

    /**
     * Заполняет белыми фигурами полученную доску
     * @param {IChessboard} chessboard Заполняемая доска
     */
    private static fillWithWhiteFigures(chessboard: IChessboard) {
        const color = Colors.White
        const cells = chessboard.cells
        
        // заполнение пешками
        const pawnRowIndex = 6;
        let row = cells[pawnRowIndex]

        for (let i = 0; i < this.size; i++) {
            row[i].figure = new Pawn(color)
        }

        // заполнение тяжелыми фигурами
        const heavyRowIndex = 7
        row = cells[heavyRowIndex]

        row[0].figure = new Rook(color)
        row[1].figure = new Knight(color)
        row[2].figure = new Bishop(color)
        row[3].figure = new King(color)
        row[4].figure = new Queen(color)
        row[5].figure = new Bishop(color)
        row[6].figure = new Knight(color)
        row[7].figure = new Rook(color)
    }

    /**
     * Заполняет черными фигурами полученную доску
     * @param {IChessboard} chessboard Заполняемая доска
     */
    private static fillWithBlackFigures(chessboard: IChessboard) {
        const color = Colors.Black
        const cells = chessboard.cells

        // заполнение пешками
        const pawnRowIndex = 1;
        let row = cells[pawnRowIndex]

        for (let i = 0; i < this.size; i++) {
            row[i].figure = new Pawn(color)
        }

        // заполнение тяжелыми фигурами
        const heavyRowIndex = 0
        row = cells[heavyRowIndex]

        row[0].figure = new Rook(color)
        row[1].figure = new Knight(color)
        row[2].figure = new Bishop(color)
        row[3].figure = new King(color)
        row[4].figure = new Queen(color)
        row[5].figure = new Bishop(color)
        row[6].figure = new Knight(color)
        row[7].figure = new Rook(color)
    }
}