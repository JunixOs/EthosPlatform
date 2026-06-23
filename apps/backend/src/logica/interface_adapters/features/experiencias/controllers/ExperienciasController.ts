import type { Request, Response } from 'express';
import type { CreateExperienciaUseCase } from '../../../../application/features/experiencias/crear_experiencia/CreateExperienciaUseCase';
import type { EditExperienciaUseCase } from '../../../../application/features/experiencias/editar/EditExperienciaUseCase';
import type { DeleteExperienciaUseCase } from '../../../../application/features/experiencias/eliminar/DeleteExperienciaUseCase';
import type { PublishExperienciaUseCase } from '../../../../application/features/experiencias/publicar/PublishExperienciaUseCase';
import type { ListExperienciasUseCase } from '../../../../application/features/experiencias/listar/ListExperienciasUseCase';
import type { GetExperienciaUseCase } from '../../../../application/features/experiencias/obtener/GetExperienciaUseCase';
import type { CreateExperienciaRequestDTO } from '../dtos/request/CreateExperienciaRequestDTO';
import type { UpdateExperienciaRequestDTO } from '../dtos/request/UpdateExperienciaRequestDTO';
import { ExperienciaHttpMapper } from '../mappers/ExperienciaHttpMapper';

export class ExperienciasController {
  constructor(
    private readonly createUC: CreateExperienciaUseCase,
    private readonly editUC: EditExperienciaUseCase,
    private readonly deleteUC: DeleteExperienciaUseCase,
    private readonly publishUC: PublishExperienciaUseCase,
    private readonly listUC: ListExperienciasUseCase,
    private readonly getUC: GetExperienciaUseCase,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const usuarioIdRaw = req.query['usuarioId'];
    const query = typeof usuarioIdRaw === 'string'
      ? { page, limit, usuarioId: usuarioIdRaw }
      : { page, limit };
    const result = await this.listUC.execute(query);
    const data = result.data.map(ExperienciaHttpMapper.toResponse);
    res.json({ success: true, data, total: result.total, page: result.page, limit: result.limit, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const experiencia = await this.getUC.execute(id);
    res.json({ success: true, data: ExperienciaHttpMapper.toResponse(experiencia), errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.user!.sub;
    const body = req.body as CreateExperienciaRequestDTO;
    const result = await this.createUC.execute({ usuarioId, ...body });
    res.status(201).json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    const body = req.body as UpdateExperienciaRequestDTO;
    await this.editUC.execute({ id, usuarioId, ...body });
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { sub, rol } = req.user!;
    await this.deleteUC.execute(id, sub, rol);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  publish = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    await this.publishUC.execute(id, usuarioId);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
