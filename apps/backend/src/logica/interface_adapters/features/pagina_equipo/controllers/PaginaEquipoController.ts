import type { Request, Response } from 'express';
import type { ObtenerPaginaEquipoUseCase } from '../../../../application/features/pagina_equipo/ObtenerPaginaEquipoUseCase';
import type { EditarPaginaEquipoUseCase } from '../../../../application/features/pagina_equipo/EditarPaginaEquipoUseCase';
import type { MiembroEquipo } from '../../../../domain/entities/PaginaEquipo';

export class PaginaEquipoController {
  constructor(
    private readonly obtenerUC: ObtenerPaginaEquipoUseCase,
    private readonly editarUC: EditarPaginaEquipoUseCase,
  ) {}

  /** GET /api/pagina-equipo */
  obtener = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.obtenerUC.execute();
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PUT /api/admin/pagina-equipo */
  editar = async (req: Request, res: Response): Promise<void> => {
    const { titulo, contenido, miembros } = req.body as { titulo: string; contenido: string; miembros: MiembroEquipo[] };
    await this.editarUC.execute({ titulo, contenido, miembros: miembros ?? [] });
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
