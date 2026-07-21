import type { Request, Response } from 'express';
import type { CrearRespuestaUseCase } from '../../../../application/features/respuestas/CrearRespuestaUseCase';
import type { ListarRespuestasUseCase } from '../../../../application/features/respuestas/ListarRespuestasUseCase';
import type { EliminarRespuestaUseCase } from '../../../../application/features/respuestas/EliminarRespuestaUseCase';

export class RespuestasController {
  constructor(
    private readonly crearUC: CrearRespuestaUseCase,
    private readonly listarUC: ListarRespuestasUseCase,
    private readonly eliminarUC: EliminarRespuestaUseCase,
  ) {}

  /** POST /api/experiencias/:id/respuestas */
  crear = async (req: Request, res: Response): Promise<void> => {
    const { id: experienciaId } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    const { contenido } = req.body as { contenido: string };
    const result = await this.crearUC.execute({ experienciaId, usuarioId, contenido });
    res.status(201).json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/:id/respuestas */
  listar = async (req: Request, res: Response): Promise<void> => {
    const { id: experienciaId } = req.params as { id: string };
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const result = await this.listarUC.execute(experienciaId, page, limit);
    res.json({ success: true, data: result.data, total: result.total, page: result.page, limit: result.limit, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** DELETE /api/respuestas/:id */
  eliminar = async (req: Request, res: Response): Promise<void> => {
    const { id: respuestaId } = req.params as { id: string };
    const { sub, rol } = req.user!;
    await this.eliminarUC.execute(respuestaId, sub, rol);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
