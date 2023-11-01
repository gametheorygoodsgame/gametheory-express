import express, { Request, Response } from 'express';
import { Game } from '@eikermannlfh/gametheoryapi';
import { gameState } from '../models/gameState';
import { uuidValidationMiddleware } from '../middleware/uuid';
import moveRouter from './moves';
import playerRouter from './players';
import { validateGameObject } from '../middleware/validateGame';
import logger from '../utils/logger';
import { handleErrors } from '../utils/handleErros';

const gameRouter = express.Router();

// GET route to get game list
gameRouter.get('/', (req: Request, res: Response) => {
  try {
    res.status(200).json(gameState.getAllGames());
    logger.info('Retrieved list of games.');
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// POST route to add a game
gameRouter.post('/', validateGameObject, async (req: Request, res: Response) => {
  try {
    const gameReq: Game = req.body;
    const gameRes = gameState.addGame(gameReq);
    logger.info(`Created game: ${JSON.stringify(gameRes)}`);
    res.status(200).json(gameRes);
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// DELETE route to delete a game
gameRouter.delete('/:gameId', uuidValidationMiddleware, (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    if (gameState.deleteGame(gameId)) {
      logger.info(`Deleted game: ${gameId}`);
      res.status(204).send({ name: 'Deleted.', message: `Successfully deleted ${gameId}.` });
    }
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

/*
gameRouter.patch(
  '/:gameId',
  validateGameObject,
  uuidValidationMiddleware,
  (req: Request, res: Response) => {
    try {
      const gameReq: Game = req.body;
      const { gameId } = req.params;
      if (gameState.deleteGame(gameId)) {
        logger.info(`Deleted game: ${gameId}`);
        res.status(204).send({ name: 'Deleted.', message: `Successfully deleted ${gameId}.` });
      }
    } catch (error) {
      const e = error as Error;
      logger.error({ name: e.name, message: e.message, stack: e.stack });
      res.status(500).send({ message: e.message });
    }
  },
);
 */

/*
gameRouter.post('/:gameId/startNewTurn'
, uuidValidationMiddleware, (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const numTurn: number = gameState.startNewTurn(gameId, 2);
    logger.info(`Game: ${gameId} progressed from turn #${numTurn - 1} to # ${numTurn}.`);
    res.status(200).json({ numTurn });
  } catch (error) {
    handleErrors(res, error as Error);
  }
});
*/

gameRouter.use('/:gameId/moves', uuidValidationMiddleware, moveRouter);
gameRouter.use('/', playerRouter);

export default gameRouter;
