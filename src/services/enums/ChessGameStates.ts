// Невозможно экспортировать по умолчанию тип enum
/* eslint-disable import/prefer-default-export */

// Нет перекрытия переменных в данном файле
/* eslint-disable no-shadow */

// Нет необходимости использовать значения enum в данном файле
/* eslint-disable no-unused-vars */
export enum ChessGameStates {
    Default = 'Default',
    Check = 'Check',
    Mate = 'Mate',
    Checkmate = 'Checkmate',
    InProcess = 'InProcess',
    Draw = 'Draw'
}
