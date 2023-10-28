import express, { type Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as admin from 'firebase-admin';
import { serviceAccount } from './utils/firebase';
import morganMiddleware from "./middleware/morgan";
import logger from "./utils/logger";
import gameRouter from './routes/games';
import playerRouter from './routes/players';
import moveRouter from './routes/moves';
import turnRouter from './routes/turns';
import {gameState} from './models/gameState';
import {prefilledGameState} from './prefilledGameState';
import {Game} from './models/game';

const server: Express = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configure middleware
server.use(cors({ origin: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(morganMiddleware);

// Configure routes
server.use('/games/', gameRouter);
server.use('/players/', playerRouter);
server.use('/moves/', moveRouter);
server.use('/turns/', turnRouter);

function initializeGameState(prefilledState: { [gameId: string]: Game }) {
  Object.keys(prefilledState).forEach((gameId) => {
    const game = prefilledState[gameId];
    gameState.addGame(game.numTurns); // You can specify the number of rounds here
    gameState.getGame(gameId).players = game.players;
    gameState.getGame(gameId).turns = game.turns;
    gameState.getGame(gameId).currentTurn = game.currentTurn;
    gameState.getGame(gameId).numTurns = game.numTurns;
  });
}

//initializeGameState(prefilledGameState);

// Start the server
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 30167;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
