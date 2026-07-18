import type { Request, Response } from 'express';
import type { ToggleReaccionUseCase } from '../../../../application/features/reacciones/ToggleReaccionUseCase';
import type { ContarReaccionesUseCase } from '../../../../application/features/reacciones/ContarReaccionesUseCase';

export class ReaccionesController {
  constructor(
    private readonly toggleUC: ToggleReaccionUseCase,
    private readonly contarUC: ContarReaccionesUseCase,
  ) {}

  /** POST /api/experiencias/:id/reacciones — toggle me gusta */
  toggle = async (req: Request, res: Response): Promise<void> => {
    const { id: experienciaId } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    const result = await this.toggleUC.execute(usuarioId, experienciaId);
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/:id/reacciones — contar reacciones */
  contar = async (req: Request, res: Response): Promise<void> => {
    const { id: experienciaId } = req.params as { id: string };
    const usuarioId = req.user?.sub;
    const result = await this.contarUC.execute(experienciaId, usuarioId);
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
