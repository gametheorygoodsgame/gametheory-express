import {Player} from './player';

export interface Game {
    id: string,
    players: Player[],
    turns: number[],
    currentTurn: number,
    numTurns: number
}