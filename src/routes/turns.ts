import express, { Request, Response } from 'express';
import { gameState } from '../models/gameState';
import { handleErrors } from '../utils/handleErros';

const turnRouter = express.Router();

// POST route to start a new turn
turnRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const redCardValue = parseInt(req.body.redCardValue);

    const currentRound = gameState.startNewTurn(gameId, gameState.getGame(gameId));
    res.status(200).json({ currentRound });
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

// GET route to get current round and number of rounds
turnRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    const currentRound = gameState.getCurrentTurn(gameId);
    const numRounds = gameState.getNumTurns(gameId);

    res.status(200).json({ currentRound, numRounds });
  } catch (error) {
    handleErrors(res, error as Error);
  }
});

export default turnRouter;
