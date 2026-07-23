import type { DataSource } from 'typeorm';
import type { Logger } from 'pino';
import { seedUsuarios, USUARIOS_SEED } from './usuarios.seed';
import { seedEtiquetas, ETIQUETAS_SEED } from './etiquetas.seed';
import { seedExperiencias } from './experiencias.seed';
import { seedInteracciones } from './interacciones.seed';
import { seedPaginaEquipo } from './paginaEquipo.seed';
import { escribirCredenciales } from './credenciales';
import type { UpsertCount } from './helpers';

/**
 * Seed automático de datos iniciales/demo. Se ejecuta en cada arranque de la
 * app (dev y producción) usando el DataSource ya inicializado por el
 * contenedor — no abre una conexión propia. Es idempotente: usa upsert()
 * sobre claves únicas o IDs determinísticos (uuid v5), así que arrancar la
 * app cientos de veces nunca duplica filas, solo actualiza las existentes.
 * Todo corre dentro de una única transacción: si algo falla, se hace
 * rollback completo y no queda nada a medio insertar.
 *
 * No incluye un módulo "configuracion.seed.ts" porque el dominio no tiene
 * ninguna entidad de configuración/ajustes — no se inventó una para
 * completar la estructura sugerida.
 */
export async function runSeed(dataSource: DataSource, logger: Logger): Promise<void> {
  const resumen: Record<string, UpsertCount> = {};

  await dataSource.transaction(async (manager) => {
    resumen['usuarios'] = await seedUsuarios(manager);
    resumen['etiquetas'] = await seedEtiquetas(manager);

    const { count: experienciasCount, experiencias } = await seedExperiencias(manager, USUARIOS_SEED, ETIQUETAS_SEED);
    resumen['experiencias'] = experienciasCount;

    const interacciones = await seedInteracciones(manager, USUARIOS_SEED, experiencias);
    resumen['favoritos'] = interacciones.favoritos;
    resumen['reacciones'] = interacciones.reacciones;
    resumen['respuestas'] = interacciones.respuestas;

    resumen['pagina_equipo'] = await seedPaginaEquipo(manager);
  });

  const credencialesPath = await escribirCredenciales(USUARIOS_SEED);

  logger.info('Seed de datos iniciales completado:');
  for (const [entidad, c] of Object.entries(resumen)) {
    logger.info(`  ${entidad}: ${c.procesados} procesados (${c.creados} creados, ${c.actualizados} actualizados)`);
  }
  logger.info(`Credenciales de acceso escritas en: ${credencialesPath}`);
  logger.info(`  Admin: ${USUARIOS_SEED[0]!.correo} / ${USUARIOS_SEED[0]!.password}`);
}
