# Auditoría de código + Sistema de Seed Automático - EthosPlatform

## Fecha: 2026-07-22
## Rama: feature/javier

---

## 1. Auditoría — hallazgos y reparaciones

### 1.1 Crítico — Sin índices ni foreign keys en todo el esquema

El schema inicial (`InitialSchema1784605944519`) no tenía **ningún** FK
constraint ni índice sobre columnas de clave foránea. Consecuencias reales,
verificadas en la propia BD de este proyecto:

- **Rendimiento**: consultas frecuentes hacían table scan — la más crítica,
  `IntentoFallidoRepository.findRecientesByCorreo`, se ejecuta en **cada
  intento de login**.
- **Integridad de datos**: eliminar un usuario o experiencia dejaba filas
  huérfanas en `reacciones`, `favoritos`, `respuestas`, `reportes` y
  `experiencia_etiquetas`. Esto no era una suposición — se encontraron
  huérfanos reales en la BD de desarrollo (75 sesiones, 14 asociaciones de
  etiquetas, 5 reacciones/favoritos, 3 respuestas, 1 reporte) producto de
  las pruebas de sesiones anteriores. El propio código de
  `EliminarCuentaUseCase` tiene comentarios admitiendo la cascada
  incompleta ("Nota: ... necesario para cascada completa").

**Reparación**: nueva migración
`1784778573000-AddIndexesAndForeignKeys.ts` que:
1. Limpia las filas huérfanas preexistentes (necesario antes de poder
   agregar los FK constraints — Postgres los rechaza si ya hay violaciones).
2. Agrega índices en todas las columnas FK.
3. Agrega los FK constraints con `ON DELETE CASCADE` — el comportamiento
   que el código ya asumía pero no garantizaba, no un cambio de lógica.

También se agregaron los `@Index()` correspondientes en las entidades ORM
para que `synchronize` (usado en desarrollo) los reconozca.

**Limitación conocida y aceptada**: en desarrollo, `synchronize: true`
recrea el esquema en cada arranque a partir de los decoradores de las
entidades. Los índices declarados con `@Index()` **sí** persisten (se
verificó con 3 reinicios consecutivos), pero los FK constraints (que no
tienen decorador `@ManyToOne`, agregados solo vía SQL crudo en la
migración) se **pierden** en cada reinicio de `pnpm dev` porque TypeORM no
los reconoce como parte del modelo. En producción esto no ocurre:
`synchronize` está apagado y `migration:run` (ya automático en el
Dockerfile) aplica y mantiene los FKs correctamente. No se agregaron
relaciones `@ManyToOne` a las entidades para evitar alterar la arquitectura
de acceso a datos existente (mappers/repositorios trabajan con columnas
`usuarioId: string` planas, no con objetos de relación).

### 1.2 Condición de carrera en reacciones duplicadas

`ToggleReaccionUseCase` hace `findByUsuarioAndExperiencia` → si no existe,
crea una reacción — un patrón *check-then-act* sin ninguna restricción en
BD que lo respalde. Dos requests concurrentes del mismo usuario podían
crear dos reacciones duplicadas.

**Reparación**: `UNIQUE (usuario_id, experiencia_id)` en `reacciones`
(migración + `@Index(['usuarioId','experienciaId'], {unique:true})` en la
entidad). Se verificó que no había duplicados existentes antes de aplicar.

### 1.3 Variable de entorno de puerto inconsistente

Un commit de CI/CD reciente (`705db9e`) renombró `PORT` → `BACKEND_PORT` en
`server.ts` para el pipeline de despliegue, pero `.env` y `.env.example`
seguían usando `PORT`. Resultado: cambiar `PORT` en `.env` no tenía ningún
efecto real en desarrollo (el server seguía usando el default hardcodeado
3000). Tu compañero ya había corregido el lado de `docker-compose.yml`
(commit `e77e817`); faltaba el lado de desarrollo.

**Reparación**: `.env` y `.env.example` actualizados a `BACKEND_PORT`.

### 1.4 Sin manejo de excepciones no controladas

No existía ningún `process.on('unhandledRejection'/'uncaughtException')`.
Cualquier error asíncrono fuera del ciclo request/response de Express caía
en el comportamiento por defecto de Node (posible crash sin log
estructurado). Se agregó manejo explícito con el logger de pino existente.

### 1.5 Dependencias muertas

`@packages/shared` y `@packages/types` estaban declaradas como
dependencias del backend pero **nunca se importan** en ningún archivo
(`grep` confirmó cero usos fuera de su propia declaración en
`package.json`). Se eliminaron.

### 1.6 Código muerto (ya identificado en auditoría anterior, sigue vigente)

`AuditoriaService`/`AuditoriaController`/`IAuditoriaRepository` existen
completos pero nunca se conectan a rutas ni al contenedor de DI — sigue sin
usarse. No se tocó en esta sesión (requiere una decisión del equipo:
terminarlo o eliminarlo).

### 1.7 Arquitectura, TypeORM, Express — sin otros hallazgos críticos

Se revisaron todos los repositorios, el contenedor de DI, `app.ts`,
`server.ts` y los middlewares: no se encontraron problemas de N+1 queries,
falta de paginación, manejo inconsistente de transacciones fuera de lo ya
descrito, ni configuración insegura adicional (CORS restrictivo, JWT sin
default hardcodeado, pino-pretty solo en dev — todo correcto, ya verificado
en auditorías anteriores).

---

## 2. Sistema de Seed Automático

### 2.1 Diseño

`apps/backend/src/datos/seed/`:
- `index.ts` — orquesta todo dentro de **una única transacción**
  (`dataSource.transaction(...)`), imprime el resumen y escribe las
  credenciales.
- `helpers.ts` — `seedId()` (UUID v5 determinístico a partir de un
  namespace fijo) y `upsertWithCount()` (upsert + conteo antes/después
  para reportar creados vs actualizados).
- `usuarios.seed.ts`, `etiquetas.seed.ts`, `experiencias.seed.ts`,
  `interacciones.seed.ts` (favoritos/reacciones/respuestas),
  `paginaEquipo.seed.ts`, `credenciales.ts`.

No se creó `configuracion.seed.ts`: el dominio no tiene ninguna entidad de
configuración/ajustes — no se inventó una solo para completar la
estructura sugerida en el prompt original.

### 2.2 Cómo se integra (sin comando manual, sin conexión propia)

En `server.ts`, justo después de `createContainer()` (que ya inicializa
`AppDataSource`):
```ts
const container = await createContainer();
await runSeed(AppDataSource, logger); // misma conexión, sin abrir otra
```
Se ejecuta automáticamente en cada arranque, en desarrollo (`pnpm dev`) y
en producción (mismo `server.ts`, sin pasos adicionales en el Dockerfile).

### 2.3 Idempotencia — verificada empíricamente, no solo por diseño

Cada entidad usa `upsert()` con un conflict target real:
- `usuarios`: `correo` (único de negocio).
- `etiquetas`: `slug` (único de negocio).
- `experiencias`, `respuestas`: `id` determinístico (uuid v5), no hay clave
  de negocio natural.
- `favoritos`, `experiencia_etiquetas`: su propia PK compuesta.
- `reacciones`: el nuevo `UNIQUE (usuario_id, experiencia_id)` de la
  sección 1.2.
- `pagina_equipo`: caso especial — es un singleton sin unique constraint
  real más allá de `id`. Un upsert ciego por id fijo **creó una fila
  duplicada** junto a la que ya existía de una siembra manual anterior (se
  encontró y reparó durante las pruebas: ahora se busca la fila existente
  primero, se reutiliza su id, y se eliminan sobrantes si los hubiera —
  el único módulo que sí necesita un `find()` antes del upsert, documentado
  en el propio código).

**Prueba real**: se reinició el servidor 3 veces seguidas. Resultado:
- 1ª vez: creó todo (6 usuarios, 15 etiquetas, 20 experiencias, 36
  favoritos, 36 reacciones, 9 respuestas, 1 página de equipo).
- 2ª y 3ª vez: **0 creados** en todas las entidades, solo actualizados —
  conteos de fila idénticos entre reinicios.

### 2.4 Transacción

Todo el seed corre dentro de un único `dataSource.transaction()`. Se
comprobó en la práctica: un error de sintaxis SQL durante el desarrollo de
la migración (no del seed, pero mismo mecanismo) hizo rollback completo sin
dejar nada a medio insertar.

### 2.5 Datos creados

- **1 administrador**: `admin@ethos.com` / `adminEthos` (contraseña exacta
  pedida — no cumple la regla de complejidad del `Password` value object
  del dominio porque no tiene dígito, pero eso no bloquea nada: el seed
  escribe el hash directamente, sin pasar por esa validación, igual que ya
  hacía `scripts/seed.ts`; el login solo compara hashes, no revalida
  complejidad).
- **5 usuarios normales**, todos con la misma contraseña `Usuario123`
  (cumple las reglas de complejidad).
- **15 etiquetas** temáticas.
- **20 experiencias** (18 publicadas, 2 en borrador), distribuidas
  round-robin entre los 6 usuarios, cada una con 1-3 etiquetas asociadas.
- **36 favoritos, 36 reacciones, 9 respuestas** distribuidos
  determinísticamente entre usuarios y experiencias (nunca un usuario
  interactuando con su propia experiencia).
- **1 página de equipo** (contenido real del proyecto: Angel, Diana,
  Junior, Yimi — mismo contenido aprobado en una sesión anterior).

Consola al arrancar:
```
Seed de datos iniciales completado:
  usuarios: 6 procesados (6 creados, 0 actualizados)
  etiquetas: 15 procesados (5 creados, 10 actualizados)
  experiencias: 20 procesados (20 creados, 0 actualizados)
  favoritos: 36 procesados (36 creados, 0 actualizados)
  reacciones: 36 procesados (36 creados, 0 actualizados)
  respuestas: 9 procesados (9 creados, 0 actualizados)
  pagina_equipo: 1 procesados (1 creados, 0 actualizados)
Credenciales de acceso escritas en: .../apps/backend/CREDENCIALES_ACCESO.txt
```

### 2.6 CREDENCIALES_ACCESO.txt

Se escribe en `apps/backend/` (no en la raíz del monorepo): es la única
ubicación consistente entre desarrollo (`pnpm dev` corre con
cwd=apps/backend) y producción (el Dockerfile fija
`WORKDIR /app/apps/backend` antes de arrancar, y la imagen de producción
no incluye el resto del monorepo). Agregado a `.gitignore`
(`/apps/backend/CREDENCIALES_ACCESO.txt`, además de la entrada ya
existente para la ubicación de la raíz que usa el script manual
`scripts/seed.ts`).

---

## 3. Efectos secundarios encontrados y corregidos durante las pruebas

- **`pagina_equipo` duplicado** (sección 2.3) — reparado en el propio
  seeder.
- **2 tests E2E desactualizados** (`components.spec.ts` → `TeamPage`):
  esperaban el placeholder original ("Nuestro Equipo" / miembro "Javier")
  en vez del contenido real del equipo ya aprobado. Se actualizaron para
  reflejar el contenido real.
- **1 test E2E no idempotente** (`flujo-reportes.spec.ts`): con
  experiencias de ID estable (determinístico) en vez de IDs frescos en
  cada siembra manual, un usuario de prueba podía intentar reportar dos
  veces la misma experiencia entre corridas manuales repetidas de la
  suite sin re-sembrar — el backend correctamente lo bloquea ("Ya has
  reportado esta experiencia anteriormente"), pero el test no contemplaba
  ese caso como un `test.skip` válido (a diferencia de los demás tests del
  mismo archivo, que sí usan ese patrón). Se corrigió siguiendo el mismo
  patrón ya establecido en el resto de la suite.

---

## 4. Verificación final

- ✅ `pnpm build` (backend + frontend): limpio
- ✅ `tsc --noEmit`: 0 errores
- ✅ `pnpm run lint`: 0 errores
- ✅ Tests unitarios: 92 backend + 38 frontend
- ✅ E2E (chromium + chromium-auth + chromium-admin): 75 passed, 6 skipped
  (guards de datos, no fallos), **0 failed**
- ✅ Idempotencia del seed verificada con 3 reinicios reales del servidor
- ✅ `scripts/seed.ts` (manual, usado por fixtures E2E) sigue funcionando
  sin cambios de comportamiento

---

## Archivos nuevos/modificados

**Nuevos**:
- `apps/backend/src/datos/presistence/migrations/1784778573000-AddIndexesAndForeignKeys.ts`
- `apps/backend/src/datos/seed/` (index.ts, helpers.ts, usuarios.seed.ts,
  etiquetas.seed.ts, experiencias.seed.ts, interacciones.seed.ts,
  paginaEquipo.seed.ts, credenciales.ts)

**Modificados**:
- 9 entidades ORM (`@Index()` agregados)
- `apps/backend/src/server.ts` (unhandledRejection/uncaughtException +
  integración del seed)
- `apps/backend/.env.example`, `.gitignore`
- `apps/backend/package.json` (quita `@packages/shared`/`@packages/types`)
- `tests/e2e/specs/components.spec.ts`, `flujo-reportes.spec.ts`
