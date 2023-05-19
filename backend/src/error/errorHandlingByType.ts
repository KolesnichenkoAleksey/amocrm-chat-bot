import { mainLogger } from '../components/logger/logger';

export function errorHandlingByType(error: unknown) {
    if (error instanceof Error) {
        mainLogger.debug(error.message);
    }
    if (typeof error === 'string') {
        mainLogger.debug(error);
    }
}