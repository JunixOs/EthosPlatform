# 18-07-2026 — Analisis Backend — OpenCode

> **Proyecto:** Sistema de Ética (EthosPlatform)
> **Revisión:** `apps/backend/src/` y `apps/frontend/src/` contrastados contra `docs/`
> **Fecha:** 18 de julio de 2026
> **Agente:** OpenCode
> **Restricción:** Sólo lectura y análisis; sin modificaciones de código.

---

## 1. Resumen Ejecutivo

### 1.1 Backend

El backend (`apps/backend/`) implementa aproximadamente el **60 % de las funcionalidades del MVP** documentadas en `docs/01-requirements/` y los casos de uso `CU-01` a `CU-06`. Las funcionalidades de autenticación, gestión de experiencias, perfiles de usuario, administración básica y favoritos se encuentran desarrolladas con una arquitectura orientada a **Clean Architecture + Vertical Slicing**.

Se detectaron **5 hallazgos de severidad Crítica** (impiden compilar o ejecutar el proyecto, o implican riesgos de seguridad graves) y **8 hallazgos de severidad Alta** (violaciones directas del contrato arquitectónico, funcionalidad rota o riesgos de seguridad importantes).

### 1.2 Frontend

El frontend (`apps/frontend/`) implementa aproximadamente el **70 % de las funcionalidades del MVP** de interfaz de usuario. Cuenta con 14 rutas implementadas, arquitectura feature-based, estado global con Zustand, y diseño responsive con TailwindCSS v4. Se detectaron **2 hallazgos Críticos** (URLs duplicadas que impiden comunicación con endpoints de backend) y **4 hallazgos Altos** (layout roto, componente compartido con props bloqueadas, errores de estado en almacenamiento local).

### 1.3 Pruebas

- **Backend:** 0 % cobertura. Sin framework de testing instalado.
- **Frontend:** 0 % cobertura unitaria/integración. Sin framework instalado.
- **E2E:** Playwright instalado y operativo en `tests/e2e/` con **~80 tests escritos** cubriendo navegación, componentes compartidos, rutas protegidas y flujos de autenticación. El ADR-017 marca la decisión como "Pendiente", pero el código de pruebas ya existe y tiene evidencia de ejecución (screenshots en `test-results/`).

---

## 2. Alcance del Análisis

### 2.1 Artefactos revisados — Backend

- `apps/backend/package.json`
- `apps/backend/src/index.ts` (punto de entrada único)
- `apps/backend/src/datos/presistence/` (TypeORM: conexiones, entidades, mappers, repositorios)
- `apps/backend/src/logica/domain/` (entidades puras, enums, value objects, reglas)
- `apps/backend/src/logica/application/` (use cases, comandos, excepciones, interfaces de repositorio)
- `apps/backend/src/logica/interface_adapters/` (controladores, DTOs, middlewares, mappers HTTP)
- `apps/backend/tests/`

### 2.2 Artefactos revisados — Frontend

- `apps/frontend/package.json`
- `apps/frontend/vite.config.ts`
- `apps/frontend/src/presentacion/app/router/index.tsx`
- `apps/frontend/src/presentacion/app/store/auth.store.ts`
- `apps/frontend/src/presentacion/shared/services/api.ts`
- `apps/frontend/src/presentacion/features/*` (pages, services, hooks, types)
- `apps/frontend/src/presentacion/shared/components/*`
- `apps/frontend/src/presentacion/layout/*`
- `apps/frontend/tests/`

### 2.3 Artefactos revisados — Pruebas E2E

- `tests/e2e/package.json`
- `tests/e2e/playwright.config.ts`
- `tests/e2e/specs/components.spec.ts`
- `tests/e2e/test-results/` (evidencia de ejecución)

### 2.4 Documentación de plan

- `docs/01-requirements/` (funcionales, no funcionales, casos de uso `CU-01` a `CU-06`)
- `docs/02-architecture/` (overview, style, modules, C4 Level 3 backend)
- `docs/03-data-model/erd.md`
- `docs/06-decisions/ADR-*.md`
- `docs/contracts/architecture-contract.md`

---

## 3. Backend — Módulos y Funcionalidades Desarrolladas

A continuación se listan las funcionalidades que **sí tienen código backend** (controllers, use cases, entidades ORM y/o repositorios).

### 3.1 Módulo Autenticación y Sesiones (CU-01)

| Funcionalidad | Evidencia de código | Estado |
|---|---|---|
| Registro de cuenta | `AuthController.register`, `RegisterUseCase`, `RegisterCommand`, `UsuarioORM`, `IUsuarioRepository` | Completo |
| Login con JWT y duración diferenciada | `AuthController.login`, `LoginUseCase`, `LoginCommand`, `SesionORM`, `ISesionRepository` | Completo (2h / 24h según `recordarme`) |
| Logout | `AuthController.logout`, `LogoutUseCase` | Parcial — ver Hallazgo B-6 |
| Bloqueo por intentos fallidos (5 intentos / 15 min) | `LoginUseCase`, `IntentoFallidoORM`, `IIntentoFallidoRepository` | Completo |
| Middleware de autenticación JWT | `authMiddleware.ts` | Completo |
| Middleware de verificación de rol administrador | `requireAdmin` | Completo — ver Hallazgo B-10 |

### 3.2 Módulo Gestión de Usuarios (CU-02)

| Funcionalidad | Evidencia de código | Estado |
|---|---|---|
| Obtener perfil propio | `UsuariosController.getMiPerfil`, `GetPerfilUseCase` | Completo |
| Obtener perfil público de otro usuario | `UsuariosController.getPerfil`, `GetPerfilUseCase` | Completo (incluye privacidad) |
| Editar perfil propio (nombre, biografía, privacidad) | `UsuariosController.editarPerfil`, `EditarPerfilUseCase` | Completo |
| Editar foto de perfil | `UsuariosController.editarFoto`, `EditarFotoPerfilUseCase` | Completo |
| Eliminar cuenta propia | `UsuariosController.eliminarCuenta`, `EliminarCuentaUseCase` | Completo |
| Ver estadísticas propias (experiencias, me gusta) | `UsuariosController.getEstadisticas`, `GetEstadisticasUseCase` | Completo |
| Listar experiencias de un usuario | `UsuariosController.getExperiencias`, `ListExperienciasUseCase` | Completo |

### 3.3 Módulo Gestión de Experiencias (CU-03)

| Funcionalidad | Evidencia de código | Estado |
|---|---|---|
| Crear experiencia (título opcional, descripción obligatoria, reflexiones) | `ExperienciasController.create`, `CreateExperienciaUseCase`, `CreateExperienciaCommand` | Completo |
| Editar experiencia propia | `ExperienciasController.update`, `EditExperienciaUseCase`, `EditExperienciaCommand` | Completo |
| Eliminar experiencia propia (y por admin) | `ExperienciasController.delete`, `DeleteExperienciaUseCase` | Completo — cascada de respuestas pendiente (ver Pendientes) |
| Publicar borrador | `ExperienciasController.publish`, `PublishExperienciaUseCase` | Completo |
| Listado paginado de experiencias publicadas | `ExperienciasController.list`, `ListExperienciasUseCase` | Completo (10 por página, orden por fecha) |
| Búsqueda por palabras clave (título y descripción) | `ExperienciasController.buscar`, `BuscarExperienciasUseCase` | Completo |
| Ver detalle de experiencia | `ExperienciasController.getById`, `GetExperienciaUseCase` | Completo |
| Preview de borrador (autenticado) | `ExperienciasController.preview` | Completo |
| Experiencias relacionadas (mismo autor / recientes) | `ExperienciasController.relacionadas`, `GetRelacionadasUseCase` | Completo |

### 3.4 Módulo Administración del Sistema (CU-06)

| Funcionalidad | Evidencia de código | Estado |
|---|---|---|
| Listar todos los usuarios (paginado) | `AdminController.listarUsuarios` | Completo — con violación arquitectónica (ver Hallazgo B-6) |
| Editar cualquier usuario | `AdminController.editarUsuario`, `EditarUsuarioAdminUseCase` | Completo |
| Eliminar cualquier cuenta | `AdminController.eliminarUsuario`, `EliminarUsuarioAdminUseCase` | Completo |
| Suspender usuario temporalmente | `AdminController.suspender`, `SuspenderUsuarioUseCase` | Completo |
| Reactivar usuario suspendido | `AdminController.reactivar` | Completo — con violación arquitectónica (ver Hallazgo B-6) |
| Asignar / cambiar rol | `AdminController.asignarRol`, `AsignarRolUseCase` | Completo |

### 3.5 Módulo Interacción Social — Favoritos (parcial de CU-04-05)

| Funcionalidad | Evidencia de código | Estado |
|---|---|---|
| Toggle favorito (agregar / quitar) | `FavoritosController.toggle`, `ToggleFavoritoUseCase`, `FavoritoORM`, `IFavoritoRepository` | Completo |
| Listar mis favoritos (paginado) | `FavoritosController.listarMios`, `ListarFavoritosUseCase` | Completo — con problema N+1 (ver Hallazgo B-11) |

### 3.6 Entidades ORM existentes (modelo de datos)

Las siguientes entidades TypeORM tienen código real:

- `UsuarioORM` → tabla `usuarios`
- `ExperienciaORM` → tabla `experiencias`
- `SesionORM` → tabla `sesiones`
- `IntentoFallidoORM` → tabla `intentos_fallidos`
- `FavoritoORM` → tabla `favoritos`
- `ReaccionORM` → tabla `reacciones` (existe como entidad, pero **sin endpoints ni use cases**)

---

## 4. Backend — Funcionalidades Pendientes MVP

Las siguientes funcionalidades están documentadas en los requisitos funcionales y casos de uso como **Must Have** o **Should Have** del MVP, pero **no tienen implementación backend** (faltan endpoints, use cases, entidades y/o repositorios).

| ID Req. | Funcionalidad | Justificación de ausencia | Impacto |
|---|---|---|---|
| R05 | **Respuestas** (comentarios de un nivel a experiencias) | No existe entidad `RespuestaORM`, ni repositorio, ni use case, ni controller, ni endpoint. | Alto — funcionalidad social clave del MVP |
| R07b implícito | **Campos reflexivos obligatorios** validados a nivel de dominio | El `CreateExperienciaUseCase` valida longitud mínima de 10 caracteres, pero no hay value object o regla de dominio explícita que garantice la presencia y calidad de las reflexiones "¿Qué dice la moral...?" y "¿Qué dice tu ética...?". | Medio |
| R10 | **Eliminación en cascada de respuestas** al borrar una experiencia | Pendiente porque no existe la entidad `Respuesta`. | Alto |
| R12 | **Eliminación en cascada de contenido** al borrar una cuenta | `EliminarCuentaUseCase` elimina el usuario y sus sesiones, pero no hay evidencia de eliminación en cascada de experiencias, respuestas, reacciones, favoritos. El `UsuarioORM` no tiene configurado `onDelete: 'CASCADE'` ni se maneja en el use case. | Alto — riesgo de datos huérfanos |
| R29, R30 | **Reacciones "me gusta"** (toggle + conteo) | `ReaccionORM` existe, pero no hay use case, controller ni endpoint. | Alto |
| R38, R39, R44 | **Borradores automáticos** cada 30 segundos y **guardado manual de borradores** | No existe entidad `BorradorORM` ni mecanismo de autosave. La experiencia tiene estado `BORRADOR`, pero no hay endpoint específico para guardar borrador sin publicar. | Medio |
| R41, R42, R51, R54 | **Etiquetado** (máximo 5 etiquetas) y **búsqueda por etiqueta** | No existe entidad `EtiquetaORM` ni tabla intermedia `ExperienciaEtiqueta`. | Alto |
| R33, R35, R36 | **Reportar contenido inapropiado**, **ocultar contenido reportado**, **historial de reportes** | No existe entidad `ReporteORM`, ni repositorio, ni use case, ni controller. | Medio |
| R16, R17, R18, R20 | **Página dedicada al equipo de desarrollo** editable solo por administradores | No existe endpoint, entidad ni use case para gestionar contenido de la página `TeamPage`. | Medio |
| R28 | **Perfil público / privado** (configuración de visibilidad) | `UsuarioORM` tiene columna `privado`, y `GetPerfilUseCase` respeta el flag, pero no hay endpoint para que un visitante anónimo solicite acceso o vea un perfil público con lógica diferenciada de privacidad más allá del 403. | Medio |
| R43 | **Vista previa antes de publicar** | Existe `GET /api/experiencias/:id/preview`, pero no hay un endpoint dedicado a generar una vista previa de una experiencia **nueva** antes de persistirla. | Bajo |
| R45 | **Fechas de creación y modificación visibles** en respuestas | Pendiente porque no existe la entidad `Respuesta`. | Medio |
| R48 | **Estadísticas de "me gusta"** en perfil | `GetEstadisticasUseCase` existe pero el repositorio concreto no expone conteo de reacciones aún. | Medio |
| R55 | **Experiencias relacionadas por etiquetas** (3–5) | Pendiente por ausencia de `EtiquetaORM`. | Medio |
| R56 | **Sección de experiencias recientes** (últimas 10) | No hay endpoint dedicado `/api/experiencias/recientes`; se puede derivar de `ListExperienciasUseCase` con `page=1, limit=10`. | Bajo |
| R57 | **Experiencias destacadas** por "me gusta" en últimas 48h | Pendiente por ausencia de `Reaccion` endpoints. | Medio |
| R60 | **Log de auditoría** de acciones administrativas | No existe entidad `AuditoriaORM`, ni repositorio, ni use case. El admin puede editar/eliminar, pero no se registra quién ni cuándo. | Alto — requisito no funcional de trazabilidad |
| R63 | **Lista negra de términos prohibidos** configurable por admin | No existe entidad `ListaNegraORM`, ni middleware de validación de contenido. | Medio |

---

## 5. Backend — Funcionalidades Pendientes V2 y V3

| Versión | Funcionalidad | Estado backend |
|---|---|---|
| V2 | **Seguimiento de usuarios** (follow) | No implementado. Faltan entidad `SeguimientoORM`, repositorio, use cases y endpoints. |
| V2 | **Feed personalizado** basado en usuarios seguidos | No implementado. Depende de `Seguimiento`. |
| V2 | **Bloqueo de usuarios** | No implementado. Faltan entidad `BloqueoORM`, repositorio, use cases. |
| V2 | **Ordenar por popularidad** en listados | Parcial — `ListExperienciasUseCase` acepta `sort=popularity`, pero sin reacciones reales la métrica es incompleta. |
| V3 | **Contenido reciente / destacado** en landing page | No hay endpoints dedicados. |
| V3 | **Notificaciones** (implícito en feed) | No implementado. |

---

## 6. Backend — Violaciones Arquitectónicas y Errores Lógicos

A continuación se detallan todos los hallazgos encontrados en el código backend, ordenados por severidad.

### Severidad: Crítico

| # | Hallazgo | Ubicación exacta | Explicación | Posible corrección |
|---|---|---|---|---|
| B-1 | **Versiones de dependencias inexistentes en `package.json`** | `apps/backend/package.json` líneas de dependencias | `typeorm ^1.0.0` (no existe, última estable es `0.3.x`), `bcryptjs ^3.0.3` (no existe, última es `2.4.3`), `dotenv ^17.4.2` (no existe, última es `16.x`), `uuid ^14.0.0` (no existe, última es `9.x` o `10.x`). Los `@types` asociados también son inexistentes. | Corregir a versiones reales: `typeorm: ^0.3.20`, `bcryptjs: ^2.4.3`, `dotenv: ^16.4.5`, `uuid: ^9.0.1` y alinear `@types`. |
| B-2 | **JWT_SECRET ausente en `.env` con fallback inseguro** | `apps/backend/.env` (ausente) y código que usa `process.env.JWT_SECRET \|\| 'secret'` | Si el archivo `.env` no tiene `JWT_SECRET`, el sistema firma tokens con la palabra `'secret'`, permitiendo que cualquier atacante genere JWT válidos. | Eliminar el fallback en el código; hacer que la aplicación falle al arrancar si `JWT_SECRET` no está definido. Documentar en `.env.example`. |
| B-3 | **Logout no invalida JWT; `authMiddleware` no consulta tabla `sesiones`** | `apps/backend/src/logica/application/features/auth/logout/LogoutUseCase.ts` y `apps/backend/src/logica/interface_adapters/middleware/authMiddleware.ts` | `LogoutUseCase` elimina la fila de `sesiones` por token, pero `authMiddleware` solo verifica la firma del JWT con `jsonwebtoken.verify()`. Un token robado sigue siendo válido hasta su expiración natural (`2h` o `24h`), aunque el usuario haya hecho logout. | Modificar `authMiddleware` para consultar `ISesionRepository` y verificar que el token aún exista en la tabla `sesiones` y no esté expirado. |

### Severidad: Alta

| # | Hallazgo | Ubicación exacta | Explicación | Posible corrección |
|---|---|---|---|---|
| B-4 | **Eliminación de cuenta sin cascada de contenido** | `apps/backend/src/logica/application/features/usuarios/eliminar_cuenta/EliminarCuentaUseCase.ts` | El use case elimina el `Usuario` y sus `Sesion`, pero no elimina `Experiencia`, `Respuesta`, `Reaccion`, `Favorito` ni otros datos asociados. Esto dejará registros huérfanos en la base de datos. | Implementar eliminación en cascada en el repositorio de usuarios (TypeORM `cascade: true` o manejarlo explícitamente en el use case mediante los repositorios correspondientes). |
| B-5 | **Sin validación de inputs / schemas en controllers** | Todos los controllers (`AuthController.ts`, `ExperienciasController.ts`, `UsuariosController.ts`, `AdminController.ts`, `FavoritosController.ts`) | Los controllers hacen casting directo: `req.body as LoginRequestDTO`. No se usa `class-validator`, `zod`, `joi` ni `express-validator`. Esto permite enviar payloads malformados, con campos extra o tipos incorrectos, pudiendo causar errores 500 o comportamiento inesperado. | Agregar `class-validator` + `class-transformer` (ya usados por TypeORM) o `zod` en la capa `interface_adapters`. Crear una función middleware de validación que se aplique antes de cada controller. |
| B-6 | **`AdminController` accede directamente al repositorio, violando Clean Architecture** | `apps/backend/src/logica/interface_adapters/features/admin/controllers/AdminController.ts` métodos `listarUsuarios` y `reactivar` | El controller invoca `this.usuarioRepo.findAll(...)` y `this.usuarioRepo.findById(...)`, muta la entidad (`usuario.reactivar()`) y la guarda directamente. La capa `InterfaceAdapters` nunca debe interactuar con la capa `Datos`. La lógica de negocio debe vivir en un `UseCase`. | Crear `ListarUsuariosAdminUseCase` y `ReactivarUsuarioUseCase` en `application/features/admin/`. Inyectarlos en el controller. Eliminar la dependencia directa a `IUsuarioRepository` desde el controller. |
| B-7 | **`index.ts` monolítico: bootstrap + DI + rutas + servidor** | `apps/backend/src/index.ts` | Un solo archivo contiene: creación de `express()`, middlewares globales, inicialización de `AppDataSource`, inyección manual de ~20 dependencias, definición de ~25 rutas directamente sobre `app`, manejador global de errores y `app.listen()`. Esto viola el Principio de Responsabilidad Única (SRP) y dificulta el testing de integración. | Extraer a `app.ts` (configuración Express sin listen), `routes.ts` (montaje de rutas usando `express.Router`), `container.ts` o `compositionRoot.ts` (instanciación de dependencias), y `server.ts` (arranque). |
| B-8 | **Acoplamiento cruzado entre features** | `apps/backend/src/logica/interface_adapters/features/usuarios/controllers/UsuariosController.ts` import de `ListExperienciasUseCase` y `apps/backend/src/logica/interface_adapters/features/favoritos/controllers/FavoritosController.ts` import de `ExperienciaHttpMapper` | `UsuariosController` depende de `ListExperienciasUseCase` (feature experiencias) y `FavoritosController` importa `ExperienciaHttpMapper` desde `../../experiencias/mappers/...`. En arquitectura limpia, cada feature debe ser autocontenida; el controller de una feature no debe importar implementaciones de otra. | Usar inyección de dependencias para el mapper compartido (moverlo a `shared/mappers/` si es realmente compartido) o exponer un `IExperienciaMapper` interface. Para `UsuariosController`, encapsular en un `GetExperienciasDeUsuarioUseCase`. |
| B-9 | **No hay manejo de errores de JWT expirado distinguido de inválido** | `apps/backend/src/logica/interface_adapters/middleware/authMiddleware.ts` | El middleware lanza `UnauthorizedException` genérico tanto si el token expiró como si es inválido. Esto dificulta al frontend decidir si debe redirigir al login o mostrar otro mensaje. | Capturar el error de `jsonwebtoken.verify()`: si `err.name === 'TokenExpiredError'`, lanzar `UnauthorizedException` con `errorCode: 'TOKEN_EXPIRED'`; si es inválido, `errorCode: 'TOKEN_INVALID'`. |

### Severidad: Media

| # | Hallazgo | Ubicación exacta | Explicación | Posible corrección |
|---|---|---|---|---|
| B-10 | **`requireAdmin` lanza `UnauthorizedException` (401) en vez de `ForbiddenException` (403)** | `apps/backend/src/logica/interface_adapters/middleware/authMiddleware.ts` (función `requireAdmin`) | Un usuario autenticado sin rol `admin` recibe 401, que semánticamente significa "no autenticado". Debería recibir 403, que significa "autenticado pero sin permisos". | Cambiar `throw new UnauthorizedException(...)` por `throw new ForbiddenException(...)` en `requireAdmin`. |
| B-11 | **N+1 query en `ListarFavoritosUseCase`** | `apps/backend/src/logica/application/features/favoritos/ListarFavoritosUseCase.ts` | Por cada favorito obtenido, el use case invoca `this.experienciaRepo.findById(favorito.experienciaId)` individualmente. Con 10 favoritos, se realizan 11 consultas (1 de favoritos + 10 de experiencias). | Agregar al repositorio `IExperienciaRepository` un método `findByIds(ids: string[])` que use `WHERE id IN (...)` en una sola consulta, o hacer un `JOIN` desde el repositorio de favoritos. |
| B-12 | **`AppDataSource` usa `synchronize: true` en desarrollo** | `apps/backend/src/datos/presistence/connections/AppDataSource.ts` | Esto hace que TypeORM altere el esquema de la base de datos automáticamente al iniciar. Es útil para prototipos pero peligroso si accidentalmente apunta a una base de datos productiva o compartida. | Cambiar a `synchronize: false` y usar migraciones (`TypeORM migrations`) para control de esquema. |
| B-13 | **Value objects lanzan `Error` genérico en vez de excepciones de dominio** | `apps/backend/src/logica/domain/value_objects/Email.ts` y `Password.ts` | Si la validación falla, se lanza `throw new Error('Formato de email inválido')`. Esto escapa al manejador global de errores configurado para `AppException` y puede generar respuestas 500 sin envelope estandarizado. | Crear `DomainException` que extienda `AppException` (o al menos sea capturada por el error handler) y lanzar esa excepción desde los value objects. |
| B-14 | **No hay graceful shutdown** | `apps/backend/src/index.ts` | No se manejan señales `SIGTERM` ni `SIGINT` para cerrar el servidor HTTP y la conexión de TypeORM ordenadamente. En despliegues con Docker/Kubernetes, esto puede causar conexiones colgadas. | Agregar listeners de `process.on('SIGTERM', ...)` y `process.on('SIGINT', ...)` que llamen `server.close()` y `AppDataSource.destroy()`. |
| B-15 | **No hay logger estructurado** | `apps/backend/src/index.ts` | Se usan `console.log` y `console.error` directamente. Esto dificulta filtrar logs por nivel, agregar correlación de request ID, y enviar logs a sistemas externos (ELK, Datadog, etc.). | Agregar una librería de logging estructurado como `pino` o `winston`. |
| B-16 | **Falta de `express.Router()` dificulta modularidad** | `apps/backend/src/index.ts` líneas 111–154 | Las rutas se montan directamente sobre la instancia `app` de Express. No hay routers agrupados por feature (ej. `const authRouter = express.Router()`). | Crear un archivo `routes.ts` que instancie routers por módulo y los monte en paths base (ej. `app.use('/api/auth', authRouter)`). |
| B-17 | **Múltiples `.gitkeep` en carpetas vacías de estructura esperada** | `apps/backend/src/logica/domain/rules/.gitkeep`, `apps/backend/src/logica/application/features/*/...` varias carpetas vacías | La estructura fue generada por un boilerplate, pero carpetas como `domain/rules/`, `utils/`, `config/`, `services/` (en el sentido tradicional) no tienen contenido. Esto indica que la arquitectura está incompleta. | Implementar las reglas de dominio en `domain/rules/` (ej. `UnicidadTituloExperienciaRule.ts`, `LimiteEtiquetasRule.ts`) o eliminar las carpetas vacías si no se usarán. |

---

## 7. Backend — Análisis de Arquitectura vs. Plan

### 7.1 Arquitectura documentada

Según `docs/02-architecture/architecture-overview.md`, `architectural-style.md`, `modules.md` y `docs/contracts/architecture-contract.md`, el backend debe seguir:

- **Clean Architecture + Vertical Slicing**
- **4 capas:** `InterfaceAdapters` → `Application` → `Domain` → `Datos`
- **Comunicación entre capas solo mediante interfaces**
- **No comunicación de capas inferiores a superiores**
- **Cada feature autocontenida** (sus propios controllers, use cases, DTOs, mappers)
- **Patrones:** Repository, Factory, Dependency Injection, DTOs por capa

### 7.2 Arquitectura real

| Aspecto | Estado | Observación |
|---|---|---|
| Separación de capas | **Parcial** | Las carpetas `interface_adapters/`, `application/`, `domain/`, `datos/` existen y se respetan en la mayoría de features. |
| Features por slicing | **Parcial** | Cada feature tiene su propia carpeta en `application/features/` y `interface_adapters/features/`. Esto es correcto. |
| Dependency Injection manual | **Presente** | Se usa constructor injection en controllers y use cases. Facilita testing teórico. |
| DTOs por capa | **Parcial** | Hay `RequestDTO`, `ResponseDTO`, `Command` y `OutputDTO`, pero no se validan automáticamente. |
| Interfaces de repositorio en Application | **Presente** | `IUsuarioRepository`, `IExperienciaRepository`, etc., están en `application/gateway/repositories/`. Correcto. |
| Mappers ORM ↔ Domain | **Presente** | `UsuarioMapper`, `ExperienciaMapper`, `SesionMapper`. Correcto. |
| Domain entities puras | **Presente** | `Usuario.ts`, `Experiencia.ts`, etc., sin dependencias de framework. Correcto. |
| Value objects | **Presente** | `Email.ts`, `Password.ts`. Correcto, aunque con problema de excepciones genéricas. |
| Enums de dominio | **Presente** | `RolEnum.ts`. Correcto. |
| **Fuga de abstracciones** | **Alta** | `AdminController` accede directo a `IUsuarioRepository`. `UsuariosController` depende de `ListExperienciasUseCase` de otra feature. `FavoritosController` importa mapper de otra feature. |
| **Ausencia de capa de validación** | **Alta** | No hay schemas ni DTOs validados con `class-validator`, `zod`, etc. |
| **Ausencia de `domain/rules/`** | **Media** | La carpeta existe vacía. Las reglas de negocio (ej. máximo 5 etiquetas, título único) no están encapsuladas como objetos de regla. |
| **Monolito `index.ts`** | **Alta** | El punto de entrada acumula responsabilidades de 4 capas diferentes. |

### 7.3 Deuda técnica arquitectónica resumida

1. **Violación del contrato de capas:** `InterfaceAdapters` no debe conocer `IRepository` directamente.
2. **Violación de aislamiento de features:** Imports cruzados entre `usuarios`, `experiencias` y `favoritos`.
3. **Validación de inputs ausente:** Los DTOs no garantizan integridad de datos de entrada.
4. **Reglas de dominio no encapsuladas:** Las validaciones están dispersas en use cases en vez de `domain/rules/`.
5. **Bootstrap monolítico:** Imposible de testear unitariamente sin levantar servidor y base de datos.

---

## 8. Backend — Análisis de Seguridad

| Requisito No Funcional | Estado | Evidencia | Hallazgo asociado |
|---|---|---|---|
| **RNF01** — Hash de contraseñas con bcrypt (cost >= 10) o Argon2 | **Cumplido con riesgo** | `RegisterUseCase` usa `bcryptjs.hash(password, 10)`. La versión de `bcryptjs` en `package.json` es inexistente, por lo que en la práctica el proyecto no compila ni se puede verificar. | B-1 |
| **RNF02** — Autenticación con JWT expirable o cookies HttpOnly (Secure, SameSite=Strict) | **Parcial** | Se usa JWT con `jsonwebtoken` y expiración `2h`/`24h`. Sin embargo, no se usan cookies HttpOnly; el token viaja por header `Authorization: Bearer`. Además, el `JWT_SECRET` puede ser `'secret'` si falta en `.env`. | B-2 |
| **RNF03** — Middleware en rutas privadas (autenticación y rol) | **Parcial** | `authMiddleware` y `requireAdmin` existen. Pero `requireAdmin` devuelve 401 en vez de 403. No hay verificación de sesión activa en la tabla `sesiones`. | B-3, B-10 |
| **R04 implícito** — Propiedad de contenido | **Cumplido** | `EditExperienciaUseCase`, `DeleteExperienciaUseCase` y `PublishExperienciaUseCase` verifican `experiencia.usuarioId === usuarioId` o `rol === ADMIN`. | — |
| **Bloqueo por intentos fallidos** (R61, R62) | **Cumplido** | `LoginUseCase` consulta `IntentoFallidoRepository`. Si hay >= 5 intentos en 15 minutos, lanza `TooManyRequestsException`. | — |
| **CORS** | **Parcial** | Configurado con `origin: FRONTEND_URL` y `credentials: true`. Falta restricción explícita de métodos. | B-15 (baja severidad) |
| **Protección de inputs** | **Ausente** | No hay sanitización ni validación de payloads. Riesgo de inyección NoSQL o payloads malformados. | B-5 |
| **Rate limiting global** | **Ausente** | Solo existe protección de fuerza bruta en login. No hay rate limiting en endpoints de creación, búsqueda, etc. | — |

---

## 9. Backend — Análisis del Modelo de Datos

### 9.1 Entidades esperadas según ERD (`docs/03-data-model/erd.md`)

1. `Usuario`
2. `Experiencia`
3. `Etiqueta`
4. `Borrador`
5. `Respuesta`
6. `Reporte`
7. `Reacción`
8. `Favorito`
9. `Seguimiento`
10. `Bloqueo`

### 9.2 Entidades ORM implementadas

| Entidad ORM | Tabla | Estado | Observación |
|---|---|---|---|
| `UsuarioORM` | `usuarios` | Implementado | Incluye roles, flags de suspensión/privacidad. |
| `ExperienciaORM` | `experiencias` | Implementado | Incluye estado (`BORRADOR`, `PUBLICADA`, `ARCHIVADA`). No hay separación explícita de `Borrador` como entidad independiente; se maneja por estado. |
| `SesionORM` | `sesiones` | Implementado | Para invalidación server-side. |
| `IntentoFallidoORM` | `intentos_fallidos` | Implementado | Para rate limiting de login. |
| `FavoritoORM` | `favoritos` | Implementado | Clave primaria compuesta (`usuario_id`, `experiencia_id`). |
| `ReaccionORM` | `reacciones` | Implementado (estructural) | Tabla existe, pero no tiene endpoints ni use cases funcionales. |
| `EtiquetaORM` | — | **No implementado** | Faltan `Etiqueta` y tabla intermedia `ExperienciaEtiqueta`. |
| `RespuestaORM` | — | **No implementado** | Requerido para comentarios. |
| `ReporteORM` | — | **No implementado** | Requerido para moderación. |
| `SeguimientoORM` | — | **No implementado** | Requerido para V2 (follow). |
| `BloqueoORM` | — | **No implementado** | Requerido para V2 (block). |
| `AuditoriaORM` | — | **No implementado** | Requerido para R60 (logs de admin). |
| `ListaNegraORM` | — | **No implementado** | Requerido para R63 (términos prohibidos). |

### 9.3 Observaciones del modelo

- `ExperienciaORM` usa `@CreateDateColumn` y `@UpdateDateColumn`, por lo que las fechas de creación/modificación se gestionan automáticamente. Cumple parcialmente R45.
- No se observan índices explícitos en columnas de búsqueda frecuente (`titulo`, `descripcion`), lo que puede degradar el rendimiento de `BuscarExperienciasUseCase`.
- `FavoritoORM` usa `repo.save(objetoPlano)` en lugar de `repo.create()`; esto funciona en TypeORM pero es menos robusto.

---

## 10. Frontend — Módulos y Funcionalidades Desarrolladas

### 10.1 Arquitectura y estructura

El frontend es una **SPA React 19** construida con **Vite 8**, estilizada con **TailwindCSS 4** y gestión de estado con **Zustand 5**. La estructura sigue una organización **feature-based** bajo `src/presentacion/`.

### 10.2 Rutas implementadas

| Ruta | Página | Protección |
|---|---|---|
| `/` | `HomePage` | Pública |
| `/equipo` | `TeamPage` | Pública |
| `/login` | `LoginPage` | Pública |
| `/registro` | `RegisterPage` | Pública |
| `/buscar` | `BuscarExperienciasPage` | Pública |
| `/experiencias` | `ListExperienciasPage` | Pública |
| `/experiencias/:id` | `ExperienciaDetailPage` | Pública |
| `/perfil/:id` | `PerfilPage` | Pública |
| `/experiencias/nueva` | `CreateExperienciaPage` | `ProtectedRoute` |
| `/experiencias/:id/editar` | `EditExperienciaPage` | `ProtectedRoute` |
| `/perfil/editar` | `EditarPerfilPage` | `ProtectedRoute` |
| `/favoritos` | `MisFavoritosPage` | `ProtectedRoute` |
| `/admin/usuarios` | `AdminUsuariosPage` | `AdminRoute` |
| `*` | `NotFoundPage` | Pública |

### 10.3 Funcionalidades por módulo

#### Autenticación (CU-01)

| Funcionalidad | Evidencia | Estado |
|---|---|---|
| Formulario de login | `LoginPage.tsx`, `auth.service.ts`, `useAuth.ts` | Completo |
| Formulario de registro | `RegisterPage.tsx`, `auth.service.ts` | Completo |
| Estado global de sesión (Zustand) | `auth.store.ts` | Completo |
| Rutas protegidas (`ProtectedRoute`) | `ProtectedRoute.tsx` | Completo |
| Rutas solo admin (`AdminRoute`) | `AdminRoute.tsx` | Completo |
| Dark mode persistente | `useTheme.ts` | Completo |

#### Gestión de Usuarios (CU-02)

| Funcionalidad | Evidencia | Estado |
|---|---|---|
| Perfil público | `PerfilPage.tsx`, `usuarios.service.ts` | Completo |
| Editar perfil propio | `EditarPerfilPage.tsx` | Completo |
| Estadísticas en perfil | `PerfilPage.tsx` (consume backend) | Completo |

#### Gestión de Experiencias (CU-03)

| Funcionalidad | Evidencia | Estado |
|---|---|---|
| Listado paginado | `ListExperienciasPage.tsx`, `useExperiencias.ts` | Completo |
| Búsqueda rápida + página de búsqueda | `BuscarExperienciasPage.tsx` | Completo |
| Detalle de experiencia | `ExperienciaDetailPage.tsx` | Completo |
| Crear experiencia (formulario) | `CreateExperienciaPage.tsx` | Completo |
| Editar experiencia (formulario) | `EditExperienciaPage.tsx` | Completo |
| Toggle favorito en detalle | `ExperienciaDetailPage.tsx` | Completo — ver Hallazgo F-4 |

#### Administración (CU-06)

| Funcionalidad | Evidencia | Estado |
|---|---|---|
| Panel de administración de usuarios | `AdminUsuariosPage.tsx`, `admin.service.ts` | Completo |
| Paginación, suspensión, cambio de rol | `AdminUsuariosPage.tsx` | Completo |

#### Interacción Social (parcial)

| Funcionalidad | Evidencia | Estado |
|---|---|---|
| Toggle favorito | `MisFavoritosPage.tsx`, `favoritos.service.ts` | Completo — ver Hallazgo F-1 |
| Listar mis favoritos | `MisFavoritosPage.tsx` | Completo |

---

## 11. Frontend — Funcionalidades Pendientes MVP

| ID Req. | Funcionalidad | Justificación de ausencia | Impacto |
|---|---|---|---|
| R05 | **Sección de respuestas** en detalle de experiencia | No existe componente, hook ni servicio de respuestas. | Alto |
| R29, R30 | **Botón de reacción "me gusta"** con conteo visible | El frontend no consume endpoint de reacciones (no existe en backend). | Alto |
| R38, R39, R44 | **Autosave de borradores** cada 30s | No hay `useEffect` ni servicio de autosave en `CreateExperienciaPage`. | Medio |
| R41, R42, R51, R54 | **Input de etiquetas** (máx. 5) y filtro por etiqueta | No hay componente de tags ni servicio de etiquetas. | Alto |
| R33, R35 | **Reportar contenido** / **ocultar contenido** | Sin botón de reporte ni modal de confirmación. | Medio |
| R16, R17, R18, R20 | **Página dedicada al equipo editable** por admin | `TeamPage` tiene contenido hardcodeado (un solo miembro). No hay formulario de edición para admin. | Medio |
| R43 | **Vista previa antes de publicar** | No hay página ni modal de previsualización previa a POST. | Bajo |
| R49 | **Lista de favoritos públicos** en perfil | El perfil no muestra la sección de favoritos del usuario. | Medio |
| R56 | **Sección de experiencias recientes** en HomePage | La landing muestra cards estáticas de valor, pero no lista las últimas 10 experiencias del backend. | Medio |
| R63 | **Filtro de lista negra** de términos prohibidos en inputs | No hay validación de contenido en frontend. | Medio |

---

## 12. Frontend — Violaciones y Errores

### Severidad: Crítico

| # | Hallazgo | Ubicación exacta | Explicación | Posible corrección |
|---|---|---|---|---|
| F-1 | **Rutas duplican prefijo `/api/` en servicios** | `apps/frontend/src/presentacion/features/favoritos/services/favoritos.service.ts` y `apps/frontend/src/presentacion/features/admin/services/admin.service.ts` | `favoritos.service.ts` y `admin.service.ts` usan rutas como `/api/favoritos/...` y `/api/admin/...`, pero `api.ts` define `BASE_URL = 'http://localhost:16001/api'`. Esto genera URLs duplicadas: `http://localhost:16001/api/api/favoritos/...` → **404**. | Eliminar el prefijo `/api/` de las rutas en `favoritos.service.ts` y `admin.service.ts`; usar solo `/favoritos/...` y `/admin/...`. |
| F-2 | **`Layout.tsx` tiene `<main>` vacío; `<Outlet>` fuera del contenedor principal** | `apps/frontend/src/presentacion/layout/shell/Layout.tsx` | El `<main className="max-w-6xl mx-auto px-4 py-8">` no envuelve el `<Outlet />`. El contenido de todas las páginas se renderiza fuera del contenedor centrado, rompiendo el layout responsive y el max-width global. | Mover el `<Outlet />` dentro del `<main>...</main>`. |

### Severidad: Alta

| # | Hallazgo | Ubicación exacta | Explicación | Posible corrección |
|---|---|---|---|---|
| F-3 | **`LinkComponent` no reenvía `...props` al componente `Link` de react-router** | `apps/frontend/src/presentacion/shared/components/Link/Link.component.tsx` | La interfaz extiende `LinkHTMLAttributes<HTMLLinkElement>` (incorrecto; debería extender de `LinkProps` de react-router). Además, el componente solo renderiza `to`, `className` y `children`, ignorando `onClick`, `state`, `replace`, `target`, etc. | Cambiar la interfaz para extender `LinkProps` de `react-router-dom` y propagar `{...props}` al componente `Link`. |
| F-4 | **`ExperienciaDetailPage` no consulta estado inicial de favorito** | `apps/frontend/src/presentacion/features/experiencias/pages/ExperienciaDetailPage.tsx` | El estado `isFav` se inicializa en `false` hardcodeado. Aunque el backend provee `ToggleFavoritoUseCase` y `ListarFavoritosUseCase`, el frontend nunca verifica si la experiencia actual ya es favorito del usuario autenticado. El corazón siempre aparece vacío al cargar. | Agregar un `useEffect` que consulte al backend (o al estado global de favoritos) para establecer `isFav` correctamente al montar la página. |
| F-5 | **`auth.store.ts` guarda `expiresAt` con `JSON.stringify` agregando comillas extra** | `apps/frontend/src/presentacion/app/store/auth.store.ts` | Al guardar en `localStorage`, `expiresAt` se envuelve con comillas dobles (`"\"2026-07-18T...\""`). Al leerlo posteriormente, el string contiene comillas literales, lo que puede causar fallos al comparar fechas o parsear con `new Date()`. | Eliminar `JSON.stringify` para `expiresAt` (ya es un string) o usar `JSON.parse` consistentemente al leer. Considerar usar el middleware `persist` de Zustand. |
| F-6 | **`api.ts` no maneja respuestas HTTP sin body (204)** | `apps/frontend/src/presentacion/shared/services/api.ts` línea `const json = await res.json() as T;` | Si el backend responde con `204 No Content` o body vacío (común en DELETE o PATCH de logout), `res.json()` lanzará un error de parseo que romperá el frontend. | Verificar `res.status !== 204 && res.headers.get('content-length') !== '0'` antes de intentar `res.json()`. |

### Severidad: Media

| # | Hallazgo | Ubicación exacta | Explicación | Posible corrección |
|---|---|---|---|---|
| F-7 | **`PerfilPage` enlaza a `/mis-experiencias`, ruta inexistente** | `apps/frontend/src/presentacion/features/usuarios/pages/PerfilPage.tsx` | Hay un `<Link to="/mis-experiencias">` que no está definido en el router. Navegar a ese link resulta en `NotFoundPage`. | Cambiar el link a `/experiencias?usuarioId=...` o crear la ruta `/mis-experiencias` si es requerida. |
| F-8 | **`useExperiencias` usa método `@deprecated`** | `apps/frontend/src/presentacion/features/experiencias/hooks/useExperiencias.ts` | El hook invoca `experienciasService.list(page)` que está marcado como `@deprecated` en el servicio. Debería usar `listar(opts)`. | Reemplazar `list(page)` por `listar({ page, ... })`. |
| F-9 | **`BuscarExperienciasPage`: `CardComponent` sin `key` dentro del `.map()`** | `apps/frontend/src/presentacion/features/experiencias/pages/BuscarExperienciasPage.tsx` | El `key` está en el `LinkComponent` interno, pero el wrapper `CardComponent` también debería llevarlo para evitar warnings de React y posibles problemas de reconciliación. | Mover el `key` al `CardComponent` o duplicarlo en ambos elementos del map. |
| F-10 | **`App.css` es código muerto de plantilla Vite** | `apps/frontend/src/presentacion/app/styles/App.css` | Contiene estilos de boilerplate de Vite (`.counter`, `.hero`, etc.) que **no se importan ni se usan** en ninguna parte de la aplicación. | Eliminar el archivo o adaptar los estilos si realmente se necesitan. |
| F-11 | **No hay lazy loading de rutas** | `apps/frontend/src/presentacion/app/router/index.tsx` | Todas las páginas se importan estáticamente. El bundle inicial carga todo el código de la aplicación, incluyendo páginas de admin que la mayoría de usuarios nunca visitarán. | Implementar `React.lazy()` para las páginas de admin, perfil, favoritos y edición. |
| F-12 | **Import vacío en `Navbar.tsx`** | `apps/frontend/src/presentacion/layout/header/Navbar.tsx` línea 3 | `import { } from "react-icons/fa";` no tiene utilidad y puede generar warnings del bundler. | Eliminar la línea. |

---

## 13. Frontend — Arquitectura vs. Plan

### 13.1 Arquitectura documentada

Según `docs/02-architecture/c4/level-3-component-frontend.md` y `docs/frontend-guide/`:

- **SPA** con React y Vite.
- **Arquitectura Basada en Componentes**.
- **Organización por features** (páginas, servicios, hooks, tipos).
- **Shared**: componentes reutilizables, hooks comunes, servicios base.
- **Widgets**: componentes compuestos de mayor nivel (vacío actualmente).

### 13.2 Arquitectura real

| Aspecto | Estado | Observación |
|---|---|---|
| Feature-based folders | **Presente** | `features/auth/`, `features/experiencias/`, etc. Correcto. |
| Layout/Shell | **Presente** | `layout/shell/Layout.tsx`, `layout/header/Navbar.tsx`. Correcto. |
| Shared components | **Parcial** | Existen `Button`, `Card`, `Link`, pero con bugs (F-3). |
| Estado global (Zustand) | **Presente** | `auth.store.ts` para sesión. Correcto, pero con bug F-5. |
| API service centralizado | **Presente** | `api.ts` con `fetch` wrapper. Correcto, pero sin manejo de 204. |
| Routing | **Presente** | `createBrowserRouter` con `ProtectedRoute` y `AdminRoute`. Correcto. |
| Dark mode | **Presente** | `useTheme.ts` con `localStorage` y `prefers-color-scheme`. Correcto. |
| **Widgets** | **Vacío** | `src/presentacion/widgets/` solo contiene `.gitkeep`. No hay componentes compuestos reutilizables de alto nivel. |
| **Lazy loading** | **Ausente** | Todas las páginas se cargan upfront. |
| **Validación de inputs** | **Ausente** | Solo validación HTML5 nativa (`required`, `type="email"`). No hay `zod`, `yup`, `react-hook-form`. |

---

## 14. Pruebas Unitarias y E2E

### 14.1 Backend

| Aspecto | Estado | Evidencia |
|---|---|---|
| Tests unitarios | **0 %** | `apps/backend/tests/unit/` contiene únicamente `.gitkeep`. |
| Tests de integración | **0 %** | `apps/backend/tests/integration/` contiene únicamente `.gitkeep`. |
| Script de test | **No implementado** | `package.json`: `"test": "echo \"Error: no test specified\" && exit 1"`. |
| Framework de testing | **No instalado** | No hay `jest`, `vitest`, `mocha`, `ava`, `node:test` ni `supertest` en `devDependencies`. |
| Factibilidad de testing | **Alta** | La inyección de dependencias manual (constructor injection) en use cases y controllers facilitaría enormemente el mocking. La arquitectura por capas está preparada para testing, pero no se aprovecha. |

### 14.2 Frontend

| Aspecto | Estado | Evidencia |
|---|---|---|
| Tests unitarios | **0 %** | `apps/frontend/tests/unit/` contiene únicamente `.gitkeep`. |
| Tests de integración | **0 %** | `apps/frontend/tests/integration/` contiene únicamente `.gitkeep`. |
| Script de test | **No implementado** | No hay script `test` en `package.json`. Solo `dev`, `build`, `lint`, `preview`. |
| Framework de testing | **No instalado** | No hay `vitest`, `jest`, `@testing-library/react`, `jsdom`, `msw` (mock service worker) en `devDependencies`. |
| Factibilidad de testing | **Alta** | Los componentes son funcionales y puros; Zustand permite mocking de stores; los servicios son funciones asíncronas simples. |

### 14.3 Pruebas E2E (End-to-End)

| Aspecto | Estado | Evidencia |
|---|---|---|
| Framework | **Playwright instalado** | `@playwright/test: ^1.60.0` en `tests/e2e/package.json`. |
| Configuración | **Operativa** | `playwright.config.ts` con `baseURL: 'http://localhost:16000'`, screenshots `on`, trace `retain-on-failure`, proyecto `chromium`. |
| Tests escritos | **~80 tests** | `tests/e2e/specs/components.spec.ts` (~497 líneas) cubre: Navbar, Layout, HomePage, LoginPage, RegisterPage, TeamPage, NotFoundPage, ListExperienciasPage, BuscarExperienciasPage, ExperienciaDetailPage, PerfilPage, ProtectedRoute, Button/Card/Link variants. |
| Evidencia de ejecución | **Presente** | `tests/e2e/test-results/` contiene decenas de subcarpetas con screenshots `.png` de cada test ejecutado, lo que demuestra que las pruebas han corrido realmente. |
| ADR-017 | **Inconsistencia** | El documento `ADR-017-use-playwright-framework.md` marca el estado como **"Pendiente"**, a pesar de que el código, la configuración y los resultados de ejecución ya existen. | 

### 14.4 Observaciones de las pruebas E2E

1. **Las pruebas E2E cubren exclusivamente el frontend** (`baseURL: http://localhost:16000`). No hay tests que validen endpoints del backend de forma aislada (eso sería integración, no E2E).
2. **Algunos tests tienen lógica condicional** (`if (await firstCard.count() > 0)`) que omite aserciones cuando no hay datos en la base de datos. Esto es pragmático para un entorno de desarrollo con BD vacía, pero reduce la determinidad de las pruebas.
3. **No hay tests de flujos autenticados** (login real + navegación protegida). Los tests de `ProtectedRoute` verifican redirección a `/login`, pero no hay un flujo E2E completo de "registrar → loguear → crear experiencia → verificar que aparece en la lista".
4. **No hay tests de administración** (`/admin/usuarios` no tiene cobertura E2E).
5. **Los tests de variantes de componentes** (`ButtonComponent`, `CardComponent`, `LinkComponent`) se validan por presencia visual en páginas reales. Esto es correcto para E2E, pero carece de tests unitarios que validen el comportamiento aislado de los componentes.

### 14.5 Recomendaciones de testing

#### Backend

1. Instalar `vitest` + `@vitest/coverage-v8` + `supertest`.
2. Priorizar tests de integración para los 5 flujos críticos: login, registro, CRUD de experiencias, toggle favorito, administración.
3. Tests unitarios para value objects (`Email`, `Password`) y reglas de dominio.
4. Tests de integración para `authMiddleware` con JWT expirado vs. inválido.

#### Frontend

1. Instalar `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`.
2. Tests unitarios para `ButtonComponent`, `CardComponent`, `LinkComponent` (renderizado, clases, eventos).
3. Tests de integración para `useAuth` (login/logout con Zustand mocking).
4. Tests de integración para páginas con `msw` (mock service worker) para simular API sin backend levantado.

#### E2E

1. Agregar flujo completo autenticado: registro → login → crear experiencia → verificar en lista → logout.
2. Agregar test de administración: login como admin → navegar a `/admin/usuarios` → suspender un usuario.
3. Considerar agregar proyecto `firefox` y `webkit` en `playwright.config.ts` para cumplir RNF08 (compatibilidad multi-navegador).
4. Usar `storageState` de Playwright para reutilizar sesión autenticada entre tests y evitar login repetido.

---

## 15. Observaciones de Integración Backend-Frontend

| # | Hallazgo | Causa raíz | Corrección necesaria |
|---|---|---|---|
| I-1 | **Favoritos y Admin no funcionan** (404) | Frontend duplica `/api/` en `favoritos.service.ts` y `admin.service.ts` | Corregir rutas en frontend (F-1). |
| I-2 | **Logout con 204 puede romper frontend** | Backend responde `204 No Content` en logout; frontend hace `res.json()` incondicionalmente | Corregir `api.ts` para manejar 204 (F-6). |
| I-3 | **Detalle de experiencia no muestra favorito activo** | Backend provee endpoints pero frontend no consulta estado inicial | Agregar consulta en `ExperienciaDetailPage` (F-4). |
| I-4 | **Frontend usa método deprecado del backend** | `useExperiencias` invoca `list()` marcado como `@deprecated` | Actualizar hook a `listar()` (F-8). |
| I-5 | **Perfil enlaza a ruta inexistente** | `PerfilPage.tsx` apunta a `/mis-experiencias` sin backend ni router | Crear ruta o corregir link (F-7). |
| I-6 | **Admin no puede editar página del equipo** | Backend no tiene endpoints para gestionar contenido de `TeamPage` | Implementar backend primero, luego frontend. |
| I-7 | **Modo oscuro consistente** | Tanto backend como frontend no persisten preferencia de tema en el usuario (solo en `localStorage` del navegador) | Opcional: persistir en `UsuarioORM` para sincronización entre dispositivos. |

---

## 16. Conclusiones y Prioridades de Corrección

### 16.1 Resumen de estado por aplicación

| Aplicación | Funcionalidades desarrolladas | Funcionalidades pendientes MVP | Severidad de deuda técnica |
|---|---|---|---|
| Backend | ~60 % | 18 funcionalidades | Alta (5 Críticos, 8 Altos) |
| Frontend | ~70 % | 11 funcionalidades | Alta (2 Críticos, 6 Altos) |
| E2E | ~40 % cobertura de flujos públicos | Flujos autenticados, admin, multi-navegador | Media |
| Unit/Integration | 0 % ambas apps | Todo | Crítico |

### 16.2 Roadmap de correcciones recomendado

#### Fase 1: Estabilización (Bloqueante — Crítico)
1. **Corregir `package.json` del backend** (B-1) — versiones reales de dependencias.
2. **Corregir URLs duplicadas `/api/` en frontend** (F-1) — favoritos y admin.
3. **Corregir `Layout.tsx`** (F-2) — mover `<Outlet>` dentro de `<main>`.
4. **Definir `JWT_SECRET` en `.env`** del backend y eliminar fallback inseguro (B-2).

#### Fase 2: Seguridad y Arquitectura (Alto impacto)
5. **Refactorizar `index.ts` del backend** en `app.ts`, `routes.ts`, `container.ts`, `server.ts` (B-7).
6. **Agregar validación de inputs** en backend con `zod` o `class-validator` (B-5).
7. **Crear use cases dedicados** para `listarUsuarios` y `reactivar` en `AdminController` (B-6).
8. **Invalidar JWT en `authMiddleware`** consultando `SesionRepository` (B-3).
9. **Corregir `LinkComponent`** para propagar props y usar `LinkProps` correcto (F-3).
10. **Corregir `auth.store.ts`** — eliminar `JSON.stringify` de `expiresAt` (F-5).
11. **Corregir `api.ts`** — manejar `204 No Content` (F-6).

#### Fase 3: Funcionalidades MVP pendientes (Alto valor de negocio)
12. **Backend: crear entidad `RespuestaORM`** + use cases + endpoints.
13. **Backend: activar reacciones** (`ReaccionORM` ya existe; faltan use cases/controller).
14. **Backend: crear `EtiquetaORM`** + tabla intermedia + búsqueda.
15. **Backend: implementar log de auditoría** (`AuditoriaORM`) (R60).
16. **Frontend: crear componente de respuestas** en `ExperienciaDetailPage`.
17. **Frontend: crear componente de tags** en creación/edición de experiencias.
18. **Frontend: implementar vista previa** antes de publicar.

#### Fase 4: Testing (Deuda técnica crítica)
19. **Backend: instalar `vitest` + `supertest`**; escribir tests de integración para auth, experiencias, favoritos, admin.
20. **Frontend: instalar `vitest` + `@testing-library/react`**; tests unitarios para componentes compartidos.
21. **E2E: agregar flujo autenticado completo** (registro → login → crear → listar → logout).
22. **E2E: agregar test de administración** y multi-navegador (`firefox`, `webkit`).

### 16.3 Métricas de salud estimadas

| Métrica | Valor estimado |
|---|---|
| Cobertura de pruebas unitarias (backend) | 0 % |
| Cobertura de pruebas unitarias (frontend) | 0 % |
| Cobertura E2E (flujos públicos) | ~60 % |
| Cobertura E2E (flujos autenticados) | ~10 % |
| Dependencias con versiones inexistentes | 4 (backend) |
| Violaciones de Clean Architecture (backend) | 3 |
| Bugs críticos de integración frontend-backend | 2 |
| Hallazgos de seguridad Críticos/Altos | 5 (backend) + 2 (frontend) |
| Funcionalidades MVP implementadas (backend) | ~60 % |
| Funcionalidades MVP implementadas (frontend) | ~70 % |

---

> **Fin del análisis.** Este documento fue generado en modo lectura sin modificar código fuente. Toda la información proviene de la inspección directa del repositorio y su documentación de plan.
