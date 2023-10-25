import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
import { GameSession, Player } from '../../common/models';
import { createPublicGoodsGameSession, getAllPublicGoodsGameSessions } from './services/publicGoodsGameService';

const globalState = new NodeCache();

export { createPublicGoodsGameSession, getAllPublicGoodsGameSessions };