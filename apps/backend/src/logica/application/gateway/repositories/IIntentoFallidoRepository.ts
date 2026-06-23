import type { IntentoFallido } from '../../../domain/entities/IntentoFallido';

export interface IIntentoFallidoRepository {
  findRecientesByCorreo(correo: string, minutosAtras?: number): Promise<IntentoFallido[]>;
  save(intento: IntentoFallido): Promise<void>;
  deleteByCorreo(correo: string): Promise<void>;
}
