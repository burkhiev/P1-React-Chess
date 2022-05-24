import { Colors } from '../enums/Colors';
import { FigureNames } from '../../models/figures/FigureNames';

/**
 * Хранилище картинок для соответствующих фигур
 */
export const FigureImageSources = {
  DEFAULT: '../../../static/chess/empty-cell.png',
  PAWN_WHITE: '../../../static/chess/white-pawn.png',
  ROOK_WHITE: '../../../static/chess/white-rook.png',
  KNIGHT_WHITE: '../../../static/chess/white-knight.png',
  BISHOP_WHITE: '../../../static/chess/white-bishop.png',
  QUEEN_WHITE: '../../../static/chess/white-queen.png',
  KING_WHITE: '../../../static/chess/white-king.png',
  PAWN_BLACK: '../../../static/chess/black-pawn.png',
  ROOK_BLACK: '../../../static/chess/black-rook.png',
  KNIGHT_BLACK: '../../../static/chess/black-knight.png',
  BISHOP_BLACK: '../../../static/chess/black-bishop.png',
  QUEEN_BLACK: '../../../static/chess/black-queen.png',
  KING_BLACK: '../../../static/chess/black-king.png',
};

/**
 * Класс отвечает за доступ к хранилищу картинок
 */
export class FigureImageSourcesManager {
  static getFigureImageSource(figureName: FigureNames, figureColor: Colors): string {
    if (figureColor === Colors.White) {
      return this.getWhiteFigureImageSource(figureName, figureColor);
    }

    return this.getBlackFigureImageSource(figureName, figureColor);
  }

  private static getWhiteFigureImageSource(figureName: FigureNames, figureColor: Colors): string {
    if (figureColor !== Colors.White) {
      throw Error(`Invalid figure color: ${Colors[figureColor]}`);
    }

    switch (figureName) {
      case FigureNames.Pawn:
        return FigureImageSources.PAWN_WHITE;
      case FigureNames.Rook:
        return FigureImageSources.ROOK_WHITE;
      case FigureNames.Knight:
        return FigureImageSources.KNIGHT_WHITE;
      case FigureNames.Bishop:
        return FigureImageSources.BISHOP_WHITE;
      case FigureNames.Queen:
        return FigureImageSources.QUEEN_WHITE;
      case FigureNames.King:
        return FigureImageSources.KING_WHITE;
      default:
        return FigureImageSources.DEFAULT;
    }
  }

  private static getBlackFigureImageSource(figureName: FigureNames, figureColor: Colors): string {
    if (figureColor !== Colors.Black) {
      throw Error(`Invalid figure color: ${Colors[figureColor]}`);
    }

    switch (figureName) {
      case FigureNames.Pawn:
        return FigureImageSources.PAWN_BLACK;
      case FigureNames.Rook:
        return FigureImageSources.ROOK_BLACK;
      case FigureNames.Knight:
        return FigureImageSources.KNIGHT_BLACK;
      case FigureNames.Bishop:
        return FigureImageSources.BISHOP_BLACK;
      case FigureNames.Queen:
        return FigureImageSources.QUEEN_BLACK;
      case FigureNames.King:
        return FigureImageSources.KING_BLACK;
      default:
        return FigureImageSources.DEFAULT;
    }
  }
}
