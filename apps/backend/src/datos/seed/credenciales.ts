import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SeedUsuario } from './usuarios.seed';

/**
 * Se escribe en el directorio de trabajo del proceso (apps/backend), que es
 * consistente tanto en desarrollo (`pnpm dev` corre con cwd=apps/backend)
 * como en producción (el Dockerfile fija WORKDIR /app/apps/backend antes de
 * arrancar). No se usa la raíz del monorepo porque la imagen de producción
 * no la incluye.
 */
export async function escribirCredenciales(usuarios: SeedUsuario[]): Promise<string> {
  const contenido = [
    'CREDENCIALES DE ACCESO - ETHOS PLATFORM',
    `Generado automáticamente al iniciar la app: ${new Date().toLocaleString('es-PE')}`,
    'Este archivo se regenera en cada arranque. No commitear (ver .gitignore).',
    '',
    ...usuarios.map((u) => [
      `Nombre: ${u.nombre}`,
      `Correo: ${u.correo}`,
      `Contraseña: ${u.password}`,
      `Rol: ${u.rol}`,
      '',
    ].join('\n')),
  ].join('\n');

  const destino = path.join(process.cwd(), 'CREDENCIALES_ACCESO.txt');
  await writeFile(destino, contenido, 'utf-8');
  return destino;
}
