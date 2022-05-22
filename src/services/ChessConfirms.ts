export default class ChessConfirms {
  static confirmRestartGame(): boolean {
    return confirm('Are you sure to start a new game.');
  }
}
