import { GameSession, Player } from '../../../common/models';
import { PublicGoodsGameMode } from '../models/publicGoodsGameMode';
import { PublicGoodsGameState } from '../models/publicGoodsGameState';
import NodeCache from "node-cache";
import {uuidv4} from "@firebase/util";

const globalState = new NodeCache();

export function createPublicGoodsGameSession(owner: string, players: Player[]): GameSession {
    const sessionId = uuidv4();
    const gameMode = new PublicGoodsGameMode();
    const gameState = new PublicGoodsGameState();

    const newSession: GameSession = {
        id: sessionId,
        owner,
        players,
        gameMode,
        gameState,
        inviteLink: `http://localhost:30167/invite/${sessionId}`,
        qrCode: '',
        currentTurn: 1,
        startedAt: new Date(),
    };

    globalState.set(sessionId, newSession, 0);

    return newSession;
}

export function getAllPublicGoodsGameSessions(): GameSession[] {
    return Object.values(globalState.mget(globalState.keys())) as GameSession[];
}