import { Move } from '@gametheorygoodsgame/gametheory-openapi';
import { ValidationError } from './validationError';
import logger from "./logger";

export function validateMove(move: any): Move {
  logger.debug(`Move ${JSON.stringify(move)} entered to validator.`)
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
