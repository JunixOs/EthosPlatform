import { describe, it, expect } from 'vitest';
import { Reporte } from '@/logica/domain/entities/Reporte';

describe('Reporte Domain Entity', () => {
  it('should create a valid reporte', () => {
    const r = new Reporte('r1', 'u1', 'e1', 'spam', 'Bad content');
    expect(r.getId()).toBe('r1');
    expect(r.getReporterId()).toBe('u1');
    expect(r.getExperienciaId()).toBe('e1');
    expect(r.getTipo()).toBe('spam');
    expect(r.getDescripcion()).toBe('Bad content');
    expect(r.getEstado()).toBe('pendiente');
  });

  it('should create reporte without descripcion', () => {
    const r = new Reporte('r1', 'u1', 'e1', 'spam', null);
    expect(r.getDescripcion()).toBeNull();
  });

  it('should resolve reporte', () => {
    const r = new Reporte('r1', 'u1', 'e1', 'spam', null);
    r.resolver();
    expect(r.getEstado()).toBe('resuelto');
  });

  it('should throw when resolving already resolved reporte', () => {
    const r = new Reporte('r1', 'u1', 'e1', 'spam', null);
    r.resolver();
    expect(() => r.resolver()).toThrow('El reporte ya fue resuelto');
  });
});
