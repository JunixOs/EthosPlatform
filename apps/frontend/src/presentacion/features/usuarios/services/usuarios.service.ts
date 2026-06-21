import { api } from '@shared/services/api';
import type { PerfilUsuario } from '@features/usuarios/types/usuario.types';

export const usuariosService = {
  async getPerfil(id: string): Promise<PerfilUsuario> {
    const res = await api.get<PerfilUsuario>(`/usuarios/${id}`);
    return res.data;
  },

  async getMiPerfil(): Promise<PerfilUsuario> {
    const res = await api.get<PerfilUsuario>('/usuarios/me');
    return res.data;
  },

  async editarPerfil(data: { nombre: string; biografia?: string | null; perfilPublico: boolean }): Promise<void> {
    await api.put('/usuarios/me/perfil', data);
  },

  async editarFoto(fotoUrl: string | null): Promise<void> {
    await api.put('/usuarios/me/foto', { fotoUrl });
  },

  async eliminarCuenta(passwordConfirmacion: string): Promise<void> {
    await api.delete('/usuarios/me', { passwordConfirmacion });
  },
};
