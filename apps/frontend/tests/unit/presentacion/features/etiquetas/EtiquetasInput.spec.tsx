import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EtiquetasInput } from '@features/etiquetas/components/EtiquetasInput';

describe('EtiquetasInput', () => {
  it('should render empty state', () => {
    render(<EtiquetasInput etiquetas={[]} onChange={vi.fn()} />);
    expect(screen.getByText((content) => content.includes('0/5'))).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/escribe y presiona enter/i)).toBeInTheDocument();
  });

  it('should add etiqueta on enter', () => {
    const onChange = vi.fn();
    render(<EtiquetasInput etiquetas={[]} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/escribe y presiona enter/i);
    fireEvent.change(input, { target: { value: 'etica' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['etica']);
  });

  it('should not add duplicate etiqueta', () => {
    const onChange = vi.fn();
    render(<EtiquetasInput etiquetas={['etica']} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/escribe y presiona enter/i);
    fireEvent.change(input, { target: { value: 'etica' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/ya fue agregada/i)).toBeInTheDocument();
  });

  it('should not allow more than 5 etiquetas', () => {
    const onChange = vi.fn();
    render(<EtiquetasInput etiquetas={['a', 'b', 'c', 'd', 'e']} onChange={onChange} />);

    expect(screen.queryByPlaceholderText(/escribe y presiona enter/i)).not.toBeInTheDocument();
  });

  it('should remove etiqueta on click', () => {
    const onChange = vi.fn();
    render(<EtiquetasInput etiquetas={['etica', 'moral']} onChange={onChange} />);

    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['moral']);
  });
});
