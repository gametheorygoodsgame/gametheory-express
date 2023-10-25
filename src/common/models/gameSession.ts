import { GameMode, GameState, Player } from './'; // Abstract game mode and game state

export class GameSession {
    id: string;
    owner: string;
    players: Player[];
    inviteLink: string;
    qrCode: string;
    currentTurn: number;
    gameMode: GameMode;
    gameState: GameState;
    startedAt: Date;

    constructor(
        id: string,
        owner: string,
        players: Player[],
        inviteLink: string,
        qrCode: string,
        gameMode: GameMode,
        gameState: GameState,
        startedAt: Date
    ) {
        this.id = id;
        this.owner = owner;
        this.players = players;
        this.inviteLink = inviteLink;
        this.qrCode = qrCode;
        this.currentTurn = 1;
        this.gameMode = gameMode;
        this.gameState = gameState;
        this.startedAt = startedAt;
    }

    // Add methods for session management
    /*startGame(): void {
        this.gameMode.startGame(this.gameState);
    }

    endGame(): void {
        this.gameMode.endGame(this.gameState);
    }

    getPlayerById(playerId: string): Player | undefined{
        return this.players.find((player) => player.id === playerId);
    }*/
}