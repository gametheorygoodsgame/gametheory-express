import express, { Request, Response } from 'express';
import { Move } from '@eikermannlfh/gametheoryapi';
import { gameState } from '../models/gameState';
import turnRouter from './turns';
import { validateMoveObject } from '../middleware/validateMove';
import { uuidValidationMiddleware } from '../middleware/uuid';
import logger from '../utils/logger';
import { handleErrors } from '../utils/handleErros';

const moveRouter = express.Router();

// POST route to add player moves
moveRouter.post('/:gameId/players/:playerId/moves', uuidValidationMiddleware, validateMoveObject, async (req: Request, res: Response) => {
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

// GET route to get current round
moveRouter.get('/', async (req: Request, res: Response) => {
  const { gameId } = req.params;

  try {
    const round = await gameState.waitForCurrentTurnChange(gameId);
    res.status(200).json({ currentRound: round });
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

moveRouter.use('/turns/:numTurn', turnRouter);

export default moveRouter;
