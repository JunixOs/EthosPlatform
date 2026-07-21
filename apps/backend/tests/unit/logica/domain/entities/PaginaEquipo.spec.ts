import { describe, it, expect } from 'vitest';
import { PaginaEquipo } from '@/logica/domain/entities/PaginaEquipo';

describe('PaginaEquipo Domain Entity', () => {
  it('should create a valid pagina equipo', () => {
    const p = new PaginaEquipo('p1', 'Equipo', 'Contenido', [{ nombre: 'Ana', rol: 'Dev' }]);
    expect(p.getId()).toBe('p1');
    expect(p.getTitulo()).toBe('Equipo');
    expect(p.getContenido()).toBe('Contenido');
    expect(p.getMiembros()).toHaveLength(1);
  });

  it('should throw for empty titulo', () => {
    expect(() => new PaginaEquipo('p1', '', 'Contenido', [])).toThrow('El título no puede estar vacío');
  });

  it('should throw for whitespace-only titulo', () => {
    expect(() => new PaginaEquipo('p1', '   ', 'Contenido', [])).toThrow('El título no puede estar vacío');
  });

  it('should throw for empty contenido', () => {
    expect(() => new PaginaEquipo('p1', 'Titulo', '', [])).toThrow('El contenido no puede estar vacío');
  });

  it('should edit and update timestamp', () => {
    const p = new PaginaEquipo('p1', 'Old', 'Old content', []);
    const antes = p.getActualizadoEn();
    p.editar('New', 'New content', [{ nombre: 'Bob', rol: 'Designer' }]);
    expect(p.getTitulo()).toBe('New');
    expect(p.getMiembros()).toHaveLength(1);
    expect(p.getActualizadoEn().getTime()).toBeGreaterThanOrEqual(antes.getTime());
  });
});
