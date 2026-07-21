import { describe, it, expect } from 'vitest';
import { Respuesta } from '@/logica/domain/entities/Respuesta';

describe('Respuesta Domain Entity', () => {
  it('should create a valid respuesta', () => {
    const r = new Respuesta('r1', 'e1', 'u1', 'Contenido válido');
    expect(r.getId()).toBe('r1');
    expect(r.getExperienciaId()).toBe('e1');
    expect(r.getUsuarioId()).toBe('u1');
    expect(r.getContenido()).toBe('Contenido válido');
  });

  it('should throw for empty content', () => {
    expect(() => new Respuesta('r1', 'e1', 'u1', '')).toThrow('El contenido de la respuesta no puede estar vacío');
  });

  it('should throw for whitespace-only content', () => {
    expect(() => new Respuesta('r1', 'e1', 'u1', '   ')).toThrow('El contenido de la respuesta no puede estar vacío');
  });

  it('should throw for content over 2000 chars', () => {
    const longContent = 'a'.repeat(2001);
    expect(() => new Respuesta('r1', 'e1', 'u1', longContent)).toThrow('El contenido de la respuesta no puede superar 2000 caracteres');
  });

  it('should allow content of exactly 2000 chars', () => {
    const content = 'a'.repeat(2000);
    const r = new Respuesta('r1', 'e1', 'u1', content);
    expect(r.getContenido()).toBe(content);
  });

  it('should edit content and update timestamp', () => {
    const r = new Respuesta('r1', 'e1', 'u1', 'Original');
    const antes = r.getActualizadaEn();
    r.editar('Nuevo contenido');
    expect(r.getContenido()).toBe('Nuevo contenido');
    expect(r.getActualizadaEn().getTime()).toBeGreaterThanOrEqual(antes.getTime());
  });
});
