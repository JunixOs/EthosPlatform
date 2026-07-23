# Testing Guide

## Unit Tests

Run all tests (backend + frontend):
```bash
pnpm test
```

Backend only:
```bash
pnpm --filter @app/backend test
# o: cd apps/backend && pnpm test
```

Frontend only:
```bash
pnpm --filter @app/frontend test
# o: cd apps/frontend && pnpm test
```

Watch mode: `pnpm test:watch` (o `test:backend:watch` / `test:frontend:watch`).
UI interactiva de Vitest: `pnpm --filter @app/backend test:ui` (o frontend).

## Coverage

```bash
pnpm test:coverage
```

Genera reportes en:
- Backend: `apps/backend/coverage/index.html` (+ `lcov.info`, `coverage-summary.json`)
- Frontend: `apps/frontend/coverage/index.html` (+ `lcov.info`, `coverage-summary.json`)

**Meta de cobertura: 70% (líneas/funciones/branches/statements).**

Estado actual (medido sobre TODO `src/`, no solo los archivos que ya tienen
test): backend ~19%, frontend ~13%. La mayoría de los use cases de auth,
experiencias y usuarios, los controllers, el middleware y buena parte de los
hooks/servicios del frontend todavía no tienen test unitario — solo están
cubiertos indirectamente por los tests E2E de Playwright (`tests/e2e/`).

Por eso `vitest.config.ts` **no** define un `coverage.threshold` que rompa el
build: forzar un 70% hoy haría fallar `pnpm test:coverage` en cada corrida.
El 70% queda como meta a alcanzar de forma incremental, y el quality gate que
efectivamente lo hace cumplir es el de SonarQube (ver abajo), no vitest.

## Input Validation

Todos los inputs de las rutas mutantes principales (`/auth/register`,
`/auth/login`, `POST/PUT /experiencias`, `PUT /usuarios/me/perfil`) se
validan con esquemas de Zod antes de llegar al controller.

Ver: `apps/backend/src/logica/shared/validation/schemas.ts`
Middleware: `apps/backend/src/logica/interface_adapters/middleware/validationMiddleware.ts`

Un input inválido devuelve `400 Bad Request` con el detalle del campo que
falló, por ejemplo:
```json
{
  "success": false,
  "errorMessage": "correo: El correo electrónico no es válido.",
  "errorCode": "EXP006",
  "httpErrorCode": 400
}
```

Nota: `errorCode` reutiliza `ValidationException` (código `EXP006`), la misma
excepción genérica de validación de campo que ya usan `CreateExperienciaUseCase`
y `EditExperienciaUseCase` — no es un error de que la validación "sea de
experiencias", es el código genérico de 400 por campo inválido en todo el proyecto.

## Quality Analysis (SonarQube)

Configuración: `sonar-project.properties` en la raíz. Apunta a
`apps/backend/coverage/lcov.info` y `apps/frontend/coverage/lcov.info`, así
que hay que correr `pnpm test:coverage` antes de escanear.

```bash
pnpm quality:check
```

Esto corre `test:coverage` y luego `sonar:scan` (`sonar-scanner`, vía el
paquete `sonarqube-scanner`).

Para correr SonarQube localmente:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
# Esperar ~2 minutos a que levante
# Login en http://localhost:9000 → admin/admin (pide cambiar password)
# Crear proyecto con key "com.ethos.platform" y generar un token
```

El scanner necesita `SONAR_HOST_URL` y `SONAR_TOKEN` (o `sonar.host.url` /
`sonar.login` en `sonar-project.properties`, no recomendado para el token).
Ejemplo:
```bash
SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=<tu-token> pnpm sonar:scan
```

Para SonarCloud, cambiar `SONAR_HOST_URL` por `https://sonarcloud.io` y usar
el token de tu organización.

## E2E Tests (Playwright)

```bash
cd tests/e2e && pnpm test
```

UI mode:
```bash
cd tests/e2e && pnpm test --ui
```

Ver `BUGS_ENCONTRADOS.txt` para el detalle de bugs encontrados y reparados
durante la estabilización previa a testing.
