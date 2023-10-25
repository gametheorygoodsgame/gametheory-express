import {GameMode, GameSession, GameState, Player} from "../../../common/models";
import PublicGoodsGameMove from "./publicGoodsGameMove";
import {PublicGoodsGameState} from "./publicGoodsGameState";

const CARDS_ON_HAND_MAX = 4;
const RED_CARDS_ON_HAND_MAX = 2;
const BLACK_CARDS_ON_HAND_MAX = 2;

export class PublicGoodsGameMode extends GameMode {
    startGame(gameState: GameState): void {
        // Implement start game logic for the 'public goods game'
    }

    endGame(gameState: GameState): void {
        // Implement end game logic for the 'public goods game'
    }

    makeMove(session: GameSession, move: PublicGoodsGameMove) {
        const publicGoodsGameState = session.gameState as PublicGoodsGameState;

        publicGoodsGameState.moves.push(move);
        publicGoodsGameState.publicGoodsPotCards += move.cardsThrown.redCards;
    }

    updateScores(session: GameSession) {
        const publicGoodsGameState = session.gameState as PublicGoodsGameState;
        const totalRedCardsInPot = publicGoodsGameState.publicGoodsPotCards;
        const numberOfPlayers = session.players.length;
        const redCardValueOnHand = publicGoodsGameState.redCardValueOnHand;
        const redCardValueInPot = publicGoodsGameState.redCardValueInPot;

        const scoreIncreaseFromPot = totalRedCardsInPot * redCardValueInPot / numberOfPlayers;

        session.players.forEach((player: Player) => {
            const redCardsThrown = publicGoodsGameState.moves
            .filter((move: PublicGoodsGameMove) => move.playerId === player.id)[0]
                .cardsThrown.redCards;
            const redCardsOnHand = RED_CARDS_ON_HAND_MAX - redCardsThrown;

            player.score += scoreIncreaseFromPot + redCardsOnHand * redCardValueOnHand;
            // Update player's score in your data store
        });
    }
}