import express, { Request, Response } from 'express';
import {gameState} from '../models/gameState';
import {GameNotFoundError} from '../utils/findOrThrow';
const turnRouter = express.Router();

// POST route to start a new round
turnRouter.post('/', async (req: Request, res: Response) => {
    try {
        const gameId = req.params.gameId;
        const redCardValue = parseInt(req.body.redCardValue);

        const currentRound = gameState.startNewTurn(gameId, redCardValue);
        res.status(200).json({ currentRound });
    } catch (error) {
        if (error instanceof GameNotFoundError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Error' });
        }
    }
});

// GET route to get current round and number of rounds
turnRouter.get('/', async (req: Request, res: Response) => {
    try {
        const gameId = req.params.gameId;

        const currentRound = gameState.getCurrentTurn(gameId);
        const numRounds = gameState.getNumTurns(gameId);

        res.status(200).json({ currentRound, numRounds });
    } catch (error) {
        if (error instanceof GameNotFoundError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Something went wrong' });
        }
    }
});

export default turnRouter;
