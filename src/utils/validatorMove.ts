import { Move } from '@eikermannlfh/gametheoryapi';
import { ValidationError } from './validationError';

export function validateMove(move: any): Move {
  if (typeof move !== 'object') {
    throw new ValidationError('Move must be an object');
  }
  if (typeof move.numRedCards !== 'number' || ![0, 1, 2].includes(move.numRedCards)) {
    throw new ValidationError('Invalid numRedCards');
  }
  if (typeof move.numTurn !== 'number') {
    throw new ValidationError('numTurn must be a number');
  }

  return move;
}
