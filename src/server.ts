import express, { type Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as admin from 'firebase-admin';
import { serviceAccount } from './utils/firebase';
import morganMiddleware from './middleware/morgan';
import logger from './utils/logger';
import gameRouter from './routes/games';
import playerRouter from './routes/players';
import moveRouter from './routes/moves';

const PORT = 30167;

const server: Express = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware konfigurieren
server.use(cors({ origin: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(morganMiddleware);

// Routen konfigurieren
server.use('/games/', gameRouter);
server.use('/players/', playerRouter);
server.use('/moves/', moveRouter);

// Server starten
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : PORT;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
