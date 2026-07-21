import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RespuestasSection } from '@features/respuestas/components/RespuestasSection';
import * as respuestasModule from '@features/respuestas/services/respuestas.service';
import * as authStore from '@/app/store/auth.store';
import type { AuthState } from '@/app/store/auth.store';

vi.mock('@features/respuestas/services/respuestas.service', () => ({
  respuestasService: {
    listar: vi.fn(),
    crear: vi.fn(),
    eliminar: vi.fn(),
  },
}));

vi.mock('@/app/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

describe('RespuestasSection', () => {
  it('should show login prompt when no user', async () => {
    vi.mocked(authStore.useAuthStore).mockReturnValue({ usuario: null } as unknown as AuthState);
    vi.mocked(respuestasModule.respuestasService.listar).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

    render(<MemoryRouter><RespuestasSection experienciaId="e1" /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument();
    });
  });

  it('should list respuestas', async () => {
    vi.mocked(authStore.useAuthStore).mockReturnValue({ usuario: { id: 'u1' } } as unknown as AuthState);
    vi.mocked(respuestasModule.respuestasService.listar).mockResolvedValue({
      data: [
        { id: 'r1', experienciaId: 'e1', usuarioId: 'u2', contenido: 'Buen post', creadaEn: '2024-01-01T00:00:00Z' },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });

    render(<MemoryRouter><RespuestasSection experienciaId="e1" /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Buen post')).toBeInTheDocument();
      expect(screen.getByText('Respuestas (1)')).toBeInTheDocument();
    });
  });

  it('should create respuesta', async () => {
    vi.mocked(authStore.useAuthStore).mockReturnValue({ usuario: { id: 'u1' } } as unknown as AuthState);
    vi.mocked(respuestasModule.respuestasService.listar).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });
    vi.mocked(respuestasModule.respuestasService.crear).mockResolvedValue({
      id: 'r2', experienciaId: 'e1', usuarioId: 'u1', contenido: 'Mi respuesta', creadaEn: '2024-01-01T00:00:00Z',
    });

    render(<MemoryRouter><RespuestasSection experienciaId="e1" /></MemoryRouter>);
    await waitFor(() => expect(screen.getByPlaceholderText(/escribe tu respuesta/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/escribe tu respuesta/i), { target: { value: 'Mi respuesta' } });
    fireEvent.click(screen.getByRole('button', { name: /responder/i }));

    await waitFor(() => {
      expect(screen.getByText('Mi respuesta')).toBeInTheDocument();
    });
  });
});
