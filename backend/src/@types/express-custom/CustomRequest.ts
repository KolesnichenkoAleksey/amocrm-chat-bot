import { Request } from 'express';

export type TypedRequestQuery<T> = Request<object, object, object, T>;

export type TypedRequestBody<T> = Request<object, object, T, object>;