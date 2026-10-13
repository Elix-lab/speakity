import type { NextFunction, Request, Response } from 'express';

/** Throw from a controller to answer with that status and message. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `No route for ${req.method} ${req.path}`));
}

// Express 5 forwards rejected promises from async handlers here too.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}
