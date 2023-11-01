import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/validationError';
import { validateMove } from '../utils/validatorMove';

export async function validateMoveObject(req: Request, res: Response, next: NextFunction) {
  try {
    validateMove(req.body);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send({ message: error.message });
    } else {
      next(error);
    }
  }
}
