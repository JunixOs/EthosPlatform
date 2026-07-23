import { v5 as uuidv5 } from 'uuid';
import type { EntityManager } from 'typeorm';
import type { EntityTarget, ObjectLiteral } from 'typeorm';

/**
 * Namespace fijo para generar IDs determinísticos (uuid v5) para las filas
 * de seed. Usar siempre el mismo `name` produce siempre el mismo UUID, lo
 * que permite hacer upsert por `id` en entidades sin una clave de negocio
 * única (Experiencia, Respuesta, PaginaEquipo) sin tener que consultar antes
 * de insertar.
 */
const SEED_NAMESPACE = '4f9f6d9e-4b8a-4b7a-9c9b-3f6a3e8f9a10';

export function seedId(name: string): string {
  return uuidv5(name, SEED_NAMESPACE);
}

export interface UpsertCount {
  procesados: number;
  creados: number;
  actualizados: number;
}

/**
 * Hace upsert de un lote de filas y reporta cuántas fueron creadas vs
 * actualizadas, comparando el conteo total antes/después (más simple y
 * portable entre drivers que inspeccionar el resultado crudo de upsert()).
 */
export async function upsertWithCount<T extends ObjectLiteral>(
  manager: EntityManager,
  target: EntityTarget<T>,
  rows: Array<Record<string, unknown>>,
  conflictPaths: string[],
): Promise<UpsertCount> {
  if (rows.length === 0) {
    return { procesados: 0, creados: 0, actualizados: 0 };
  }
  const repo = manager.getRepository(target);
  const antes = await repo.count();
  await repo.upsert(rows as unknown as T[], { conflictPaths });
  const despues = await repo.count();
  const creados = despues - antes;
  return { procesados: rows.length, creados, actualizados: rows.length - creados };
}
