import type { Request, Response } from 'express';
import type { IUsuarioRepository } from '../../../../application/gateway/repositories/IUsuarioRepository';

export class ListarUsuariosAdminUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(page: number, limit: number): Promise<{
    data: Array<{
      id: string;
      nombre: string;
      correo: string;
      rol: string;
      suspendido: boolean;
      perfilPublico: boolean;
      creadoEn: Date;
    }>;
    total: number;
  }> {
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
    return { data: usuarios, total };
  }
}
