import { Response } from 'express';
import { GameNotFoundError, PlayerNotFoundError } from './findOrThrow';
import logger from './logger';

export const handleErrors = (res: Response, error: Error) => {
  const errorResponse = {
    name: error.name,
    message: error.message,
    stack: error.stack, // You may exclude this in a production environment
  };

  logger.error(errorResponse);

  if (error instanceof GameNotFoundError || error instanceof PlayerNotFoundError) {
    res.status(400).send({ name: error.name, message: error.message });
  } else {
    res.status(500).send({ name: error.name, message: error.message });
  }
};
