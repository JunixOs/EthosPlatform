import type { EntityManager } from 'typeorm';
import { PaginaEquipoORM } from '../presistence/entities/PaginaEquipoORM';
import { seedId, type UpsertCount } from './helpers';

const PAGINA_EQUIPO_ID = seedId('pagina-equipo:singleton');

const CONTENIDO = [
  'EthosPlatform es un proyecto desarrollado por estudiantes de la Universidad Nacional Agraria de la Selva (UNAS), Facultad de Ingeniería en Informática y Sistemas. Nuestro objetivo es crear una comunidad donde las personas puedan compartir y reflexionar sobre dilemas éticos y morales.',
  'Misión: Promover la reflexión ética y el diálogo moral en la comunidad académica.',
  'Visión: Ser una plataforma de referencia para la educación en valores y ética.',
  'Valores: Integridad, Transparencia, Respeto, Inclusión, Innovación.',
  'Contacto: info@ethos.com',
  'Ubicación: Universidad Nacional Agraria de la Selva, Tocache, San Martín, Perú.',
].join('\n\n');

const MIEMBROS = [
  { nombre: 'Angel Paolo Javier', rol: 'Desarrollador Full Stack - Líder del proyecto', bio: 'Desarrollador Full Stack - Líder del proyecto' },
  { nombre: 'Diana Yllesca', rol: 'Diseñadora UX/UI - Responsable de UI', bio: 'Diseñadora UX/UI - Responsable de UI' },
  { nombre: 'Junior Ordoñez', rol: 'DevOps & Backend - Infraestructura', bio: 'DevOps & Backend - Infraestructura' },
  { nombre: 'Yimi Kevin Ponce', rol: 'Frontend Developer - React especialista', bio: 'Frontend Developer - React especialista' },
];

/**
 * PaginaEquipo es un singleton (una sola fila), pero la tabla no tiene
 * ningún constraint único más allá de `id` que lo garantice — un upsert
 * ciego por un id determinístico fijo crearía una fila nueva junto a
 * cualquier fila preexistente con otro id (ej. la creada por
 * scripts/seed.ts). Por eso, a diferencia del resto de los seeders, acá sí
 * hace falta un find() previo: se reutiliza el id de la fila existente si
 * la hay (y se eliminan sobrantes si por algún motivo hay más de una), en
 * vez de asumir que el conflictPath de upsert alcanza para evitar duplicados.
 */
export async function seedPaginaEquipo(manager: EntityManager): Promise<UpsertCount> {
  const repo = manager.getRepository(PaginaEquipoORM);
  const existentes = await repo.find();

  const idAUsar = existentes[0]?.id ?? PAGINA_EQUIPO_ID;
  const sobrantes = existentes.slice(1).map((p) => p.id);
  if (sobrantes.length > 0) {
    await repo.delete(sobrantes);
  }

  const row = {
    id: idAUsar,
    titulo: 'Conoce al Equipo de EthosPlatform',
    contenido: CONTENIDO,
    miembros: JSON.stringify(MIEMBROS),
  };
  await repo.upsert([row], { conflictPaths: ['id'] });

  return { procesados: 1, creados: existentes.length === 0 ? 1 : 0, actualizados: existentes.length === 0 ? 0 : 1 };
}
