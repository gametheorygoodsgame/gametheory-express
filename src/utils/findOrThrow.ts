/**
 *
 * @param value
 * @param errorClass
 */
export function findOrThrow<T, ErrorType extends Error>(
    value: T | undefined,
    errorClass: new () => ErrorType
): T {
  if (value === undefined) {
    throw new errorClass();
  }
  return value;
}

export class GameNotFoundError extends Error {
  constructor() {
    super('Game not Found!');
    this.name = 'GameNotFoundError';
  }
}

export class PlayerNotFoundError extends Error {
  constructor() {
    super('Player not Found!');
    this.name = 'PlayerNotFoundError';
  }
}