import { Request, Response } from 'express';
import GameService from './gameService';

class GameController {
    private gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    async getAllGames(request: Request, response: Response) {
        try {
            const serviceResponse = await this.gameService.getAllGames();
            this.sendResponse(response, serviceResponse);
        } catch (error) {
            this.sendError(response, error);
        }
    }

    private sendResponse(response: Response, payload: any) {
        response.status(payload.code || 200);
        const responsePayload = payload.payload !== undefined ? payload.payload : payload;
        if (responsePayload instanceof Object) {
            response.json(responsePayload);
        } else {
            response.end(responsePayload);
        }
    }

    private sendError(response: Response, error: any) {
        response.status(error.code || 500);
        if (error.error instanceof Object) {
            response.json(error.error);
        } else {
            response.end(error.error || error.message);
        }
    }
}

export default GameController;
