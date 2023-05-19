import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import cors from 'cors';
import { mainLogger } from './components/logger/logger';
import botsState from './state/BotsState';
import errorHandler from './middleware/errorHandlingMiddleware';
import { router } from './routes';
import mongoManager from './components/mongo/MongoManager';
import { MongooseSettings } from './consts/MongooseSettings';
import { errorHandlingByType } from './error/errorHandlingByType';

dotenv.config({
    path: path.resolve(__dirname, '..', `${process.env.NODE_ENV}.env`)
});

const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/amocrmChatBot';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

const mockBotTokens: string[] = [
    '5969836269:AAEUT45drow1aAD0dM6iw8LcXlcwg1V1a-E',
    '5313087216:AAF9X15tR5mzoyu4yN6kb3IHC6BC8fOknN8'
];

const start = async (): Promise<void> => {
    try {
        await mongoManager.connect(MONGO_URI, MongooseSettings);
        app.listen(PORT);
    } catch (error: unknown) {
        errorHandlingByType(error)
    }
};

start().then(() => {
    mainLogger.debug(`Server started on Port ${PORT}`);
    mainLogger.debug('Database connection has been successful');

    botsState.initializeBots(mockBotTokens).launchInitializedBots();
});

