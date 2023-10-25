import {GameState} from "./";

export abstract class GameMode {
    abstract startGame(gameState: GameState): void;
    abstract endGame(gameState: GameState): void;
    // Define common properties for game mode
}