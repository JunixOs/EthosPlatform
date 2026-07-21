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
    origin: process.env['FRONTEND_URL'] ?? 'http://localhost:16000',
    credentials: true,
  }));

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}

/** Global error handler — debe registrarse DESPUÉS de todas las rutas */
export function globalErrorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.headers['x-request-id'] ?? crypto.randomUUID?.() ?? Date.now().toString();

  if (err instanceof AppException) {
    const auditLog = {
      requestId,
      ...err.toAuditLog(),
      path: req.path,
      method: req.method,
      ip: req.ip ?? req.socket.remoteAddress,
    };

    if (err.httpStatus >= 500) {
      logger.error(auditLog, `[${err.code}] AppException ${err.httpStatus}`);
    } else if (err.event === 'SECURITY') {
      logger.warn(auditLog, `[${err.code}] Security event ${err.httpStatus}`);
    } else {
      logger.info(auditLog, `[${err.code}] AppException ${err.httpStatus}`);
    }

    res.status(err.httpStatus).json(err.toJSON());
    return;
  }

  if (err instanceof Error) {
    logger.error(
      { requestId, message: err.message, stack: err.stack, path: req.path, method: req.method },
      '[SYS002] Error no controlado',
    );
    res.status(400).json({
      success: false,
      data: null,
      errorMessage: err.message,
      errorCode: 'SYS002',
      httpErrorCode: 400,
      module: 'SYSTEM',
      event: 'ERROR',
      extra: { requestId },
    });
    return;
  }

  logger.error({ requestId, path: req.path, method: req.method }, '[SYS001] Error desconocido');
  res.status(500).json({
    success: false,
    data: null,
    errorMessage: 'Error interno del servidor.',
    errorCode: 'SYS001',
    httpErrorCode: 500,
    module: 'SYSTEM',
    event: 'ERROR',
    extra: { requestId },
  });
}
