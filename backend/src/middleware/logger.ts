import { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware
 * Logs all incoming requests with method, URL, status code, and response time
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = 
      res.statusCode >= 500 ? '\x1b[31m' : // Red for 5xx
      res.statusCode >= 400 ? '\x1b[33m' : // Yellow for 4xx
      res.statusCode >= 300 ? '\x1b[36m' : // Cyan for 3xx
      '\x1b[32m'; // Green for 2xx

    console.log(
      `${statusColor}[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms\x1b[0m`
    );
  });

  next();
};

