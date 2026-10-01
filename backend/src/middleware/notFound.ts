import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: {
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
        statusCode: 404,
      },
    });
    return;
  }
  next();
}

