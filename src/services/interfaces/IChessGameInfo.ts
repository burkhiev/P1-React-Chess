import { ICell } from '../../models/cells/ICell';
import { ChessGameStates } from '../enums/ChessGameStates';
import { Colors } from '../enums/Colors';

export default interface IChessGameInfo {
    currentTeamColor: Colors,
    gameState: ChessGameStates,
    priorityTargetCell: ICell | undefined
// eslint-disable-next-line semi
}
