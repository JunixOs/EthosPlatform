import type { EntityManager } from 'typeorm';
import { EtiquetaORM } from '../presistence/entities/EtiquetaORM';
import { seedId, upsertWithCount, type UpsertCount } from './helpers';

export interface SeedEtiqueta {
  id: string;
  nombre: string;
  slug: string;
}

const ETIQUETAS_PLANTILLA: Array<{ nombre: string; slug: string }> = [
  { nombre: 'Integridad', slug: 'integridad' },
  { nombre: 'Honestidad', slug: 'honestidad' },
  { nombre: 'Responsabilidad', slug: 'responsabilidad' },
  { nombre: 'Empatía', slug: 'empatia' },
  { nombre: 'Justicia', slug: 'justicia' },
  { nombre: 'Transparencia', slug: 'transparencia' },
  { nombre: 'Trabajo', slug: 'trabajo' },
  { nombre: 'Relaciones', slug: 'relaciones' },
  { nombre: 'Coraje', slug: 'coraje' },
  { nombre: 'Confianza', slug: 'confianza' },
  { nombre: 'Respeto', slug: 'respeto' },
  { nombre: 'Solidaridad', slug: 'solidaridad' },
  { nombre: 'Lealtad', slug: 'lealtad' },
  { nombre: 'Humildad', slug: 'humildad' },
  { nombre: 'Perseverancia', slug: 'perseverancia' },
];

export const ETIQUETAS_SEED: SeedEtiqueta[] = ETIQUETAS_PLANTILLA.map((e) => ({
  ...e,
  id: seedId(`etiqueta:${e.slug}`),
}));

export async function seedEtiquetas(manager: EntityManager): Promise<UpsertCount> {
  const rows = ETIQUETAS_SEED.map((e) => ({ id: e.id, nombre: e.nombre, slug: e.slug }));
  return upsertWithCount(manager, EtiquetaORM, rows, ['slug']);
}
