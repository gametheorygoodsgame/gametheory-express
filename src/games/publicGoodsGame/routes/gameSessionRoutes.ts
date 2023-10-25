import Router from 'express';
import {
    createPublicGoodsGameSession,
    getAllPublicGoodsGameSessions
} from "../publicGoodsGameSession";
import {Player} from "../../../common/models";
import {authenticateUser} from "../../../common/middleware/authenticate";

const gameSessionRouter = Router();

// Route for creating a new game session
gameSessionRouter.post('/',authenticateUser , (req, res) => {
    // Extract owner and players information from the request body
    const owner: string = req.body.owner;
    const players: Player[] = req.body.players;

    // Create a new game session using the createGameSession function
    const newGameSession = createPublicGoodsGameSession(owner, players);

    // Return the newly created game session as a response
    res.json(newGameSession);
});

gameSessionRouter.get('/', (req, res) => {
    res.json(getAllPublicGoodsGameSessions());
});

export { gameSessionRouter };