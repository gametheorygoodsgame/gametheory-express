import { Request, Response, NextFunction } from 'express';
import { validateUUIDv4 } from '../utils/validatorUUIDv4';

export const uuidValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { gameId } = req.params;
  const { playerId } = req.params;

  const errors = [];

  // Validate game ID if present
  if (gameId) {
    try {
      validateUUIDv4(gameId);
    } catch (error) {
      errors.push(error);
    }
  }

  // Validate player ID if present
  if (playerId) {
    try {
      validateUUIDv4(playerId);
    } catch (error) {
      errors.push(error);
    }
  }

  // Check if any errors occurred
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
