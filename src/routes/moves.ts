import express, { Request, Response } from 'express';
import { Move } from '@gametheorygoodsgame/gametheory-openapi';
import { gameState } from '../models/gameState';
import { validateMoveMiddleware } from '../middleware/validateMove';
import { uuidValidationMiddleware } from '../middleware/uuid';
import logger from '../utils/logger';
import { handleErrors } from '../utils/handleErros';

const moveRouter = express.Router();

// POST Move hinzufügen
moveRouter.post('/:gameId/players/:playerId/moves', uuidValidationMiddleware, validateMoveMiddleware, async (req: Request, res: Response) => {
  try {
    const move: Move = req.body;
    const { gameId } = req.params;
    const { playerId } = req.params;

    const moveRes = gameState.addMove(gameId, playerId, move);

    res.status(200).json({ moveRes });
    logger.info(`Added Move ${JSON.stringify(moveRes)} to player ${playerId} in game ${gameId}.`);
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

export default moveRouter;
