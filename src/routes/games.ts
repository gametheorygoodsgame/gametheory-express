import express, { Request, Response } from 'express';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';
import { gameState } from '../models/gameState';
import { uuidValidationMiddleware } from '../middleware/uuid';
import moveRouter from './moves';
import playerRouter from './players';
import { validateGameMiddleware } from '../middleware/validateGame';
import logger from '../utils/logger';
import { handleErrors } from '../utils/handleErros';

const gameRouter = express.Router();

// GET alle Games
gameRouter.get('/', (req: Request, res: Response) => {
  try {
    res.status(200).json(gameState.getAllGames());
    logger.info('Retrieved list of games.');
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// GET Game by Id
gameRouter.get('/:gameId', uuidValidationMiddleware, (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    res.status(200).json(gameState.getGame(gameId));
    logger.info(`Retrieved game: ${gameId}.`);
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// POST Game hinzufügen
gameRouter.post('/', validateGameMiddleware, async (req: Request, res: Response) => {
  try {
    const gameReq: Game = req.body;
    const gameRes = gameState.addGame(gameReq);
    logger.info(`Created game: ${JSON.stringify(gameRes)}`);
    res.status(200).json(gameRes);
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// DELETE Game löschen
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

// PATCH Game ändern
gameRouter.patch(
  '/:gameId',
  validateGameMiddleware,
  uuidValidationMiddleware,
  (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const gameReq: Game = req.body;
      const gameRes = gameState.startNewTurn(gameId, gameReq);
      logger.info(`Changed game: ${JSON.stringify(gameRes)}`);
      res.status(200).json(gameRes);
    } catch (error) {
      handleErrors(res, error as Error);
    }
  },
);

// Subrouten hinzufügen
// Winner senden
gameRouter.get('/:gameId/winner', uuidValidationMiddleware, (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const game = gameState.getGame(gameId);

    // Falls kein Gewinner gesetzt ist, wähle einen zufällig
    if (!game.winner) {
      gameState.setWinner(gameId);
    }

    // Gewinner senden
    res.status(200).json({ winner: game.winner });
  } catch (error) {
    handleErrors(res, error as Error);
  }
});


gameRouter.use('/:gameId/moves', uuidValidationMiddleware, moveRouter);
gameRouter.use('/', playerRouter);

export default gameRouter;
