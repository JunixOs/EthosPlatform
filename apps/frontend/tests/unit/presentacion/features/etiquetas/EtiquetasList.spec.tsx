import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EtiquetasList } from '@features/etiquetas/components/EtiquetasList';

describe('EtiquetasList', () => {
  it('should render nothing when empty', () => {
    const { container } = render(
      <MemoryRouter>
        <EtiquetasList etiquetas={[]} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render etiquetas as links', () => {
    render(
      <MemoryRouter>
        <EtiquetasList etiquetas={[
          { id: 'et1', nombre: 'etica', slug: 'etica' },
          { id: 'et2', nombre: 'moral', slug: 'moral' },
        ]} />
      </MemoryRouter>
    );

    expect(screen.getByText('#etica')).toBeInTheDocument();
    expect(screen.getByText('#moral')).toBeInTheDocument();
  });
});
