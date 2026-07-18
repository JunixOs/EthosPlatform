# Plan Implementacion - MVC - 18-07-2026

> **Proyecto:** Sistema de Ética (EthosPlatform)
> **Fecha:** 18 de julio de 2026
> **Agente:** OpenCode
> **Referencia:** Basado en `18-07-2026 - Analisis Backend - OpenCode.md`
> **Objetivo:** Implementar completamente el MVC (Modelo-Vista-Controlador / Clean Architecture) del proyecto, corrigiendo errores actuales, completando funcionalidades pendientes del MVP, y asegurando cobertura de pruebas unitarias, de integración y E2E.

---

## 1. Introducción y Objetivos

### 1.1 Propósito

Este plan establece el roadmap completo para llevar el proyecto **Sistema de Ética** desde su estado actual (~60 % backend, ~70 % frontend, 0 % unit/integración) hasta una implementación completa del MVP, con arquitectura MVC/Clean Architecture sólida, pruebas automatizadas y flujos E2E validados.

### 1.2 Principios rectores

1. **No romper lo que funciona:** Cada cambio en código existente debe ir acompañado de pruebas de regresión.
2. **Pruebas primero (Test-First):** Para cada nueva funcionalidad o corrección, se escribirán primero las pruebas unitarias/integración, luego el código.
3. **Arquitectura documentada:** Todo nuevo código debe respetar el contrato arquitectónico (Clean Architecture + Vertical Slicing, 4 capas, interfaces entre capas).
4. **Integración continua:** Cada fase debe dejar el proyecto en un estado compilable y funcional.

---

## 2. Estado Actual (Resumen del Análisis)

| Capa | Estado | Hallazgos críticos |
|---|---|---|
| **Backend** | ~60 % MVP implementado | 5 errores críticos (dependencias inexistentes, JWT inseguro, logout sin invalidación), 8 altos (Clean Architecture violada, validación ausente, monolito index.ts) |
| **Frontend** | ~70 % MVP implementado | 2 errores críticos (URLs duplicadas /api/, layout roto), 6 altos (LinkComponent roto, auth.store corrupto, manejo de 204 ausente) |
| **Pruebas Unitarias** | 0 % | Sin frameworks instalados en backend ni frontend |
| **Pruebas Integración** | 0 % | Sin frameworks instalados |
| **Pruebas E2E** | ~40 % flujos públicos | Playwright operativo con ~80 tests, pero sin flujos autenticados ni de administración |

---

## 3. Fases de Implementación

### Fase 1: Estabilización y Corrección de Errores Críticos (Semana 1)

> **Objetivo:** El proyecto debe compilar, instalar dependencias y ejecutarse sin errores bloqueantes. Frontend y backend deben comunicarse correctamente.

| # | Tarea | Archivos afectados | Criterio de aceptación | Responsable sugerido |
|---|---|---|---|---|
| 1.1 | Corregir versiones de dependencias en backend | `apps/backend/package.json` | `pnpm install` en backend completa sin errores. `pnpm dev` levanta el servidor. | Backend dev |
| 1.2 | Corregir URLs duplicadas `/api/` en frontend | `apps/frontend/src/presentacion/features/favoritos/services/favoritos.service.ts`, `admin.service.ts` | Las peticiones a favoritos y admin responden 200 (no 404). Verificar en Network tab del navegador. | Frontend dev |
| 1.3 | Corregir `Layout.tsx`: `<Outlet>` dentro de `<main>` | `apps/frontend/src/presentacion/layout/shell/Layout.tsx` | El contenido de todas las páginas está centrado con `max-w-6xl mx-auto px-4 py-8`. | Frontend dev |
| 1.4 | Definir `JWT_SECRET` en `.env` y eliminar fallback inseguro | `apps/backend/.env`, código que usa `process.env.JWT_SECRET \|\| 'secret'` | Si `JWT_SECRET` no está definido, el backend lanza error al arrancar (no usa fallback). Crear `.env.example`. | Backend dev |
| 1.5 | Corregir `auth.store.ts`: eliminar `JSON.stringify` de `expiresAt` | `apps/frontend/src/presentacion/app/store/auth.store.ts` | El valor de `expiresAt` en `localStorage` es un string ISO limpio, sin comillas escapadas. | Frontend dev |
| 1.6 | Corregir `api.ts`: manejo de respuestas 204 No Content | `apps/frontend/src/presentacion/shared/services/api.ts` | Las peticiones DELETE/POST de logout no lanzan error de parseo JSON cuando el backend responde 204. | Frontend dev |
| 1.7 | Smoke test manual de flujos críticos | Todo el sistema | Login, registro, crear experiencia, listar experiencias, toggle favorito, navegar a admin funcionan sin errores en consola. | QA / Dev |

**Entregable de Fase 1:**
- Pull request con correcciones.
- Capturas de pantalla de flujos críticos funcionando.
- `pnpm install` y `pnpm dev` ejecutables sin errores en ambas aplicaciones.

---

### Fase 2: Refactorización Arquitectónica y Seguridad (Semana 2)

> **Objetivo:** Separar responsabilidades en backend, corregir violaciones de Clean Architecture, validar inputs, y cerrar brechas de seguridad.

| # | Tarea | Archivos afectados | Criterio de aceptación | Responsable sugerido |
|---|---|---|---|---|
| 2.1 | Extraer `index.ts` monolítico en 4 archivos | `apps/backend/src/index.ts` → `app.ts`, `routes.ts`, `container.ts`, `server.ts` | `server.ts` inicia la app. `routes.ts` usa `express.Router()` por feature. `container.ts` instancia dependencias. Tests de integración pueden importar `app.ts` sin levantar servidor. | Backend dev |
| 2.2 | Crear use cases para `AdminController` (listar y reactivar) | `apps/backend/src/logica/application/features/admin/listar_usuarios/`, `reactivar_usuario/` | `AdminController` ya no importa `IUsuarioRepository`. Usa `ListarUsuariosAdminUseCase` y `ReactivarUsuarioUseCase`. | Backend dev |
| 2.3 | Agregar validación de inputs con `zod` o `class-validator` | Instalar `zod` en backend. Crear schemas para `LoginRequestDTO`, `RegisterRequestDTO`, `CreateExperienciaRequestDTO`, `UpdateExperienciaRequestDTO`. | Si se envía un payload inválido (email sin @, contraseña vacía, título > 255 chars), el backend responde 400 con mensaje claro, no 500. | Backend dev |
| 2.4 | Invalidar JWT en `authMiddleware` consultando `SesionRepository` | `apps/backend/src/logica/interface_adapters/middleware/authMiddleware.ts` | Después de hacer logout, el token anterior es rechazado con 401, aunque no haya expirado naturalmente. | Backend dev |
| 5 | Corregir `requireAdmin`: lanzar 403 en vez de 401 | `apps/backend/src/logica/interface_adapters/middleware/authMiddleware.ts` | Usuario autenticado sin rol admin recibe 403 `ForbiddenException`. | Backend dev |
| 2.6 | Implementar cascada de eliminación al borrar cuenta | `apps/backend/src/logica/application/features/usuarios/eliminar_cuenta/EliminarCuentaUseCase.ts` | Al eliminar un usuario, todas sus experiencias, respuestas, reacciones, favoritos y sesiones se eliminan. Verificar con consulta directa a BD. | Backend dev |
| 2.7 | Corregir `LinkComponent` en frontend | `apps/frontend/src/presentacion/shared/components/Link/Link.component.tsx` | El componente extiende `LinkProps` de react-router y propaga `{...props}`. `onClick`, `state`, `replace`, `target` funcionan. | Frontend dev |
| 2.8 | Corregir `ExperienciaDetailPage`: consultar estado inicial de favorito | `apps/frontend/src/presentacion/features/experiencias/pages/ExperienciaDetailPage.tsx` | Al cargar una experiencia que ya es favorito, el corazón aparece relleno. | Frontend dev |
| 2.9 | Agregar graceful shutdown al backend | `apps/backend/src/server.ts` | Al recibir SIGTERM/SIGINT, el servidor cierra conexiones HTTP y destruye `AppDataSource` antes de salir. | Backend dev |
| 2.10 | Agregar logger estructurado (`pino`) | `apps/backend/src/app.ts`, `server.ts` | Los logs incluyen timestamp, nivel, request ID. Reemplaza `console.log`/`console.error`. | Backend dev |

**Entregable de Fase 2:**
- Pull request con refactorización.
- Pruebas de regresión manuales de todos los flujos existentes.
- Verificación de que `pnpm test` en backend ejecuta al menos 1 test de integración exitoso (instalación de vitest + supertest).

---

### Fase 3: Infraestructura de Pruebas (Semana 2, paralelo)

> **Objetivo:** Instalar y configurar frameworks de testing en backend y frontend. Escribir las primeras pruebas para código existente.

| # | Tarea | Archivos afectados | Criterio de aceptación | Responsable sugerido |
|---|---|---|---|---|
| 3.1 | Instalar `vitest` + `supertest` en backend | `apps/backend/package.json` | Comando `pnpm test` ejecuta vitest. Al menos 1 test de ejemplo pasa. | Backend dev |
| 3.2 | Configurar `vitest` para TypeScript y paths del monorepo | `apps/backend/vitest.config.ts` | Los tests pueden importar desde `src/` sin errores de resolución de módulos. | Backend dev |
| 3.3 | Instalar `vitest` + `@testing-library/react` + `jsdom` en frontend | `apps/frontend/package.json` | Comando `pnpm test` ejecuta vitest con entorno jsdom. 1 test de renderizado de `ButtonComponent` pasa. | Frontend dev |
| 3.4 | Crear utilidades de testing compartidas | `apps/backend/tests/utils/testDb.ts`, `apps/frontend/tests/utils/renderWithProviders.tsx` | Backend: helper para inicializar TypeORM en memoria (`sqlite` o `pg` de test). Frontend: helper para renderizar componentes con Zustand store y Router. | Backend / Frontend dev |
| 3.5 | Escribir tests de integración para flujos críticos existentes | `apps/backend/tests/integration/auth.spec.ts`, `experiencias.spec.ts`, `usuarios.spec.ts` | Tests pasan: login válido → 200 con token; login inválido → 401/429; crear experiencia autenticado → 201; crear sin auth → 401; listar experiencias → 200 paginado. | Backend dev |
| 3.6 | Escribir tests unitarios para value objects existentes | `apps/backend/tests/unit/domain/value_objects/Email.spec.ts`, `Password.spec.ts` | `Email` rechaza formatos inválidos. `Password` rechaza cortas/débiles. | Backend dev |
| 3.7 | Escribir tests unitarios para componentes compartidos del frontend | `apps/frontend/tests/unit/shared/components/Button.component.spec.tsx`, `Link.component.spec.tsx`, `Card.component.spec.tsx` | Renderizan correctamente con variantes y clases esperadas. Eventos `onClick` funcionan. | Frontend dev |

**Entregable de Fase 3:**
- `pnpm test` ejecutable y exitoso en ambas aplicaciones.
- Cobertura mínima inicial: backend ~15 %, frontend ~10 %.

---

### Fase 4: Completar Funcionalidades MVP — Backend (Semanas 3–4)

> **Objetivo:** Implementar todas las funcionalidades MVP pendientes del backend: respuestas, reacciones, etiquetas, reportes, auditoría, página dedicada.

#### 4.1 Módulo Respuestas (R05)

| # | Tarea | Archivos nuevos | Pruebas requeridas |
|---|---|---|---|
| 4.1.1 | Crear entidad `RespuestaORM` | `apps/backend/src/datos/presistence/entities/RespuestaORM.ts` | Test de integridad de schema (columnas, FKs). |
| 4.1.2 | Crear entidad de dominio `Respuesta` | `apps/backend/src/logica/domain/entities/Respuesta.ts` | Test unitario: instanciación y reglas de dominio. |
| 4.1.3 | Crear mapper `RespuestaMapper` | `apps/backend/src/datos/presistence/mappers/RespuestaMapper.ts` | Test unitario: `toDomain` y `toORM` idempotentes. |
| 4.1.4 | Crear interfaz `IRespuestaRepository` | `apps/backend/src/logica/application/gateway/repositories/IRespuestaRepository.ts` | — |
| 4.1.5 | Crear repositorio `RespuestaRepository` | `apps/backend/src/datos/presistence/repositories/RespuestaRepository.ts` | Test de integración: CRUD completo en BD de test. |
| 4.1.6 | Crear use cases: `CrearRespuestaUseCase`, `ListarRespuestasUseCase`, `EliminarRespuestaUseCase` | `apps/backend/src/logica/application/features/respuestas/` | Tests unitarios: autoría, validación de existencia de experiencia, cascada. |
| 4.1.7 | Crear controller `RespuestasController` | `apps/backend/src/logica/interface_adapters/features/respuestas/controllers/RespuestasController.ts` | Test de integración: endpoints responden 201, 200, 403, 404 según caso. |
| 4.1.8 | Registrar rutas | `apps/backend/src/routes.ts` | Test E2E: crear respuesta → aparece en listado. |

#### 4.2 Módulo Reacciones (R29, R30)

| # | Tarea | Archivos nuevos | Pruebas requeridas |
|---|---|---|---|
| 4.2.1 | Activar entidad `ReaccionORM` (ya existe) | Confirmar schema | Test de schema. |
| 4.2.2 | Crear use case `ToggleReaccionUseCase` | `apps/backend/src/logica/application/features/reacciones/` | Test unitario: toggle idempotente, conteo correcto. |
| 4.2.3 | Crear use case `ContarReaccionesUseCase` | `apps/backend/src/logica/application/features/reacciones/` | Test unitario: agregación por experiencia. |
| 4.2.4 | Crear controller `ReaccionesController` | `apps/backend/src/logica/interface_adapters/features/reacciones/` | Test de integración: POST toggle → 200; GET conteo → número. |
| 4.2.5 | Registrar rutas | `apps/backend/src/routes.ts` | Test E2E: dar me gusta → conteo incrementa. |

#### 4.3 Módulo Etiquetas (R41, R42, R51, R54)

| # | Tarea | Archivos nuevos | Pruebas requeridas |
|---|---|---|---|
| 4.3.1 | Crear entidad `EtiquetaORM` | `apps/backend/src/datos/presistence/entities/EtiquetaORM.ts` | Test de schema: nombre único, slug. |
| 4.3.2 | Crear tabla intermedia `ExperienciaEtiquetaORM` | `apps/backend/src/datos/presistence/entities/ExperienciaEtiquetaORM.ts` | Test de schema: clave compuesta. |
| 4.3.3 | Crear value object/regla `LimiteEtiquetasRule` | `apps/backend/src/logica/domain/rules/LimiteEtiquetasRule.ts` | Test unitario: rechaza > 5 etiquetas. |
| 4.3.4 | Crear use cases: `AsociarEtiquetasUseCase`, `BuscarPorEtiquetaUseCase`, `ListarEtiquetasUseCase` | `apps/backend/src/logica/application/features/etiquetas/` | Tests unitarios: límite de 5, búsqueda case-insensitive. |
| 4.3.5 | Crear controller `EtiquetasController` | `apps/backend/src/logica/interface_adapters/features/etiquetas/` | Test de integración: asociar 5 etiquetas → 201; asociar 6 → 400. |
| 4.3.6 | Registrar rutas | `apps/backend/src/routes.ts` | Test E2E: buscar por etiqueta devuelve experiencias filtradas. |

#### 4.4 Módulo Reportes y Moderación (R33, R35, R36)

| # | Tarea | Archivos nuevos | Pruebas requeridas |
|---|---|---|---|
| 4.4.1 | Crear entidad `ReporteORM` | `apps/backend/src/datos/presistence/entities/ReporteORM.ts` | Test de schema. |
| 4.4.2 | Crear use cases: `CrearReporteUseCase`, `ListarReportesUseCase`, `OcultarContenidoUseCase` | `apps/backend/src/logica/application/features/reportes/` | Test unitario: un usuario no puede reportar 2 veces el mismo contenido. |
| 4.4.3 | Crear controller `ReportesController` | `apps/backend/src/logica/interface_adapters/features/reportes/` | Test de integración: POST reporte → 201; admin GET reportes → lista. |
| 4.4.4 | Registrar rutas | `apps/backend/src/routes.ts` | — |

#### 4.5 Módulo Log de Auditoría (R60)

| # | Tarea | Archivos nuevos | Pruebas requeridas |
|---|---|---|---|
| 4.5.1 | Crear entidad `AuditoriaORM` | `apps/backend/src/datos/presistence/entities/AuditoriaORM.ts` | Test de schema: admin, acción, objetivo, timestamp. |
| 4.5.2 | Crear `AuditoriaService` o decorator de use cases | `apps/backend/src/logica/application/services/AuditoriaService.ts` | Test unitario: registrar acción no lanza error. |
| 4.5.3 | Integrar auditoría en use cases administrativos | `EditarUsuarioAdminUseCase`, `EliminarUsuarioAdminUseCase`, `SuspenderUsuarioUseCase`, etc. | Test de integración: después de suspender usuario, existe registro en auditoría. |
| 4.5.4 | Crear endpoint para consultar logs | `AdminController` → `GET /api/admin/auditoria` | Test E2E: admin consulta logs → 200 con datos. |

#### 4.6 Módulo Página Dedicada al Equipo (R16–R20)

| # | Tarea | Archivos nuevos | Pruebas requeridas |
|---|---|---|---|
| 4.6.1 | Crear entidad `PaginaEquipoORM` (o usar configuración JSON/BD) | `apps/backend/src/datos/presistence/entities/PaginaEquipoORM.ts` | Test de schema. |
| 4.6.2 | Crear use cases: `ObtenerPaginaEquipoUseCase`, `EditarPaginaEquipoUseCase` | `apps/backend/src/logica/application/features/pagina_equipo/` | Test unitario: solo admin puede editar. |
| 4.6.3 | Crear controller | `apps/backend/src/logica/interface_adapters/features/pagina_equipo/` | Test de integración: GET pública → 200; PUT sin admin → 403. |
| 4.6.4 | Actualizar `TeamPage` en frontend para consumir endpoint | `apps/frontend/src/presentacion/pages/TeamPage.tsx` | Test E2E: admin edita contenido → se refleja en `/equipo`. |

**Entregable de Fase 4:**
- Backend MVP 100 % implementado.
- Pruebas unitarias por cada nuevo use case, repositorio, value object.
- Pruebas de integración por cada nuevo controller/endpoint.
- Cobertura de backend mínima: 60 %.

---

### Fase 5: Completar Funcionalidades MVP — Frontend (Semanas 4–5)

> **Objetivo:** Implementar las pantallas y componentes de UI correspondientes a las funcionalidades MVP que aún no tienen frontend.

| # | Tarea | Archivos nuevos / afectados | Pruebas requeridas |
|---|---|---|---|
| 5.1 | **Componente de Respuestas** en `ExperienciaDetailPage` | `apps/frontend/src/presentacion/features/respuestas/` (pages, services, hooks, types) | Test unitario: renderiza lista de respuestas. Test integración: POST respuesta → aparece en lista. |
| 5.2 | **Botón de reacción "me gusta"** en detalle y listado | `apps/frontend/src/presentacion/features/reacciones/` | Test unitario: toggle cambia estado visual. Test E2E: click → conteo actualizado. |
| 5.3 | **Input de etiquetas** (máx. 5) en crear/editar experiencia | `apps/frontend/src/presentacion/features/etiquetas/` | Test unitario: al 6to tag muestra error. Test E2E: crear experiencia con 3 tags → tags visibles en detalle. |
| 5.4 | **Filtro por etiqueta** en `/experiencias` y `/buscar` | `ListExperienciasPage.tsx`, `BuscarExperienciasPage.tsx` | Test E2E: click en tag → navega a `/buscar?etiqueta=etica` con resultados. |
| 5.5 | **Modal de reportar contenido** en detalle | `apps/frontend/src/presentacion/features/reportes/` | Test unitario: modal se abre y envía POST. Test E2E: reportar → mensaje de confirmación. |
| 5.6 | **Autosave de borradores** cada 30s en crear/editar | `apps/frontend/src/presentacion/features/experiencias/hooks/useAutoSave.ts` | Test unitario: después de 30s con cambios, se ejecuta PATCH. Test E2E: escribir → esperar 30s → recargar → borrador recuperado. |
| 5.7 | **Vista previa antes de publicar** | `apps/frontend/src/presentacion/features/experiencias/pages/PreviewExperienciaPage.tsx` | Test E2E: click "Vista previa" → renderiza experiencia sin persistir. |
| 5.8 | **Página de favoritos en perfil público** | `apps/frontend/src/presentacion/features/usuarios/pages/PerfilPage.tsx` | Test unitario: sección "Favoritos" visible con datos. |
| 5.9 | **Sección "Experiencias recientes"** en HomePage | `apps/frontend/src/presentacion/pages/HomePage.tsx` | Test E2E: landing muestra las últimas 10 experiencias del backend. |
| 5.10 | **Lazy loading de rutas** | `apps/frontend/src/presentacion/app/router/index.tsx` | Test E2E: navegación a `/admin/usuarios` carga chunk separado (visible en Network). |
| 5.11 | **Validación de formularios** en frontend (Zod o similar) | Instalar `zod` + `react-hook-form` (opcional) en frontend. | Test unitario: email inválido → mensaje de error antes de enviar. |

**Entregable de Fase 5:**
- Frontend MVP 100 % implementado.
- Pruebas unitarias para cada nuevo componente/hook.
- Pruebas de integración para cada nuevo servicio/API call.
- Cobertura de frontend mínima: 50 %.

---

### Fase 6: Pruebas E2E Completas (Semana 5–6)

> **Objetivo:** Cubrir todos los flujos de usuario con pruebas E2E: públicos, autenticados, administrativos, y multi-navegador.

| # | Flujo a cubrir | Tests E2E nuevos | Archivo sugerido |
|---|---|---|---|
| 6.1 | **Registro completo** | Registro → login automático → redirección a home | `tests/e2e/specs/flujo-auth.spec.ts` |
| 6.2 | **CRUD de experiencias** | Crear → listar → editar → eliminar → verificar que desaparece | `tests/e2e/specs/flujo-experiencias.spec.ts` |
| 6.3 | **Flujo de favoritos** | Dar favorito → ver en "Mis favoritos" → quitar favorito → desaparece | `tests/e2e/specs/flujo-favoritos.spec.ts` |
| 6.4 | **Flujo de respuestas** | Ver experiencia → escribir respuesta → respuesta aparece → eliminar respuesta | `tests/e2e/specs/flujo-respuestas.spec.ts` |
| 6.5 | **Flujo de reacciones** | Ver experiencia → dar me gusta → conteo aumenta → quitar → conteo disminuye | `tests/e2e/specs/flujo-reacciones.spec.ts` |
| 6.6 | **Flujo de etiquetas** | Crear experiencia con 3 tags → buscar por tag → resultado correcto | `tests/e2e/specs/flujo-etiquetas.spec.ts` |
| 6.7 | **Flujo de reportes** | Usuario reporta contenido → admin ve reporte → admin oculta contenido | `tests/e2e/specs/flujo-reportes.spec.ts` |
| 6.8 | **Flujo de administración** | Login como admin → suspender usuario → usuario no puede login → reactivar → puede login | `tests/e2e/specs/flujo-admin.spec.ts` |
| 6.9 | **Flujo de perfil** | Editar perfil → foto → privacidad → ver perfil público con datos actualizados | `tests/e2e/specs/flujo-perfil.spec.ts` |
| 6.10 | **Dark mode persistente** | Alternar tema → recargar página → tema persistido | `tests/e2e/specs/flujo-ui.spec.ts` |
| 6.11 | **Multi-navegador** | Ejecutar flujos 6.1–6.4 en Firefox y WebKit | Actualizar `playwright.config.ts` con proyectos `firefox` y `webkit`. |
| 6.12 | **Session storage** | Usar `storageState` de Playwright para reutilizar sesión entre tests | `tests/e2e/playwright.config.ts` + `auth.setup.ts`. |

**Entregable de Fase 6:**
- Suite E2E ejecutable con `pnpm test` en `tests/e2e/`.
- Todos los flujos pasan en Chromium. Flujos críticos pasan en Firefox y WebKit.
- Reporte HTML de Playwright generado.

---

### Fase 7: Funcionalidades Versión 2 y Versión 3 (Semanas 7–8)

> **Objetivo:** Implementar funcionalidades post-MVP: seguimiento, feed, bloqueo, notificaciones, destacados.

| # | Funcionalidad | Backend | Frontend | Pruebas |
|---|---|---|---|---|
| 7.1 | **Seguimiento de usuarios** (follow) | Entidad `SeguimientoORM`, use cases, endpoints | Botón "Seguir" en perfil, conteo de seguidores | Unit + Integration + E2E |
| 7.2 | **Feed personalizado** | Endpoint `/api/feed` con experiencias de usuarios seguidos | Página `/feed` con listado filtrado | Unit + Integration + E2E |
| 7.3 | **Bloqueo de usuarios** | Entidad `BloqueoORM`, use cases, validación en búsqueda/feed | Botón "Bloquear" en perfil, contenido bloqueado oculto | Unit + Integration + E2E |
| 7.4 | **Experiencias destacadas** (48h) | Query de experiencias con más reacciones en ventana de tiempo | Sección "Destacadas" en HomePage | Integration + E2E |
| 7.5 | **Notificaciones** (implícito) | Tabla `NotificacionORM`, endpoints para listar/marcar leídas | Badge de notificaciones en Navbar, dropdown | Integration + E2E |

---

## 4. Estrategia de Testing por Fase

### 4.1 Pirámide de testing objetivo

```
        /\
       /  \   E2E (~10 % de cobertura, flujos críticos)
      /____\
     /      \  Integration (~25 %, endpoints + servicios)
    /________\
   /          \ Unit (~65 %, lógica pura, componentes, reglas)
  /____________\
```

### 4.2 Convenciones de testing

| Capa | Framework | Ubicación | Patrón de nomenclatura |
|---|---|---|---|
| Backend Unit | Vitest | `apps/backend/tests/unit/**/*.spec.ts` | `{Entidad}.spec.ts` |
| Backend Integration | Vitest + Supertest | `apps/backend/tests/integration/**/*.spec.ts` | `{Feature}.spec.ts` |
| Frontend Unit | Vitest + Testing Library | `apps/frontend/tests/unit/**/*.spec.tsx` | `{Componente}.component.spec.tsx` |
| Frontend Integration | Vitest + Testing Library + MSW | `apps/frontend/tests/integration/**/*.spec.tsx` | `{Pagina}.page.spec.tsx` |
| E2E | Playwright | `tests/e2e/specs/*.spec.ts` | `flujo-{dominio}.spec.ts` |

### 4.3 Reglas de oro

1. **Toda nueva funcionalidad debe incluir sus pruebas unitarias** antes de mergear.
2. **Todo nuevo endpoint debe incluir pruebas de integración** antes de mergear.
3. **Todo nuevo flujo de usuario debe incluir pruebas E2E** antes de cerrar la historia.
4. **Cada corrección de bug debe incluir una prueba de regresión** que falle antes del fix y pase después.
5. **Mínimo de cobertura por módulo:** backend 70 %, frontend 60 %, E2E 100 % de flujos críticos.

---

## 5. Dependencias entre Tareas (Diagrama de Gantt simplificado)

```
Semana 1: [Fase 1: Estabilización] ........................
Semana 2: [Fase 2: Refactorización] + [Fase 3: Infra testing] ..
Semana 3: [Fase 4: Backend MVP] ..................................
Semana 4: [Fase 4: Backend MVP (fin)] + [Fase 5: Frontend MVP] .
Semana 5: [Fase 5: Frontend MVP (fin)] + [Fase 6: E2E] ........
Semana 6: [Fase 6: E2E (fin)] ..................................
Semana 7: [Fase 7: V2] ........................................
Semana 8: [Fase 7: V3] ........................................
```

**Dependencias críticas:**
- Fase 2 depende de Fase 1.
- Fase 3 puede ejecutarse en paralelo con Fase 2.
- Fase 4 depende de Fase 2 y 3.
- Fase 5 depende de Fase 4 (endpoints backend listos).
- Fase 6 depende de Fase 4 y 5.
- Fase 7 depende de Fase 6.

---

## 6. Criterios de Aceptación por Fase

### Fase 1
- [ ] `pnpm install` y `pnpm dev` funcionan sin errores en backend y frontend.
- [ ] Flujos críticos (login, registro, crear experiencia, listar, favoritos, admin) pasan smoke test manual.
- [ ] No hay errores 404 causados por URLs duplicadas.

### Fase 2
- [ ] `AdminController` no importa repositorios directamente.
- [ ] Payloads inválidos responden 400 con mensaje claro.
- [ ] Logout invalida token inmediatamente (verificado con request post-logout).
- [ ] Eliminación de cuenta borra todo contenido asociado (verificado en BD).
- [ ] `index.ts` está dividido en `app.ts`, `routes.ts`, `container.ts`, `server.ts`.

### Fase 3
- [ ] `pnpm test` ejecuta y pasa al menos 10 tests en backend.
- [ ] `pnpm test` ejecuta y pasa al menos 5 tests en frontend.
- [ ] Cobertura reportada por Vitest es > 0 % y los reportes se generan.

### Fase 4
- [ ] Todos los endpoints MVP pendientes están implementados y documentados.
- [ ] Cada nuevo use case tiene test unitario que pasa.
- [ ] Cada nuevo controller tiene test de integración que pasa.
- [ ] Cobertura de backend ≥ 60 %.

### Fase 5
- [ ] Todos los componentes MVP pendientes están implementados.
- [ ] Cada nuevo componente tiene test unitario que pasa.
- [ ] Cada nuevo servicio/hook tiene test de integración que pasa.
- [ ] Cobertura de frontend ≥ 50 %.

### Fase 6
- [ ] Suite E2E ejecuta completa sin fallos en Chromium.
- [ ] Flujos críticos pasan en Firefox y WebKit.
- [ ] Reporte HTML de Playwright generado y revisado.

### Fase 7
- [ ] Funcionalidades V2 y V3 implementadas con pruebas.
- [ ] Documentación actualizada (ADR si aplica).

---

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Corrección de dependencias del backend rompe otros paquetes | Media | Alto | Actualizar de a una dependencia, correr `pnpm dev` y smoke tests entre cada cambio. |
| Refactorización de `index.ts` introduce regresiones | Media | Alto | Mantener copia del `index.ts` original durante la refactorización. Escribir test de integración del servidor antes de refactorizar. |
| Tests E2E son flaky por timing de red | Alta | Medio | Usar `await expect(...).toBeVisible({ timeout: 10000 })`. Configurar retries en Playwright. |
| Falta de datos en BD de test causa tests condicionales | Alta | Medio | Usar seeds de BD (script `pnpm db:seed`) que inserta usuarios, experiencias y respuestas de prueba antes de correr E2E. |
| Acoplamiento frontend-backend retrasa Fase 5 | Media | Medio | Definir contratos API (OpenAPI/Swagger) en Fase 4 para que frontend pueda usar mocks (MSW) mientras backend termina. |

---

## 8. Documentación Asociada

Este plan se complementa con los siguientes documentos ubicados en `docs/guides/mvc-implementation/`:

| Documento | Contenido |
|---|---|
| `Plan de Prueba - Unit-Integration - Autenticacion y Sesiones - 18-07-2026.md` | Tests detallados para login, registro, logout, JWT, sesiones, intentos fallidos. |
| `Plan de Prueba - Unit-Integration - Gestion de Usuarios - 18-07-2026.md` | Tests para perfil, edición, foto, eliminación, estadísticas, privacidad. |
| `Plan de Prueba - Unit-Integration - Gestion de Experiencias - 18-07-2026.md` | Tests para CRUD, borradores, publicación, búsqueda, paginación, relacionadas. |
| `Plan de Prueba - Unit-Integration - Interaccion Social - 18-07-2026.md` | Tests para respuestas, reacciones, favoritos, etiquetas, seguimiento, bloqueo. |
| `Plan de Prueba - Unit-Integration - Administracion del Sistema - 18-07-2026.md` | Tests para gestión de usuarios, roles, suspensión, auditoría, página dedicada. |
| `Plan de Prueba - Unit-Integration - Moderacion y Seguridad - 18-07-2026.md` | Tests para reportes, lista negra, ocultar contenido, rate limiting. |

---

> **Fin del Plan de Implementación MVC.**
