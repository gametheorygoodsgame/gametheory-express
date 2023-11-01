import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/validationError';
import { validatePlayer } from '../utils/validatorPlayer';

export async function validatePlayerObject(req: Request, res: Response, next: NextFunction) {
  try {
    validatePlayer(req.body);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send({ message: error.message });
    } else {
      next(error);
    }
  }
}
