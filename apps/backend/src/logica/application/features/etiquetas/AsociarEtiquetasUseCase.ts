import type { IEtiquetaRepository } from '../../gateway/repositories/IEtiquetaRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { Etiqueta } from '../../../domain/entities/Etiqueta';
import { NotFoundException, ValidationException } from '../../exceptions/AppException';
import { v4 as uuidv4 } from 'uuid';

export interface AsociarEtiquetasCommand {
  experienciaId: string;
  usuarioId: string;
  nombresEtiquetas: string[];
}

export interface AsociarEtiquetasResult {
  etiquetas: { id: string; nombre: string; slug: string }[];
}

export class AsociarEtiquetasUseCase {
  constructor(
    private readonly etiquetaRepo: IEtiquetaRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(cmd: AsociarEtiquetasCommand): Promise<AsociarEtiquetasResult> {
    const experiencia = await this.experienciaRepo.findById(cmd.experienciaId);
    if (!experiencia) throw new NotFoundException('Experiencia');
    if (experiencia.getUsuarioId() !== cmd.usuarioId) {
      throw new ValidationException('No puedes editar etiquetas de esta experiencia.');
    }

    if (cmd.nombresEtiquetas.length > 5) {
      throw new ValidationException('No puedes asociar más de 5 etiquetas.', 'etiquetas');
    }

    // Limpiar etiquetas actuales
    const actuales = await this.etiquetaRepo.findByExperienciaId(cmd.experienciaId);
    await Promise.all(actuales.map((e) => this.etiquetaRepo.desasociarDeExperiencia(cmd.experienciaId, e.getId())));

    const resultado: { id: string; nombre: string; slug: string }[] = [];

    for (const nombre of cmd.nombresEtiquetas) {
      const limpio = nombre.trim().toLowerCase();
      if (!limpio) continue;

      let etiqueta = await this.etiquetaRepo.findByNombre(limpio);
      if (!etiqueta) {
        etiqueta = new Etiqueta(uuidv4(), limpio, limpio);
        await this.etiquetaRepo.save(etiqueta);
      }
      await this.etiquetaRepo.asociarAExperiencia(cmd.experienciaId, etiqueta.getId());
      resultado.push({ id: etiqueta.getId(), nombre: etiqueta.getNombre(), slug: etiqueta.getSlug() });
    }

    return { etiquetas: resultado };
  }
}
