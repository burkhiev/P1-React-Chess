import { Colors } from "../models/enums/Colors"
import { FigureNames } from "../models/enums/FigureNames"
import { IFigure } from "../models/interfaces/IFigure"

/**
 * Хранилище картинок для соответствующих фигур
 */
export const FigureImageSources = {
    PAWN_WHITE: '',
    ROOK_WHITE: '',
    KNIGHT_WHITE: '',
    BISHOP_WHITE: '',
    QUEEN_WHITE: '',
    KING_WHITE: '',
    PAWN_BLACK: '',
    ROOK_BLACK: '',
    KNIGHT_BLACK: '',
    BISHOP_BLACK: '',
    QUEEN_BLACK: '',
    KING_BLACK: ''
}

/**
 * Класс отвечает за доступ к хранилищу картинок
 */
export class FigureImageSourcesService {

    static getFigureImageSource(figure: IFigure): string {
        if (figure.color === Colors.White) {
            return this.getWhiteFigureImageSource(figure)
        }
        else {
            return this.getBlackFigureImageSource(figure)
        }
    }

    private static getWhiteFigureImageSource(figure: IFigure): string {
        if (figure.color === Colors.White) {
            throw Error(`Invalid figure\' color: ${Colors[figure.color]}`)
        }

        switch (figure.figureName) {
            case FigureNames.Pawn:
                return FigureImageSources.PAWN_WHITE
            case FigureNames.Rook:
                return FigureImageSources.ROOK_WHITE
            case FigureNames.Rook:
                return FigureImageSources.KNIGHT_WHITE
            case FigureNames.Rook:
                return FigureImageSources.BISHOP_WHITE
            case FigureNames.Rook:
                return FigureImageSources.QUEEN_WHITE
            case FigureNames.Rook:
                return FigureImageSources.KING_WHITE
            default:
                throw Error('Unknown error.')
        }
    }

    private static getBlackFigureImageSource(figure: IFigure): string {
        if (figure.color === Colors.Black) {
            throw Error(`Invalid figure\' color: ${Colors[figure.color]}`)
        }

        switch (figure.figureName) {
            case FigureNames.Pawn:
                return FigureImageSources.PAWN_BLACK
            case FigureNames.Rook:
                return FigureImageSources.ROOK_BLACK
            case FigureNames.Rook:
                return FigureImageSources.KNIGHT_BLACK
            case FigureNames.Rook:
                return FigureImageSources.BISHOP_BLACK
            case FigureNames.Rook:
                return FigureImageSources.QUEEN_BLACK
            case FigureNames.Rook:
                return FigureImageSources.KING_BLACK
            default:
                throw Error('Unknown error.')
        }
    }
}