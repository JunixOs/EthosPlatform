import { api } from '@shared/services/api';

import type { LoginDTO, RegisterDTO, AuthResponse } from '@features/auth/types/auth.types';

import type { ApiResponse } from '@shared/types/api.types';

export const authService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  async register(data: RegisterDTO): Promise<{ id: string }> {
    const res = await api.post<ApiResponse<{ id: string }>>('/auth/register', data);
    return res.data;
  },
};
