# Plan de Prueba - Unit-Integration - Autenticacion y Sesiones - 18-07-2026

> **Módulo:** Autenticación y Sesiones (CU-01)
> **Fecha:** 18 de julio de 2026
> **Referencia:** Plan Implementacion - MVC - 18-07-2026.md, Fases 3–6
> **Frameworks:** Vitest (unit), Supertest (integration), Playwright (E2E)

---

## 1. Alcance

Este plan cubre las pruebas del módulo de autenticación y sesiones, incluyendo:
- Registro de cuentas de usuario
- Inicio de sesión (login) con JWT
- Cierre de sesión (logout) con invalidación de token
- Middleware de autenticación y autorización por roles
- Protección contra fuerza bruta (intentos fallidos)
- Duración diferenciada de sesiones (2h / 24h)

---

## 2. Estrategia de Testing

| Tipo | Herramienta | Entorno | Enfoque |
|---|---|---|---|
| **Unitarias** | Vitest | Node.js | Value objects (`Email`, `Password`), use cases (`RegisterUseCase`, `LoginUseCase`, `LogoutUseCase`), reglas de dominio, mappers. |
| **Integración** | Vitest + Supertest | Node.js + TypeORM (BD en memoria/pg test) | Endpoints HTTP: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, middlewares. |
| **E2E** | Playwright | Navegador (Chromium/Firefox/WebKit) | Flujo completo: registro → login → logout → intento de acceso con token revocado. |

---

## 3. Pruebas Unitarias

### 3.1 Value Objects

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UV-01 | `Email.debe-aceptar-formato-valido` | Validar email correcto | `new Email('usuario@correo.com')` | Instancia creada sin error |
| UV-02 | `Email.debe-rechazar-formato-invalido` | Validar email incorrecto | `new Email('correo-invalido')` | Lanza `DomainException` con mensaje claro |
| UV-03 | `Email.debe-rechazar-vacio` | Email vacío | `new Email('')` | Lanza `DomainException` |
| UV-04 | `Password.debe-aceptar-contraseña-segura` | Contraseña válida | `new Password('Abcdef1!')` | Instancia creada sin error |
| UV-05 | `Password.debe-rechazar-corta` | Contraseña < 8 caracteres | `new Password('Abc1')` | Lanza `DomainException` |
| UV-06 | `Password.debe-rechazar-sin-mayuscula` | Falta mayúscula | `new Password('abcdefg1')` | Lanza `DomainException` |
| UV-07 | `Password.debe-rechazar-sin-numero` | Falta número | `new Password('Abcdefgh')` | Lanza `DomainException` |

### 3.2 Use Cases

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UU-01 | `RegisterUseCase.debe-crear-usuario-con-datos-validos` | Registro exitoso | `{ nombre: 'Juan', email: 'juan@test.com', password: 'Password1' }` | `{ id: uuid, email: 'juan@test.com' }` |
| UU-02 | `RegisterUseCase.debe-rechazar-email-duplicado` | Email ya registrado | Mismo email que UU-01 | Lanza `ConflictException` (409) |
| UU-03 | `RegisterUseCase.debe-hashear-contraseña` | Seguridad | Cualquier password válido | Contraseña almacenada como hash bcrypt, nunca en texto plano |
| UU-04 | `LoginUseCase.debe-retornar-token-para-credenciales-validas` | Login exitoso | `{ email: 'juan@test.com', password: 'Password1', recordarme: false }` | `{ token: jwt, expiresAt: fecha +2h }` |
| UU-05 | `LoginUseCase.debe-retornar-token-24h-si-recordarme` | Sesión larga | `{ email: 'juan@test.com', password: 'Password1', recordarme: true }` | `{ token: jwt, expiresAt: fecha +24h }` |
| UU-06 | `LoginUseCase.debe-rechazar-credenciales-invalidas` | Password incorrecto | `{ email: 'juan@test.com', password: 'WrongPass' }` | Lanza `UnauthorizedException` (401) |
| UU-07 | `LoginUseCase.debe-bloquear-despues-de-5-intentos` | Fuerza bruta | 5 intentos fallidos consecutivos en < 15 min | 6to intento lanza `TooManyRequestsException` (429) |
| UU-08 | `LoginUseCase.debe-permitir-intento-despues-de-15min` | Ventana de bloqueo | Esperar 15 min después de bloqueo | Intento 6to permite validación normal |
| UU-09 | `LoginUseCase.debe-crear-sesion-en-bd` | Persistencia | Login exitoso | Fila creada en tabla `sesiones` con token y expiración |
| UU-10 | `LogoutUseCase.debe-eliminar-sesion-de-bd` | Invalidación server-side | Token válido | Fila eliminada en `sesiones`. Token rechazado en middleware. |

### 3.3 Domain Entities y Reglas

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UE-01 | `Usuario.debe-inicializar-con-rol-user` | Rol por defecto | `new Usuario(...)` | `rol === RolEnum.USER` |
| UE-02 | `Usuario.debe-permitir-suspender` | Suspensión temporal | `usuario.suspender(7)` | `suspendidoHasta = now + 7 días` |
| UE-03 | `Usuario.debe-rechazar-login-si-suspendido` | Verificación de suspensión | Login durante suspensión activa | Lanza `ForbiddenException` (403) con mensaje de suspensión |
| UE-04 | `IntentoFallido.debe-contar-intentos-recientes` | Rate limiting | 3 intentos en 10 min | `contarRecientes() === 3` |
| UE-05 | `IntentoFallido.debe-ignorar-intentos-viejos` | Ventana temporal | 2 intentos hace 20 min, 3 hace 5 min | `contarRecientes() === 3` |

---

## 4. Pruebas de Integración

### 4.1 Endpoints de Autenticación

| # | Nombre del test | Método | Ruta | Body / Headers | Código esperado | Body esperado |
|---|---|---|---|---|---|---|
| IU-01 | `POST /api/auth/register - exito` | POST | `/api/auth/register` | `{ nombre, email, password }` | 201 | `{ success: true, data: { id } }` |
| IU-02 | `POST /api/auth/register - email-duplicado` | POST | `/api/auth/register` | Email existente | 409 | `{ success: false, errorCode: 'EMAIL_DUPLICADO' }` |
| IU-03 | `POST /api/auth/register - email-invalido` | POST | `/api/auth/register` | `{ email: 'invalido' }` | 400 | `{ success: false, errorCode: 'VALIDACION_FALLIDA' }` |
| IU-04 | `POST /api/auth/register - password-debil` | POST | `/api/auth/register` | `{ password: '123' }` | 400 | `{ success: false, errorCode: 'VALIDACION_FALLIDA' }` |
| IU-05 | `POST /api/auth/login - exito-sin-recordarme` | POST | `/api/auth/login` | `{ email, password, recordarme: false }` | 200 | `{ success: true, data: { token, expiresAt } }` |
| IU-06 | `POST /api/auth/login - exito-con-recordarme` | POST | `/api/auth/login` | `{ email, password, recordarme: true }` | 200 | Token con expiración 24h |
| IU-07 | `POST /api/auth/login - credenciales-invalidas` | POST | `/api/auth/login` | Password incorrecto | 401 | `{ success: false, errorCode: 'CREDENCIALES_INVALIDAS' }` |
| IU-08 | `POST /api/auth/login - bloqueo-por-intentos` | POST | `/api/auth/login` | 6 intentos fallidos | 429 | `{ success: false, errorCode: 'DEMASIADOS_INTENTOS' }` |
| IU-09 | `POST /api/auth/login - usuario-suspendido` | POST | `/api/auth/login` | Usuario suspendido | 403 | `{ success: false, errorCode: 'USUARIO_SUSPENDIDO' }` |
| IU-10 | `POST /api/auth/logout - exito` | POST | `/api/auth/logout` | `Authorization: Bearer <token>` | 200 | `{ success: true }` |
| IU-11 | `POST /api/auth/logout - token-revocado` | POST | `/api/auth/logout` | Token ya usado en logout previo | 401 | `{ success: false, errorCode: 'TOKEN_INVALIDO' }` |
| IU-12 | `POST /api/auth/logout - sin-token` | POST | `/api/auth/logout` | Sin header | 401 | `{ success: false, errorCode: 'TOKEN_FALTANTE' }` |

### 4.2 Middleware

| # | Nombre del test | Método | Ruta | Headers | Código esperado | Body esperado |
|---|---|---|---|---|---|---|
| IM-01 | `GET /api/usuarios/me - token-valido` | GET | `/api/usuarios/me` | `Authorization: Bearer <valid>` | 200 | Perfil del usuario |
| IM-02 | `GET /api/usuarios/me - token-expirado` | GET | `/api/usuarios/me` | `Authorization: Bearer <expirado>` | 401 | `{ errorCode: 'TOKEN_EXPIRADO' }` |
| IM-03 | `GET /api/usuarios/me - token-invalido` | GET | `/api/usuarios/me` | `Authorization: Bearer fake` | 401 | `{ errorCode: 'TOKEN_INVALIDO' }` |
| IM-04 | `GET /api/usuarios/me - token-revocado` | GET | `/api/usuarios/me` | Token después de logout | 401 | `{ errorCode: 'TOKEN_INVALIDO' }` |
| IM-05 | `GET /api/admin/usuarios - admin-ok` | GET | `/api/admin/usuarios` | `Authorization: Bearer <admin>` | 200 | Lista de usuarios |
| IM-06 | `GET /api/admin/usuarios - user-forbidden` | GET | `/api/admin/usuarios` | `Authorization: Bearer <user>` | 403 | `{ errorCode: 'PERMISO_DENEGADO' }` |
| IM-07 | `GET /api/admin/usuarios - sin-auth` | GET | `/api/admin/usuarios` | Sin header | 401 | `{ errorCode: 'TOKEN_FALTANTE' }` |

---

## 5. Pruebas E2E (Playwright)

| # | Nombre del test | Pasos | Criterio de aceptación |
|---|---|---|---|
| EE-01 | `Flujo-registro-completo` | 1. Ir a `/registro`. 2. Completar formulario. 3. Click "Crear cuenta". 4. Verificar redirección a `/login` o `/`. 5. Login con credenciales nuevas. | Usuario registrado puede iniciar sesión. Mensaje de éxito visible. |
| EE-02 | `Flujo-login-logout` | 1. Ir a `/login`. 2. Completar credenciales. 3. Click "Ingresar". 4. Verificar presencia de token en localStorage. 5. Click "Cerrar sesión". 6. Verificar token eliminado. | Token guardado en login, eliminado en logout. Navbar cambia de estado autenticado a no autenticado. |
| EE-03 | `Flujo-sesion-expirada` | 1. Login sin "Recordarme". 2. Esperar 2h (simular con manipulación de `expiresAt` en localStorage o test con token expirado forzado). 3. Navegar a `/favoritos`. | Redirección automática a `/login`. Mensaje "Tu sesión ha expirado". |
| EE-04 | `Flujo-token-revocado` | 1. Login. 2. Logout. 3. Intentar navegar a ruta protegida con token anterior (simular via localStorage). | Backend responde 401. Frontend redirige a `/login`. |
| EE-05 | `Flujo-bloqueo-intentos` | 1. Ir a `/login`. 2. Ingresar 5 veces credenciales incorrectas. 3. Ingresar credenciales correctas en 6to intento. | 6to intento muestra mensaje de bloqueo (429). Usuario no puede loguearse durante 15 min. |
| EE-06 | `Flujo-dark-mode-persistente` | 1. Alternar tema oscuro. 2. Cerrar navegador. 3. Reabrir `/`. | Tema oscuro se mantiene. Clase `.dark` presente en `<html>`. |

---

## 6. Fixtures y Mocks

### 6.1 Backend Fixtures (Integration)

```typescript
// apps/backend/tests/fixtures/usuarios.fixture.ts
export const usuarioValido = {
  nombre: 'Usuario Test',
  email: 'test@ethos.platform',
  password: 'PasswordSegura1',
};

export const adminValido = {
  nombre: 'Admin Test',
  email: 'admin@ethos.platform',
  password: 'AdminPass123',
  rol: 'admin',
};
```

### 6.2 Frontend Fixtures (Unit)

```typescript
// apps/frontend/tests/fixtures/auth.fixture.ts
export const sessionMock = {
  usuario: { id: 'uuid', nombre: 'Test', email: 'test@ethos.platform', rol: 'user' },
  token: 'mock-jwt-token',
  expiresAt: new Date(Date.now() + 7200000).toISOString(), // +2h
};
```

### 6.3 Seeds de BD (E2E)

Script `pnpm db:seed` que inserta:
- 1 usuario admin (`admin@ethos.platform` / `Admin123`)
- 2 usuarios normales (`user1@ethos.platform`, `user2@ethos.platform`)
- 5 experiencias publicadas
- 1 experiencia borrador

---

## 7. Criterios de Aceptación del Módulo

- [ ] **100 % de tests unitarios de value objects pasan.**
- [ ] **100 % de tests unitarios de use cases pasan.**
- [ ] **100 % de tests de integración de endpoints pasan.**
- [ ] **Todos los tests E2E de autenticación pasan en Chromium.**
- [ ] **Cobertura mínima del módulo:** backend 80 %, frontend 70 %.
- [ ] **No hay regresiones:** flujos existentes (login, registro, logout) funcionan igual o mejor que antes.

---

## 8. Entregables

| Entregable | Ubicación |
|---|---|
| Tests unitarios backend | `apps/backend/tests/unit/domain/value_objects/*.spec.ts`, `application/features/auth/*.spec.ts` |
| Tests integración backend | `apps/backend/tests/integration/auth.spec.ts` |
| Tests E2E | `tests/e2e/specs/flujo-auth.spec.ts` |
| Reporte de cobertura | `apps/backend/coverage/` |

---

> **Fin del Plan de Prueba — Autenticación y Sesiones.**
