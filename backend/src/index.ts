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

const start = async (): Promise<void> => {
    try {
        await mongoManager.connect(MONGO_URI, MongooseSettings);
        app.listen(PORT);
    } catch (error: unknown) {
        errorHandlingByType(error);
    }
};

start().then(async () => {
    mainLogger.debug(`Server started on Port ${PORT}`);
    mainLogger.debug('Database connection has been successful');

    const allUsersBots = await mongoManager.getAllBots();

    if (allUsersBots) {
        const allUsersBotsTokens = allUsersBots
            .map((initializingBots) => initializingBots.initializingBots)
            .flat()
            .map((bot) => bot.botToken);

        botsState.initializeBots(allUsersBotsTokens).launchInitializedBots();

        mainLogger.debug(`Bots in the number of ${new Set(botsState.getBots().map(bot => bot.botToken)).size} pieces were launched`);
    }
});

