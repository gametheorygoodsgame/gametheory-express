import { Request, Response, NextFunction } from 'express';
import { validateGame } from '../utils/validatorGame';
import {ValidationError} from '../utils/validationError';

export async function validateGameObject(req: Request, res: Response, next: NextFunction) {
    try {
        validateGame(req.body);
        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ message: error.message});
        } else {
            next(error);
        }
    }
}