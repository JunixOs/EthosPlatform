import type { ErrorCode, ErrorModule, AuditEvent } from './ErrorCatalog';
import { getErrorDefinition } from './ErrorCatalog';

/**
 * Excepción base del sistema.
 *
 * Características:
 * - Código de error estático del catálogo (ErrorCatalog)
 * - Módulo al que pertenece (para auditoría)
 * - Evento de auditoría (INFO, WARNING, ERROR, SECURITY)
 * - Datos extra contextuales (para debugging y auditoría)
 * - HTTP status automático desde el catálogo
 */
export class AppException extends Error {
  public readonly code: ErrorCode;
  public readonly module: ErrorModule;
  public readonly event: AuditEvent;
  public readonly httpStatus: number;
  public readonly extra: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message?: string,
    extra?: Record<string, unknown>,
  ) {
    const def = getErrorDefinition(code);
    super(message ?? def.defaultMessage);
    this.name = 'AppException';
    this.code = code;
    this.module = def.module;
    this.event = def.event;
    this.httpStatus = def.httpStatus;
    this.extra = extra ?? {};
  }

  /**
   * Serializa la excepción para respuesta JSON.
   */
  toJSON() {
    return {
      success: false,
      data: null,
      errorMessage: this.message,
      errorCode: this.code,
      httpErrorCode: this.httpStatus,
      module: this.module,
      event: this.event,
      extra: this.extra,
    };
  }

  /**
   * Serializa para logs de auditoría.
   */
  toAuditLog() {
    return {
      code: this.code,
      module: this.module,
      event: this.event,
      httpStatus: this.httpStatus,
      message: this.message,
      extra: this.extra,
      stack: this.stack,
    };
  }
}

// ─── Excepciones concretas por tipo de error ───────────────────────────────

export class NotFoundException extends AppException {
  constructor(resource: string, code: ErrorCode = 'USER001') {
    super(code, `${resource} no encontrado.`, { resource });
    this.name = 'NotFoundException';
  }
}

export class UnauthorizedException extends AppException {
  constructor(message?: string, extra?: Record<string, unknown>) {
    super('AUTH005', message, extra);
    this.name = 'UnauthorizedException';
  }
}

export class TokenMissingException extends AppException {
  constructor() {
    super('AUTH001');
    this.name = 'TokenMissingException';
  }
}

export class TokenInvalidException extends AppException {
  constructor() {
    super('AUTH002');
    this.name = 'TokenInvalidException';
  }
}

export class TokenExpiredException extends AppException {
  constructor() {
    super('AUTH003');
    this.name = 'TokenExpiredException';
  }
}

export class TokenRevokedException extends AppException {
  constructor() {
    super('AUTH004');
    this.name = 'TokenRevokedException';
  }
}

export class AccountSuspendedException extends AppException {
  constructor(diasRestantes?: number) {
    super('AUTH007', undefined, diasRestantes !== undefined ? { diasRestantes } : undefined);
    this.name = 'AccountSuspendedException';
  }
}

export class TooManyRequestsException extends AppException {
  constructor(intentos: number, ventanaMinutos = 15) {
    super('AUTH006', undefined, { intentosFallidos: intentos, ventanaMinutos });
    this.name = 'TooManyRequestsException';
  }
}

export class ForbiddenException extends AppException {
  constructor(message?: string, extra?: Record<string, unknown>) {
    super('ADMIN001', message, extra);
    this.name = 'ForbiddenException';
  }
}

export class ConflictException extends AppException {
  constructor(message: string, extra?: Record<string, unknown>) {
    super('AUTH009', message, extra);
    this.name = 'ConflictException';
  }
}

export class ValidationException extends AppException {
  constructor(message: string, campo?: string, extra?: Record<string, unknown>) {
    const mergedExtra = campo ? { campo, ...extra } : extra;
    super('EXP006', message, mergedExtra);
    this.name = 'ValidationException';
  }
}

export class DomainException extends AppException {
  constructor(message: string, extra?: Record<string, unknown>) {
    super('SYS002', message, extra);
    this.name = 'DomainException';
  }
}

export class SystemException extends AppException {
  constructor(message?: string, extra?: Record<string, unknown>) {
    super('SYS001', message, extra);
    this.name = 'SystemException';
  }
}
