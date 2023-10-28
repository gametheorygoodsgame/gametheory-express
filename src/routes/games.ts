import express, { Request, Response } from 'express';
import { gameState } from '../models/gameState';
import {uuidValidationMiddleware} from '../middleware/uuid';
import moveRouter from './moves';
import playerRouter from './players';
import {validateGameObject} from '../middleware/validateGame';
import {Game} from '../models/game';

const gameRouter = express.Router();

// GET route to get game list
gameRouter.get('/', (req: Request, res: Response) => {
    try {
        const gameListInfo = gameState.getAllGames();
        res.status(200).json({ gameListInfo: gameListInfo });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
    }
});

// POST route to add a game
gameRouter.post('/', validateGameObject, async (req: Request, res: Response) => {
    try {
        const newGame: Game = req.body;
        const gameIDPost = gameState.addGame(newGame.numTurns);
        res.status(200).json({ gameId: gameIDPost });
    } catch (error: any) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE route to delete a game
gameRouter.delete('/:gameId', uuidValidationMiddleware, (req: Request, res: Response) => {
    try {
        const gameIDDelete = req.params.gameId;
        const numDelGames: number = gameState.deleteGame(gameIDDelete);
        if (numDelGames === 0) {
            res.status(404).send({ message: 'Game not found' });
        } else {
            res.status(200).send({ message: 'Success' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
    }
});

gameRouter.use('/:gameId/moves', uuidValidationMiddleware, moveRouter);
gameRouter.use('/:gameId/players', uuidValidationMiddleware, playerRouter);

export default gameRouter;