# Plan de Prueba - Unit-Integration - Administracion del Sistema - 18-07-2026

> **Módulo:** Administración del Sistema (CU-06)
> **Fecha:** 18 de julio de 2026
> **Referencia:** Plan Implementacion - MVC - 18-07-2026.md, Fases 3–6
> **Frameworks:** Vitest (unit), Supertest (integration), Playwright (E2E)

---

## 1. Alcance

Este plan cubre las pruebas del módulo de administración, incluyendo:
- Gestión de usuarios (listar, editar, eliminar, asignar rol, suspender, reactivar)
- Panel de administración exclusivo para rol `admin`
- Log de auditoría de acciones administrativas (R60)
- Página dedicada al equipo de desarrollo editable por admin (R16–R20)
- Estadísticas y métricas del sistema

---

## 2. Estrategia de Testing

| Tipo | Herramienta | Enfoque |
|---|---|---|
| **Unitarias** | Vitest | Use cases administrativos (`EditarUsuarioAdminUseCase`, `EliminarUsuarioAdminUseCase`, `SuspenderUsuarioUseCase`, `AsignarRolUseCase`, `AuditoriaService`). |
| **Integración** | Vitest + Supertest | Endpoints bajo `/api/admin/*`, endpoints de auditoría, página dedicada. |
| **E2E** | Playwright | Flujo completo de administrador: login → panel → gestionar usuario → ver auditoría. |

---

## 3. Pruebas Unitarias

### 3.1 Use Cases Administrativos

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UA-01 | `ListarUsuariosAdminUseCase.debe-paginar` | Listado | `page=1, limit=10` | Array de usuarios con `total` |
| UA-02 | `ListarUsuariosAdminUseCase.debe-incluir-suspendidos` | Filtro | — | Usuarios suspendidos marcados con flag |
| UA-03 | `EditarUsuarioAdminUseCase.debe-editar-cualquier-usuario` | Admin privilege | `usuarioId` ajeno | Campos actualizados |
| UA-04 | `EditarUsuarioAdminUseCase.debe-rechazar-email-duplicado` | Validación | Email ya usado por otro | Lanza `ConflictException` |
| UA-05 | `EliminarUsuarioAdminUseCase.debe-eliminar-cualquier-cuenta` | Admin privilege | `usuarioId` ajeno | Usuario y contenido eliminados |
| UA-06 | `SuspenderUsuarioUseCase.debe-suspender-por-dias` | Suspensión | `{ dias: 7 }` | `suspendidoHasta = now + 7 días` |
| UA-07 | `SuspenderUsuarioUseCase.debe-invalidar-sesiones` | Efecto secundario | Suspender usuario activo | Todas sus sesiones eliminadas |
| UA-08 | `ReactivarUsuarioUseCase.debe-limpiar-suspension` | Reactivación | Usuario suspendido | `suspendidoHasta = null`, puede loguear |
| UA-09 | `AsignarRolUseCase.debe-cambiar-rol` | Rol | `{ rol: 'admin' }` | `rol` actualizado |
| UA-10 | `AsignarRolUseCase.debe-rechazar-rol-invalido` | Validación | `{ rol: 'superuser' }` | Lanza `ValidationException` |

### 3.2 Log de Auditoría

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UAU-01 | `AuditoriaService.debe-registrar-accion` | Registro | `{ adminId, accion: 'SUSPENDER', targetId }` | Fila en `AuditoriaORM` creada |
| UAU-02 | `AuditoriaService.debe-incluir-timestamp` | Timestamp | Cualquier acción | `createdAt` = fecha/hora actual |
| UAU-03 | `ObtenerAuditoriaUseCase.debe-filtrar-por-accion` | Consulta | `{ accion: 'ELIMINAR' }` | Solo registros de eliminación |
| UAU-04 | `ObtenerAuditoriaUseCase.debe-ordenar-por-fecha` | Orden | — | Más recientes primero |

### 3.3 Página Dedicada al Equipo

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UPE-01 | `ObtenerPaginaEquipoUseCase.debe-retornar-contenido` | Lectura pública | — | Objeto con título, descripción, miembros |
| UPE-02 | `EditarPaginaEquipoUseCase.debe-actualizar` | Admin privilege | `{ titulo, descripcion, miembros }` | Contenido actualizado |
| UPE-03 | `EditarPaginaEquipoUseCase.debe-rechazar-no-admin` | Autorización | Usuario sin rol admin | Lanza `ForbiddenException` |

---

## 4. Pruebas de Integración

### 4.1 Endpoints de Administración

| # | Nombre | Método | Ruta | Auth (rol) | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| I-01 | `GET /api/admin/usuarios - admin-ok` | GET | `/api/admin/usuarios` | Admin | — | 200 | Array paginado de todos los usuarios |
| I-02 | `GET /api/admin/usuarios - user-forbidden` | GET | `/api/admin/usuarios` | User | — | 403 | `errorCode: 'PERMISO_DENEGADO'` |
| I-03 | `GET /api/admin/usuarios - sin-auth` | GET | `/api/admin/usuarios` | No | — | 401 | `errorCode: 'TOKEN_FALTANTE'` |
| I-04 | `PUT /api/admin/usuarios/:id - editar` | PUT | `/api/admin/usuarios/{id}` | Admin | `{ nombre, email, rol }` | 200 | Datos actualizados |
| I-05 | `DELETE /api/admin/usuarios/:id - eliminar` | DELETE | `/api/admin/usuarios/{id}` | Admin | — | 200 | Usuario eliminado de BD |
| I-06 | `PATCH /api/admin/usuarios/:id/rol - asignar` | PATCH | `/api/admin/usuarios/{id}/rol` | Admin | `{ rol: 'admin' }` | 200 | `data.rol === 'admin'` |
| I-07 | `PATCH /api/admin/usuarios/:id/suspender - suspender` | PATCH | `/api/admin/usuarios/{id}/suspender` | Admin | `{ dias: 7 }` | 200 | `data.suspendidoHasta` definido |
| I-08 | `PATCH /api/admin/usuarios/:id/reactivar - reactivar` | PATCH | `/api/admin/usuarios/{id}/reactivar` | Admin | — | 200 | `data.suspendidoHasta === null` |
| I-09 | `PATCH /api/admin/usuarios/:id/suspender - no-admin` | PATCH | `/api/admin/usuarios/{id}/suspender` | User | — | 403 | `errorCode: 'PERMISO_DENEGADO'` |

### 4.2 Auditoría

| # | Nombre | Método | Ruta | Auth (rol) | Código | Validación |
|---|---|---|---|---|---|---|
| IA-01 | `GET /api/admin/auditoria - admin-ok` | GET | `/api/admin/auditoria` | Admin | 200 | Array de registros con `adminId`, `accion`, `targetId`, `timestamp` |
| IA-02 | `GET /api/admin/auditoria - user-forbidden` | GET | `/api/admin/auditoria` | User | 403 | `errorCode: 'PERMISO_DENEGADO'` |
| IA-03 | `GET /api/admin/auditoria - filtro-por-accion` | GET | `/api/admin/auditoria?accion=ELIMINAR` | Admin | 200 | Solo registros de eliminación |

### 4.3 Página Dedicada

| # | Nombre | Método | Ruta | Auth | Código | Validación |
|---|---|---|---|---|---|---|
| IPE-01 | `GET /api/pagina-equipo - publico` | GET | `/api/pagina-equipo` | No | 200 | `data.titulo`, `data.miembros` presentes |
| IPE-02 | `PUT /api/pagina-equipo - admin` | PUT | `/api/pagina-equipo` | Admin | 200 | Contenido actualizado en BD |
| IPE-03 | `PUT /api/pagina-equipo - user-forbidden` | PUT | `/api/pagina-equipo` | User | 403 | `errorCode: 'PERMISO_DENEGADO'` |

---

## 5. Pruebas E2E (Playwright)

| # | Nombre | Pasos | Criterio |
|---|---|---|---|
| EE-01 | `Flujo-admin-login-panel` | 1. Ir a `/login`. 2. Ingresar credenciales admin. 3. Verificar dropdown muestra "Panel Admin". 4. Click. 5. Verificar tabla de usuarios. | Panel carga. Tabla paginada visible. Botones de acción por fila. |
| EE-02 | `Flujo-admin-suspender-usuario` | 1. Login admin. 2. Ir a panel. 3. Click "Suspender" en usuario. 4. Ingresar 3 días. 5. Confirmar. 6. Login con usuario suspendido. | Usuario suspendido recibe mensaje de bloqueo. No puede acceder. |
| EE-03 | `Flujo-admin-reactivar-usuario` | 1. Login admin. 2. Ir a panel. 3. Click "Reactivar" en usuario suspendido. 4. Login con usuario reactivado. | Usuario puede loguear normalmente. |
| EE-04 | `Flujo-admin-eliminar-usuario` | 1. Login admin. 2. Ir a panel. 3. Click "Eliminar" en usuario. 4. Confirmar. | Usuario desaparece de tabla. Contenido del usuario ya no visible en público. |
| EE-05 | `Flujo-admin-cambiar-rol` | 1. Login admin. 2. Ir a panel. 3. Cambiar rol de user a admin. 4. Login con usuario promovido. | Dropdown muestra "Panel Admin". Puede acceder a `/admin/usuarios`. |
| EE-06 | `Flujo-admin-auditoria` | 1. Login admin. 2. Suspender usuario. 3. Ir a "Auditoría". 4. Verificar registro. | Tabla auditoría muestra acción con admin, target, timestamp. |
| EE-07 | `Flujo-admin-editar-pagina-equipo` | 1. Login admin. 2. Ir a `/equipo`. 3. Click "Editar" (solo visible para admin). 4. Modificar texto. 5. Guardar. 6. Recargar `/equipo`. | Cambios persisten y son visibles para visitantes anónimos. |
| EE-08 | `Flujo-user-no-accede-admin` | 1. Login como user normal. 2. Intentar navegar a `/admin/usuarios` (URL directa). | Redirección a `/` o 403. No se muestra tabla. |

---

## 6. Fixtures y Mocks

### 6.1 Backend Fixtures

```typescript
export const adminCredentials = {
  email: 'admin@ethos.platform',
  password: 'AdminSeguro123',
};

export const suspensionPayload = {
  dias: 7,
};

export const paginaEquipoUpdate = {
  titulo: 'Nuestro Equipo de Ética',
  descripcion: 'Conoce a quienes hacen posible esta plataforma.',
  miembros: [
    { nombre: 'Javier', rol: 'Full Stack', foto: 'https://...' },
  ],
};
```

---

## 7. Criterios de Aceptación del Módulo

- [ ] **100 % tests unitarios** de use cases administrativos pasan.
- [ ] **100 % tests de integración** de endpoints `/api/admin/*` pasan.
- [ ] **Cada acción administrativa** (suspender, eliminar, editar, cambiar rol) genera registro en auditoría.
- [ ] **Solo admin** puede acceder a endpoints de administración (verificado con tests 403/401).
- [ ] **Panel admin** en frontend es funcional y protegido por `AdminRoute`.
- [ ] **Cobertura mínima:** backend 80 %, frontend 70 %.

---

> **Fin del Plan de Prueba — Administración del Sistema.**
