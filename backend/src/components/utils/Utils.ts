import { v5 as uuidv5 } from 'uuid';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', `${process.env.NODE_ENV}.env`)
});

class Utils {

    private readonly TELEGRAM_USER_SECRET_KEY;

    constructor() {
        this.TELEGRAM_USER_SECRET_KEY = process.env.TELEGRAM_UUID_KEY || 'ac76cf21-d6d4-4344-91db-7e4ccbaef687';
    }

    hashFunction(input: string): string {
        return uuidv5(input, this.TELEGRAM_USER_SECRET_KEY);
    }

}

export default new Utils();