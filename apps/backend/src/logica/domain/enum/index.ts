export enum TipoSesionEnum {
  CORTA = 'corta', // 2 horas
  LARGA = 'larga', // 24 horas
}

export enum EstadoExperienciaEnum {
  BORRADOR = 'borrador',
  PUBLICADA = 'publicada',
  ARCHIVADA = 'archivada',
}

export enum EstadoReporteEnum {
  PENDIENTE = 'pendiente',
  EN_REVISION = 'en_revision',
  RESUELTO = 'resuelto',
  RECHAZADO = 'rechazado',
}

export enum TipoReporteEnum {
  SPAM = 'spam',
  CONTENIDO_INAPROPIADO = 'contenido_inapropiado',
  ACOSO = 'acoso',
  INFORMACION_FALSA = 'informacion_falsa',
  OTRO = 'otro',
}
