# Tecnologías de Despliegue

Este documento describe las tecnologías, herramientas y servicios utilizados para el proceso de integración continua, análisis de calidad y despliegue continuo (CI/CD) de EthosPlatform.

## GitHub Actions

**GitHub Actions** es la plataforma de automatización nativa de GitHub utilizada para orquestar el pipeline de CI/CD del proyecto.

- **Rol en el proyecto**: Orquesta todo el flujo de integración continua y despliegue continuo. Se dispara automáticamente ante eventos de `push` a la rama `main`.
- **Workflow principal**: `.github/workflows/deploy.yml`
- **Jobs definidos**:
  - `analysis`: Construcción del proyecto, ejecución de tests con cobertura, linting y análisis de calidad con SonarQube.
  - `deploy`: Disparo del webhook de despliegue hacia Dockploy una vez superada la fase de análisis.
- **Ventajas para el proyecto**:
  - Integración nativa con el repositorio de código.
  - Capacidad de ejecutar runners propios (self-hosted) dentro de la infraestructura del equipo.
  - Soporte para definir concurrencia, timeouts y variables de entorno de forma declarativa en YAML.

## Self-Hosted Runner

Un **Self-Hosted Runner** es una máquina virtual o física propiedad del equipo, registrada en GitHub Actions para ejecutar los workflows del proyecto.

- **Rol en el proyecto**: Es el ejecutor físico del pipeline de CI/CD. Recibe las órdenes de GitHub, descarga el código, instala dependencias, ejecuta tests y análisis, y finalmente dispara el despliegue.
- **Ubicación**: Reside dentro de la misma red privada donde se alojan SonarQube, Dockploy y los servicios Docker de producción.
- **Ventajas para el proyecto**:
  - Acceso directo y de baja latencia a los servicios internos (SonarQube, Dockploy, Docker Engine).
  - No se consumen minutos de los runners hospedados por GitHub (costo cero en términos de facturación de GitHub).
  - Posibilidad de instalar herramientas específicas (SonarScanner CLI, Docker, Node.js) una sola vez y reutilizarlas entre ejecuciones.
- **Mantenimiento**: El servidor debe mantenerse actualizado (sistema operativo, dependencias, tokens de registro del runner) y monitoreado para garantizar disponibilidad del pipeline.

## SonarQube

**SonarQube** es una plataforma de inspección continua de código que permite medir y mejorar la calidad y seguridad del software.

- **Rol en el proyecto**: Actúa como la autoridad de calidad de código antes de permitir que cualquier cambio llegue a producción. Cada push a `main` genera un análisis completo de backend y frontend.
- **Proyectos configurados**:
  - `com.ethos.backend`: Análisis del código fuente y tests del backend (Node.js/TypeScript).
  - `com.ethos.frontend`: Análisis del código fuente y tests del frontend (React/TypeScript).
- **Quality Gate**: Configurado con `sonar.qualitygate.wait=true`, lo que bloquea el pipeline si el código no cumple con los umbrales definidos (cobertura mínima, ausencia de bugs críticos, vulnerabilities, code smells).
- **Métricas principales analizadas**:
  - Cobertura de tests (reporte LCOV generado por Vitest).
  - Bugs, vulnerabilidades y hotspots de seguridad.
  - Deuda técnica y code smells.
  - Duplicación de código.

## SonarScanner CLI

**SonarScanner CLI** es la herramienta de línea de comandos oficial de SonarSource que analiza el código fuente y envía los resultados a una instancia de SonarQube.

- **Rol en el proyecto**: Es el componente ejecutor del análisis. Se invoca directamente desde el workflow de GitHub Actions dentro del Self-Hosted Runner.
- **Instalación**: Preinstalado y disponible en el `PATH` del Self-Hosted Runner.
- **Configuración por proyecto**: Cada aplicación (`apps/backend` y `apps/frontend`) posee su propio archivo `sonar-project.properties` que define:
  - `sonar.projectKey` y `sonar.projectName`
  - Rutas de fuentes (`sonar.sources`) y tests (`sonar.tests`)
  - Rutas del reporte de cobertura (`sonar.javascript.lcov.reportPaths`)
  - Exclusiones y filtros
- **Parámetros dinámicos**: El workflow inyecta en tiempo de ejecución:
  - `-Dsonar.host.url`: URL de la instancia de SonarQube (obtenida de `secrets.SONAR_HOST_URL`).
  - `-Dsonar.token`: Token de autenticación (obtenido de `secrets.SONAR_TOKEN`).
  - `-Dsonar.qualitygate.wait=true` y `timeout=300`: Espera activa al Quality Gate.

## Dockploy

**Dockploy** es la herramienta de despliegue continuo (CD) utilizada para automatizar la publicación de los contenedores Docker en el entorno de producción.

- **Rol en el proyecto**: Recibe una señal del pipeline de CI/CD (vía webhook HTTP) y ejecuta el proceso de reconstrucción y reinicio de los servicios Docker definidos en `docker-compose.yml`.
- **Mecanismo de activación**: El job `deploy` del workflow realiza una petición `POST` a la URL del webhook de Dockploy, almacenada en el secreto `DOCKPLOY_WEBHOOK`.
- **Ventajas para el proyecto**:
  - Despliegue sencillo basado en webhooks, sin necesidad de exponer SSH manualmente.
  - Reconstrucción automatizada de imágenes Docker a partir del código actualizado.
  - Reinicio controlado de servicios con `docker-compose`.

## Docker y Docker Compose

**Docker** es la tecnología de contenedorización utilizada para empaquetar y ejecutar los servicios de la plataforma. **Docker Compose** define y orquesta los servicios multi-contenedor.

- **Rol en el proyecto**: Proporciona el entorno de ejecución aislado y reproducible para el backend (Node.js), frontend (Nginx + build estático) y la base de datos (PostgreSQL).
- **Servicios definidos**:
  - `frontend`: Imagen basada en Nginx que sirve los assets compilados de React.
  - `backend`: Imagen basada en Node.js 22 Alpine que ejecuta la API REST y las migraciones de TypeORM.
  - `postgres`: Instancia de PostgreSQL 17 con volumen persistente para los datos.
- **Características de producción**:
  - `restart: unless-stopped` en todos los servicios.
  - Red interna explícita (`etica_network`) para comunicación entre contenedores.
  - Healthcheck configurado en PostgreSQL para garantizar disponibilidad antes de levantar el backend.
  - `depends_on` con condiciones de salud para controlar el orden de arranque.

## Resumen de Interacción

| Tecnología | Fase del Pipeline | Interactúa con |
|---|---|---|
| GitHub Actions | Orquestación completa | Self-Hosted Runner, GitHub Secrets |
| Self-Hosted Runner | Ejecución física | SonarScanner CLI, Docker, pnpm, Node.js |
| SonarQube | Quality Gate (post-test) | SonarScanner CLI (vía HTTP/REST) |
| SonarScanner CLI | Análisis de código | Código fuente, SonarQube |
| Dockploy | Despliegue (post-Quality Gate) | Docker Engine, Docker Compose |
| Docker Compose | Infraestructura de ejecución | Imágenes Docker, volúmenes, redes |

---

**Última actualización:** 21-07-2026
