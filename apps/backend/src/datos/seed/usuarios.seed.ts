import type { EntityManager } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UsuarioORM } from '../presistence/entities/UsuarioORM';
import { seedId, upsertWithCount, type UpsertCount } from './helpers';

export interface SeedUsuario {
  id: string;
  nombre: string;
  correo: string;
  password: string;
  rol: 'admin' | 'user';
  biografia: string;
}

const USUARIOS_PLANTILLA: Omit<SeedUsuario, 'id'>[] = [
  {
    nombre: 'Administrador Ethos',
    correo: 'admin@ethos.com',
    password: 'adminEthos',
    rol: 'admin',
    biografia: 'Cuenta de administración de la plataforma.',
  },
  {
    nombre: 'Laura Mendoza',
    correo: 'laura.mendoza@ethos.com',
    password: 'Usuario123',
    rol: 'user',
    biografia: 'Estudiante de filosofía interesada en ética aplicada.',
  },
  {
    nombre: 'Diego Ramírez',
    correo: 'diego.ramirez@ethos.com',
    password: 'Usuario123',
    rol: 'user',
    biografia: 'Ingeniero de software, participa activamente en la comunidad.',
  },
  {
    nombre: 'Valentina Torres',
    correo: 'valentina.torres@ethos.com',
    password: 'Usuario123',
    rol: 'user',
    biografia: 'Psicóloga, le interesan los dilemas éticos en salud mental.',
  },
  {
    nombre: 'Mateo Rojas',
    correo: 'mateo.rojas@ethos.com',
    password: 'Usuario123',
    rol: 'user',
    biografia: 'Docente universitario, comparte experiencias del aula.',
  },
  {
    nombre: 'Camila Vega',
    correo: 'camila.vega@ethos.com',
    password: 'Usuario123',
    rol: 'user',
    biografia: 'Abogada, reflexiona sobre justicia y ética profesional.',
  },
];

export const USUARIOS_SEED: SeedUsuario[] = USUARIOS_PLANTILLA.map((u) => ({
  ...u,
  id: seedId(`usuario:${u.correo}`),
}));

export async function seedUsuarios(manager: EntityManager): Promise<UpsertCount> {
  const rows = await Promise.all(
    USUARIOS_SEED.map(async (u) => ({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      passwordHash: await bcrypt.hash(u.password, 10),
      rol: u.rol,
      biografia: u.biografia,
      perfilPublico: true,
      suspendido: false,
    })),
  );

  return upsertWithCount(manager, UsuarioORM, rows, ['correo']);
}
