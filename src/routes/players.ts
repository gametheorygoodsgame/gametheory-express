import express, { Request, Response } from 'express';
import { gameState } from '../models/gameState';
import {GameNotFoundError, PlayerNotFoundError} from '../utils/findOrThrow';
import moveRouter from './moves';
import {uuidValidationMiddleware} from '../middleware/uuid';
import {validatePlayerObject} from '../middleware/validatePlayer';

const playerRouter = express.Router();

// POST route to add a player to a game
playerRouter.post('/', validatePlayerObject, async (req: Request, res: Response) => {
    const { player } = req.body;
    const gameId = req.params.gameId;

    try {
        const playerId = gameState.addPlayer(gameId, player.name);
        res.status(200).json(playerId);
    } catch (error) {
        if (error instanceof GameNotFoundError || error instanceof PlayerNotFoundError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
});

// GET route to get all players in a game
playerRouter.get('/', (req: Request, res: Response) => {
    const gameId = req.params.gameId;

    try {
        const players = gameState.getAllPlayers(gameId);
        res.status(200).json(players);
    } catch (error) {
        if (error instanceof GameNotFoundError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
});

// Add sub-routers for /moves and /moves/turns/{numTurn}
playerRouter.use('/:playerId/moves', uuidValidationMiddleware, moveRouter);

export default playerRouter;