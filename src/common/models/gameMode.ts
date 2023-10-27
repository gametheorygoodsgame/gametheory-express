import { GameState } from './gameState';

export abstract class GameMode {
  abstract startGame(gameState: GameState): void;
  abstract endGame(gameState: GameState): void;
  // Define common properties for game mode
}
