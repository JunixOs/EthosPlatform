import type { IEtiquetaRepository } from '../../gateway/repositories/IEtiquetaRepository';

export interface EtiquetaDTO {
  id: string;
  nombre: string;
  slug: string;
}

export class ObtenerEtiquetasDeExperienciaUseCase {
  constructor(private readonly etiquetaRepo: IEtiquetaRepository) {}

  async execute(experienciaId: string): Promise<EtiquetaDTO[]> {
    const etiquetas = await this.etiquetaRepo.findByExperienciaId(experienciaId);
    return etiquetas.map((e) => ({
      id: e.getId(),
      nombre: e.getNombre(),
      slug: e.getSlug(),
    }));
  }
}
