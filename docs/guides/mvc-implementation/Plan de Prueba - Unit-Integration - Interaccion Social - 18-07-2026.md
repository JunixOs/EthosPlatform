# Plan de Prueba - Unit-Integration - Interaccion Social - 18-07-2026

> **Módulo:** Interacción Social (CU-04, CU-05)
> **Submódulos:** Respuestas, Reacciones, Favoritos, Etiquetas, Seguimiento, Bloqueo
> **Fecha:** 18 de julio de 2026
> **Referencia:** Plan Implementacion - MVC - 18-07-2026.md, Fases 3–7
> **Frameworks:** Vitest (unit), Supertest (integration), Playwright (E2E)

---

## 1. Alcance

Este plan cubre las pruebas de todos los submódulos de interacción social:
- **Respuestas:** Comentarios de un nivel a experiencias (R05)
- **Reacciones:** Toggle "me gusta" con conteo (R29, R30)
- **Favoritos:** Guardar/quitar experiencias (R49)
- **Etiquetas:** Asociar máximo 5 etiquetas por experiencia, búsqueda por etiqueta (R41, R42, R51, R54)
- **Seguimiento:** Follow/unfollow de usuarios (V2)
- **Bloqueo:** Bloquear/desbloquear usuarios (V2)

---

## 2. Estrategia de Testing

| Tipo | Herramienta | Enfoque |
|---|---|---|
| **Unitarias** | Vitest | Entidades `Respuesta`, `Reaccion`, `Favorito`, `Etiqueta`, `Seguimiento`, `Bloqueo`; use cases; reglas (`LimiteEtiquetasRule`). |
| **Integración** | Vitest + Supertest | Endpoints de cada submódulo con BD test. |
| **E2E** | Playwright | Flujos de usuario: comentar, dar me gusta, guardar favorito, seguir, bloquear. |

---

## 3. Pruebas Unitarias

### 3.1 Submódulo Respuestas

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UR-01 | `Respuesta.debe-crear-con-texto` | Instanciación | `{ texto: 'Comentario', experienciaId, usuarioId }` | Instancia válida |
| UR-02 | `Respuesta.debe-rechazar-texto-vacio` | Validación | `{ texto: '' }` | Lanza `DomainException` |
| UR-03 | `Respuesta.debe-rechazar-texto-largo` | Validación | `{ texto: 'a'.repeat(2001) }` | Lanza `DomainException` (máx. 2000 chars) |
| UR-04 | `CrearRespuestaUseCase.debe-crear-respuesta` | Creación | Datos válidos | Respuesta persistida |
| UR-05 | `CrearRespuestaUseCase.debe-rechazar-experiencia-inexistente` | FK | `experienciaId` inexistente | Lanza `NotFoundException` |
| UR-06 | `ListarRespuestasUseCase.debe-ordenar-por-fecha` | Listado | `experienciaId` con 3 respuestas | Orden descendente (más reciente primero) |
| UR-07 | `EliminarRespuestaUseCase.debe-permitir-autor` | Autoría | Usuario autor | Eliminación exitosa |
| UR-08 | `EliminarRespuestaUseCase.debe-permitir-admin` | Rol | Admin | Eliminación exitosa |
| UR-09 | `EliminarRespuestaUseCase.debe-rechazar-ajeno` | Autoría | Usuario no autor | Lanza `ForbiddenException` |

### 3.2 Submódulo Reacciones

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| URE-01 | `Reaccion.debe-toggle-agregar` | Primera reacción | `{ experienciaId, usuarioId }` | `agregado: true`, `total: 1` |
| URE-02 | `Reaccion.debe-toggle-quitar` | Segunda reacción (toggle off) | Misma reacción | `agregado: false`, `total: 0` |
| URE-03 | `ToggleReaccionUseCase.debe-contar-correctamente` | Agregación | 3 usuarios reaccionan | `total: 3` |
| URE-04 | `ToggleReaccionUseCase.debe-rechazar-experiencia-inexistente` | FK | `experienciaId` inexistente | Lanza `NotFoundException` |
| URE-05 | `ContarReaccionesUseCase.debe-retornar-numero` | Consulta | `experienciaId` | Número exacto de reacciones |

### 3.3 Submódulo Favoritos

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UF-01 | `Favorito.debe-crear` | Instanciación | `{ usuarioId, experienciaId }` | Instancia válida |
| UF-02 | `ToggleFavoritoUseCase.debe-agregar` | Primera vez | `{ usuarioId, experienciaId }` | `esFavorito: true` |
| UF-03 | `ToggleFavoritoUseCase.debe-quitar` | Segunda vez | Mismos IDs | `esFavorito: false` |
| UF-04 | `ListarFavoritosUseCase.debe-paginar` | Listado | `usuarioId, page=1, limit=10` | Array paginado de experiencias favoritas |
| UF-05 | `ListarFavoritosUseCase.debe-optimizar-consulta` | N+1 | 10 favoritos | Máximo 2 queries (1 favoritos + 1 experiencias por lote) |

### 3.4 Submódulo Etiquetas

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UET-01 | `Etiqueta.debe-crear-con-nombre` | Instanciación | `{ nombre: 'Ética' }` | Instancia válida, slug auto-generado |
| UET-02 | `LimiteEtiquetasRule.debe-aceptar-5` | Límite | Array de 5 etiquetas | `true` |
| UET-03 | `LimiteEtiquetasRule.debe-rechazar-6` | Límite | Array de 6 etiquetas | Lanza `ValidationException` |
| UET-04 | `AsociarEtiquetasUseCase.debe-asociar-nuevas` | Creación | `['Ética', 'Moral']` | Etiquetas creadas si no existen, asociadas a experiencia |
| UET-05 | `AsociarEtiquetasUseCase.debe-reutilizar-existentes` | Reutilización | `['Ética']` (ya existe) | Reusa ID existente, no duplica |
| UET-06 | `BuscarPorEtiquetaUseCase.debe-filtrar` | Búsqueda | `slug='etica'` | Experiencias que tienen esa etiqueta |

### 3.5 Submódulo Seguimiento (V2)

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| US-01 | `Seguimiento.debe-crear` | Follow | `{ seguidorId, seguidoId }` | Instancia válida |
| US-02 | `Seguimiento.debe-rechazar-autoseguimiento` | Validación | `seguidorId === seguidoId` | Lanza `DomainException` |
| US-03 | `SeguirUsuarioUseCase.debe-toggle` | Follow/unfollow | Primer follow → true, segundo → false | Toggle idempotente |
| US-04 | `ListarSeguidoresUseCase.debe-contar` | Métrica | `usuarioId` | Número de seguidores |

### 3.6 Submódulo Bloqueo (V2)

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UB-01 | `Bloqueo.debe-crear` | Block | `{ bloqueadorId, bloqueadoId }` | Instancia válida |
| UB-02 | `Bloqueo.debe-rechazar-autobloqueo` | Validación | `bloqueadorId === bloqueadoId` | Lanza `DomainException` |
| UB-03 | `BloquearUsuarioUseCase.debe-ocultar-contenido` | Efecto | `bloqueadorId` bloquea autor | Feed del bloqueador no muestra contenido del bloqueado |

---

## 4. Pruebas de Integración

### 4.1 Respuestas

| # | Nombre | Método | Ruta | Auth | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| IR-01 | `POST /api/experiencias/:id/respuestas - crear` | POST | `/api/experiencias/{id}/respuestas` | Sí | `{ texto: 'Comentario' }` | 201 | `data.texto === 'Comentario'` |
| IR-02 | `POST /api/experiencias/:id/respuestas - texto-vacio` | POST | `/api/experiencias/{id}/respuestas` | Sí | `{ texto: '' }` | 400 | `errorCode: 'VALIDACION_FALLIDA'` |
| IR-03 | `GET /api/experiencias/:id/respuestas - listar` | GET | `/api/experiencias/{id}/respuestas` | No | — | 200 | Array ordenado por fecha desc |
| IR-04 | `DELETE /api/respuestas/:id - autor` | DELETE | `/api/respuestas/{id}` | Sí (autor) | — | 200 | Respuesta eliminada |
| IR-05 | `DELETE /api/respuestas/:id - ajeno` | DELETE | `/api/respuestas/{id}` | Sí (no autor) | — | 403 | `errorCode: 'PERMISO_DENEGADO'` |

### 4.2 Reacciones

| # | Nombre | Método | Ruta | Auth | Código | Validación |
|---|---|---|---|---|---|---|
| IRE-01 | `POST /api/experiencias/:id/reacciones - toggle-on` | POST | `/api/experiencias/{id}/reacciones` | Sí | 200 | `data.agregado: true, data.total: N+1` |
| IRE-02 | `POST /api/experiencias/:id/reacciones - toggle-off` | POST | Misma ruta | Sí | 200 | `data.agregado: false, data.total: N-1` |
| IRE-03 | `GET /api/experiencias/:id/reacciones - conteo` | GET | `/api/experiencias/{id}/reacciones` | No | 200 | `data.total` = número exacto |

### 4.3 Favoritos

| # | Nombre | Método | Ruta | Auth | Código | Validación |
|---|---|---|---|---|---|---|
| IF-01 | `POST /api/favoritos/:experienciaId - toggle-on` | POST | `/api/favoritos/{id}` | Sí | 200 | `data.esFavorito: true` |
| IF-02 | `POST /api/favoritos/:experienciaId - toggle-off` | POST | Misma ruta | Sí | 200 | `data.esFavorito: false` |
| IF-03 | `GET /api/favoritos/mios - listar` | GET | `/api/favoritos/mios?page=1` | Sí | 200 | Array paginado de experiencias |
| IF-04 | `GET /api/favoritos/mios - sin-auth` | GET | `/api/favoritos/mios` | No | 401 | `errorCode: 'TOKEN_FALTANTE'` |

### 4.4 Etiquetas

| # | Nombre | Método | Ruta | Auth | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| IET-01 | `POST /api/experiencias/:id/etiquetas - asociar` | POST | `/api/experiencias/{id}/etiquetas` | Sí (autor) | `['Ética', 'Moral', 'Filosofía']` | 200 | 3 etiquetas asociadas |
| IET-02 | `POST /api/experiencias/:id/etiquetas - limite-6` | POST | `/api/experiencias/{id}/etiquetas` | Sí | 6 etiquetas | 400 | `errorCode: 'LIMITE_ETIQUETAS_EXCEDIDO'` |
| IET-03 | `GET /api/etiquetas - listar` | GET | `/api/etiquetas` | No | — | 200 | Array de etiquetas únicas |
| IET-04 | `GET /api/experiencias?etiqueta=etica - filtrar` | GET | `/api/experiencias?etiqueta=etica` | No | — | 200 | Solo experiencias con esa etiqueta |

### 4.5 Seguimiento (V2)

| # | Nombre | Método | Ruta | Auth | Código | Validación |
|---|---|---|---|---|---|---|
| IS-01 | `POST /api/usuarios/:id/seguir - toggle` | POST | `/api/usuarios/{id}/seguir` | Sí | 200 | `data.siguiendo: true/false` |
| IS-02 | `GET /api/usuarios/:id/seguidores - conteo` | GET | `/api/usuarios/{id}/seguidores` | No | 200 | `data.total` número |

### 4.6 Bloqueo (V2)

| # | Nombre | Método | Ruta | Auth | Código | Validación |
|---|---|---|---|---|---|---|
| IB-01 | `POST /api/usuarios/:id/bloquear - toggle` | POST | `/api/usuarios/{id}/bloquear` | Sí | 200 | `data.bloqueado: true/false` |
| IB-02 | `GET /api/feed - sin-bloqueados` | GET | `/api/feed` | Sí | 200 | No contiene experiencias de usuarios bloqueados |

---

## 5. Pruebas E2E (Playwright)

| # | Nombre | Pasos | Criterio |
|---|---|---|---|
| EE-01 | `Flujo-respuesta` | 1. Login. 2. Ir a experiencia pública. 3. Escribir respuesta. 4. Enviar. | Respuesta aparece en listado. Contador incrementa. |
| EE-02 | `Flujo-reaccion` | 1. Ir a experiencia. 2. Click "Me gusta". 3. Ver contador. 4. Click de nuevo. | Contador sube y baja. Estado visual cambia. |
| EE-03 | `Flujo-favorito` | 1. Login. 2. Click corazón en experiencia. 3. Ir a `/favoritos`. | Experiencia aparece en favoritos. |
| EE-04 | `Flujo-etiquetas` | 1. Login. 2. Crear experiencia con 3 tags. 3. Ir a detalle. 4. Click en tag. | Navega a búsqueda filtrada por tag. Resultados correctos. |
| EE-05 | `Flujo-etiquetas-limite` | 1. Login. 2. Intentar agregar 6 tags. | Input bloquea o muestra error "Máximo 5 etiquetas". |
| EE-06 | `Flujo-seguir` (V2) | 1. Login. 2. Ir a perfil de otro usuario. 3. Click "Seguir". | Botón cambia a "Siguiendo". Contador de seguidores incrementa. |
| EE-07 | `Flujo-bloquear` (V2) | 1. Login. 2. Ir a perfil. 3. Click "Bloquear". 4. Ir a feed. | No aparecen experiencias del usuario bloqueado. |

---

## 6. Criterios de Aceptación del Módulo

- [ ] **100 % tests unitarios** de todas las entidades de interacción social pasan.
- [ ] **100 % tests de integración** de todos los endpoints pasan.
- [ ] **N+1 query eliminado** en favoritos (verificado con query logging).
- [ ] **Límite de 5 etiquetas** funciona en backend y frontend.
- [ ] **Toggle de reacciones** es idempotente (no duplica registros).
- [ ] **Cobertura mínima:** backend 70 %, frontend 60 %.

---

> **Fin del Plan de Prueba — Interacción Social.**
