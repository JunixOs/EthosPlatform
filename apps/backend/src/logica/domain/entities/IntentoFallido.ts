export class IntentoFallido {
  private readonly id: string;
  private readonly correo: string;
  private readonly ip: string;
  private readonly fechaIntento: Date;

  constructor(id: string, correo: string, ip: string, fechaIntento: Date = new Date()) {
    this.id = id;
    this.correo = correo;
    this.ip = ip;
    this.fechaIntento = fechaIntento;
  }

  getId(): string {
    return this.id;
  }

  getCorreo(): string {
    return this.correo;
  }

  getIp(): string {
    return this.ip;
  }

  getFechaIntento(): Date {
    return this.fechaIntento;
  }

  static contarRecientes(intentos: IntentoFallido[], minutosAtras: number = 15): number {
    const ahora = new Date();
    const hace = new Date(ahora.getTime() - minutosAtras * 60000);
    return intentos.filter((i) => i.fechaIntento > hace && i.fechaIntento <= ahora).length;
  }

  static debeBloquearse(intentos: IntentoFallido[], maxIntentos: number = 5): boolean {
    return this.contarRecientes(intentos) >= maxIntentos;
  }
}
