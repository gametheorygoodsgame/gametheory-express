import {Game, gameState, Player, ValidNumRedCards} from './gameState';

export function startNewTurn (gameID: string, redCardValue: number) {
  if (!gameState.globalState.has(gameID)) {
    throw new Error('Game not Found!');
  }
  const game: Game = gameState.globalState.get(gameID);

  game.turns[game.currentTurn] = redCardValue * game.players.reduce((total, player) => {
    // Find the moves for the currentTurn for the current player
    const movesForCurrentTurn = player.moves.filter((move) => move.numTurn === game.currentTurn);

    // Sum the numRedCards for the currentTurn
    const numRedCardsForCurrentTurn = movesForCurrentTurn.reduce((sum, move) => sum + move.numRedCards, 0);

    // Add the sum to the player's score
    player.score += numRedCardsForCurrentTurn;

    // Return the updated total
    return total + numRedCardsForCurrentTurn;
  }, 0);

  game.currentTurn++;
  return game.currentTurn;
}

export function addMove (gameId: string, playerId: string, numRedCards: ValidNumRedCards) {
  const game: Game = gameState.globalState.get(gameId);
  if (game.currentTurn === 0) return;
  const player: Player = game.players.find((player) => player.id === playerId);
  player.moves[game.currentTurn - 1] = { numRedCards: numRedCards, numTurn: game.currentTurn };
}

/*export function getGameStatistics (gameId: string) {
  if (!gameState.globalState.has(gameId)) {
    throw new Error('Game not Found!');
  }

  const game: Game = gameState.globalState.get(gameId);
  const currentTurn = game.currentTurn;
  const turns = game.turns;

  if (!turns || currentTurn <= 0) {
    throw new Error('Turns data not found for this game.');
  }

  const gameStatistics: object[] = [];

  for (let i = 0; i < game.currentTurn - 1; i++) {
    const turn = turns[i];
    turn.turn = `Runde ${i + 1}`;
    gameStatistics.push(turn);
  }

  return gameStatistics;
}*/

export async function waitForCurrentTurnChange (gameId: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const game: Game = gameState.globalState.get(gameId);
    const currentTurn = game.currentTurn.valueOf();

    const interval = setInterval(() => {
      if (game.currentTurn !== currentTurn) {
        clearInterval(interval);
        const nextTurn = gameState.getCurrentTurn(gameId);
        resolve(nextTurn);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Game not found or turn change took too long.'));
    }, 600000);
  });
}
