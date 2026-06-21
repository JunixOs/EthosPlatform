import { api } from '@shared/services/api';

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  suspendido: boolean;
  perfilPublico: boolean;
  creadoEn: string;
}

export const adminService = {
  async listarUsuarios(page = 1, limit = 20): Promise<{ data: UsuarioAdmin[]; total: number }> {
    const res = await api.get<{ data: UsuarioAdmin[]; total: number }>(`/api/admin/usuarios?page=${page}&limit=${limit}`);
    return res.data;
  },

  async asignarRol(id: string, rol: string): Promise<void> {
    await api.patch(`/api/admin/usuarios/${id}/rol`, { rol });
  },

  async suspender(id: string, diasSuspension: number): Promise<void> {
    await api.patch(`/api/admin/usuarios/${id}/suspender`, { diasSuspension });
  },

  async reactivar(id: string): Promise<void> {
    await api.patch(`/api/admin/usuarios/${id}/reactivar`, {});
  },

  async eliminar(id: string): Promise<void> {
    await api.delete(`/api/admin/usuarios/${id}`);
  },
};
