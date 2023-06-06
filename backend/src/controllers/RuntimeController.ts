import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';

class RuntimeController {
    async ping(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(StatusCodes.Ok.Code).json({message: `pong ${Date.now()}`});
        } catch (error: unknown) {

            if (error instanceof Error) {
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                next(ApiError.internal(error));
            }

        }
    }
}

export default new RuntimeController();