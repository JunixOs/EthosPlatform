const BASE_URL = import.meta.env['VITE_API_URL'] as string ?? 'http://localhost:3000/api';

function getToken(): string | null {
  return localStorage.getItem('ethos_token');
}

function clearAuthAndRedirect(): void {
  localStorage.removeItem('ethos_token');
  localStorage.removeItem('ethos_usuario');
  localStorage.removeItem('ethos_token_expiresAt');
  window.dispatchEvent(new CustomEvent('ethos:auth:expired'));
  // Redirigir a login con flag de sesión expirada (evita loop si ya estamos en login)
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login?sesionExpirada=1';
  }
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  errorMessage: string;
  errorCode: string;
  httpErrorCode: number;
  module: string;
  event: string;
  extra?: Record<string, unknown>;
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly module: string;
  public readonly event: string;
  public readonly extra?: Record<string, unknown>;

  constructor(response: ApiErrorResponse) {
    super(response.errorMessage);
    this.name = 'ApiError';
    this.code = response.errorCode;
    this.httpStatus = response.httpErrorCode;
    this.module = response.module;
    this.event = response.event;
    this.extra = response.extra;
  }

  /** Devuelve true si es un error de autenticación (401/403) */
  isAuthError(): boolean {
    return this.httpStatus === 401 || this.httpStatus === 403;
  }

  /** Devuelve true si es un error de validación (400) */
  isValidationError(): boolean {
    return this.httpStatus === 400;
  }

  /** Devuelve true si es un error de conflicto (409) */
  isConflictError(): boolean {
    return this.httpStatus === 409;
  }

  /** Devuelve true si es un error de servidor (500) */
  isServerError(): boolean {
    return this.httpStatus >= 500;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as Partial<ApiErrorResponse>;

    // Interceptor global: 401 = sesión expirada o inválida
    if (res.status === 401) {
      clearAuthAndRedirect();
    }

    throw new ApiError({
      success: false,
      data: null,
      errorMessage: json.errorMessage ?? `Error ${res.status}`,
      errorCode: json.errorCode ?? `HTTP_${res.status}`,
      httpErrorCode: json.httpErrorCode ?? res.status,
      module: json.module ?? 'SYSTEM',
      event: json.event ?? 'ERROR',
      extra: json.extra,
    });
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const json = await res.json() as T;
  return json;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};
