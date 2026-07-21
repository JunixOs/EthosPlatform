import { describe, it, expect } from 'vitest';
import { Etiqueta } from '@/logica/domain/entities/Etiqueta';

describe('Etiqueta Domain Entity', () => {
  it('should create a valid etiqueta', () => {
    const e = new Etiqueta('et1', 'etica', 'etica');
    expect(e.getId()).toBe('et1');
    expect(e.getNombre()).toBe('etica');
    expect(e.getSlug()).toBe('etica');
  });

  it('should throw for empty name', () => {
    expect(() => new Etiqueta('et1', '', 'slug')).toThrow('El nombre de la etiqueta no puede estar vacío');
  });

  it('should throw for whitespace-only name', () => {
    expect(() => new Etiqueta('et1', '   ', 'slug')).toThrow('El nombre de la etiqueta no puede estar vacío');
  });

  it('should throw for name over 50 chars', () => {
    const longName = 'a'.repeat(51);
    expect(() => new Etiqueta('et1', longName, 'slug')).toThrow('El nombre de la etiqueta no puede superar 50 caracteres');
  });

  it('should allow name of exactly 50 chars', () => {
    const name = 'a'.repeat(50);
    const e = new Etiqueta('et1', name, 'slug');
    expect(e.getNombre()).toBe(name);
  });
});
