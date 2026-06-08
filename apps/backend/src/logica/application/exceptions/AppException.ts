export class AppException extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly httpStatus: number,
  ) {
    super(message);
    this.name = 'AppException';
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super(`${resource} no encontrado.`, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = 'No autorizado.') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenException extends AppException {
  constructor(message = 'Acceso denegado.') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class ValidationException extends AppException {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class TooManyRequestsException extends AppException {
  constructor(message = 'Demasiados intentos. Intente en 15 minutos.') {
    super(message, 'TOO_MANY_REQUESTS', 429);
  }
}
