import {ValidationError} from './validationError';
import {Player} from '../models/player';
import {validateUUIDv4} from './validatorUUIDv4';
import {validateMove} from './validatorMove';

export function validatePlayer(player: any): Player {
    if (typeof player !== 'object') {
        throw new ValidationError('Player must be an object');
    }
    if (typeof player.id !== 'string' || !validateUUIDv4(player.id)) {
        throw new ValidationError('Player ID must be a valid UUIDv4 string');
    }
    if (typeof player.name !== 'string') {
        throw new ValidationError('Player name must be a string');
    }
    if (!Array.isArray(player.moves) || (player.moves.length > 0 && !player.moves.every(validateMove))) {
        throw new ValidationError('Player moves must be an array of valid moves');
    }
    if (typeof player.score !== 'number') {
        throw new ValidationError('Player score must be a number');
    }

    return player;
}

export function isObjectCastableToPlayer(obj: any): boolean {
    validatePlayer(obj);
    return true;
}