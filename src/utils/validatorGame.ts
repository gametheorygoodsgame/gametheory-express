import {ValidationError} from './validationError';
import {Game} from '../models/game';
import {validateUUIDv4} from './validatorUUIDv4';
import {validatePlayer} from './validatorPlayer';

export function validateGame(game: any): Game {
    if (typeof game !== 'object') {
        throw new ValidationError('Game must be an object');
    }
    /*if (typeof game.id !== 'string' || !validateUUIDv4(game.id)) {
        throw new ValidationError('Game ID must be a valid UUIDv4 string');
    }*/
    if (!Array.isArray(game.players) || (game.players.length > 0 && !game.players.every(validatePlayer))) {
        throw new ValidationError('Players must be an array of valid players');
    }
    if (!Array.isArray(game.turns) || (game.turns.length > 0 && !game.turns.every((turn: any) => typeof turn === 'number'))) {
        throw new ValidationError('Turns must be an array of numbers');
    }
    if (typeof game.currentTurn !== 'number') {
        throw new ValidationError('CurrentTurn must be a number');
    }
    if (typeof game.numTurns !== 'number') {
        throw new ValidationError('NumTurns must be a number');
    }

    return game;
}

export function isObjectCastableToGame(obj: any): boolean {
    validateGame(obj);
    return true;
}