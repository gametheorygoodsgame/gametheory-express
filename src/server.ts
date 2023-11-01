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
import turnRouter from './routes/turns';

const server: Express = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configure middleware
server.use(cors({ origin: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(morganMiddleware);

// Configure routes
server.use('/games/', gameRouter);
server.use('/players/', playerRouter);
server.use('/moves/', moveRouter);
server.use('/turns/', turnRouter);

// Start the server
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 30167;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
