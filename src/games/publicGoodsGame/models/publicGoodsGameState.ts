import {GameState} from "../../../common/models";
import PublicGoodsGameMove from "./publicGoodsGameMove";

const DEFAULT_RED_CARD_VALUE_ON_HAND = 1;
const DEFAULT_RED_CARD_VALUE_IN_POT = 2;
const STARTING_TURN = 0;
const DEFAULT_NUMBER_OF_TURNS = 5;
const STARTING_POT = 0;

export class PublicGoodsGameState extends GameState {
    publicGoodsPotCards: number;
    currentTurn: number;
    numberOfTurns: number;
    redCardValueOnHand: number = DEFAULT_RED_CARD_VALUE_ON_HAND;
    redCardValueInPot: number = DEFAULT_RED_CARD_VALUE_IN_POT;
    moves: PublicGoodsGameMove[];

    constructor(redCardValueInPot: number = DEFAULT_RED_CARD_VALUE_IN_POT) {
        super();
        this.publicGoodsPotCards = STARTING_POT;
        this.currentTurn = STARTING_TURN;
        this.numberOfTurns = DEFAULT_NUMBER_OF_TURNS;
        this.moves = [];
    }
    // Implement game-specific methods and properties
    // For example, methods to update card values and pot value
}