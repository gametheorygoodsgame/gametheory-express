import { v4 as UUIDv4 } from 'uuid';
import NodeCache from 'node-cache';
import { Game, Move, Player, MoveNumRedCardsEnum } from '@gametheorygoodsgame/gametheory-openapi';
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
function calculateScoresAndPot(gameId: string) {
  const validGameId = validateUUIDv4(gameId);
  const game: Game = getGame(validGameId);

  /*game.players.forEach((value, index) => {
    game.potCards[game.currentTurn] = value.moves[game.currentTurn].numRedCards || 0;
    game.players[index].score += 2 - (value.moves[game.currentTurn].numRedCards || 0)
        * game.cardHandValue[game.currentTurn];
  });

  game.players.forEach((value, index) => {
    game.players[index].score += (game.potCards[game.currentTurn]
        * game.cardPotValue[game.currentTurn]) / game.players.length;
  });*/

  return game;
}

function startNewTurn(gameId: string, gameReq: Game) {
  calculateScoresAndPot(gameId);
  const gameRes = getGame(gameId);
  gameRes.cardHandValue = gameReq.cardHandValue;
  gameRes.cardPotValue = gameReq.cardHandValue;
  gameRes.currentTurn++;

  return gameRes;
}

function addMove(gameId: string, playerId: string, moveReq: Move) {
  const validGameId = validateUUIDv4(gameId);
  const validPlayerId = validateUUIDv4(playerId);
  const game: Game = getGame(validGameId);
  if (game.currentTurn === 0) {
    throw new Error('The game hasn\'t started yet.');
  }
  const player: Player = getPlayer(validGameId, validPlayerId);
  const move: Move = { numRedCards: moveReq.numRedCards || 0, numTurn: game.currentTurn };
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

/*
type GameStatisticsItem = {redCardPotValue: number, numOfRedCardsPlayed: number};
type GameStatisticsTotal = GameStatisticsItem[];
type GameStatistics = {total: GameStatisticsTotal};

export function getGameStatistics(gameId: string) {
  const game = getGame(gameId);

  const currentTurn = game.currentTurn;
  const game: Game = {
    id: '',
    numTurns,
    currentTurn: 0,
    players: [],
    cardHandValue: [1],
    cardPotValue: [2],
    potCards: [0],
  };
  const rounds = game.rounds;

  if (!game.potCards || currentTurn <= 0) {
    throw new Error('Rounds data not found for this game.');
  }

  const gameStatistics: GameStatistics = {total: []};
  const gameStatisticsTotal: object[] = [];

  for (let i = 1; i < currentTurn - 1; i++) {
    let totalCardsThisTurn = 0;
    game.players.forEach((value) => {
      totalCardsThisTurn = value.moves[i].numRedCards;
    })
    const redCardValue = game.cardPotValue[i];
    const currentTurnObj: GameStatisticsItem =
        {redCardPotValue: game.cardPotValue[i], numOfRedCardsPlayed: game.potCards[i]};
    gameStatistics.total.push(currentTurnObj);
  }

  return gameStatistics;
}

 */

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
