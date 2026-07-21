import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReaccionButton } from '@features/reacciones/components/ReaccionButton';
import * as reaccionesModule from '@features/reacciones/services/reacciones.service';

vi.mock('@features/reacciones/services/reacciones.service', () => ({
  reaccionesService: {
    toggle: vi.fn(),
  },
}));

describe('ReaccionButton', () => {
  it('should render initial count and not reacted state', () => {
    render(<ReaccionButton experienciaId="e1" initialCount={5} initialHasReacted={false} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('🤍')).toBeInTheDocument();
  });

  it('should render reacted state', () => {
    render(<ReaccionButton experienciaId="e1" initialCount={10} initialHasReacted={true} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
  });

  it('should toggle reaction on click', async () => {
    vi.mocked(reaccionesModule.reaccionesService.toggle).mockResolvedValue({
      accion: 'agregado',
      experienciaId: 'e1',
      totalReacciones: 6,
    });

    render(<ReaccionButton experienciaId="e1" initialCount={5} initialHasReacted={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });
  });
});
