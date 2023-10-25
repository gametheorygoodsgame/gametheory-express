import {v4 as uuidv4} from 'uuid';
import NodeCache from 'node-cache';
import {ValidNumRedCards} from "../common/validators";
import {Game, /*PublicGoodsGameMove, Player*/} from "@eikermannlfh/gametheoryapi";
import GameMocker from "../mocking/game";
import { Player, PublicGoodsPot, GameSession, Move } from '../old';

// Definieren von benutzerdefinierten Typen

//type Player = { name: string, moves: any[] };
type PlayersMap = { [key: string]: Player };

// Erstellen einer globalen Cache-Instanz für den Spielzustand
const globalState = new NodeCache({ useClones: false, stdTTL: 10800 });

// Funktion zum Hinzufügen eines neuen Spiels
export function addGame(game: Game) {
    // Generieren einer neuen Spiel-ID
    const gameID: string = uuidv4();
    const newGame: Game = GameMocker.createGame(gameID);

    // Hinzufügen eines neuen Spiels zum globalen Zustand
    globalState.set(gameID, newGame)

    // Rückgabe der Spiel-ID
    return newGame;
}

export function deleteGame(gameID: string) {
    return globalState.del(gameID)
}

export function addPlayer(gameID: string, name: string) {

    const playerID = uuidv4();

    // Überprüfung, ob das Spiel im globalen Zustand existiert
    if (!globalState.has(gameID)) {
        console.log("Error")
        throw new Error('Game not Found!');
    }
    // Abrufen des Spiels aus dem globalen Zustand und Hinzufügen des neuen Spielers
    const game: Game | undefined = globalState.get(gameID)

    if (game){
        if(game.currTurn != 0) {
            throw new Error("Game has already started")
        }
        else {
            game.players.push(playerID)
        }
    }

    return playerID;
}

// Funktion zum Abrufen aller Spieler eines Spiels
export function getAllPlayers(gameID: string) {
    // Abrufen des Spiels aus dem globalen Zustand
    const game: Game | undefined = globalState.get(gameID);
    let allPlayersArray: String[] = [];

    if(game){
        allPlayersArray = game.players;
    }

    // Rückgabe des Arrays mit allen Spielern
    return allPlayersArray;
}

export function finishTurn(gameID: string, redCardValue: number) {
    let currentTurn: number = 0;
    if (globalState.has(gameID)) {
        const game: Game | undefined = globalState.get(gameID);
        if(game){
            game.currTurn++;
            currentTurn = game.currTurn;
        }
    }
    else {
        console.log("Error")
        throw new Error('Game not Found!');
    }

    //game.currentRound++;
    //game.rounds[game.currentRound] = { redCardValue: redCardValue, numOfRedCardsPlayed: null }
    //return game.currentRound
    return currentTurn;
}

export function getPotTotal(gameId: string){
    const game: Game | undefined = globalState.get(gameId);
    if(game){
        return game.potCards * game.cardPotValue;
    }
}

export function savePlayerMove(move: Move){

}

// Funktion zum Hinzufügen von Spielzügen eines Spielers
/*export function addMoves(gameID: string, playerID: string, numRedCards: ValidNumRedCards) {
    // Abrufen des Spiels und des Spielers aus dem globalen Zustand und Hinzufügen des Spielzugs
    const game: Game | undefined = globalState.get(gameID);
    if(game) {
        const player: string = game.players.find((Object) => Object.playerId === playerId);
        player.moves[game.currentRound] = numRedCards;
    }
}*/

// Funktion zum Setzen des Wertes einer Karte für eine Runde
export function setCardValue(gameID: string, cardValue: number) {
    // Abrufen des Spiels aus dem globalen Zustand und Setzen des Kartenwerts für die aktuelle Runde
    const game: any = globalState.get(gameID);
    game.rounds[game.currentRound] = cardValue;
}

export function getCurrentRound(gameID: string) {
    if (!globalState.has(gameID)) {
        console.log("Error")
        throw new Error('Game not Found!');
    }
    const game: any = globalState.get(gameID);

    return game.currentRound;
}

// Funktion zum Abrufen von Informationen zu allen Spielen im globalen Zustand
export function getGameListInfo() {
    // Abrufen der IDs aller Spiele im globalen Zustand
    const gameListKeys: string[] = globalState.keys()

    // Erstellen eines Arrays von Objekten, das Informationen zu jedem Spiel enthält
    const gameList = gameListKeys.map((gameID) => {
            const game: any = globalState.get(gameID)
            const playerNumber: number = game.players.getStats().keys;
            const currentRound: number = game.currentRound;
            const numRounds: number = game.numRounds;
            return { gameID: gameID, playerNumber: playerNumber, currentRound: currentRound, numRounds: numRounds }
        }
    )

    // Erstellen eines Objekts mit Informationen zur Gesamtzahl der Spiele im globalen Zustand und einer Liste aller Spiele
    const gameListInfo = { totalNumber: globalState.getStats().keys, gameList: gameList }

    // Rückgabe des Objekts mit Informationen zu allen Spielen
    return gameListInfo;
}

export function waitForCurrentRoundChange(gameID: string): Promise<void> {
    return new Promise((resolve,reject) => {
        const game: any = globalState.get(gameID);
        const currentRound =  game.currentRound.valueOf() ;

        const interval = setInterval(() => {
            if (game.currentRound != currentRound) {
                clearInterval(interval);
                const nextRound = getCurrentRound(gameID);
                resolve(nextRound);
            }
        }, 1000); // Check every second for the change in the current round

        // Reject the promise if the game is not found within 60 seconds
        setTimeout(() => {
            clearInterval(interval);
            reject(new Error('Game not found or round change took too long.'));
        }, 60000);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////
export function createGameSession(owner: string, turns: number): GameSession {
    const sessionId = uuidv4(); // Generate a unique ID for the session
    const publicGoodsPotId = uuidv4(); // Generate a unique ID for the session
    const newSession: GameSession = {
        id: sessionId,
        owner,
        turns,
        currentTurn: 1,
        players: [],
        publicGoodsPot: {
            id: publicGoodsPotId,
            totalRedCards: 0,
            potValue: 2, // Default pot value
        },
    };

    globalState.set(sessionId, newSession, 0); // Store the game session in the cache
    return newSession;
}

export function addPlayerToSession(sessionId: string, player: Player): GameSession | undefined {
    const session = globalState.get(sessionId) as GameSession | undefined;
    if (session) {
        session.players.push(player);
        globalState.set(sessionId, session, 0); // Update the session in the cache
    }
    return session;
}

function makeMove(sessionId: string, move: Move): GameSession | undefined {
    const session = globalState.get(sessionId) as GameSession | undefined;
    if (session) {
        // Update game logic for the move here, including adjusting the pot
        // and updating player scores based on your rules.

        // For example, you can update the pot and scores like this:
        session.publicGoodsPot.totalRedCards += move.cardsThrown.redCards;
        // Update player scores based on your rules

        // Increment the current turn
        session.currentTurn++;

        // Store the player's move and turn information
        if (!session.moves) {
            session.moves = [];
        }
        move.id = uuidv4(); // Generate a unique ID for the move
        session.moves.push(move);

        globalState.set(sessionId, session, 0); // Update the session in the cache
    }
    return session;
}

function finishTurn2(sessionId: string): GameSession | undefined {
    const session = globalState.get(sessionId) as GameSession | undefined;
    if (session) {
        // Implement logic to distribute rewards based on your game rules
        updatePlayerScores(session);

        // Reset the pot
        session.publicGoodsPot.totalRedCards = 0;

        // Increment the current turn
        session.currentTurn++;

        // Store the turn's end
        if (!session.turnsEnded) {
            session.turnsEnded = [];
        }
        session.turnsEnded.push(session.currentTurn);

        globalState.set(sessionId, session, 0); // Update the session in the cache
    }
    return session;
}

export function getGameSession(sessionId: string): GameSession | undefined {
    return globalState.get(sessionId) as GameSession | undefined;
}

export function updatePlayerScores(session: GameSession): void {
    const { publicGoodsPot, players } = session;
    const redCardsWorth = publicGoodsPot.potValue; // Get the worth of red cards in the pot

    for (const player of players) {
        // Calculate the player's score based on the number of red cards in their hand
        const redCardScore = player.hand.redCards * redCardsWorth;

        // Update the player's total score
        player.score += redCardScore;
    }
}

