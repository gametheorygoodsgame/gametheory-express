import { v4 as UUIDv4 } from 'uuid';
import NodeCache from 'node-cache';
import { Game, Move, Player, MoveNumRedCardsEnum } from '@eikermannlfh/gametheoryapi';
import { findOrThrow, GameNotFoundError, PlayerNotFoundError } from '../utils/findOrThrow';
import { validateUUIDv4 } from '../utils/validatorUUIDv4';
import logger from '../utils/logger';

const globalState = new NodeCache({ useClones: false, stdTTL: 10800 });

function getGame(gameId: string) {
  // const validGameId = validateUUIDv4(gameId);
  return findOrThrow<Game, GameNotFoundError>(globalState.get(gameId), GameNotFoundError);
}

function getAllGames(): Game[] {
  const gameIds = globalState.keys();
  const games = globalState.mget(gameIds);
  return Object.values(games) as Game[];
}

function addGame(gameReq: Game) {
  const gameId: string = UUIDv4();
  const game: Game = {
    id: gameId,
    players: [],
    potCards: [0],
    cardHandValue: [1],
    cardPotValue: [2],
    currentTurn: 0,
    numTurns: gameReq.numTurns,
  };

  globalState.set(gameId, game);
  return game;
}

function deleteGame(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  return globalState.del(validGameId) > 0;
}

function addPlayer(gameId: string, name: string) {
  // const validGameId = validateUUIDv4(gameId);
  const playerId = UUIDv4();

  const game = getGame(gameId);
  if (game.currentTurn !== 0) {
    throw new Error('Game has already started');
  }

  const playerList = game.players;
  const player: Player = {
    id: playerId,
    name,
    moves: [],
    score: 0,
  };

  playerList.push(player);

  return player;
}

function getPlayer(gameId: string, playerId: string) {
  const validGameId = validateUUIDv4(gameId);
  const validPlayerId = validateUUIDv4(playerId);
  return findOrThrow<Player, PlayerNotFoundError>(
    getGame(validGameId).players.find((currPlayer) => currPlayer.id === validPlayerId),
    PlayerNotFoundError,
  );
}

function getAllPlayers(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  const game = getGame(validGameId);
  return game.players;
}

function getCurrentTurn(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  const game = getGame(validGameId);
  return game.currentTurn;
}

function getNumTurns(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  const game = getGame(validGameId);
  return game.numTurns;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function startNewTurn(gameId: string, redCardValue: number) {
  /*
  const validGameId = validateUUIDv4(gameId);
  const game: Game = getGame(validGameId);

  game.turns[game.currentTurn] = game.players.reduce((total, player) => {
    // Find the moves for the currentTurn for the current player
    const movesForCurrentTurn = player.moves.filter((move) => move.numTurn === game.currentTurn);

    // Sum the numRedCards for the currentTurn
    const numRedCardsForCurrentTurn = movesForCurrentTurn
      .reduce((sum, move) => sum + move.numRedCards, 0);

    // Add the sum to the player's score
    player.score += numRedCardsForCurrentTurn;

    // Return the updated total
    return total + numRedCardsForCurrentTurn;
  }, 0) * redCardValue;

  game.currentTurn++;
  return game.currentTurn;
  */
}

function addMove(gameId: string, playerId: string, moveReq: Move) {
  const validGameId = validateUUIDv4(gameId);
  const validPlayerId = validateUUIDv4(playerId);
  const game: Game = getGame(validGameId);
  if (game.currentTurn === 0) {
    throw new Error('The game hasn\'t started yet.');
  }
  const player: Player = getPlayer(validGameId, validPlayerId);
  const move: Move = { numRedCards: moveReq.numRedCards, numTurn: game.currentTurn };
  player.moves[game.currentTurn] = move;
  logger.debug(player);
  return move;
}

async function waitForCurrentTurnChange(gameId: string): Promise<void> {
  const validGameId = validateUUIDv4(gameId);
  await new Promise((resolve, reject) => {
    const game: Game = getGame(validGameId);
    const currentTurn = game.currentTurn.valueOf();

    const interval = setInterval(() => {
      if (game.currentTurn !== currentTurn) {
        clearInterval(interval);
        const nextTurn = getCurrentTurn(validGameId);
        resolve(nextTurn);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Game not found or turn change took too long.'));
    }, 600000);
  });
}

export const gameState = {
  getGame,
  getAllGames,
  addGame,
  deleteGame,
  addPlayer,
  getPlayer,
  getAllPlayers,
  getCurrentTurn,
  getNumTurns,
  addMove,
  startNewTurn,
  waitForCurrentTurnChange,
};
