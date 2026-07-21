import type { IEtiquetaRepository } from '../../gateway/repositories/IEtiquetaRepository';

export interface EtiquetaDTO {
  id: string;
  nombre: string;
  slug: string;
}

export class ListarEtiquetasUseCase {
  constructor(private readonly etiquetaRepo: IEtiquetaRepository) {}

  async execute(): Promise<EtiquetaDTO[]> {
    const etiquetas = await this.etiquetaRepo.findAll();
    return etiquetas.map((e) => ({ id: e.getId(), nombre: e.getNombre(), slug: e.getSlug() }));
  }
}
