# Plan de Prueba - Unit-Integration - Gestion de Usuarios - 18-07-2026

> **Módulo:** Gestión de Usuarios (CU-02)
> **Fecha:** 18 de julio de 2026
> **Referencia:** Plan Implementacion - MVC - 18-07-2026.md, Fases 3–6
> **Frameworks:** Vitest (unit), Supertest (integration), Playwright (E2E)

---

## 1. Alcance

Este plan cubre las pruebas del módulo de gestión de usuarios, incluyendo:
- Perfil propio (lectura, edición, foto)
- Perfil público de otros usuarios (con privacidad)
- Eliminación de cuenta propia con cascada de contenido
- Estadísticas del usuario (experiencias publicadas, me gusta recibidos)
- Configuración de privacidad (perfil público/privado)
- Listado de experiencias de un usuario específico

---

## 2. Estrategia de Testing

| Tipo | Herramienta | Entorno | Enfoque |
|---|---|---|---|
| **Unitarias** | Vitest | Node.js | Entidad `Usuario`, use cases (`GetPerfilUseCase`, `EditarPerfilUseCase`, `EliminarCuentaUseCase`, `GetEstadisticasUseCase`), mappers. |
| **Integración** | Vitest + Supertest | Node.js + TypeORM (BD test) | Endpoints: `GET /api/usuarios/me`, `PUT /api/usuarios/me/perfil`, `PUT /api/usuarios/me/foto`, `DELETE /api/usuarios/me`, `GET /api/usuarios/:id`, `GET /api/usuarios/:id/estadisticas`, `GET /api/usuarios/:id/experiencias`. |
| **E2E** | Playwright | Navegador | Flujo: editar perfil → cambiar foto → ver perfil público → eliminar cuenta. |

---

## 3. Pruebas Unitarias

### 3.1 Entidad de Dominio

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UU-01 | `Usuario.debe-editar-perfil` | Actualización de datos | `usuario.editarPerfil({ nombre: 'Nuevo', biografia: 'Bio', privado: true })` | `nombre === 'Nuevo'`, `biografia === 'Bio'`, `privado === true` |
| UU-02 | `Usuario.debe-rechazar-email-duplicado-al-editar` | Validación de unicidad | Email que ya pertenece a otro usuario | Lanza `ConflictException` |
| UU-03 | `Usuario.debe-eliminar-sesiones-activas-al-borrar-cuenta` | Invalidación de sesiones | `usuario.eliminarCuenta()` | Todas las sesiones del usuario marcadas para eliminación |
| UU-04 | `Usuario.debe-marcar-como-privado` | Configuración de privacidad | `usuario.setPrivado(true)` | `privado === true` |
| UU-05 | `Usuario.debe-marcar-como-publico` | Configuración de privacidad | `usuario.setPrivado(false)` | `privado === false` |

### 3.2 Use Cases

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UUC-01 | `GetPerfilUseCase.debe-retornar-perfil-propio` | Perfil del requester | `usuarioId === requesterId` | Perfil completo con email y configuración |
| UUC-02 | `GetPerfilUseCase.debe-retornar-perfil-publico` | Perfil de otro usuario público | `usuarioId !== requesterId`, `privado === false` | Perfil público (nombre, foto, bio, experiencias) |
| UUC-03 | `GetPerfilUseCase.debe-rechazar-perfil-privado` | Perfil privado de otro | `usuarioId !== requesterId`, `privado === true` | Lanza `ForbiddenException` (403) |
| UUC-04 | `EditarPerfilUseCase.debe-actualizar-campos` | Edición exitosa | `{ nombre, biografia, privado }` | Usuario actualizado en repositorio |
| UUC-05 | `EditarPerfilUseCase.debe-rechazar-nombre-vacio` | Validación | `{ nombre: '' }` | Lanza `ValidationException` (400) |
| UUC-06 | `EditarFotoPerfilUseCase.debe-actualizar-url` | Foto nueva | `{ fotoUrl: 'https://.../foto.jpg' }` | `fotoUrl` actualizada |
| UUC-07 | `EliminarCuentaUseCase.debe-eliminar-usuario` | Borrado lógico/físico | `usuarioId` autenticado | Usuario eliminado de BD |
| UUC-08 | `EliminarCuentaUseCase.debe-eliminar-contenido-asociado` | Cascada | `usuarioId` con experiencias, respuestas, favoritos | Todo contenido del usuario eliminado |
| UUC-09 | `EliminarCuentaUseCase.debe-eliminar-sesiones` | Invalidación | `usuarioId` con sesiones activas | Sesiones eliminadas |
| UUC-10 | `GetEstadisticasUseCase.debe-contar-experiencias` | Métrica | `usuarioId` con 3 experiencias | `{ totalExperiencias: 3 }` |
| UUC-11 | `GetEstadisticasUseCase.debe-contar-me-gusta` | Métrica | `usuarioId` con experiencias que suman 10 reacciones | `{ totalMeGusta: 10 }` |

---

## 4. Pruebas de Integración

| # | Nombre del test | Método | Ruta | Auth | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| I-01 | `GET /api/usuarios/me - perfil-propio` | GET | `/api/usuarios/me` | Sí (user) | — | 200 | `data.email`, `data.nombre`, `data.rol` presentes |
| I-02 | `GET /api/usuarios/me - sin-auth` | GET | `/api/usuarios/me` | No | — | 401 | `errorCode: 'TOKEN_FALTANTE'` |
| I-03 | `PUT /api/usuarios/me/perfil - editar-ok` | PUT | `/api/usuarios/me/perfil` | Sí | `{ nombre, biografia, privado }` | 200 | `data.nombre === nuevoNombre` |
| I-04 | `PUT /api/usuarios/me/perfil - nombre-vacio` | PUT | `/api/usuarios/me/perfil` | Sí | `{ nombre: '' }` | 400 | `errorCode: 'VALIDACION_FALLIDA'` |
| I-05 | `PUT /api/usuarios/me/foto - actualizar` | PUT | `/api/usuarios/me/foto` | Sí | `{ fotoUrl: 'https://...' }` | 200 | `data.fotoUrl === 'https://...'` |
| I-06 | `DELETE /api/usuarios/me - eliminar` | DELETE | `/api/usuarios/me` | Sí | — | 200 | Usuario ya no existe en BD |
| I-07 | `DELETE /api/usuarios/me - cascada` | DELETE | `/api/usuarios/me` | Sí | — | 200 | Experiencias, respuestas, favoritos del usuario eliminados de BD |
| I-08 | `GET /api/usuarios/:id - perfil-publico` | GET | `/api/usuarios/{idPublico}` | No | — | 200 | `data.nombre`, `data.biografia`, `data.experiencias` visibles |
| I-09 | `GET /api/usuarios/:id - perfil-privado` | GET | `/api/usuarios/{idPrivado}` | No (o user diferente) | — | 403 | `errorCode: 'PERFIL_PRIVADO'` |
| I-10 | `GET /api/usuarios/:id/estadisticas - metricas` | GET | `/api/usuarios/{id}/estadisticas` | No | — | 200 | `data.totalExperiencias`, `data.totalMeGusta` son números ≥ 0 |
| I-11 | `GET /api/usuarios/:id/experiencias - listado` | GET | `/api/usuarios/{id}/experiencias` | No | — | 200 | Array paginado de experiencias del usuario |
| I-12 | `GET /api/usuarios/:id - usuario-inexistente` | GET | `/api/usuarios/fake-uuid` | No | — | 404 | `errorCode: 'USUARIO_NO_ENCONTRADO'` |

---

## 5. Pruebas E2E (Playwright)

| # | Nombre del test | Pasos | Criterio de aceptación |
|---|---|---|---|
| EE-01 | `Flujo-editar-perfil` | 1. Login. 2. Navegar a `/perfil/editar`. 3. Cambiar nombre y biografía. 4. Guardar. 5. Ir a `/perfil/:id`. | Perfil muestra datos actualizados. Toast de éxito visible. |
| EE-02 | `Flujo-cambiar-foto` | 1. Login. 2. Editar perfil. 3. Ingresar URL de imagen. 4. Guardar. | Imagen de perfil se actualiza en Navbar y en perfil público. |
| EE-03 | `Flujo-privacidad-perfil` | 1. Login como User A. 2. Set perfil privado. 3. Logout. 4. Login como User B. 5. Ir a perfil de User A. | Página muestra mensaje "Perfil privado" (403). No se ven datos personales. |
| EE-04 | `Flujo-ver-perfil-publico` | 1. Login. 2. Crear experiencia. 3. Logout. 4. Navegar a perfil del autor sin autenticación. | Perfil público visible con nombre, bio y listado de experiencias. |
| EE-05 | `Flujo-eliminar-cuenta` | 1. Login. 2. Crear experiencia. 3. Ir a editar perfil. 4. Click "Eliminar cuenta". 5. Confirmar. 6. Intentar login con credenciales anteriores. | Cuenta eliminada. Experiencia asociada desaparece del listado público. Login devuelve 401. |
| EE-06 | `Flujo-estadisticas-en-perfil` | 1. Login. 2. Publicar 2 experiencias. 3. Otro usuario da me gusta a una. 4. Ir a perfil propio. | Estadísticas muestran "2 experiencias", "1 me gusta". |

---

## 6. Fixtures y Mocks

### 6.1 Backend Fixtures

```typescript
export const perfilUpdatePayload = {
  nombre: 'Nombre Actualizado',
  biografia: 'Desarrollador apasionado por la ética.',
  privado: false,
};

export const fotoUrlValida = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d';
```

### 6.2 Mocks de repositorio (Unit)

```typescript
// Mock de IUsuarioRepository para tests unitarios de use cases
const mockUsuarioRepo = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};
```

---

## 7. Criterios de Aceptación del Módulo

- [ ] **100 % tests unitarios de `Usuario` domain entity pasan.**
- [ ] **100 % tests unitarios de use cases de usuarios pasan.**
- [ ] **100 % tests de integración de endpoints de usuarios pasan.**
- [ ] **Todos los tests E2E de perfil y cuenta pasan en Chromium.**
- [ ] **Cobertura mínima:** backend 75 %, frontend 65 %.
- [ ] **No hay datos huérfanos** después de eliminar una cuenta (verificado con query directa a BD).

---

> **Fin del Plan de Prueba — Gestión de Usuarios.**
