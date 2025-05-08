import { v4 as UUIDv4 } from 'uuid';
import NodeCache from 'node-cache';
import { Game, Move, Player, MoveNumRedCardsEnum } from '@gametheorygoodsgame/gametheory-openapi';
import { findOrThrow, GameNotFoundError, PlayerNotFoundError } from '../utils/findOrThrow';
import { validateUUIDv4 } from '../utils/validatorUUIDv4';
import logger from '../utils/logger';
import games from '../routes/games';

// Einen cache state erstellen, der 3h existiert
const globalState = new NodeCache({ useClones: false, stdTTL: 10800 });

function getGame(gameId: string) {
  // Finde Spiel oder werfe Error
  return findOrThrow<Game, GameNotFoundError>(globalState.get(gameId), GameNotFoundError);
}

// aktuelles datum und zeit erhalten und in den Spieltitel umwandeln
function getCurrentDateTime(): string {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function getAllGames(): Game[] {
  // Finde alle gameIds
  const gameIds = globalState.keys();
  // Finde die Spiele zu jeder Id
  const games = globalState.mget(gameIds);

  return Object.values(games) as Game[];
}

function addGame(gameReq: Game) {
  // Erstelle eine neue Id
  const gameId: string = UUIDv4();
  // Game instanziieren
  const game: Game = {
    id: gameId,
    name: (gameReq.name === '') ? getCurrentDateTime() : gameReq.name, // sets current time as game name if a name has not existed before
    players: [],
    potCards: [0],
    cardHandValue: [1],
    cardPotValue: [2],
    currentTurn: 0,
    numTurns: gameReq.numTurns,
    winner: undefined,
  };

  // Game im State speichern
  globalState.set(gameId, game);
  return game;
}

function deleteGame(gameId: string) {
  // GameId auf UUIDv4-Format prüfen
  const validGameId = validateUUIDv4(gameId);
  return globalState.del(validGameId) > 0;
}

function addPlayer(gameId: string, name: string) {
  // Erstelle eine neue Id
  const playerId = UUIDv4();

  const game = getGame(gameId);

  // Wenn das Spiel bereits begonnen hat, wirf Fehler statt einen neuen Spieler hinzuzufügen
  if (game.currentTurn !== 0) {
    throw new Error('Game has already started');
  }

  // Player instanziieren
  const player: Player = {
    id: playerId,
    name,
    moves: [{ numTurn: 0, numRedCards: 0 }],
    score: 0,
  };

  // Player an die Liste der Spieler im Game anfügen
  game.players.push(player);

  return player;
}

function getPlayer(gameId: string, playerId: string) {
  // GameId auf UUIDv4-Format prüfen
  const validGameId = validateUUIDv4(gameId);
  // PlayerId auf UUIDv4-Format prüfen
  const validPlayerId = validateUUIDv4(playerId);

  // Player aus der Spielerliste suchen, der die PlayerId besitzt, oder Error werfen
  return findOrThrow<Player, PlayerNotFoundError>(
    getGame(validGameId).players.find((currPlayer) => currPlayer.id === validPlayerId),
    PlayerNotFoundError,
  );
}

function getAllPlayers(gameId: string) {
  // GameId auf UUIDv4-Format prüfen
  const validGameId = validateUUIDv4(gameId);
  const game = getGame(validGameId);

  return game.players;
}

function getCurrentTurn(gameId: string) {
  // GameId auf UUIDv4-Format prüfen
  const validGameId = validateUUIDv4(gameId);

  const game = getGame(validGameId);
  return game.currentTurn;
}

function getNumTurns(gameId: string) {
  // GameId auf UUIDv4-Format prüfen
  const validGameId = validateUUIDv4(gameId);

  const game = getGame(validGameId);
  return game.numTurns;
}

function calculateScoresAndPot(game: Game): void {
  // 🔎 Prüfe, ob für diese Runde überhaupt ein Kartenwert vorliegt
  if (!game.cardHandValue[game.currentTurn]) {
    logger.warn(`⚠️ Kein Kartenwert für Runde ${game.currentTurn}`);
    return;
  }

  logger.debug(`[GameState] calculateScoresAndPot: ${JSON.stringify(game, null, 2)}`);

  game.players.forEach((player, index) => {
    // 🧩 Suche den Spielzug für diese Runde
    const move = player.moves[game.currentTurn];

    // ❌ Wenn der Spieler keinen Zug abgegeben hat, wird er übersprungen
    if (!move) {
      logger.warn(`⚠️ Spieler ${player.name} hat keinen Move für Runde ${game.currentTurn}. Score bleibt gleich.`);
      return;
    }

    // ✅ Fallback-Werte verwenden, falls einzelne Werte fehlen
    const redCards = move.numRedCards ?? 0;
    const handValue = game.cardHandValue[game.currentTurn] ?? 1;
    const potValue = game.cardPotValue[game.currentTurn] ?? 1;
    const potCards = game.potCards[game.currentTurn] ?? 0;

    logger.debug(`🧮 ${player.name}: RedCards=${redCards}, Hand=${handValue}, PotCards=${potCards}, Pot=${potValue}`);

    // 🧠 Punkteberechnung:
    // - 2 Punkte minus rote Karten * Handkartenwert
    // - plus Anzahl Pot-Karten * Pot-Wert
    game.players[index].score += (2 - redCards) * handValue;
    game.players[index].score += potCards * potValue;
  });
}

function isGameFinished(gameId: string) {
  const game = getGame(gameId);
  game.isFinished = (getCurrentTurn(gameId) >= getNumTurns(gameId));
  return game.isFinished;
}

function startNewTurn(gameId: string, gameReq: Game) {
  const gameRes = getGame(gameId);

  // 🛠️ Übertrage inactiveSinceTurn vom Request-Spieler auf gespeicherten Spieler
  gameReq.players.forEach((reqPlayer) => {
    const existing = gameRes.players.find((p) => p.id === reqPlayer.id);
    if (existing && 'inactiveSinceTurn' in reqPlayer) {
      (existing as any).inactiveSinceTurn = (reqPlayer as any).inactiveSinceTurn;
    }
  });

  // Wenn dies nicht die Vorrunde ist, berechne die Scores
  if (gameReq.currentTurn !== 0) {
    calculateScoresAndPot(gameReq);
  }

  if (!isGameFinished(gameId)) {
    const nextTurn = gameReq.currentTurn + 1;

    // Ist der Kartenwert der Hand für die Nächste Runde gesetzt?
    if (gameReq.cardHandValue[nextTurn]) {
      logger.debug(`Incoming card hand Value is ${gameReq.cardHandValue[nextTurn]}`);
      // Wenn ja, füge ihn an das Array an
      gameRes.cardHandValue.push(gameReq.cardHandValue[nextTurn]);
      logger.debug(`Set card hand value hand for turn #${nextTurn} to ${gameReq.cardHandValue[nextTurn]}.`);
    } else {
      // Wenn nein, füge 1 an das Array an
      gameRes.cardHandValue.push(1);
      logger.debug(`Set card hand value for turn #${nextTurn} to 1.`);
    }

    // Ist der Kartenwert des Pots für die Nächste Runde gesetzt?
    if (gameReq.cardPotValue[nextTurn]) {
      logger.debug(`Incoming card pot Value is ${gameReq.cardPotValue[nextTurn]}`);
      // Wenn ja, füge ihn an das Array an
      gameRes.cardPotValue.push(gameReq.cardPotValue[nextTurn]);
      logger.debug(`Set card pot value hand for turn #${nextTurn} to ${gameReq.cardPotValue[nextTurn]}.`);
    } else {
      // Wenn nein, füge 1 an das Array an
      gameRes.cardPotValue.push(1);
      logger.debug(`Set card pot value for turn #${nextTurn} to 1.`);
    }

    // eslint-disable-next-line no-plusplus
    gameRes.currentTurn++;
  }

  return gameRes;
}

function addMove(gameId: string, playerId: string, moveReq: Move) {
  // GameId auf UUIDv4-Format prüfen
  const validGameId = validateUUIDv4(gameId);
  // PlayerId auf UUIDv4-Format prüfen
  const validPlayerId = validateUUIDv4(playerId);

  const game: Game = getGame(validGameId);

  // Wenn die laufende Runde noch die Vorrunde ist, werfe Error
  if (game.currentTurn === 0) {
    throw new Error("The game hasn't started yet.");
  }

  const player: Player = getPlayer(validGameId, validPlayerId);

  // 🛡️ Verhindere, dass inaktive Spieler noch Züge abgeben
  if ('inactiveSinceTurn' in player && typeof player.inactiveSinceTurn === 'number') {
    if (game.currentTurn >= player.inactiveSinceTurn) {
      throw new Error(
        `Du bist seit Runde ${player.inactiveSinceTurn} inaktiv und darfst leider keine weiteren Züge mehr machen.`,
      );
    }
  }

  // Füge den übergebenen Move dieser Runde an das Move-Array des Spielers an
  // Wenn die Anzahl roter Karten nicht definiert ist, setze sie 0
  const move: Move = { numRedCards: moveReq.numRedCards || 0, numTurn: game.currentTurn };
  player.moves[game.currentTurn] = move;
  logger.debug(`Added move ${JSON.stringify(move)} to Player ${player.name}(${player.id}) in turn #${game.currentTurn}.`);

  // Füge die roten Karten dem Pott dieser Runde hinzu
  // Wenn die Anzahl roter Karten nicht definiert ist, setze sie 0
  if (!game.potCards[game.currentTurn] || typeof game.potCards[game.currentTurn] !== 'number') {
    game.potCards[game.currentTurn] = 0;
  }
  game.potCards[game.currentTurn] += move.numRedCards;
  logger.info(`Added ${move.numRedCards} to pot for turn #${game.currentTurn}.`);

  return move;
}

function getNumFinishedPlayers(gameId: string) {
  let count = 0;
  const game = getGame(gameId);
  game?.players.forEach((player) => {
    if (player.moves[game?.currentTurn]) {
      // eslint-disable-next-line no-plusplus
      count++;
    }
  });
  return count;
}

function setWinner(gameId: string): Player {
  const validGameId = validateUUIDv4(gameId);
  const game = getGame(validGameId);

  if (!game.players || game.players.length === 0) {
    throw new Error('Kein Spieler im Spiel vorhanden.');
  }

  // Gewinner darf nur einmal gesetzt werden
  if (game.winner) {
    logger.info(`Gewinner für Spiel ${gameId} war bereits gesetzt: ${game.winner}`);
    return game.winner;
  }

  // Zufälligen Index wählen
  const randomIndex = Math.floor(Math.random() * game.players.length);
  const selectedWinner = game.players[randomIndex];

  // Gewinner setzen
  game.winner = selectedWinner;
  logger.info(`Zufällig gewählter Gewinner für Spiel ${gameId}: ${selectedWinner.name}`);

  return selectedWinner;
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
  isGameFinished,
  setWinner,
};
