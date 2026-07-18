# Plan de Prueba - Unit-Integration - Gestion de Experiencias - 18-07-2026

> **Módulo:** Gestión de Experiencias (CU-03)
> **Fecha:** 18 de julio de 2026
> **Referencia:** Plan Implementacion - MVC - 18-07-2026.md, Fases 3–6
> **Frameworks:** Vitest (unit), Supertest (integration), Playwright (E2E)

---

## 1. Alcance

Este plan cubre las pruebas del módulo de gestión de experiencias, incluyendo:
- CRUD completo de experiencias (crear, leer, actualizar, eliminar)
- Estados de experiencia: BORRADOR, PUBLICADA, ARCHIVADA
- Campos reflexivos obligatorios: "¿Qué dice la moral?" y "¿Qué dice tu ética?"
- Borradores automáticos y guardado manual
- Publicación y vista previa
- Búsqueda por palabras clave y filtrado
- Paginación (10 por página)
- Ordenamiento por fecha y popularidad
- Experiencias relacionadas
- Cascada de eliminación de respuestas al borrar experiencia
- Validación de unicidad de título (si se proporciona)

---

## 2. Estrategia de Testing

| Tipo | Herramienta | Entorno | Enfoque |
|---|---|---|---|
| **Unitarias** | Vitest | Node.js | Entidad `Experiencia`, use cases (`CreateExperienciaUseCase`, `EditExperienciaUseCase`, `DeleteExperienciaUseCase`, `PublishExperienciaUseCase`, `ListExperienciasUseCase`, `BuscarExperienciasUseCase`), reglas de dominio (`UnicidadTituloRule`), mappers. |
| **Integración** | Vitest + Supertest | Node.js + TypeORM (BD test) | Endpoints: `POST /api/experiencias`, `GET /api/experiencias`, `GET /api/experiencias/:id`, `PUT /api/experiencias/:id`, `DELETE /api/experiencias/:id`, `PATCH /api/experiencias/:id/publicar`, `GET /api/experiencias/buscar`, `GET /api/experiencias/:id/relacionadas`. |
| **E2E** | Playwright | Navegador | Flujo completo: crear borrador → editar → vista previa → publicar → buscar → eliminar. |

---

## 3. Pruebas Unitarias

### 3.1 Entidad de Dominio

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UE-01 | `Experiencia.debe-crear-en-estado-borrador` | Estado inicial | `new Experiencia({ titulo, descripcion, moral, etica, usuarioId })` | `estado === EstadoExperiencia.BORRADOR` |
| UE-02 | `Experiencia.debe-publicar-con-campos-completos` | Transición a publicada | `experiencia.publicar()` con título, descripción, moral, ética | `estado === EstadoExperiencia.PUBLICADA` |
| UE-03 | `Experiencia.debe-rechazar-publicar-sin-titulo` | Validación | `experiencia.publicar()` sin título | Lanza `DomainException` |
| UE-04 | `Experiencia.debe-rechazar-publicar-sin-descripcion` | Validación | `experiencia.publicar()` sin descripción | Lanza `DomainException` |
| UE-05 | `Experiencia.debe-rechazar-publicar-sin-moral` | Campo reflexivo obligatorio | `experiencia.publicar()` sin moral | Lanza `DomainException` |
| UE-06 | `Experiencia.debe-rechazar-publicar-sin-etica` | Campo reflexivo obligatorio | `experiencia.publicar()` sin ética | Lanza `DomainException` |
| UE-07 | `Experiencia.debe-editar-campos` | Actualización | `experiencia.editar({ titulo: 'Nuevo', descripcion: 'Nueva desc' })` | Campos actualizados, `fechaModificacion` actualizada |
| UE-08 | `Experiencia.debe-archivar` | Transición | `experiencia.archivar()` | `estado === EstadoExperiencia.ARCHIVADA` |
| UE-09 | `Experiencia.debe-validar-titulo-unico` | Regla de negocio | `experiencia` con título que ya existe | Lanza `ConflictException` si título duplicado |
| UE-10 | `Experiencia.debe-permitir-titulo-null` | Opcionalidad | `new Experiencia({ titulo: null })` | Creada sin error |

### 3.2 Reglas de Dominio

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UR-01 | `UnicidadTituloRule.debe-validar-titulo-nuevo` | Título no existe | `titulo: 'Nuevo Título'` | `true` |
| UR-02 | `UnicidadTituloRule.debe-rechazar-titulo-duplicado` | Título ya usado | `titulo: 'Título Existente'` | Lanza `ConflictException` |
| UR-03 | `UnicidadTituloRule.debe-ignorar-null` | Título omitido | `titulo: null` | `true` (no validar) |

### 3.3 Use Cases

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UUC-01 | `CreateExperienciaUseCase.debe-crear-borrador` | Creación inicial | `{ titulo, descripcion, moral, etica, publicar: false }` | `Experiencia` en estado BORRADOR |
| UUC-02 | `CreateExperienciaUseCase.debe-crear-y-publicar` | Creación directa | `{ titulo, descripcion, moral, etica, publicar: true }` | `Experiencia` en estado PUBLICADA |
| UUC-03 | `CreateExperienciaUseCase.debe-rechazar-titulo-duplicado` | Validación | `{ titulo: 'Existente' }` | Lanza `ConflictException` |
| UUC-04 | `EditExperienciaUseCase.debe-editar-propio` | Autoría | Usuario autor edita su experiencia | Campos actualizados |
| UUC-05 | `EditExperienciaUseCase.debe-rechazar-editar-ajeno` | Autoría | Usuario no autor intenta editar | Lanza `ForbiddenException` (403) |
| UUC-06 | `DeleteExperienciaUseCase.debe-eliminar-propio` | Autoría | Usuario autor elimina | Eliminada de BD |
| UUC-07 | `DeleteExperienciaUseCase.debe-permitir-admin-eliminar` | Rol admin | Admin elimina experiencia ajena | Eliminada de BD |
| UUC-08 | `DeleteExperienciaUseCase.debe-eliminar-respuestas-en-cascada` | Cascada | Experiencia con 3 respuestas | Respuestas también eliminadas |
| UUC-09 | `PublishExperienciaUseCase.debe-publicar-borrador` | Transición | `experiencia.estado === BORRADOR` | `estado === PUBLICADA` |
| UUC-10 | `PublishExperienciaUseCase.debe-rechazar-sin-campos-obligatorios` | Validación | Borrador incompleto | Lanza `ValidationException` |
| UUC-11 | `ListExperienciasUseCase.debe-paginar` | Paginación | `page=1, limit=10` | Array de 10 elementos, `total` correcto |
| UUC-12 | `ListExperienciasUseCase.debe-ordenar-por-fecha` | Ordenamiento | `sort=date` | Primera experiencia = más reciente |
| UUC-13 | `ListExperienciasUseCase.debe-ordenar-por-popularidad` | Ordenamiento | `sort=popularity` | Primera = más reacciones |
| UUC-14 | `BuscarExperienciasUseCase.debe-buscar-por-titulo` | Búsqueda | `q='ética'` | Resultados que contienen 'ética' en título o descripción |
| UUC-15 | `BuscarExperienciasUseCase.debe-ser-case-insensitive` | Búsqueda | `q='ÉTICA'` | Mismos resultados que `q='ética'` |
| UUC-16 | `GetRelacionadasUseCase.debe-retornar-recientes` | Relación | `experienciaId` | Lista de experiencias recientes del mismo autor |

---

## 4. Pruebas de Integración

| # | Nombre del test | Método | Ruta | Auth | Body / Query | Código | Validación |
|---|---|---|---|---|---|---|---|
| I-01 | `POST /api/experiencias - crear-borrador` | POST | `/api/experiencias` | Sí | `{ titulo, descripcion, moral, etica, publicar: false }` | 201 | `data.estado === 'BORRADOR'` |
| I-02 | `POST /api/experiencias - crear-publicar` | POST | `/api/experiencias` | Sí | `{ titulo, descripcion, moral, etica, publicar: true }` | 201 | `data.estado === 'PUBLICADA'` |
| I-03 | `POST /api/experiencias - titulo-duplicado` | POST | `/api/experiencias` | Sí | Título ya existente | 409 | `errorCode: 'TITULO_DUPLICADO'` |
| I-04 | `POST /api/experiencias - sin-auth` | POST | `/api/experiencias` | No | Cualquier body | 401 | `errorCode: 'TOKEN_FALTANTE'` |
| I-05 | `POST /api/experiencias - campos-reflexivos-vacios` | POST | `/api/experiencias` | Sí | `{ moral: '', etica: '' }` | 400 | `errorCode: 'VALIDACION_FALLIDA'` |
| I-06 | `GET /api/experiencias - listado-publico` | GET | `/api/experiencias` | No | — | 200 | Array de solo PUBLICADAS, paginado (10) |
| I-07 | `GET /api/experiencias - orden-popularidad` | GET | `/api/experiencias?sort=popularity` | No | — | 200 | Primera tiene más reacciones |
| I-08 | `GET /api/experiencias/:id - detalle-publico` | GET | `/api/experiencias/{idPublico}` | No | — | 200 | `data.titulo`, `data.descripcion`, `data.moral`, `data.etica` presentes |
| I-09 | `GET /api/experiencias/:id/preview - borrador-propio` | GET | `/api/experiencias/{idBorrador}/preview` | Sí (autor) | — | 200 | Detalle del borrador visible |
| I-10 | `GET /api/experiencias/:id/preview - borrador-ajeno` | GET | `/api/experiencias/{idBorrador}/preview` | Sí (no autor) | — | 403 | `errorCode: 'PERMISO_DENEGADO'` |
| I-11 | `PUT /api/experiencias/:id - editar-propio` | PUT | `/api/experiencias/{id}` | Sí (autor) | `{ descripcion: 'Nueva' }` | 200 | `data.descripcion === 'Nueva'` |
| I-12 | `PUT /api/experiencias/:id - editar-ajeno` | PUT | `/api/experiencias/{id}` | Sí (no autor) | `{ descripcion: 'Nueva' }` | 403 | `errorCode: 'PERMISO_DENEGADO'` |
| I-13 | `DELETE /api/experiencias/:id - eliminar-propio` | DELETE | `/api/experiencias/{id}` | Sí (autor) | — | 200 | Experiencia no existe en BD |
| I-14 | `DELETE /api/experiencias/:id - cascada-respuestas` | DELETE | `/api/experiencias/{idConRespuestas}` | Sí (autor) | — | 200 | Respuestas asociadas tampoco existen |
| I-15 | `PATCH /api/experiencias/:id/publicar` | PATCH | `/api/experiencias/{idBorrador}` | Sí (autor) | — | 200 | `data.estado === 'PUBLICADA'` |
| I-16 | `GET /api/experiencias/buscar - query` | GET | `/api/experiencias/buscar?q=ética` | No | — | 200 | Resultados filtrados por 'ética' |
| I-17 | `GET /api/experiencias/:id/relacionadas` | GET | `/api/experiencias/{id}/relacionadas` | No | — | 200 | Array de experiencias relacionadas |

---

## 5. Pruebas E2E (Playwright)

| # | Nombre del test | Pasos | Criterio de aceptación |
|---|---|---|---|
| EE-01 | `Flujo-crear-borrador` | 1. Login. 2. Ir a `/experiencias/nueva`. 3. Completar título, descripción, moral, ética. 4. Click "Guardar borrador". | Experiencia aparece en "Mis borradores" (si existe sección). Estado = borrador. |
| EE-02 | `Flujo-publicar-experiencia` | 1. Login. 2. Crear borrador. 3. Ir a detalle del borrador. 4. Click "Publicar". | Estado cambia a "Publicada". Aparece en `/experiencias`. |
| EE-03 | `Flujo-editar-experiencia` | 1. Login. 2. Ir a experiencia propia. 3. Click "Editar". 4. Modificar descripción. 5. Guardar. | Cambios reflejados inmediatamente en detalle. |
| EE-04 | `Flujo-eliminar-experiencia` | 1. Login. 2. Ir a experiencia propia. 3. Click "Eliminar". 4. Confirmar en modal. | Experiencia desaparece del listado. Backend responde 200. |
| EE-05 | `Flujo-buscar-experiencia` | 1. Ir a `/buscar`. 2. Escribir "ética". 3. Enter. | Resultados mostrados contienen "ética" en título o descripción. |
| EE-06 | `Flujo-vista-previa` | 1. Login. 2. Ir a crear experiencia. 3. Completar campos. 4. Click "Vista previa". | Modal/página muestra experiencia renderizada como se verá públicamente, sin persistir. |
| EE-07 | `Flujo-experiencias-relacionadas` | 1. Ir a detalle de experiencia pública. 2. Scroll a "Relacionadas". | Se muestran 3–5 experiencias del mismo autor o recientes. |
| EE-08 | `Flujo-autosave-borrador` | 1. Login. 2. Ir a crear experiencia. 3. Escribir título. 4. Esperar 30s. 5. Recargar página. | Campos escritos se recuperan automáticamente. |
| EE-09 | `Flujo-campos-reflexivos-obligatorios` | 1. Login. 2. Ir a crear experiencia. 3. Dejar moral o ética vacía. 4. Intentar publicar. | Formulario muestra error en campo vacío. Botón "Publicar" deshabilitado o backend responde 400. |
| EE-10 | `Flujo-paginacion` | 1. Crear 12 experiencias. 2. Ir a `/experiencias`. | Primera página muestra 10. Botón "Siguiente" activo. Segunda página muestra 2 restantes. |

---

## 6. Fixtures y Mocks

### 6.1 Backend Fixtures

```typescript
export const experienciaValida = {
  titulo: 'Mi experiencia ética',
  descripcion: 'Descripción detallada de la experiencia.',
  moral: '¿Qué dice la moral sobre esto? Reflexión obligatoria.',
  etica: '¿Qué dice tu ética? Reflexión personal obligatoria.',
  publicar: false,
};

export const experienciaIncompleta = {
  titulo: 'Incompleta',
  descripcion: 'Solo descripción',
  moral: '',
  etica: '',
};
```

### 6.2 Mock de BD (Unit)

```typescript
// Para tests unitarios de use cases
const mockExperienciaRepo = {
  findById: vi.fn(),
  findByTitulo: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  findPublicadas: vi.fn(),
  buscar: vi.fn(),
};
```

---

## 7. Criterios de Aceptación del Módulo

- [ ] **100 % tests unitarios de `Experiencia` domain entity pasan.**
- [ ] **100 % tests unitarios de use cases de experiencias pasan.**
- [ ] **100 % tests de integración de endpoints de experiencias pasan.**
- [ ] **Todos los tests E2E de CRUD de experiencias pasan en Chromium.**
- [ ] **Cobertura mínima:** backend 75 %, frontend 65 %.
- [ ] **No hay experiencias huérfanas** después de eliminar usuario (verificado con query a BD).
- [ ] **Título duplicado** es rechazado con 409 tanto en create como en edit.

---

> **Fin del Plan de Prueba — Gestión de Experiencias.**
