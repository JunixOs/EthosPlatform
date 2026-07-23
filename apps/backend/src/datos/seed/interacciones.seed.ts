import type { EntityManager } from 'typeorm';
import { FavoritoORM } from '../presistence/entities/FavoritoORM';
import { ReaccionORM } from '../presistence/entities/ReaccionORM';
import { RespuestaORM } from '../presistence/entities/RespuestaORM';
import { seedId, upsertWithCount, type UpsertCount } from './helpers';
import type { SeedUsuario } from './usuarios.seed';
import type { SeedExperiencia } from './experiencias.seed';

const RESPUESTAS_TEXTO = [
  'Gracias por compartir esto, me hizo reflexionar bastante.',
  'Muy identificado con tu experiencia, gracias por la honestidad.',
  'Creo que actuaste correctamente, no es una decisión fácil.',
  'Interesante punto de vista, no lo había pensado así.',
  'Esto resume muy bien el dilema entre moral y ética personal.',
];

export interface InteraccionesSeedResult {
  favoritos: UpsertCount;
  reacciones: UpsertCount;
  respuestas: UpsertCount;
}

/**
 * Distribuye favoritos, reacciones y respuestas entre usuarios y
 * experiencias publicadas de forma determinística (sin Math.random()), para
 * que cada reinicio genere exactamente los mismos pares y el upsert sea
 * verdaderamente idempotente. Un usuario nunca interactúa con su propia
 * experiencia (no tendría sentido reaccionar/comentar tu propio post).
 */
export async function seedInteracciones(
  manager: EntityManager,
  usuarios: SeedUsuario[],
  experiencias: Array<SeedExperiencia & { usuarioId: string }>,
): Promise<InteraccionesSeedResult> {
  const publicadas = experiencias.filter((e) => e.estado === 'publicada');
  const n = usuarios.length;

  const favoritoRows: Array<{ usuarioId: string; experienciaId: string }> = [];
  const reaccionRows: Array<{ id: string; usuarioId: string; experienciaId: string }> = [];
  const respuestaRows: Array<{ id: string; experienciaId: string; usuarioId: string; contenido: string }> = [];

  publicadas.forEach((exp, i) => {
    // Cada experiencia recibe favorito y reacción de los siguientes 2 usuarios
    // (en el orden circular de la lista), salteando al propio autor.
    for (const offset of [1, 2]) {
      const candidato = usuarios[(i + offset) % n]!;
      if (candidato.id === exp.usuarioId) continue;

      favoritoRows.push({ usuarioId: candidato.id, experienciaId: exp.id });
      reaccionRows.push({
        id: seedId(`reaccion:${exp.id}:${candidato.id}`),
        usuarioId: candidato.id,
        experienciaId: exp.id,
      });
    }

    // Una respuesta cada dos experiencias, de un tercer usuario distinto.
    if (i % 2 === 0) {
      const autor = usuarios[(i + 3) % n]!;
      if (autor.id !== exp.usuarioId) {
        respuestaRows.push({
          id: seedId(`respuesta:${exp.id}:${autor.id}`),
          experienciaId: exp.id,
          usuarioId: autor.id,
          contenido: RESPUESTAS_TEXTO[i % RESPUESTAS_TEXTO.length]!,
        });
      }
    }
  });

  const favoritos = await upsertWithCount(manager, FavoritoORM, favoritoRows, ['usuarioId', 'experienciaId']);
  const reacciones = await upsertWithCount(manager, ReaccionORM, reaccionRows, ['usuarioId', 'experienciaId']);
  const respuestas = await upsertWithCount(manager, RespuestaORM, respuestaRows, ['id']);

  return { favoritos, reacciones, respuestas };
}
