declare global {
  namespace Express {
    interface Request {
      /** Set by the auth middleware (or the mock user, for now). */
      userId?: string;
    }
  }
}

export {};
