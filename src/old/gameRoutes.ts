import express, { Router, Request, Response } from 'express';
import GameController from './gameController';

const router: Router = express.Router();
const gameController = new GameController();

router.get('/', async (req: Request, res: Response) => {
    await gameController.getAllGames(req, res);
});

export default router;
