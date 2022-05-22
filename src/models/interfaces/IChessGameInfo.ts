import { ChessGameStates } from '../../services/enums/ChessGameStates';
import { Colors } from '../../services/enums/Colors';

export default interface IChessGameInfo {
    currentTeamColor: Colors,
    gameState: ChessGameStates
// eslint-disable-next-line semi
}
