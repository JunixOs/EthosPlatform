/**
 * Catálogo centralizado de códigos de error del sistema.
 *
 * Cada código de error define:
 * - `code`: Identificador único (prefijo de módulo + número secuencial)
 * - `module`: Módulo al que pertenece (AUTH, USER, EXPERIENCE, ADMIN, SOCIAL, MODERATION, SYSTEM)
 * - `event`: Evento estático tipo AUDIT_LEVEL (INFO, WARNING, ERROR, SECURITY)
 * - `httpStatus`: Código HTTP que se devuelve al frontend
 * - `defaultMessage`: Mensaje legible por defecto (puede sobreescribirse)
 *
 * Este catálogo es la fuente de verdad para:
 * - Mapeo de excepciones → respuestas HTTP
 * - Auditoría de errores (módulo + evento)
 * - Traducción de errores en frontend
 * - Documentación de API
 */

export type ErrorModule =
  | 'AUTH'
  | 'USER'
  | 'EXPERIENCE'
  | 'ADMIN'
  | 'SOCIAL'
  | 'MODERATION'
  | 'SYSTEM';

export type AuditEvent = 'INFO' | 'WARNING' | 'ERROR' | 'SECURITY';

export interface ErrorDefinition {
  code: string;
  module: ErrorModule;
  event: AuditEvent;
  httpStatus: number;
  defaultMessage: string;
}

export const ErrorCatalog: Record<string, ErrorDefinition> = {
  // ═══════════════════════════════════════════════════════════════
  // AUTH (1000-1099)
  // ═══════════════════════════════════════════════════════════════
  AUTH001: {
    code: 'AUTH001',
    module: 'AUTH',
    event: 'SECURITY',
    httpStatus: 401,
    defaultMessage: 'Token no proporcionado.',
  },
  AUTH002: {
    code: 'AUTH002',
    module: 'AUTH',
    event: 'SECURITY',
    httpStatus: 401,
    defaultMessage: 'Token inválido.',
  },
  AUTH003: {
    code: 'AUTH003',
    module: 'AUTH',
    event: 'SECURITY',
    httpStatus: 401,
    defaultMessage: 'Token expirado.',
  },
  AUTH004: {
    code: 'AUTH004',
    module: 'AUTH',
    event: 'SECURITY',
    httpStatus: 401,
    defaultMessage: 'Sesión revocada.',
  },
  AUTH005: {
    code: 'AUTH005',
    module: 'AUTH',
    event: 'ERROR',
    httpStatus: 401,
    defaultMessage: 'Credenciales incorrectas.',
  },
  AUTH006: {
    code: 'AUTH006',
    module: 'AUTH',
    event: 'WARNING',
    httpStatus: 429,
    defaultMessage: 'Demasiados intentos fallidos. Intente en 15 minutos.',
  },
  AUTH007: {
    code: 'AUTH007',
    module: 'AUTH',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'Tu cuenta está suspendida.',
  },
  AUTH008: {
    code: 'AUTH008',
    module: 'AUTH',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'El correo electrónico no es válido.',
  },
  AUTH009: {
    code: 'AUTH009',
    module: 'AUTH',
    event: 'WARNING',
    httpStatus: 409,
    defaultMessage: 'Ya existe una cuenta con ese correo.',
  },

  // ═══════════════════════════════════════════════════════════════
  // USER (1100-1199)
  // ═══════════════════════════════════════════════════════════════
  USER001: {
    code: 'USER001',
    module: 'USER',
    event: 'ERROR',
    httpStatus: 404,
    defaultMessage: 'Usuario no encontrado.',
  },
  USER002: {
    code: 'USER002',
    module: 'USER',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'Este perfil es privado.',
  },
  USER003: {
    code: 'USER003',
    module: 'USER',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'La URL de la foto es demasiado larga.',
  },
  USER004: {
    code: 'USER004',
    module: 'USER',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'Contraseña incorrecta.',
  },
  USER005: {
    code: 'USER005',
    module: 'USER',
    event: 'WARNING',
    httpStatus: 409,
    defaultMessage: 'Ya existe una cuenta con ese correo.',
  },
  USER006: {
    code: 'USER006',
    module: 'USER',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'Correo electrónico inválido.',
  },

  // ═══════════════════════════════════════════════════════════════
  // EXPERIENCE (1200-1299)
  // ═══════════════════════════════════════════════════════════════
  EXP001: {
    code: 'EXP001',
    module: 'EXPERIENCE',
    event: 'ERROR',
    httpStatus: 404,
    defaultMessage: 'Experiencia no encontrada.',
  },
  EXP002: {
    code: 'EXP002',
    module: 'EXPERIENCE',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'No puedes editar esta experiencia.',
  },
  EXP003: {
    code: 'EXP003',
    module: 'EXPERIENCE',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'No puedes eliminar esta experiencia.',
  },
  EXP004: {
    code: 'EXP004',
    module: 'EXPERIENCE',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'No puedes publicar esta experiencia.',
  },
  EXP005: {
    code: 'EXP005',
    module: 'EXPERIENCE',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'Solo el autor puede previsualizar un borrador.',
  },
  EXP006: {
    code: 'EXP006',
    module: 'EXPERIENCE',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'El campo no cumple la longitud mínima.',
  },
  EXP007: {
    code: 'EXP007',
    module: 'EXPERIENCE',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'El término de búsqueda no puede estar vacío.',
  },

  // ═══════════════════════════════════════════════════════════════
  // ADMIN (1300-1399)
  // ═══════════════════════════════════════════════════════════════
  ADMIN001: {
    code: 'ADMIN001',
    module: 'ADMIN',
    event: 'SECURITY',
    httpStatus: 403,
    defaultMessage: 'Se requiere rol de administrador.',
  },
  ADMIN002: {
    code: 'ADMIN002',
    module: 'ADMIN',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'Rol inválido.',
  },
  ADMIN003: {
    code: 'ADMIN003',
    module: 'ADMIN',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'La suspensión debe ser entre 1 y 365 días.',
  },

  // ═══════════════════════════════════════════════════════════════
  // SOCIAL (1400-1499)
  // ═══════════════════════════════════════════════════════════════
  SOC001: {
    code: 'SOC001',
    module: 'SOCIAL',
    event: 'ERROR',
    httpStatus: 404,
    defaultMessage: 'Experiencia no encontrada.',
  },

  // ═══════════════════════════════════════════════════════════════
  // SYSTEM (9000-9099)
  // ═══════════════════════════════════════════════════════════════
  SYS001: {
    code: 'SYS001',
    module: 'SYSTEM',
    event: 'ERROR',
    httpStatus: 500,
    defaultMessage: 'Error interno del servidor.',
  },
  SYS002: {
    code: 'SYS002',
    module: 'SYSTEM',
    event: 'ERROR',
    httpStatus: 400,
    defaultMessage: 'Error en la solicitud.',
  },
  SYS003: {
    code: 'SYS003',
    module: 'SYSTEM',
    event: 'ERROR',
    httpStatus: 500,
    defaultMessage: 'JWT_SECRET no está configurado.',
  },
} as const;

export type ErrorCode = keyof typeof ErrorCatalog;

/**
 * Obtiene la definición de un código de error.
 */
export function getErrorDefinition(code: ErrorCode): ErrorDefinition {
  const def = ErrorCatalog[code];
  if (!def) {
    return ErrorCatalog.SYS001 as ErrorDefinition;
  }
  return def as ErrorDefinition;
}

/**
 * Mapea un código de error a su código HTTP correspondiente.
 */
export function getHttpStatus(code: ErrorCode): number {
  return getErrorDefinition(code).httpStatus;
}

/**
 * Obtiene el mensaje por defecto de un código de error.
 */
export function getDefaultMessage(code: ErrorCode): string {
  return getErrorDefinition(code).defaultMessage;
}
