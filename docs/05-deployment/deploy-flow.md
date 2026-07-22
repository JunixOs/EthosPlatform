# Flujo de Despliegue

Este documento detalla el proceso completo de despliegue continuo de EthosPlatform, desde el momento en que un desarrollador envía código hasta que la nueva versión está disponible en el entorno correspondiente (desarrollo o producción).

## Visión General del Flujo

EthosPlatform utiliza **dos ramas principales** que disparan pipelines independientes:

| Rama | Workflow | Entorno | SonarQube | Quality Gate |
|---|---|---|---|---|
| `develop` | `deploy-development.yml` | Desarrollo | Proyectos `.dev` | Informativo (no bloquea) |
| `main` | `deploy-production.yml` | Producción | Proyectos base | Bloqueante (obligatorio) |

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  Push a     │────▶│ GitHub      │────▶│ Self-Hosted  │────▶│ SonarQube│────▶│ Dockploy │
│  develop    │     │ Actions     │     │ Runner       │     │ .dev     │     │ Dev      │
│  o main     │     │             │     │              │     │ o prod   │     │ o Prod   │
└─────────────┘     └─────────────┘     └──────────────┘     └──────────┘     └──────────┘
```

---

## Paso 1: Push a la rama de trabajo

**Actor**: Desarrollador / Equipo de desarrollo
**Trigger**: Evento `push` en la rama `develop` o `main`.

### 1.1. Rama `develop` (Desarrollo)

1. El desarrollador trabaja en una feature branch.
2. Realiza merge hacia `develop` mediante Pull Request o merge directo.
3. GitHub detecta el `push` y dispara `.github/workflows/deploy-development.yml`.

**Concurrencia**: `group: development-deploy` con `cancel-in-progress: true`.
- Un nuevo push a `develop` cancela cualquier ejecución anterior en curso, priorizando el código más reciente.

### 1.2. Rama `main` (Producción)

1. Cuando el código en `develop` es estable, se promociona a `main` (vía PR o merge).
2. GitHub detecta el `push` y dispara `.github/workflows/deploy-production.yml`.

**Concurrencia**: `group: production-deploy` con `cancel-in-progress: false`.
- Nunca se cancela un deploy de producción en curso. Los nuevos pushes esperan en cola para garantizar estabilidad.

---

## Paso 2: GitHub Actions orquesta el pipeline

**Actor**: Plataforma GitHub Actions
**Job activado**: `analysis` (Build & Quality Analysis)

GitHub Actions asigna el job al **Self-Hosted Runner** registrado en el repositorio. El runner descarga el código y comienza la ejecución de los pasos definidos.

### 2.1. Checkout del código

- Acción: `actions/checkout@v4` con `clean: true`.
- Resultado: El workspace del runner se limpia y se descarga el código en el estado exacto del commit que disparó el pipeline.

### 2.2. Preparación del entorno de build

- Acción: `pnpm/action-setup@v4` instala pnpm `11.8.0`.
- Acción: `actions/setup-node@v4` instala/configura Node.js `22` y habilita la caché de pnpm.
- Comando: `pnpm install --frozen-lockfile` instala las dependencias del monorepo sin modificar `pnpm-lock.yaml`.

### 2.3. Calidad de código estático

- Comando: `pnpm run lint`
- Se ejecutan los linters de backend (`eslint`) y frontend (`eslint`) en sus respectivos workspaces.
- **Fallo posible**: Si el código viola las reglas de linting, el job se detiene aquí.

### 2.4. Tests con cobertura

- Comando: `pnpm run test:coverage`
- Se ejecutan los tests unitarios e integrales de backend (Vitest, entorno Node) y frontend (Vitest, entorno jsdom).
- Se generan los reportes de cobertura en formato `lcov` (`coverage/lcov.info`) en cada aplicación.
- **Fallo posible**: Si algún test falla, el job se detiene aquí.

### 2.5. Build de aplicaciones

- Comandos:
  - `pnpm build:backend` — Transpilación TypeScript a `apps/backend/dist`.
  - `pnpm build:frontend` — Compilación de React con Vite a `apps/frontend/dist`.
- **Fallo posible**: Errores de compilación de TypeScript o Vite detienen el pipeline.

---

## Paso 3: Análisis de calidad con SonarQube

**Actor**: Self-Hosted Runner + SonarScanner CLI + SonarQube Server
**Job activado**: `analysis` (continuación)

Una vez superados los tests y builds, el runner ejecuta el análisis de calidad de código.

### 3.1. Proyectos separados por entorno

Para mantener métricas limpias y trazables, cada entorno envía sus análisis a proyectos independientes en SonarQube:

| Aplicación | Rama `develop` | Rama `main` |
|---|---|---|
| Backend | `com.ethos.backend.dev` | `com.ethos.backend` |
| Frontend | `com.ethos.frontend.dev` | `com.ethos.frontend` |

> **Nota sobre SonarQube Community Edition**: La edición Community no soporta Branch Analysis nativo. La única forma de diferenciar métricas entre ramas es mediante proyectos separados.

### 3.2. Análisis del Backend

- Directorio de trabajo: `apps/backend`
- **Desarrollo** (`develop`):
  ```bash
  sonar-scanner \
    -Dsonar.host.url="$SONAR_HOST_URL" \
    -Dsonar.token="$SONAR_TOKEN" \
    -Dsonar.projectKey="com.ethos.backend.dev" \
    -Dsonar.projectName="EthosPlatform Backend (Development)" \
    -Dsonar.qualitygate.wait=false
  ```
- **Producción** (`main`):
  ```bash
  sonar-scanner \
    -Dsonar.host.url="$SONAR_HOST_URL" \
    -Dsonar.token="$SONAR_TOKEN" \
    -Dsonar.projectKey="com.ethos.backend" \
    -Dsonar.projectName="EthosPlatform Backend" \
    -Dsonar.qualitygate.wait=true \
    -Dsonar.qualitygate.timeout=300
  ```
- Configuración base leída desde: `apps/backend/sonar-project.properties`.
- Los parámetros `-Dsonar.projectKey` y `-Dsonar.projectName` **sobrescriben** los valores del archivo de propiedades.

### 3.3. Análisis del Frontend

- Directorio de trabajo: `apps/frontend`
- **Desarrollo** (`develop`): usa `com.ethos.frontend.dev` con `qualitygate.wait=false`.
- **Producción** (`main`): usa `com.ethos.frontend` con `qualitygate.wait=true` y `timeout=300`.
- Configuración base leída desde: `apps/frontend/sonar-project.properties`.

### 3.4. Evaluación del Quality Gate

#### En `develop` (Quality Gate informativo)

- `sonar.qualitygate.wait=false`: El scanner envía el análisis y **no espera** el veredicto.
- El pipeline continúa inmediatamente hacia el despliegue.
- El equipo puede revisar las métricas en SonarQube como información de mejora, pero un issue no bloquea la iteración rápida.

#### En `main` (Quality Gate bloqueante)

- `sonar.qualitygate.wait=true`: El scanner permanece en espera activa hasta recibir el veredicto.
- **Timeout**: 300 segundos (5 minutos).
- **Fallo posible**:
  - Cobertura de código inferior al umbral definido.
  - Presencia de bugs, vulnerabilidades o code smells bloqueantes.
  - Duplicación de código por encima del límite permitido.
  - Timeout de comunicación con SonarQube.

Si el Quality Gate **falla en `main`**, el pipeline se detiene completamente y **no se ejecuta el despliegue a producción**.

---

## Paso 4: Despliegue mediante Dockploy

**Actor**: Self-Hosted Runner + Dockploy
**Job activado**: `deploy` (Deploy via Dockploy)
**Condición**: El job `analysis` debe haberse completado con éxito (`needs: analysis`).

### 4.1. Validación del webhook

- El runner verifica que el secreto del webhook correspondiente esté definido:
  - `DOCKPLOY_WEBHOOK_DEV` para `develop`.
  - `DOCKPLOY_WEBHOOK` para `main`.
- Si falta, el job falla inmediatamente con un mensaje de error claro.

### 4.2. Disparo del webhook

- Comando ejecutado:
  ```bash
  curl --fail --silent --show-error --max-time 60 -X POST \
    -H "Content-Type: application/json" \
    -H "X-GitHub-Event: deploy-from-github" \
    -d '{"ref": "refs/heads/<rama>", "environment": "<entorno>"}' \
    "$DOCKPLOY_WEBHOOK"
  ```
- El runner envía una petición HTTP `POST` a la URL de Dockploy.

### 4.3. Acciones de Dockploy

Tras recibir la señal, Dockploy ejecuta típicamente las siguientes operaciones en el servidor:

1. **Actualización del código**: Obtiene la última versión del código (o recibe la confirmación de que debe reconstruir).
2. **Reconstrucción de imágenes**:
   ```bash
   docker-compose build
   ```
3. **Reinicio de servicios** (sin downtime si se usa estrategia adecuada):
   ```bash
   docker-compose up -d
   ```
4. **Manejo de migraciones**: El contenedor del backend ejecuta automáticamente las migraciones de TypeORM al iniciarse (`migration:run` en el `CMD` del Dockerfile).
5. **Limpieza**: Eliminación de imágenes intermedias, contenedores detenidos y volúmenes huérfanos.

---

## Paso 5: Verificación post-despliegue

**Actor**: Equipo de desarrollo / Operaciones

Aunque no es parte automatizada del workflow actual, se recomiendan las siguientes verificaciones manuales o automatizadas tras cada despliegue:

1. **Healthcheck de la API**: Petición a un endpoint de salud (`/health` o similar).
2. **Verificación del frontend**: Acceso a la URL pública y navegación básica.
3. **Logs de contenedores**: Revisión de `docker-compose logs` para detectar errores de inicio.
4. **Base de datos**: Confirmación de que las migraciones se aplicaron correctamente.
5. **SonarQube**: Revisión de las métricas del proyecto correspondiente (`.dev` o base).

---

## Diagrama de Secuencia Detallado

### Desarrollo (`develop`)

```
Developer     GitHub      Self-Hosted    SonarQube    Dockploy    Docker
    |            |           Runner         |           |         |
    |──push──▶   |            |             |           |         |
    |            |──trigger──▶ |             |           |         |
    |            |            |──checkout──▶|           |         |
    |            |            |──lint/test/build──────▶ |         |
    |            |            |             |           |         |
    |            |            |──sonar-scan(dev)──────▶ |         |
    |            |            |  (no espera QG)          |         |
    |            |            |             |           |         |
    |            |            |──POST webhook(dev)───▶|         |
    |            |            |             |           |──build──▶|
    |            |            |             |           |──up -d──▶|
    |            |            |◀──success──────────────|         |
    |            |◀──completed───────────────────────────|         |
```

### Producción (`main`)

```
Developer     GitHub      Self-Hosted    SonarQube    Dockploy    Docker
    |            |           Runner         |           |         |
    |──push──▶   |            |             |           |         |
    |            |──trigger──▶ |             |           |         |
    |            |            |──checkout──▶|           |         |
    |            |            |──lint/test/build──────▶ |         |
    |            |            |             |           |         |
    |            |            |──sonar-scan(prod)─────▶ |         |
    |            |            |◀──quality gate──OK      |         |
    |            |            |             |           |         |
    |            |            |──POST webhook(prod)──▶|         |
    |            |            |             |           |──build──▶|
    |            |            |             |           |──up -d──▶|
    |            |            |◀──success──────────────|         |
    |            |◀──completed───────────────────────────|         |
```

## Estados de Fallo y Recuperación

| Fase | Fallo típico | Impacto | Recuperación |
|---|---|---|---|
| Lint | Error de ESLint | Pipeline detenido. No hay despliegue. | Corregir código y push nuevo. |
| Tests | Test unitario fallido | Pipeline detenido. No hay despliegue. | Corregir test o código y push nuevo. |
| Build | Error de TypeScript/Vite | Pipeline detenido. No hay despliegue. | Corregir errores de compilación. |
| SonarQube (prod) | Quality Gate no superado | Pipeline detenido. No hay despliegue a producción. | Revisar SonarQube, corregir issues, merge corregido a main. |
| SonarQube (dev) | Análisis con issues | Pipeline **continúa**. Despliegue no se bloquea. | Corregir issues antes de promocionar a main. |
| SonarQube | Timeout / No conecta | Pipeline detenido (prod) o continúa (dev). | Verificar estado de SonarQube y red. |
| Dockploy | Webhook no responde | Pipeline detenido. No hay despliegue. | Verificar estado de Dockploy y URL. |
| Dockploy | Docker build falla | Servicio previo sigue corriendo. | Revisar logs de Dockploy/Docker. |

## Registro y Auditabilidad

- Cada ejecución del workflow queda registrada en la pestaña **Actions** del repositorio de GitHub.
- SonarQube mantiene históricos independientes para cada entorno:
  - Proyectos `.dev`: evolución de la calidad durante el desarrollo.
  - Proyectos base: métricas certificadas del código que llega a producción.
- Los logs de Docker (`docker-compose logs`) y los logs del runner se mantienen en el servidor para troubleshooting.

---

**Última actualización:** 22-07-2026
