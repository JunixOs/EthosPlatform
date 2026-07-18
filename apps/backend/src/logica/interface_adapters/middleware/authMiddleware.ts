import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedException, ForbiddenException } from '../../application/exceptions/AppException';
import type { ISesionRepository } from '../../application/gateway/repositories/ISesionRepository';

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

export function createAuthMiddleware(sesionRepo: ISesionRepository) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedException('Token no proporcionado.'));
    }

    const token = authHeader.slice(7);
    const secret = process.env['JWT_SECRET'];
    if (!secret) {
      return next(new Error('JWT_SECRET no está definido en las variables de entorno.'));
    }

    try {
      const payload = jwt.verify(token, secret) as AuthPayload;

      // Verificar que la sesión aún existe en la base de datos (invalidación en logout)
      const sesion = await sesionRepo.findByToken(token);
      if (!sesion || !sesion.isValida()) {
        return next(new UnauthorizedException('Token inválido o expirado.'));
      }

      req.user = payload;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedException('Token expirado.'));
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new UnauthorizedException('Token inválido.'));
      }
      next(err);
    }
  };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.rol !== 'admin') {
    return next(new ForbiddenException('Se requiere rol de administrador.'));
  }
  next();
}
