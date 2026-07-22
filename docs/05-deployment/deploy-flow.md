# Flujo de Despliegue

Este documento detalla el proceso completo de despliegue continuo de EthosPlatform, desde el momento en que un desarrollador envía código hasta que la nueva versión está disponible en producción.

## Visión General del Flujo

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  Push a  │────▶│ GitHub      │────▶│ Self-Hosted  │────▶│ SonarQube│────▶│ Dockploy │
│  main    │     │ Actions     │     │ Runner       │     │ Quality  │     │ Deploy   │
└──────────┘     └─────────────┘     └──────────────┘     │   Gate    │     └──────────┘
                                                         └──────────┘
```

## Paso 1: Push a la rama `main`

**Actor**: Desarrollador / Equipo de desarrollo
**Trigger**: Evento `push` en la rama `main` del repositorio de GitHub.

1. El desarrollador finaliza una funcionalidad o corrección en su rama de trabajo.
2. Realiza merge (o push directo, según política del equipo) hacia la rama `main`.
3. GitHub detecta el evento `push` en `main` y encola el workflow definido en `.github/workflows/deploy.yml`.

**Reglas de concurrencia**:
- El workflow utiliza `concurrency: group: production-deploy` con `cancel-in-progress: false`.
- Esto evita que dos despliegues se ejecuten simultáneamente, garantizando orden y predecibilidad.

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

### 3.1. Análisis del Backend

- Directorio de trabajo: `apps/backend`
- Comando ejecutado:
  ```bash
  sonar-scanner \
    -Dsonar.host.url="$SONAR_HOST_URL" \
    -Dsonar.token="$SONAR_TOKEN" \
    -Dsonar.qualitygate.wait=true \
    -Dsonar.qualitygate.timeout=300
  ```
- Configuración leída desde: `apps/backend/sonar-project.properties`.
- El scanner envía el código fuente, los tests y el reporte `coverage/lcov.info` a SonarQube.

### 3.2. Análisis del Frontend

- Directorio de trabajo: `apps/frontend`
- Comando ejecutado:
  ```bash
  sonar-scanner \
    -Dsonar.host.url="$SONAR_HOST_URL" \
    -Dsonar.token="$SONAR_TOKEN" \
    -Dsonar.qualitygate.wait=true \
    -Dsonar.qualitygate.timeout=300
  ```
- Configuración leída desde: `apps/frontend/sonar-project.properties`.

### 3.3. Evaluación del Quality Gate

- SonarQube procesa los análisis y evalúa las métricas contra el perfil de Quality Gate configurado.
- El parámetro `sonar.qualitygate.wait=true` obliga al scanner a permanecer en espera activa hasta recibir el veredicto.
- **Timeout**: Si después de 300 segundos (5 minutos) no hay respuesta, el comando falla.
- **Fallo posible**:
  - Cobertura de código inferior al umbral definido.
  - Presencia de bugs, vulnerabilidades o code smells bloqueantes.
  - Duplicación de código por encima del límite permitido.
  - Timeout de comunicación con SonarQube.

Si el Quality Gate **falla**, el pipeline se detiene completamente y **no se ejecuta el despliegue**.

---

## Paso 4: Despliegue mediante Dockploy

**Actor**: Self-Hosted Runner + Dockploy
**Job activado**: `deploy` (Deploy via Dockploy)
**Condición**: El job `analysis` debe haberse completado con éxito (`needs: analysis`).

### 4.1. Validación del webhook

- El runner verifica que el secreto `DOCKPLOY_WEBHOOK` esté definido.
- Si falta, el job falla inmediatamente con un mensaje de error claro.

### 4.2. Disparo del webhook

- Comando ejecutado:
  ```bash
  curl --fail --silent --show-error --max-time 60 -X POST \
    -H "Content-Type: application/json" \
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

---

## Diagrama de Secuencia Detallado

```
Developer     GitHub      Self-Hosted    SonarQube    Dockploy    Docker
    |            |           Runner         |           |         |
    |──push──▶   |            |             |           |         |
    |            |──trigger──▶ |             |           |         |
    |            |            |──checkout──▶|           |         |
    |            |            |──lint/test/build──────▶ |         |
    |            |            |             |           |         |
    |            |            |──sonar-scan(backend)──▶  |         |
    |            |            |◀──quality gate──OK      |         |
    |            |            |──sonar-scan(frontend)──▶|         |
    |            |            |◀──quality gate──OK       |         |
    |            |            |             |           |         |
    |            |            |──POST webhook──────────▶|         |
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
| SonarQube | Quality Gate no superado | Pipeline detenido. No hay despliegue. | Revisar SonarQube, corregir issues. |
| SonarQube | Timeout / No conecta | Pipeline detenido. No hay despliegue. | Verificar estado de SonarQube y red. |
| Dockploy | Webhook no responde | Pipeline detenido. No hay despliegue. | Verificar estado de Dockploy y URL. |
| Dockploy | Docker build falla | Servicio previo sigue corriendo. | Revisar logs de Dockploy/Docker. |

## Registro y Auditabilidad

- Cada ejecución del workflow queda registrada en la pestaña **Actions** del repositorio de GitHub.
- SonarQube mantiene un histórico de cada análisis, vinculado al commit correspondiente.
- Los logs de Docker (`docker-compose logs`) y los logs del runner se mantienen en el servidor para troubleshooting.

---

**Última actualización:** 21-07-2026
