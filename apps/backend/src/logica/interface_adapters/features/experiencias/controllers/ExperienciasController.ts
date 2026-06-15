import type { Request, Response } from 'express';
import type { CreateExperienciaUseCase } from '../../../../application/features/experiencias/crear_experiencia/CreateExperienciaUseCase';
import type { EditExperienciaUseCase } from '../../../../application/features/experiencias/editar/EditExperienciaUseCase';
import type { DeleteExperienciaUseCase } from '../../../../application/features/experiencias/eliminar/DeleteExperienciaUseCase';
import type { PublishExperienciaUseCase } from '../../../../application/features/experiencias/publicar/PublishExperienciaUseCase';
import type { ListExperienciasUseCase } from '../../../../application/features/experiencias/listar/ListExperienciasUseCase';
import type { GetExperienciaUseCase } from '../../../../application/features/experiencias/obtener/GetExperienciaUseCase';
import type { BuscarExperienciasUseCase } from '../../../../application/features/experiencias/buscar/BuscarExperienciasUseCase';
import type { GetRelacionadasUseCase } from '../../../../application/features/experiencias/relacionadas/GetRelacionadasUseCase';
import type { CreateExperienciaRequestDTO } from '../dtos/request/CreateExperienciaRequestDTO';
import type { UpdateExperienciaRequestDTO } from '../dtos/request/UpdateExperienciaRequestDTO';
import type { SortOrder } from '../../../../application/gateway/repositories/IExperienciaRepository';
import { ExperienciaHttpMapper } from '../mappers/ExperienciaHttpMapper';
import { ForbiddenException } from '../../../../application/exceptions/AppException';

export class ExperienciasController {
  constructor(
    private readonly createUC: CreateExperienciaUseCase,
    private readonly editUC: EditExperienciaUseCase,
    private readonly deleteUC: DeleteExperienciaUseCase,
    private readonly publishUC: PublishExperienciaUseCase,
    private readonly listUC: ListExperienciasUseCase,
    private readonly getUC: GetExperienciaUseCase,
    private readonly buscarUC: BuscarExperienciasUseCase,
    private readonly relacionadasUC: GetRelacionadasUseCase,
  ) {}

  /** GET /api/experiencias — lista paginada con sort opcional (R31, R32) */
  list = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const usuarioIdRaw = req.query['usuarioId'];
    const sortRaw = req.query['sort'];
    const sort: SortOrder | undefined = sortRaw === 'date' || sortRaw === 'popularity' ? sortRaw : undefined;
    const base = typeof usuarioIdRaw === 'string'
      ? { page, limit, usuarioId: usuarioIdRaw }
      : { page, limit };
    const query = sort !== undefined ? { ...base, sort } : base;
    const result = await this.listUC.execute(query);
    const data = result.data.map(ExperienciaHttpMapper.toResponse);
    res.json({ success: true, data, total: result.total, page: result.page, limit: result.limit, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/buscar — búsqueda por título/descripción (R51, R13) */
  buscar = async (req: Request, res: Response): Promise<void> => {
    const q = String(req.query['q'] ?? '');
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const result = await this.buscarUC.execute(q, page, limit);
    const data = result.data.map(ExperienciaHttpMapper.toResponse);
    res.json({ success: true, data, total: result.total, page: result.page, limit: result.limit, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/:id */
  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const experiencia = await this.getUC.execute(id);
    res.json({ success: true, data: ExperienciaHttpMapper.toResponse(experiencia), errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/:id/preview — ver borrador propio (R43) */
  preview = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    const experiencia = await this.getUC.execute(id);
    if (experiencia.getUsuarioId() !== usuarioId) {
      throw new ForbiddenException('Solo el autor puede previsualizar un borrador.');
    }
    res.json({ success: true, data: ExperienciaHttpMapper.toResponse(experiencia), errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/:id/relacionadas — relacionadas recientes (R55) */
  relacionadas = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const lista = await this.relacionadasUC.ejecutarRelacionadas(id);
    res.json({ success: true, data: lista.map(ExperienciaHttpMapper.toResponse), errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/experiencias/:id/relacionadas-autor — del mismo autor (R56) */
  relacionadasAutor = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const lista = await this.relacionadasUC.ejecutarPorAutor(id);
    res.json({ success: true, data: lista.map(ExperienciaHttpMapper.toResponse), errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** POST /api/experiencias */
  create = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.user!.sub;
    const body = req.body as CreateExperienciaRequestDTO;
    const result = await this.createUC.execute({ usuarioId, ...body });
    res.status(201).json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PUT /api/experiencias/:id */
  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    const body = req.body as UpdateExperienciaRequestDTO;
    await this.editUC.execute({ id, usuarioId, ...body });
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** DELETE /api/experiencias/:id */
  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { sub, rol } = req.user!;
    await this.deleteUC.execute(id, sub, rol);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PATCH /api/experiencias/:id/publicar */
  publish = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    await this.publishUC.execute(id, usuarioId);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
