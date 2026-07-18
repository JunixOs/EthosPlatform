# Plan de Prueba - Unit-Integration - Moderacion y Seguridad - 18-07-2026

> **Módulo:** Moderación y Seguridad
> **Fecha:** 18 de julio de 2026
> **Referencia:** Plan Implementacion - MVC - 18-07-2026.md, Fases 3–6
> **Frameworks:** Vitest (unit), Supertest (integration), Playwright (E2E)

---

## 1. Alcance

Este plan cubre las pruebas de moderación y seguridad, incluyendo:
- Reportes de contenido inapropiado (R33)
- Ocultar contenido reportado (R35)
- Historial de reportes (R36)
- Lista negra de términos prohibidos configurable por admin (R63)
- Rate limiting global (adicional al de login)
- Validación de contenido contra términos prohibidos
- Protección de inputs y sanitización

---

## 2. Estrategia de Testing

| Tipo | Herramienta | Enfoque |
|---|---|---|
| **Unitarias** | Vitest | `ListaNegraRule`, `Reporte` entity, use cases (`CrearReporteUseCase`, `OcultarContenidoUseCase`, `ValidarContenidoUseCase`), sanitización de inputs. |
| **Integración** | Vitest + Supertest | Endpoints de reportes, endpoints de lista negra, middleware de validación de contenido. |
| **E2E** | Playwright | Flujo: usuario reporta contenido → admin revisa → admin oculta → contenido no visible. |

---

## 3. Pruebas Unitarias

### 3.1 Lista Negra de Términos Prohibidos

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| ULN-01 | `ListaNegraRule.debe-aceptar-contenido-limpio` | Sin términos prohibidos | `"Esta es una experiencia ética positiva."` | `true` |
| ULN-02 | `ListaNegraRule.debe-rechazar-termino-prohibido` | Contiene término prohibido | `"Este contenido es ofensivo [TERMINO_PROHIBIDO]"` | Lanza `ValidationException` con término detectado |
| ULN-03 | `ListaNegraRule.debe-ser-case-insensitive` | Mayúsculas/minúsculas | `"OFENSIVO"` (prohibido en minúscula) | Lanza `ValidationException` |
| ULN-04 | `ListaNegraRule.debe-detectar-variantes` | Subcadenas | `"palabraofensiva123"` | Lanza `ValidationException` (si se configura partial match) |
| ULN-05 | `ListaNegraRule.debe-aceptar-lista-vacia` | Sin términos configurados | Cualquier texto | `true` (no hay términos para validar) |

### 3.2 Reportes

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| UR-01 | `Reporte.debe-crear-con-motivo` | Instanciación | `{ experienciaId, usuarioId, motivo: 'Spam' }` | Instancia válida |
| UR-02 | `Reporte.debe-rechazar-motivo-vacio` | Validación | `{ motivo: '' }` | Lanza `DomainException` |
| UR-03 | `CrearReporteUseCase.debe-crear-reporte` | Creación | Datos válidos | Reporte persistido |
| UR-04 | `CrearReporteUseCase.debe-rechazar-doble-reporte` | Idempotencia | Mismo usuario, misma experiencia | Lanza `ConflictException` (ya reportado) |
| UR-05 | `CrearReporteUseCase.debe-rechazar-autoreporte` | Validación | Usuario reporta su propia experiencia | Lanza `ForbiddenException` |
| UR-06 | `ListarReportesUseCase.debe-ordenar-por-fecha` | Consulta admin | — | Más recientes primero, solo no resueltos |
| UR-07 | `OcultarContenidoUseCase.debe-ocultar-experiencia` | Acción admin | `experienciaId` | `estado === 'OCULTA'` |
| UR-08 | `OcultarContenidoUseCase.debe-rechazar-no-admin` | Autorización | User normal | Lanza `ForbiddenException` |

### 3.3 Sanitización y Seguridad

| # | Nombre del test | Descripción | Entrada | Salida esperada |
|---|---|---|---|---|
| US-01 | `SanitizarInput.debe-escapar-html` | XSS | `"<script>alert('xss')</script>"` | `"&lt;script&gt;alert('xss')&lt;/script&gt;"` |
| US-02 | `SanitizarInput.debe-escapar-comillas` | SQL/NoSQL injection | `' OR 1=1 --` | Texto escapado sin ejecución |
| US-03 | `ValidarContenidoUseCase.debe-validar-en-creacion` | Middleware | Experiencia con término prohibido | Lanza `ValidationException` antes de persistir |

---

## 4. Pruebas de Integración

### 4.1 Reportes

| # | Nombre | Método | Ruta | Auth | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| I-01 | `POST /api/reportes - crear` | POST | `/api/reportes` | Sí | `{ experienciaId, motivo: 'Spam' }` | 201 | `data.id` generado |
| I-02 | `POST /api/reportes - doble-reporte` | POST | `/api/reportes` | Sí | Mismo `experienciaId` | 409 | `errorCode: 'YA_REPORTADO'` |
| I-03 | `POST /api/reportes - autoreporte` | POST | `/api/reportes` | Sí | Experiencia propia | 403 | `errorCode: 'NO_AUTOREPORTE'` |
| I-04 | `POST /api/reportes - motivo-vacio` | POST | `/api/reportes` | Sí | `{ motivo: '' }` | 400 | `errorCode: 'VALIDACION_FALLIDA'` |
| I-05 | `GET /api/admin/reportes - admin-lista` | GET | `/api/admin/reportes` | Admin | — | 200 | Array de reportes pendientes |
| I-06 | `GET /api/admin/reportes - user-forbidden` | GET | `/api/admin/reportes` | User | — | 403 | `errorCode: 'PERMISO_DENEGADO'` |
| I-07 | `PATCH /api/admin/reportes/:id/resolver` | PATCH | `/api/admin/reportes/{id}` | Admin | `{ accion: 'OCULTAR' }` | 200 | Experiencia asociada `estado === 'OCULTA'` |
| I-08 | `PATCH /api/admin/reportes/:id/descartar` | PATCH | `/api/admin/reportes/{id}` | Admin | `{ accion: 'DESCARTAR' }` | 200 | Reporte marcado como resuelto, experiencia sigue visible |

### 4.2 Lista Negra (Admin)

| # | Nombre | Método | Ruta | Auth | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| I-09 | `GET /api/admin/lista-negra - admin` | GET | `/api/admin/lista-negra` | Admin | — | 200 | Array de términos prohibidos |
| I-10 | `POST /api/admin/lista-negra - agregar` | POST | `/api/admin/lista-negra` | Admin | `{ termino: 'spam' }` | 201 | Término agregado a BD |
| I-11 | `DELETE /api/admin/lista-negra/:id - quitar` | DELETE | `/api/admin/lista-negra/{id}` | Admin | — | 200 | Término eliminado |
| I-12 | `POST /api/admin/lista-negra - user-forbidden` | POST | `/api/admin/lista-negra` | User | — | 403 | `errorCode: 'PERMISO_DENEGADO'` |

### 4.3 Validación Automática

| # | Nombre | Método | Ruta | Auth | Body | Código | Validación |
|---|---|---|---|---|---|---|---|
| I-13 | `POST /api/experiencias - contenido-limpio` | POST | `/api/experiencias` | Sí | Texto sin términos prohibidos | 201 | Experiencia creada |
| I-14 | `POST /api/experiencias - termino-prohibido` | POST | `/api/experiencias` | Sí | Texto con término de lista negra | 400 | `errorCode: 'CONTENIDO_PROHIBIDO'` |
| I-15 | `POST /api/respuestas - termino-prohibido` | POST | `/api/experiencias/{id}/respuestas` | Sí | Texto con término prohibido | 400 | `errorCode: 'CONTENIDO_PROHIBIDO'` |

### 4.4 Rate Limiting Global

| # | Nombre | Método | Ruta | Repeticiones | Código | Validación |
|---|---|---|---|---|---|---|
| I-16 | `POST /api/experiencias - rate-limit` | POST | `/api/experiencias` | 101 en 1 minuto | 429 | `errorCode: 'DEMASIADAS_PETICIONES'` |
| I-17 | `POST /api/reportes - rate-limit` | POST | `/api/reportes` | 51 en 1 minuto | 429 | `errorCode: 'DEMASIADAS_PETICIONES'` |

---

## 5. Pruebas E2E (Playwright)

| # | Nombre | Pasos | Criterio |
|---|---|---|---|
| EE-01 | `Flujo-reportar-contenido` | 1. Login como User A. 2. Ver experiencia de User B. 3. Click "Reportar". 4. Seleccionar motivo. 5. Enviar. | Modal de confirmación. Backend crea reporte. User B no ve cambios aún. |
| EE-02 | `Flujo-admin-revisar-reporte` | 1. Login admin. 2. Ir a panel de reportes. 3. Ver reporte creado en EE-01. 4. Click "Ver contenido". | Panel muestra reporte con motivo, autor, fecha. Link a experiencia funciona. |
| EE-03 | `Flujo-admin-ocultar-contenido` | 1. Login admin. 2. Ir a reportes. 3. Click "Ocultar contenido". 4. Logout. 5. Ir a experiencia como visitante. | Experiencia muestra "Contenido oculto por moderación". No se ve texto original. |
| EE-04 | `Flujo-admin-descartar-reporte` | 1. Login admin. 2. Ir a reportes. 3. Click "Descartar". 4. Logout. 5. Ir a experiencia. | Experiencia sigue visible normalmente. Reporte marcado como resuelto. |
| EE-05 | `Flujo-lista-negra-configurar` | 1. Login admin. 2. Ir a "Configuración" > "Lista negra". 3. Agregar término "spam". 4. Guardar. | Término aparece en lista. Persiste tras recarga. |
| EE-06 | `Flujo-lista-negra-bloqueo` | 1. Login admin. 2. Agregar "spam" a lista negra. 3. Login como user. 4. Crear experiencia con texto "Esto es spam". | Formulario muestra error antes de enviar o backend responde 400. |
| EE-07 | `Flujo-xss-protegido` | 1. Login. 2. Crear experiencia con `<script>alert(1)</script>`. 3. Guardar. 4. Ver experiencia pública. | Script no ejecuta. Texto se muestra como texto plano escapado. |

---

## 6. Criterios de Aceptación del Módulo

- [ ] **100 % tests unitarios** de `ListaNegraRule`, `Reporte`, y sanitización pasan.
- [ ] **100 % tests de integración** de endpoints de reportes y lista negra pasan.
- [ ] **Contenido con términos prohibidos** es rechazado en creación de experiencias y respuestas.
- [ ] **Doble reporte** del mismo usuario a la misma experiencia retorna 409.
- [ ] **Autoreporte** está bloqueado (403).
- [ ] **Rate limiting** funciona en endpoints de escritura (CREATE/POST).
- [ ] **XSS** está mitigado (inputs con `<script>` se escapan en BD y frontend).
- [ ] **Cobertura mínima:** backend 70 %.

---

> **Fin del Plan de Prueba — Moderación y Seguridad.**
