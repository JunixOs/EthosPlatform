import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportarModal } from '@features/reportes/components/ReportarModal';
import * as reportesModule from '@features/reportes/services/reportes.service';

vi.mock('@features/reportes/services/reportes.service', () => ({
  reportesService: {
    crear: vi.fn(),
  },
}));

describe('ReportarModal', () => {
  it('should not render when closed', () => {
    render(<ReportarModal experienciaId="e1" isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/reportar contenido/i)).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<ReportarModal experienciaId="e1" isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/reportar contenido/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reportar/i })).toBeInTheDocument();
  });

  it('should submit report and show success', async () => {
    vi.mocked(reportesModule.reportesService.crear).mockResolvedValue({ id: 'r1', estado: 'pendiente' });
    const onClose = vi.fn();

    render(<ReportarModal experienciaId="e1" isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'acoso' } });
    fireEvent.click(screen.getByRole('button', { name: /reportar/i }));

    await waitFor(() => {
      expect(screen.getByText(/reporte enviado/i)).toBeInTheDocument();
    });
  });

  it('should close on cancel', () => {
    const onClose = vi.fn();
    render(<ReportarModal experienciaId="e1" isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
