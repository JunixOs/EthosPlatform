import { describe, it, expect } from 'vitest';
import {
  AppException,
  NotFoundException,
  UnauthorizedException,
  TokenMissingException,
  TokenInvalidException,
  TokenExpiredException,
  TokenRevokedException,
  AccountSuspendedException,
  TooManyRequestsException,
  ForbiddenException,
  ConflictException,
  ValidationException,
  DomainException,
  SystemException,
} from '@/logica/application/exceptions/AppException';

describe('AppException', () => {
  it('should create an exception with catalog defaults', () => {
    const ex = new AppException('AUTH001');
    expect(ex.code).toBe('AUTH001');
    expect(ex.module).toBe('AUTH');
    expect(ex.event).toBe('SECURITY');
    expect(ex.httpStatus).toBe(401);
    expect(ex.message).toBe('Token no proporcionado.');
  });

  it('should allow custom message', () => {
    const ex = new AppException('AUTH001', 'Custom message');
    expect(ex.message).toBe('Custom message');
  });

  it('should include extra data', () => {
    const ex = new AppException('AUTH001', undefined, { path: '/api/test' });
    expect(ex.extra).toEqual({ path: '/api/test' });
  });

  it('should serialize to JSON correctly', () => {
    const ex = new AppException('AUTH005', 'Bad credentials', { ip: '127.0.0.1' });
    const json = ex.toJSON();
    expect(json).toEqual({
      success: false,
      data: null,
      errorMessage: 'Bad credentials',
      errorCode: 'AUTH005',
      httpErrorCode: 401,
      module: 'AUTH',
      event: 'ERROR',
      extra: { ip: '127.0.0.1' },
    });
  });

  it('should serialize to audit log', () => {
    const ex = new AppException('SYS001');
    const log = ex.toAuditLog();
    expect(log.code).toBe('SYS001');
    expect(log.module).toBe('SYSTEM');
    expect(log.event).toBe('ERROR');
    expect(log.httpStatus).toBe(500);
    expect(log.stack).toBeDefined();
  });

  it('should fallback to SYS001 for unknown codes', () => {
    // @ts-expect-code - Testing unknown code behavior
    const ex = new AppException('UNKNOWN99' as any);
    expect(ex.httpStatus).toBe(500);
    expect(ex.module).toBe('SYSTEM');
  });
});

describe('NotFoundException', () => {
  it('should have 404 status and USER001 code by default', () => {
    const ex = new NotFoundException('Usuario');
    expect(ex.code).toBe('USER001');
    expect(ex.httpStatus).toBe(404);
    expect(ex.message).toBe('Usuario no encontrado.');
    expect(ex.extra).toEqual({ resource: 'Usuario' });
  });
});

describe('UnauthorizedException', () => {
  it('should have AUTH005 code and 401 status', () => {
    const ex = new UnauthorizedException();
    expect(ex.code).toBe('AUTH005');
    expect(ex.httpStatus).toBe(401);
    expect(ex.message).toBe('Credenciales incorrectas.');
  });

  it('should allow custom message', () => {
    const ex = new UnauthorizedException('Custom auth error');
    expect(ex.message).toBe('Custom auth error');
  });
});

describe('TokenMissingException', () => {
  it('should have AUTH001 code', () => {
    const ex = new TokenMissingException();
    expect(ex.code).toBe('AUTH001');
    expect(ex.httpStatus).toBe(401);
  });
});

describe('TokenInvalidException', () => {
  it('should have AUTH002 code', () => {
    const ex = new TokenInvalidException();
    expect(ex.code).toBe('AUTH002');
    expect(ex.httpStatus).toBe(401);
  });
});

describe('TokenExpiredException', () => {
  it('should have AUTH003 code', () => {
    const ex = new TokenExpiredException();
    expect(ex.code).toBe('AUTH003');
    expect(ex.httpStatus).toBe(401);
  });
});

describe('TokenRevokedException', () => {
  it('should have AUTH004 code', () => {
    const ex = new TokenRevokedException();
    expect(ex.code).toBe('AUTH004');
    expect(ex.httpStatus).toBe(401);
  });
});

describe('AccountSuspendedException', () => {
  it('should have AUTH007 code and default message', () => {
    const ex = new AccountSuspendedException();
    expect(ex.code).toBe('AUTH007');
    expect(ex.httpStatus).toBe(403);
    expect(ex.message).toBe('Tu cuenta está suspendida.');
  });

  it('should include diasRestantes in extra', () => {
    const ex = new AccountSuspendedException(5);
    expect(ex.extra).toEqual({ diasRestantes: 5 });
  });
});

describe('TooManyRequestsException', () => {
  it('should have AUTH006 code and 429 status', () => {
    const ex = new TooManyRequestsException(5);
    expect(ex.code).toBe('AUTH006');
    expect(ex.httpStatus).toBe(429);
    expect(ex.extra).toEqual({ intentosFallidos: 5, ventanaMinutos: 15 });
  });

  it('should allow custom window', () => {
    const ex = new TooManyRequestsException(3, 30);
    expect(ex.extra).toEqual({ intentosFallidos: 3, ventanaMinutos: 30 });
  });
});

describe('ForbiddenException', () => {
  it('should have ADMIN001 code and 403 status', () => {
    const ex = new ForbiddenException();
    expect(ex.code).toBe('ADMIN001');
    expect(ex.httpStatus).toBe(403);
  });

  it('should allow custom message', () => {
    const ex = new ForbiddenException('No admin access');
    expect(ex.message).toBe('No admin access');
  });
});

describe('ConflictException', () => {
  it('should have AUTH009 code and 409 status', () => {
    const ex = new ConflictException('Email already exists');
    expect(ex.code).toBe('AUTH009');
    expect(ex.httpStatus).toBe(409);
    expect(ex.message).toBe('Email already exists');
  });
});

describe('ValidationException', () => {
  it('should have EXP006 code and 400 status', () => {
    const ex = new ValidationException('Title is too short', 'title');
    expect(ex.code).toBe('EXP006');
    expect(ex.httpStatus).toBe(400);
    expect(ex.message).toBe('Title is too short');
    expect(ex.extra).toEqual({ campo: 'title' });
  });

  it('should work without campo', () => {
    const ex = new ValidationException('Invalid data');
    expect(ex.extra).toEqual({});
  });
});

describe('DomainException', () => {
  it('should have SYS002 code and 400 status', () => {
    const ex = new DomainException('Invalid state transition');
    expect(ex.code).toBe('SYS002');
    expect(ex.httpStatus).toBe(400);
  });
});

describe('SystemException', () => {
  it('should have SYS001 code and 500 status', () => {
    const ex = new SystemException();
    expect(ex.code).toBe('SYS001');
    expect(ex.httpStatus).toBe(500);
    expect(ex.message).toBe('Error interno del servidor.');
  });

  it('should allow custom message', () => {
    const ex = new SystemException('Database connection failed');
    expect(ex.message).toBe('Database connection failed');
  });
});
