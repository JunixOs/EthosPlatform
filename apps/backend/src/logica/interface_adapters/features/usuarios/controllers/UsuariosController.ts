import type { Request, Response } from 'express';
import type { GetPerfilUseCase } from '../../../../application/features/usuarios/obtener_perfil/GetPerfilUseCase';
import type { EditarPerfilUseCase } from '../../../../application/features/usuarios/editar_perfil/EditarPerfilUseCase';
import type { EditarFotoPerfilUseCase } from '../../../../application/features/usuarios/editar_foto/EditarFotoPerfilUseCase';
import type { EliminarCuentaUseCase } from '../../../../application/features/usuarios/eliminar_cuenta/EliminarCuentaUseCase';
import type { GetEstadisticasUseCase } from '../../../../application/features/usuarios/estadisticas/GetEstadisticasUseCase';
import type { ListExperienciasPorUsuarioUseCase } from '../../../../application/features/usuarios/listar_experiencias/ListExperienciasPorUsuarioUseCase';
import { UsuarioExperienciaMapper } from '../mappers/UsuarioExperienciaMapper';

export class UsuariosController {
  constructor(
    private readonly getPerfilUC: GetPerfilUseCase,
    private readonly editarPerfilUC: EditarPerfilUseCase,
    private readonly editarFotoUC: EditarFotoPerfilUseCase,
    private readonly eliminarCuentaUC: EliminarCuentaUseCase,
    private readonly estadisticasUC: GetEstadisticasUseCase,
    private readonly listExpUC: ListExperienciasPorUsuarioUseCase,
  ) {}

  /** GET /api/usuarios/:id — perfil público (R25) */
  getPerfil = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const requesterId = req.user?.sub;
    const result = await this.getPerfilUC.execute(id, requesterId);
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/usuarios/me — perfil propio */
  getMiPerfil = async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user!.sub;
    const result = await this.getPerfilUC.execute(requesterId, requesterId);
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PUT /api/usuarios/me/perfil — editar nombre, bio, privacidad (R26, R28, R47) */
  editarPerfil = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.user!.sub;
    const { nombre, biografia, perfilPublico } = req.body as {
      nombre: string;
      biografia?: string | null;
      perfilPublico: boolean;
    };
    const cmd = biografia !== undefined
      ? { usuarioId, nombre, biografia, perfilPublico }
      : { usuarioId, nombre, perfilPublico };
    await this.editarPerfilUC.execute(cmd);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PUT /api/usuarios/me/foto — subir URL foto (R27) */
  editarFoto = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.user!.sub;
    const { fotoUrl } = req.body as { fotoUrl: string | null };
    await this.editarFotoUC.execute(usuarioId, fotoUrl ?? null);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** DELETE /api/usuarios/me — eliminar cuenta propia (R12) */
  eliminarCuenta = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = req.user!.sub;
    const { passwordConfirmacion } = req.body as { passwordConfirmacion: string };
    await this.eliminarCuentaUC.execute(usuarioId, passwordConfirmacion);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/usuarios/:id/estadisticas — estadísticas (R48) */
  getEstadisticas = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const result = await this.estadisticasUC.execute(id);
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/usuarios/:id/experiencias — experiencias del usuario (R46) */
  getExperiencias = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const page = Number(req.query['page'] ?? 1);
    const result = await this.listExpUC.execute({ page, limit: 10, usuarioId: id });
    res.json({
      success: true,
      data: result.data.map(UsuarioExperienciaMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      errorMessage: '',
      errorCode: '',
      httpErrorCode: '',
    });
  };
}
