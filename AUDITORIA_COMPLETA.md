# Auditoría Completa de Código - EthosPlatform

## Fecha: 2026-07-21
## Rama: feature/javier
## Estado: ⚠️ CASI PASA — 1 condición del Quality Gate no cumplida (cobertura en código nuevo), 0 bugs/vulnerabilidades/code smells

---

## 1. Análisis Estático (ESLint)

- Backend: no tenía ESLint configurado — se agregó (`eslint.config.mjs`, flat config,
  `@typescript-eslint/recommended` + `no-unused-vars` + `no-namespace` con excepción
  para `declare global { namespace Express }`).
- Frontend: ya tenía ESLint configurado; se corrigió que no ignoraba `coverage/`
  (generaba ruido de archivos de reportes HTML).
- Errores encontrados: 33 (13 frontend + 20 backend, primera corrida)
- Errores tras reparar: **0**
- Status: ✅ PASSED

Principales categorías reparadas: imports/variables sin usar (incluyendo un
feature completo sin terminar y sin usar — `AuditoriaService`/`AuditoriaController`,
ver nota abajo), `any` explícitos reemplazados por tipos concretos o
`unknown as Tipo`, un componente exportando una función junto al componente
(rompía Fast Refresh), y 7 casos legítimos de `react-hooks/set-state-in-effect`
documentados con comentarios de supresión (patrón estándar de fetch-on-mount,
no un bug).

## 2. Formateo (Prettier)

- No estaba configurado. Se agregó `.prettierrc.json` + `.prettierignore` +
  scripts `format`/`format:check`.
- Archivos con diferencias de formato: 213 de ~230
- **Decisión**: NO se corrió `--write` sobre el código existente. Reformatear
  213 archivos en un solo commit es un cambio masivo con alto riesgo de
  conflicto con el trabajo en curso de otros compañeros en la misma rama
  compartida — se dejó como decisión del equipo para un commit dedicado
  (`pnpm format` cuando decidan hacerlo).
- Status: ⚠️ CONFIGURADO, no aplicado (decisión explícita, no un olvido)

## 3. SonarQube Quality Gate

- Status: **ERROR** — 1 condición no cumplida: `new_coverage` (21.0% actual,
  requiere ≥80% en el gate "Sonar way" por defecto sobre código nuevo/modificado)
- Bugs: **0** (eran 2 antes de reparar)
- Vulnerabilities: **0**
- Code Smells: **0** (eran 75 antes de reparar)
- Security Hotspots: **0**
- Coverage (global del proyecto): 17.7%
- Duplications: 0.5%
- `new_violations`: 0 (OK) | `new_duplicated_lines_density`: 2.7% (OK, bajo el 3%)

**La única condición que falla es cobertura de tests en código nuevo — no
bugs, no vulnerabilidades, no code smells.** Este es exactamente el gap de
cobertura (13-20% real vs 70-80% deseado) que ya se había detectado y
documentado en sesiones anteriores (ver TESTING.md, BACKEND_COVERAGE.txt,
FRONTEND_COVERAGE.txt) — no es sorpresa, es la misma deuda técnica
manifestándose ahora como un gate real. Arreglarlo requiere escribir tests
nuevos para los archivos tocados en esta sesión, trabajo no incluido en el
alcance de "auditoría y reparación de calidad" (que es distinto de "escribir
suite de tests").

## 4. Pruebas Unitarias

- Backend: 92/92 ✅ (mismos tests, algunos reestructurados con `it.each` para
  eliminar duplicación — ver hallazgo S5976)
- Frontend: 38/38 ✅
- Total: 130/130 ✅

## 5. Pruebas E2E (Playwright)

- 198 passed, 11 skipped (guards de datos por acumulación de usuarios de
  prueba tras muchas corridas — comportamiento esperado, no fallos), 0 failed
- Corrida completa sobre chromium, firefox, webkit, chromium-auth, chromium-admin
- Se corrió específicamente para validar el refactor extenso de UI hecho en
  esta auditoría (Navbar, HomePage, TeamPage, RespuestasSection, formularios
  de Login/Register/CreateExperiencia/EditExperiencia/EditarPerfil/Reportar) —
  0 regresiones.

## 6. Pruebas de Carga

- Endpoint: `/api/health` — 10 conexiones, 30s, rate objetivo 100 req/s
- Error Rate: **0%** (< 5% ✅)
- Latency p99: **13ms** (< 100ms ✅)
- Throughput: ~100 req/s sostenido, sin backlog
- Detalle completo en LOAD_TEST_RESULTS.txt

## 7. Revisión de Seguridad

- SQL Injection: ✅ SAFE — todo uso de TypeORM vía `createQueryBuilder` con
  bind parameters (`:param`), 0 concatenación de inputs de usuario en SQL
- XSS: ✅ SAFE — 0 usos de `innerHTML`/`dangerouslySetInnerHTML` en el frontend
- JWT: ✅ SAFE — `JWT_SECRET` solo desde `.env`, falla explícitamente si falta,
  sin valor por defecto hardcodeado
- CORS: ✅ SAFE — origin restrictivo desde `.env` (no `*`); se corrigió un
  valor de fallback hardcodeado desactualizado (puerto 5173 → 16000)
- Secretos en el repo: ✅ SAFE — `.env` no está trackeado en git
- Hallazgo real reparado: regex de `Email.ts` con riesgo de backtracking
  exponencial (ReDoS) — reemplazada por una versión sin ambigüedad de
  backtracking (regla SonarQube typescript:S8786)
- Detalle completo en SECURITY_REVIEW.txt

## 8. Build & Types

- `pnpm build`: ✅ SUCCESS (backend tsc + frontend tsc -b && vite build)
- TypeScript (`tsc --noEmit`): ✅ 0 ERRORS (backend y frontend)

---

## Problemas Encontrados y Reparados

### Bugs reales (más allá de lint/estilo)
1. **`Reporte.ts`**: el campo `estado` era `readonly` pero `resolver()` lo
   mutaba usando `(this as any).estado = 'resuelto'` — un `any` usado para
   saltarse el chequeo de TypeScript en vez de arreglar el modelo. Se quitó
   `readonly` (es el único campo de esa entidad que sí cambia) y se eliminó
   el cast.
2. **`RegisterUseCase.ts`**: `new Password(cmd.password)` se creaba solo por
   su validación y se descartaba, para luego usar `cmd.password` (sin
   validar/normalizar) en el hash. Se capturó la instancia y se usa
   `password.getValue()`.
3. **`BuscarExperienciasPage.tsx`**: template string roto —
   `` `para "{searchParams.get('q')}"` `` faltaba el `$` de interpolación,
   mostraba el texto literal en vez del valor de búsqueda.
4. **`Navbar.tsx`**: import duplicado y vacío (`import {  } from "react-icons/fa"`)
   — resto de una edición anterior, sin efecto pero confuso.
5. **2 casos de `key` faltante** en listas de React (`BuscarExperienciasPage.tsx`,
   `Navbar.tsx`) — el `key` estaba en un hijo anidado en vez del elemento
   raíz devuelto por `.map()`, lo que no ayuda a la reconciliación de React.
6. **`Email.ts`**: regex con backtracking exponencial (ReDoS) — ver sección
   de seguridad.
7. **`toast.store.ts`**: exportaba un array mutable (`listeners`) que otros
   módulos modificaban directamente (`.push`/`.splice`) — encapsulado detrás
   de una función `subscribe()`.

### Deuda de tipos/dependencias deprecadas
- Zod v4 cambió la firma no deprecada de validación de email —
  `z.string().trim().email(...)` → `z.string().trim().pipe(z.email(...))`.
- `Repository.findByIds()` de TypeORM está deprecado — reemplazado por
  `findBy({ id: In(ids) })`.
- `React.FormEvent` está deprecado (`@types/react` v19 lo marca explícitamente
  como "no existe tal evento") — reemplazado por `SubmitEvent` en los 9
  archivos que lo usaban para manejar `onSubmit`.
- `experienciasService.list()` deprecado — el único caller (`useExperiencias.ts`)
  se migró a `.listar()`.

### Refactors de diseño (constructores con demasiados parámetros — S107)
- `Experiencia` y `Usuario` tenían constructores de 9 parámetros posicionales
  (máximo recomendado: 7). Se refactorizaron a un único objeto de props
  (`ExperienciaProps`, `UsuarioProps`) con valores opcionales para los
  defaults. Solo 2 call sites cada uno (mapper + use case) — cambio de bajo
  riesgo, verificado con `tsc`, tests unitarios y smoke tests manuales
  (register/login/crear experiencia) tras reiniciar el backend.

### Nota para el equipo — feature sin terminar detectada
`AuditoriaService` / `AuditoriaController` / `AuditoriaRepository` /
`IAuditoriaRepository` existen como código completo (servicio + controller +
repositorio) pero **nunca se conectaron al contenedor de DI ni a `routes.ts`**
— no hay ningún endpoint `/auditoria` expuesto. Se eliminó la importación
muerta en `container.ts` (causaba el error de lint), pero el feature en sí
sigue ahí sin usarse. Alguien del equipo debería decidir si se termina de
conectar o se elimina.

---

## Conclusión

**El código está limpio de bugs, vulnerabilidades y code smells según
SonarQube (0/0/0).** Los 130 tests unitarios y 198 tests E2E pasan sin
regresiones tras un refactor extenso de UI y de 4 entidades de dominio. La
única razón por la que el Quality Gate no está en verde es la cobertura de
tests en código nuevo (21% vs 80% requerido) — la misma deuda de cobertura
ya conocida y documentada, no un problema nuevo descubierto en esta auditoría.

**Recomendación**: el código está listo para seguir trabajando en
`feature/javier`. Si "Quality Gate PASSED" es un requisito estricto para el
merge, hay dos caminos — ninguno de los dos lo decidí unilateralmente:
1. Escribir tests para el código nuevo/modificado hasta cubrir el 80% de esa
   porción (trabajo real, no cosmético).
2. Ajustar la condición `new_coverage` del quality gate del proyecto en
   SonarQube (es una configuración del proyecto, no del código) si el equipo
   considera que 80% en código nuevo es una meta prematura para este punto
   del proyecto.

---

Auditoría ejecutada por: Claude Code (Sonnet 5)
Timestamp: 2026-07-21T08:30:00Z aprox.
