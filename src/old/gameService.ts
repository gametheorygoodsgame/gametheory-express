import Service from "@eikermannlfh/gametheoryapi/services/Service";
import GameMocker from '../mocking/game'
import { Game } from "@eikermannlfh/gametheoryapi/models/Game";
import { Player } from "@eikermannlfh/gametheoryapi";

type SuccessResponse = {
    payload: any;
    code: number;
};

type ErrorResponse = {
    error: any;
    code: number;
};

class GameService extends Service {
    async getAllGames() {
        try {
            const games = await GameMocker.fetchGames();
            // Create a success response with the array of games in the payload
            const response: SuccessResponse = Service.successResponse({
                payload: games,
            });
            return response;
        } catch (e: any) {
            // Handle errors and return a reject response
            const errorResponse: ErrorResponse = Service.rejectResponse(
                e.message || 'Invalid input',
                e.status || 405,
            );
            return errorResponse;
        }
    }
}

export default GameService;