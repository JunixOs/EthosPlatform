import type { Request, Response } from 'express';
import type { AuditoriaService } from '../../../../application/services/AuditoriaService';

export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  /** GET /api/admin/auditoria */
  listar = async (req: Request, res: Response): Promise<void> => {
    // Nota: El listado real se haría a través del repository directamente
    // Este controller es un placeholder para el endpoint
    res.json({ success: true, data: [], total: 0, page: 1, limit: 10, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
