import { mainLogger } from '../logger/logger';
import mongoose from 'mongoose';
import {DataBaseConnectionOptions} from "../../@types/mongo/MongoConfig";


class ManagerMongoDB {
    connect(UriConnection: string, ConnectionOptions: DataBaseConnectionOptions): void {
        mongoose.set('strictQuery', true);
        mongoose
            .connect(UriConnection, ConnectionOptions)
            .then(() =>
                mainLogger.debug('Database connection has been successful')
            )
            .catch((error) =>
                mainLogger.debug('Error connecting to database', error)
            );
    };
}

export default new ManagerMongoDB();
