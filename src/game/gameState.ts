import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';

export type ValidNumRedCards = 0 | 1 | 2;

export interface Move { numRedCards: number, numTurn: number }
export interface Player { id: string, name: string, moves: Move[], score: number }
export interface Game {id: string, players: Player[], turns: number[], currentTurn: number, numTurns: number}

const globalState = new NodeCache({ useClones: false, stdTTL: 10800 });

function getAllGames (): Game[]{
  const gameIds = gameState.globalState.keys();
  const games = gameState.globalState.mget(gameIds);
  return Object.values(games) as Game[];
}
function addGame (numRounds: number) {
  const gameId: string = uuidv4();
  const game: Game = {
    id: gameId,
    players: [],
    turns: [],
    currentTurn: 0,
    numTurns: numRounds
  };

  globalState.set(gameId, game);
  return gameId;
}

function deleteGame (gameId: string) {
  return globalState.del(gameId);
}

function getGame (gameId: string) {
  if (!globalState.has(gameId)) {
    throw new Error('Game not Found!');
  }
  return globalState.get(gameId);
}

function addPlayer (gameId: string, name: string) {
  const playerId = uuidv4();

  if (!globalState.has(gameId)) {
    throw new Error('Game not Found!');
  }

  const game: Game |undefined = globalState.get(gameId);

  if (game) {
    if (game.currentTurn !== 0) {
      throw new Error('Game has already started');
    }

    const playerList = game.players;
    const player: Player = {
      id: playerId,
      name: name,
      moves: [],
      score: 0
    };

    playerList.push(player);

    return playerId;
  }
}

function getAllPlayers (gameId: string) {
  const game: Game | undefined = globalState.get(gameId);
  if(game){
    return game.players;
  }
}

function getCurrentTurn (gameId: string) {
  if (!globalState.has(gameId)) {
    throw new Error('Game not Found!');
  }
  const game: Game | undefined = globalState.get(gameId);
  if(game) {
    return game.currentTurn;
  }
}

function getNumTurns (gameId: string) {
  if (!globalState.has(gameId)) {
    throw Error('Game not Found!');
  }
  const game: Game | undefined = globalState.get(gameId);
  if(game) {
    return game.numTurns;
  }
}

export const gameState = {
  globalState,
  addGame,
  deleteGame,
  getGame,
  addPlayer,
  getAllPlayers,
  getCurrentTurn,
  getNumTurns
};
