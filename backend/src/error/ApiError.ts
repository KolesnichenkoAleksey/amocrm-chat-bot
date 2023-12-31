import { StatusCodes } from '../consts/statusCodes';

class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message: string): ApiError {
        return new ApiError(StatusCodes.BadRequest.Code, message);
    }

    static unauthorized(message: string): ApiError {
        return new ApiError(StatusCodes.Unauthorized.Code, message);
    }

    static forbidden(message: string): ApiError {
        return new ApiError(StatusCodes.Forbidden.Code, message);
    }

    static notFound(message: string): ApiError {
        return new ApiError(StatusCodes.NotFound.Code, message);
    }

    static internal(message: string): ApiError {
        return new ApiError(StatusCodes.Internal.Code, message);
    }
}

export { ApiError };