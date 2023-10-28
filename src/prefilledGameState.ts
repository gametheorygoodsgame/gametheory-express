import { Game } from './models/game';
import { gameState } from './models/gameState';
import { v4 as UUIDv4 } from 'uuid';

// Initialize some prefilled game state data
const prefilledGameState: { [gameId: string]: Game } = {
    '7a1679dd-3408-4166-b67e-06b62bc2e1db': {
        id: '7a1679dd-3408-4166-b67e-06b62bc2e1db',
        players: [
            { id: 'dc86ae18-1236-46b7-b0b9-67065221d69e', name: 'Player 1', moves: [], score: 0 },
            { id: 'dfed22c4-1325-4bc6-86b9-6d16fda36f84', name: 'Player 2', moves: [], score: 0 },
        ],
        turns: [],
        currentTurn: 1,
        numTurns: 5,
    },
    'f2ff9bb2-ea5a-49cc-912a-87b0d0dcb538': {
        id: 'f2ff9bb2-ea5a-49cc-912a-87b0d0dcb538',
        players: [
            { id: 'dc86ae18-1236-46b7-b0b9-67065221d69e', name: 'Player 3', moves: [], score: 0 },
            { id: 'dfed22c4-1325-4bc6-86b9-6d16fda36f84', name: 'Player 4', moves: [], score: 0 },
        ],
        turns: [],
        currentTurn: 0,
        numTurns: 4,
    },
};

// Populate the globalState cache with the prefilled game state
Object.keys(prefilledGameState).forEach((gameId) => {
    gameState.addGame(5); // You can specify the number of rounds here
    const game = prefilledGameState[gameId];
    gameState.getGame(gameId).players = game.players;
    gameState.getGame(gameId).turns = game.turns;
    gameState.getGame(gameId).currentTurn = game.currentTurn;
    gameState.getGame(gameId).numTurns = game.numTurns;
});

export { prefilledGameState };