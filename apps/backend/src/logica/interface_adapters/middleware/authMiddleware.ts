import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../../application/exceptions/AppException';

export interface AuthPayload {
  sub: string;
  rol: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token no proporcionado.');
  }

  const token = authHeader.slice(7);
  const secret = process.env['JWT_SECRET'] ?? 'secret';

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedException('Token inválido o expirado.');
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.rol !== 'admin') {
    throw new UnauthorizedException('Se requiere rol de administrador.');
  }
  next();
}
