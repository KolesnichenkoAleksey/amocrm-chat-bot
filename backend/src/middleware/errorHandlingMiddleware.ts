import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../error/ApiError';
import { StatusCodes } from '../consts/statusCodes';

export default function(error: unknown, req: Request, res: Response, next: NextFunction) {

    if (error instanceof ApiError) {
        return res.status(error.status).json({ message: error.message });
    }

    return res.status(StatusCodes.Internal.Code).json({ message: 'Непредвиденная ошибка!' });
}