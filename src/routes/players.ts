import express, { Request, Response } from 'express';
import { gameState } from '../models/gameState';
import { GameNotFoundError } from '../utils/findOrThrow';
import moveRouter from './moves';
import { uuidValidationMiddleware } from '../middleware/uuid';
import { validatePlayerMiddleware } from '../middleware/validatePlayer';
import logger from '../utils/logger';
import { handleErrors } from '../utils/handleErros';

const playerRouter = express.Router();

// POST Player hinzufügen
playerRouter.post('/:gameId/players', uuidValidationMiddleware, validatePlayerMiddleware, async (req: Request, res: Response) => {
  const player = req.body;
  logger.debug(player);
  const { gameId } = req.params;
  logger.debug(gameId);

  try {
    const playerRes = gameState.addPlayer(gameId, player.name);
    res.status(200).json(playerRes);
    logger.info(`Added Player ${JSON.stringify(playerRes)} to game ${gameId}.`);
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// GET all Players
playerRouter.get('/:gameId/players', uuidValidationMiddleware, (req: Request, res: Response) => {
  const { gameId } = req.params;

  try {
    const players = gameState.getAllPlayers(gameId);
    res.status(200).json(players);
    logger.info('Retrieved list of players.');
  } catch (error) {
    const e = error as Error;
    logger.error({ name: e.name, message: e.message, stack: e.stack });
    if (error instanceof GameNotFoundError) {
      res.status(404).send({ name: error.name, message: error.message });
    } else {
      res.status(500).send({ message: e.message });
    }
  }
});

// Subrouten hinzufügen
playerRouter.use('/', moveRouter);

export default playerRouter;
