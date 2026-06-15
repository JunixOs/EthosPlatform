import type { Request, Response } from 'express';
import type { AsignarRolUseCase } from '../../../../application/features/admin/asignar_rol/AsignarRolUseCase';
import type { SuspenderUsuarioUseCase } from '../../../../application/features/admin/suspender_usuario/SuspenderUsuarioUseCase';
import type { EditarUsuarioAdminUseCase } from '../../../../application/features/admin/editar_usuario/EditarUsuarioAdminUseCase';
import type { EliminarUsuarioAdminUseCase } from '../../../../application/features/admin/eliminar_usuario/EliminarUsuarioAdminUseCase';
import type { IUsuarioRepository } from '../../../../application/gateway/repositories/IUsuarioRepository';

export class AdminController {
  constructor(
    private readonly asignarRolUC: AsignarRolUseCase,
    private readonly suspenderUC: SuspenderUsuarioUseCase,
    private readonly editarUC: EditarUsuarioAdminUseCase,
    private readonly eliminarUC: EliminarUsuarioAdminUseCase,
    private readonly usuarioRepo: IUsuarioRepository,
  ) {}

  /** GET /api/admin/usuarios — listar todos los usuarios */
  listarUsuarios = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 20);
    const { data, total } = await this.usuarioRepo.findAll(page, limit);
    const usuarios = data.map((u) => ({
      id: u.getId(),
      nombre: u.getNombre(),
      correo: u.getEmail().getValue(),
      rol: u.getRol(),
      suspendido: u.isSuspendido(),
      perfilPublico: u.isPerfilPublico(),
      creadoEn: u.getCreadoEn(),
    }));
    res.json({ success: true, data: usuarios, total, page, limit, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PATCH /api/admin/usuarios/:id/rol — asignar rol (R02) */
  asignarRol = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { rol } = req.body as { rol: string };
    await this.asignarRolUC.execute(id, rol);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PATCH /api/admin/usuarios/:id/suspender — suspender usuario (R37) */
  suspender = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { diasSuspension } = req.body as { diasSuspension: number };
    await this.suspenderUC.execute({ targetId: id, diasSuspension });
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PATCH /api/admin/usuarios/:id/reactivar — reactivar usuario */
  reactivar = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { data } = await this.usuarioRepo.findAll(1, 1);
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) { res.status(404).json({ success: false, data: [], errorMessage: 'Usuario no encontrado.', errorCode: 'NOT_FOUND', httpErrorCode: '404' }); return; }
    usuario.reactivar();
    await this.usuarioRepo.update(usuario);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
    void data;
  };

  /** PUT /api/admin/usuarios/:id — editar usuario (R06, R22) */
  editarUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { nombre, correo, rol, perfilPublico } = req.body as {
      nombre: string;
      correo: string;
      rol: string;
      perfilPublico: boolean;
    };
    await this.editarUC.execute({ targetId: id, nombre, correo, rol, perfilPublico });
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** DELETE /api/admin/usuarios/:id — eliminar usuario (R21) */
  eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    await this.eliminarUC.execute(id);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
