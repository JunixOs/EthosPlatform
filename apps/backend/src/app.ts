import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { AppException } from './logica/application/exceptions/AppException';
import { logger } from './infrastructure/logger';

export function createApp(): express.Application {
  const app = express();

  app.use(cors({
    origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
    credentials: true,
  }));

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

    // Global error handler (se registra al final, en routes.ts o server.ts)
    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof AppException) {
        if (err.httpStatus >= 500) {
          logger.error(err, 'AppException en request');
        }
        res.status(err.httpStatus).json({
          success: false,
          data: [],
          errorMessage: err.message,
          errorCode: err.errorCode,
          httpErrorCode: String(err.httpStatus),
        });
        return;
      }
      if (err instanceof Error) {
        logger.error(err, 'Error no controlado en request');
        res.status(400).json({
          success: false,
          data: [],
          errorMessage: err.message,
          errorCode: 'BAD_REQUEST',
          httpErrorCode: '400',
        });
        return;
      }
      logger.error('Error desconocido en request');
      res.status(500).json({
        success: false,
        data: [],
        errorMessage: 'Error interno del servidor.',
        errorCode: 'INTERNAL_ERROR',
        httpErrorCode: '500',
      });
    });

  return app;
}
