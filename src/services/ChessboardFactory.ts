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
        
        for (let i = 0; i < this.size; i++) {
            cells.push([])

            for (let j = 0; j < this.size; j++) {
                cells[i].push(new Cell())
            }
        }
        
        return new Chessboard(cells)
    }

    /**
     * Заполняет белыми фигурами полученную доску
     * @param {IChessboard} chessboard Заполняемая доска
     */
    private static fillWithWhiteFigures(chessboard: IChessboard) {
        const black = Colors.White
        const cells = chessboard.cells
        
        // заполнение пешками
        const pawnRowIndex = 1;
        let row = cells[pawnRowIndex]

        for (let i = 0; i < this.size; i++) {
            row[i] = new Cell(new Pawn(black))
        }

        // заполнение тяжелыми фигурами
        const heavyRowIndex = 0
        row = cells[heavyRowIndex]

        row[0].figure = new Rook(black)
        row[1].figure = new Knight(black)
        row[2].figure = new Bishop(black)
        row[3].figure = new King(black)
        row[4].figure = new Queen(black)
        row[5].figure = new Bishop(black)
        row[6].figure = new Knight(black)
        row[7].figure = new Rook(black)
    }

    /**
     * Заполняет черными фигурами полученную доску
     * @param {IChessboard} chessboard Заполняемая доска
     */
    private static fillWithBlackFigures(chessboard: IChessboard) {
        const black = Colors.Black
        const cells = chessboard.cells

        // заполнение пешками
        const pawnRowIndex = 6;
        let row = cells[pawnRowIndex]

        for (let i = 0; i < this.size; i++) {
            row[i] = new Cell(new Pawn(black))
        }

        // заполнение тяжелыми фигурами
        const heavyRowIndex = 7
        row = cells[heavyRowIndex]

        row[0].figure = new Rook(black)
        row[1].figure = new Knight(black)
        row[2].figure = new Bishop(black)
        row[3].figure = new King(black)
        row[4].figure = new Queen(black)
        row[5].figure = new Bishop(black)
        row[6].figure = new Knight(black)
        row[7].figure = new Rook(black)
    }
}