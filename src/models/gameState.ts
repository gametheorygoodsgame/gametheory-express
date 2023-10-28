import { v4 as UUIDv4 } from 'uuid';
import NodeCache from 'node-cache';
import { findOrThrow, GameNotFoundError, PlayerNotFoundError } from '../utils/findOrThrow';
import { Player } from './player';
import { Game } from './game';
import { ValidNumRedCards } from './move';
import { validateUUIDv4 } from '../utils/validatorUUIDv4';

const globalState = new NodeCache({ useClones: false, stdTTL: 10800 });

function getGame(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  return findOrThrow<Game, GameNotFoundError>(globalState.get(validGameId), GameNotFoundError);
}

function getAllGames(): Game[] {
  const gameIds = globalState.keys();
  const games = globalState.mget(gameIds);
  return Object.values(games) as Game[];
}

function addGame(numRounds: number) {
  const gameId: string = UUIDv4();
  const game: Game = {
    id: gameId,
    players: [],
    turns: [],
    currentTurn: 0,
    numTurns: numRounds,
  };

  globalState.set(gameId, game);
  return gameId;
}

function deleteGame(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  return globalState.del(validGameId);
}

function addPlayer(gameId: string, name: string) {
  const validGameId = validateUUIDv4(gameId);
  const playerId = UUIDv4();

  const game = getGame(validGameId);

  if (game) {
    if (game.currentTurn !== 0) {
      throw new Error('Game has already started');
    }

    const playerList = game.players;
    const player: Player = {
      id: playerId,
      name: name,
      moves: [],
      score: 0,
    };

    playerList.push(player);

    return playerId;
  }
}

function getPlayer(gameId: string, playerId: string) {
  const validGameId = validateUUIDv4(gameId);
  const validPlayerId = validateUUIDv4(playerId);
  return findOrThrow<Player, PlayerNotFoundError>(
      getGame(validGameId).players.find((currPlayer) => currPlayer.id === validPlayerId),
      PlayerNotFoundError
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

function startNewTurn(gameId: string, redCardValue: number) {
  const validGameId = validateUUIDv4(gameId);
  const game: Game = gameState.getGame(validGameId);

  game.turns[game.currentTurn] = redCardValue * game.players.reduce((total, player) => {
    // Find the moves for the currentTurn for the current player
    const movesForCurrentTurn = player.moves.filter((move) => move.numTurn === game.currentTurn);

    // Sum the numRedCards for the currentTurn
    const numRedCardsForCurrentTurn = movesForCurrentTurn
        .reduce((sum, move) => sum + move.numRedCards, 0);

    // Add the sum to the player's score
    player.score += numRedCardsForCurrentTurn;

    // Return the updated total
    return total + numRedCardsForCurrentTurn;
  }, 0);

  game.currentTurn++;
  return game.currentTurn;
}

function addMove(gameId: string, playerId: string, numRedCards: ValidNumRedCards) {
  const validGameId = validateUUIDv4(gameId);
  const validPlayerId = validateUUIDv4(playerId);
  const game: Game = gameState.getGame(validGameId);
  if (game.currentTurn === 0) return;
  const player: Player = gameState.getPlayer(validGameId, validPlayerId);
  player.moves[game.currentTurn - 1] = { numRedCards, numTurn: game.currentTurn };
}

async function waitForCurrentTurnChange(gameId: string): Promise<void> {
  const validGameId = validateUUIDv4(gameId);
  await new Promise((resolve, reject) => {
    const game: Game = gameState.getGame(validGameId);
    const currentTurn = game.currentTurn.valueOf();

    const interval = setInterval(() => {
      if (game.currentTurn !== currentTurn) {
        clearInterval(interval);
        const nextTurn = gameState.getCurrentTurn(validGameId);
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
