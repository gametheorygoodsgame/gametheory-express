import {Game} from "@eikermannlfh/gametheoryapi/models/Game";
import {Player} from "@eikermannlfh/gametheoryapi";
import GameService from "../old/gameService";

class GameMocker {
    static async fetchGames() {
        // Replace this with actual data retrieval logic
        return await this.fetchDataFromSomewhere();
    }

    static async fetchDataFromSomewhere() {
        let games: Game[] = [];
        games.push(this.createGame());
        return games;
    }

    static createGame(gameId?: String): Game{
        return {
            gameId: 'game123',
            cardHandValue: 1,
            cardPotValue: 2,
            closed: new Date(),
            currTurn: 0,
            maxTurn: 10,
            opened: new Date(),
            owner: this.createPlayer(),
            players: ['player123'],
            potCards: 0
        };
    }

    static createPlayer(playerId?: String): Player{
        return {
            score: 0,
            personId: 'person123',
            playerId: 'player123'
        };
    }
}


export default GameMocker;