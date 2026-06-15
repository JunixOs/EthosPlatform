import type { Request, Response } from 'express';
import type { ToggleFavoritoUseCase } from '../../../../application/features/favoritos/ToggleFavoritoUseCase';
import type { ListarFavoritosUseCase } from '../../../../application/features/favoritos/ListarFavoritosUseCase';
import { ExperienciaHttpMapper } from '../../experiencias/mappers/ExperienciaHttpMapper';

export class FavoritosController {
  constructor(
    private readonly toggleUC: ToggleFavoritoUseCase,
    private readonly listarUC: ListarFavoritosUseCase,
  ) {}

  /** POST /api/favoritos/:experienciaId — toggle favorito (R49) */
  toggle = async (req: Request, res: Response): Promise<void> => {
    const { experienciaId } = req.params as { experienciaId: string };
    const usuarioId = req.user!.sub;
    const result = await this.toggleUC.execute(usuarioId, experienciaId);
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/favoritos/mios — listar mis favoritos */
  listarMios = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.user!.sub;
    const page = Number(req.query['page'] ?? 1);
    const result = await this.listarUC.execute(usuarioId, page, 10);
    res.json({
      success: true,
      data: result.data.map(ExperienciaHttpMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      errorMessage: '',
      errorCode: '',
      httpErrorCode: '',
    });
  };
}
