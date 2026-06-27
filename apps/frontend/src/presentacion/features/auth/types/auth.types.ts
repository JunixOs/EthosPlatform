export interface LoginDTO {
  correo: string;
  password: string;
  recordarme?: boolean;
}

export interface RegisterDTO {
  nombre: string;
  correo: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  usuarioId: string;
  nombre: string;
  expiresAt: string;
  rol: string;
}