import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioORM } from '../presistence/entities/UsuarioORM';
import { ExperienciaORM } from '../presistence/entities/ExperienciaORM';
import { EtiquetaORM } from '../presistence/entities/EtiquetaORM';
import { ExperienciaEtiquetaORM } from '../presistence/entities/ExperienciaEtiquetaORM';
import { PaginaEquipoORM } from '../presistence/entities/PaginaEquipoORM';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

interface SeedPersona {
  nombre: string;
  correo: string;
  password: string;
  rol: 'admin' | 'user';
  biografia: string;
  rolEquipo: string;
}

// Equipo del proyecto — todos con rol=admin (único rol con privilegios reales
// en el backend hoy; no existe un rol "moderador" distinto de "admin").
const TEAM: SeedPersona[] = [
  { nombre: 'Angel Paolo Javier', correo: 'angel@ethos.com', password: 'Angel123!Secure', rol: 'admin', biografia: 'Desarrollador Full Stack - Líder del proyecto', rolEquipo: 'Desarrollador Full Stack - Líder del proyecto' },
  { nombre: 'Diana Yllesca', correo: 'diana@ethos.com', password: 'Diana123!Secure', rol: 'admin', biografia: 'Diseñadora UX/UI - Responsable de UI', rolEquipo: 'Diseñadora UX/UI - Responsable de UI' },
  { nombre: 'Junior Ordoñez', correo: 'junior@ethos.com', password: 'Junior123!Secure', rol: 'admin', biografia: 'DevOps & Backend - Infraestructura', rolEquipo: 'DevOps & Backend - Infraestructura' },
  { nombre: 'Yimi Kevin Ponce', correo: 'yimi@ethos.com', password: 'Yimi123!Secure', rol: 'admin', biografia: 'Frontend Developer - React especialista', rolEquipo: 'Frontend Developer - React especialista' },
];

const TEST_USERS: SeedPersona[] = [
  { nombre: 'Juan Pérez García', correo: 'juan.perez@test.com', password: 'TestUser123!', rol: 'user', biografia: 'Usuario de prueba', rolEquipo: '' },
  { nombre: 'María López Rodríguez', correo: 'maria.lopez@test.com', password: 'TestUser123!', rol: 'user', biografia: 'Usuario de prueba', rolEquipo: '' },
  { nombre: 'Carlos Martínez Sánchez', correo: 'carlos.martinez@test.com', password: 'TestUser123!', rol: 'user', biografia: 'Usuario de prueba', rolEquipo: '' },
  { nombre: 'Sofia García Fernández', correo: 'sofia.garcia@test.com', password: 'TestUser123!', rol: 'user', biografia: 'Usuario de prueba', rolEquipo: '' },
];

const ETIQUETAS = [
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
];

const EXPERIENCIAS_EJEMPLO = [
  {
    titulo: 'Mi primer dilema ético en el trabajo',
    descripcion: 'La primera vez que enfrenté una decisión ética difícil en mi carrera profesional.',
    reflexionMoral: 'Aprendí que la integridad es más importante que el beneficio inmediato.',
    reflexionEtica: 'Decidí actuar según mi propio criterio de lo correcto, incluso si no era la opción más cómoda.',
    etiquetas: ['integridad', 'trabajo'],
  },
  {
    titulo: 'Cuando tuve que elegir entre amigo y principios',
    descripcion: 'Un conflicto entre lealtad personal y valores éticos.',
    reflexionMoral: 'Los verdaderos amigos respetan tus valores.',
    reflexionEtica: 'Elegí mantenerme fiel a mis principios, confiando en que la amistad genuina lo entendería.',
    etiquetas: ['coraje', 'relaciones', 'confianza'],
  },
  {
    titulo: 'Transparencia en la comunicación',
    descripcion: 'La importancia de ser honesto incluso cuando es difícil.',
    reflexionMoral: 'La verdad siempre sale a la luz, mejor siendo honesto desde el inicio.',
    reflexionEtica: 'Opté por decir la verdad de inmediato, aunque implicara una conversación incómoda.',
    etiquetas: ['honestidad', 'transparencia'],
  },
  {
    titulo: 'Solidaridad con colegas',
    descripcion: 'Cómo defendí a un compañero injustamente criticado.',
    reflexionMoral: 'La empatía y solidaridad son fundamentales en cualquier comunidad.',
    reflexionEtica: 'Decidí hablar en su defensa porque consideré que era lo justo, más allá de las consecuencias.',
    etiquetas: ['empatia', 'relaciones', 'trabajo'],
  },
  {
    titulo: 'Errores y responsabilidad',
    descripcion: 'Asumir responsabilidad por un error en un proyecto importante.',
    reflexionMoral: 'Asumir errores genera confianza y fortalece las relaciones.',
    reflexionEtica: 'Reconocí mi error abiertamente porque creo que la honestidad vale más que cuidar mi imagen.',
    etiquetas: ['responsabilidad', 'confianza'],
  },
];

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 5432),
    username: process.env['DB_USER'] ?? 'postgres',
    password: process.env['DB_PASSWORD'] ?? 'postgres',
    database: process.env['DB_NAME'] ?? 'ethos_platform',
    entities: [UsuarioORM, ExperienciaORM, EtiquetaORM, ExperienciaEtiquetaORM, PaginaEquipoORM],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();

  const usuarioRepo = dataSource.getRepository(UsuarioORM);
  const experienciaRepo = dataSource.getRepository(ExperienciaORM);
  const etiquetaRepo = dataSource.getRepository(EtiquetaORM);
  const expEtiquetaRepo = dataSource.getRepository(ExperienciaEtiquetaORM);
  const paginaRepo = dataSource.getRepository(PaginaEquipoORM);

  // Limpiar datos de test anteriores (usuarios con correo de test)
  const testUsers = await usuarioRepo.find({ where: [{ correo: 'e2e-user@test.com' }, { correo: 'e2e-admin@test.com' }] });
  for (const u of testUsers) {
    await usuarioRepo.delete(u.id);
  }
  if (testUsers.length > 0) {
    const userIds = testUsers.map((u) => u.id);
    const testExps = await experienciaRepo.find({ where: userIds.map((id) => ({ usuarioId: id })) });
    for (const e of testExps) {
      await experienciaRepo.delete(e.id);
    }
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

  // ─────────────────────────────────────────────────────
  // Equipo del proyecto y usuarios de prueba con nombre real
  // ─────────────────────────────────────────────────────
  const todasLasPersonas = [...TEAM, ...TEST_USERS];
  const existentes = await usuarioRepo.find({ where: todasLasPersonas.map((p) => ({ correo: p.correo })) });
  for (const u of existentes) {
    const expsPersona = await experienciaRepo.find({ where: { usuarioId: u.id } });
    for (const e of expsPersona) {
      await expEtiquetaRepo.delete({ experienciaId: e.id });
      await experienciaRepo.delete(e.id);
    }
    await usuarioRepo.delete(u.id);
  }

  const idsPorCorreo = new Map<string, string>();
  for (const persona of todasLasPersonas) {
    const id = uuidv4();
    idsPorCorreo.set(persona.correo, id);
    const hash = await bcrypt.hash(persona.password, 10);
    await usuarioRepo.save({
      id,
      nombre: persona.nombre,
      correo: persona.correo,
      passwordHash: hash,
      rol: persona.rol,
      biografia: persona.biografia,
      perfilPublico: true,
      suspendido: false,
    });
  }

  // Etiquetas (crear si no existen)
  const idsPorSlug = new Map<string, string>();
  for (const et of ETIQUETAS) {
    const etiqueta = await etiquetaRepo.findOneBy({ slug: et.slug });
    if (!etiqueta) {
      const id = uuidv4();
      await etiquetaRepo.save({ id, nombre: et.nombre, slug: et.slug });
      idsPorSlug.set(et.slug, id);
    } else {
      idsPorSlug.set(et.slug, etiqueta.id);
    }
  }

  // Experiencias de ejemplo, autoría rotando entre el equipo
  for (let i = 0; i < EXPERIENCIAS_EJEMPLO.length; i++) {
    const ex = EXPERIENCIAS_EJEMPLO[i]!;
    const autor = TEAM[i % TEAM.length]!;
    const usuarioId = idsPorCorreo.get(autor.correo)!;
    const expId = uuidv4();
    await experienciaRepo.save({
      id: expId,
      usuarioId,
      titulo: ex.titulo,
      descripcion: ex.descripcion,
      reflexionMoral: ex.reflexionMoral,
      reflexionEtica: ex.reflexionEtica,
      estado: 'publicada',
      creadaEn: new Date(),
      actualizadaEn: new Date(),
    });
    for (const slug of ex.etiquetas) {
      const etiquetaId = idsPorSlug.get(slug);
      if (etiquetaId) {
        await expEtiquetaRepo.save({ experienciaId: expId, etiquetaId });
      }
    }
  }

  // ─────────────────────────────────────────────────────
  // Página del equipo
  // ─────────────────────────────────────────────────────
  const contenidoEquipo = [
    'EthosPlatform es un proyecto desarrollado por estudiantes de la Universidad Nacional Agraria de la Selva (UNAS), Facultad de Ingeniería en Informática y Sistemas. Nuestro objetivo es crear una comunidad donde las personas puedan compartir y reflexionar sobre dilemas éticos y morales.',
    'Misión: Promover la reflexión ética y el diálogo moral en la comunidad académica.',
    'Visión: Ser una plataforma de referencia para la educación en valores y ética.',
    'Valores: Integridad, Transparencia, Respeto, Inclusión, Innovación.',
    'Contacto: info@ethos.com',
    'Ubicación: Universidad Nacional Agraria de la Selva, Tocache, San Martín, Perú.',
  ].join('\n\n');

  const miembrosEquipo = TEAM.map((p) => ({ nombre: p.nombre, rol: p.rolEquipo, bio: p.biografia }));

  const existingPagina = await paginaRepo.findOne({ where: {} });
  if (existingPagina) {
    existingPagina.titulo = 'Conoce al Equipo de EthosPlatform';
    existingPagina.contenido = contenidoEquipo;
    existingPagina.miembros = JSON.stringify(miembrosEquipo);
    await paginaRepo.save(existingPagina);
  } else {
    await paginaRepo.save({
      id: uuidv4(),
      titulo: 'Conoce al Equipo de EthosPlatform',
      contenido: contenidoEquipo,
      miembros: JSON.stringify(miembrosEquipo),
      actualizadoEn: new Date(),
    });
  }

  // ─────────────────────────────────────────────────────
  // Archivo de credenciales (gitignored — no se commitea)
  // ─────────────────────────────────────────────────────
  const credenciales = `CREDENCIALES DE ACCESO - ETHOS PLATFORM
Generado: ${new Date().toLocaleString('es-PE')}
No commitear este archivo. Compartir solo con el equipo.

EQUIPO (rol=admin)
──────────────────
${TEAM.map((p) => `${p.nombre}\n  correo: ${p.correo}\n  password: ${p.password}\n`).join('\n')}

USUARIOS DE PRUEBA (rol=user)
──────────────────────────────
${TEST_USERS.map((p) => `${p.nombre}\n  correo: ${p.correo}\n  password: ${p.password}\n`).join('\n')}

E2E (usados por tests automatizados, no borrar)
────────────────────────────────────────────────
E2E User   correo: e2e-user@test.com   password: TestPass123
E2E Admin  correo: e2e-admin@test.com  password: AdminPass123
`;
  const credencialesPath = path.join(__dirname, '../../../CREDENCIALES_ACCESO.txt');
  await writeFile(credencialesPath, credenciales, 'utf-8');

  console.log('✅ Seed completado:');
  console.log(`   Usuario: e2e-user@test.com / TestPass123 (ID: ${userId})`);
  console.log(`   Admin:   e2e-admin@test.com / AdminPass123 (ID: ${adminId})`);
  console.log(`   Experiencias E2E: ${exp1Id}, ${exp2Id}, ${expAdminId}`);
  console.log(`   Equipo: ${TEAM.length} personas (admin)`);
  console.log(`   Usuarios de prueba: ${TEST_USERS.length}`);
  console.log(`   Etiquetas: ${ETIQUETAS.length}`);
  console.log(`   Experiencias de ejemplo: ${EXPERIENCIAS_EJEMPLO.length}`);
  console.log(`   Página de equipo: actualizada`);
  console.log(`   Credenciales guardadas en: ${credencialesPath}`);

  await dataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
