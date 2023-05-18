import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../error/ApiError';
import { StatusCodes } from '../consts/statusCodes';

export default function(err: unknown, req: Request, res: Response, next: NextFunction) {

    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    return res.status(StatusCodes.Internal.Code).json({ message: 'Непредвиденная ошибка!' });
}