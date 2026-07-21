import 'reflect-metadata';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioORM } from '../src/datos/presistence/entities/UsuarioORM';
import { ExperienciaORM } from '../src/datos/presistence/entities/ExperienciaORM';
import { PaginaEquipoORM } from '../src/datos/presistence/entities/PaginaEquipoORM';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 5432),
    username: process.env['DB_USER'] ?? 'postgres',
    password: process.env['DB_PASSWORD'] ?? 'postgres',
    database: process.env['DB_NAME'] ?? 'ethos_platform',
    entities: [UsuarioORM, ExperienciaORM, PaginaEquipoORM],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();

  const usuarioRepo = dataSource.getRepository(UsuarioORM);
  const experienciaRepo = dataSource.getRepository(ExperienciaORM);
  const paginaRepo = dataSource.getRepository(PaginaEquipoORM);

  // Limpiar datos de test anteriores (usuarios con correo de test)
  const testUsers = await usuarioRepo.find({ where: [{ correo: 'e2e-user@test.com' }, { correo: 'e2e-admin@test.com' }] });
  for (const u of testUsers) {
    await usuarioRepo.delete(u.id);
  }
  const testExps = await experienciaRepo.find({ where: { usuarioId: testUsers[0]?.id ?? 'none' } });
  for (const e of testExps) {
    await experienciaRepo.delete(e.id);
  }

  // Crear usuario normal de test
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash('TestPass123', 10);
  await usuarioRepo.save({
    id: userId,
    nombre: 'E2E User',
    correo: 'e2e-user@test.com',
    passwordHash,
    rol: 'user',
    perfilPublico: true,
    suspendido: false,
  });

  // Crear admin de test
  const adminId = uuidv4();
  const adminPasswordHash = await bcrypt.hash('AdminPass123', 10);
  await usuarioRepo.save({
    id: adminId,
    nombre: 'E2E Admin',
    correo: 'e2e-admin@test.com',
    passwordHash: adminPasswordHash,
    rol: 'admin',
    perfilPublico: true,
    suspendido: false,
  });

  // Crear experiencias de test (del usuario normal)
  const exp1Id = uuidv4();
  await experienciaRepo.save({
    id: exp1Id,
    usuarioId: userId,
    titulo: 'Experiencia E2E de prueba: Dilema en el trabajo',
    descripcion: 'Una descripción detallada de una situación ética real que ocurrió en un entorno laboral.',
    reflexionMoral: 'La moral corporativa dictaba que debía reportar el incidente inmediatamente.',
    reflexionEtica: 'Mi ética personal me indicó que primero debía hablar con la persona involucrada.',
    estado: 'publicada',
    creadaEn: new Date(),
    actualizadaEn: new Date(),
  });

  const exp2Id = uuidv4();
  await experienciaRepo.save({
    id: exp2Id,
    usuarioId: userId,
    titulo: 'Experiencia E2E de prueba: Conflicto familiar',
    descripcion: 'Un dilema ético que surgió en una reunión familiar importante.',
    reflexionMoral: 'La tradición familiar sugería una decisión conservadora.',
    reflexionEtica: 'Mi criterio racional me llevó por otro camino.',
    estado: 'publicada',
    creadaEn: new Date(Date.now() - 86400000),
    actualizadaEn: new Date(Date.now() - 86400000),
  });

  // Crear experiencia del admin (para que e2e-user pueda reportarla)
  const expAdminId = uuidv4();
  await experienciaRepo.save({
    id: expAdminId,
    usuarioId: adminId,
    titulo: 'Experiencia E2E del admin: Reflexión sobre ética',
    descripcion: 'Una experiencia publicada por el admin para pruebas de reportes.',
    reflexionMoral: 'Desde la perspectiva de la moral institucional...',
    reflexionEtica: 'Desde mi ética personal...',
    estado: 'publicada',
    creadaEn: new Date(),
    actualizadaEn: new Date(),
  });

  // Crear página de equipo por defecto
  const existingPagina = await paginaRepo.findOne({ where: {} });
  if (!existingPagina) {
    await paginaRepo.save({
      id: uuidv4(),
      titulo: 'Nuestro Equipo',
      contenido: 'Conoce al equipo detrás de EthosPlatform.',
      miembros: JSON.stringify([
        { nombre: 'Javier', rol: 'Desarrollador Full Stack', bio: 'Responsable de la arquitectura.' },
        { nombre: 'Ana', rol: 'Diseñadora UX', bio: 'Creadora de la experiencia visual.' },
      ]),
      actualizadoEn: new Date(),
    });
  }

  console.log('✅ Seed completado:');
  console.log(`   Usuario: e2e-user@test.com / TestPass123 (ID: ${userId})`);
  console.log(`   Admin:   e2e-admin@test.com / AdminPass123 (ID: ${adminId})`);
  console.log(`   Experiencias: ${exp1Id}, ${exp2Id}, ${expAdminId}`);

  await dataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
