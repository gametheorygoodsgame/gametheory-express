import express, { Request, Response } from 'express';
import {gameState} from '../models/gameState';
import {GameNotFoundError, PlayerNotFoundError} from '../utils/findOrThrow';
import turnRouter from './turns';
import {validateMoveObject} from '../middleware/validateMove';
import {Move} from '../models/move';

const moveRouter = express.Router();

// POST route to add player moves
moveRouter.post('/', validateMoveObject, async (req: Request, res: Response) => {
    try {
        const move: Move = req.body;
        const gameId = req.params.gameId;
        const playerId = req.params.playerId;

        gameState.addMove(gameId, playerId, move.numRedCards);

        res.status(200).send({ message: 'Success' });
    } catch (error) {
        if (error instanceof GameNotFoundError || error instanceof PlayerNotFoundError) {
            res.status(400).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Error' });
        }
    }
});

// GET route to get current round
moveRouter.get('/', async (req: Request, res: Response) => {
    const gameId = req.params.gameId;

    try {
        const round = await gameState.waitForCurrentTurnChange(gameId);
        res.status(200).json({ currentRound: round });
    } catch (error) {
        if (error instanceof GameNotFoundError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Something went wrong' });
        }
    }
});

moveRouter.use('/turns/:numTurn', turnRouter);

export default moveRouter;
