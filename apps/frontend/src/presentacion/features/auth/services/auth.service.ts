import { api } from '../../../shared/services/api';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { LoginDTO, RegisterDTO, AuthResponse } from '../types/auth.types';

export const authService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  async register(data: RegisterDTO): Promise<{ id: string }> {
    const res = await api.post<ApiResponse<{ id: string }>>('/auth/register', data);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout', {});
  },
};
