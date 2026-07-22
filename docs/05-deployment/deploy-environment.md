# Entorno de Despliegue

Este documento describe todos los componentes —físicos y lógicos— que conforman el entorno de despliegue de EthosPlatform en producción.

## Diagrama Conceptual

![Diagrama de Despliegue - EthosPlatform](../diagrams/images/deployment/Diagrama-Despliegue%20-%20v2%20-%20EthosPlatform.png)

## Componentes Físicos

### Servidor Virtual (VPS)

Servidor privado virtual que aloja todos los servicios de producción y el runner de CI/CD.

- **Función**: Es la única máquina física/virtual dedicada al entorno productivo y al pipeline de despliegue.
- **Requisitos mínimos recomendados**:
  - 2 vCPU (preferiblemente 4 para builds concurrentes)
  - 4 GB RAM (8 GB si se ejecutan análisis de SonarQube en la misma máquina)
  - 40 GB SSD (para imágenes Docker, logs, datos de PostgreSQL y caché de builds)
- **Sistema operativo**: Linux (distro compatible con Docker, e.g., Ubuntu LTS, Debian).
- **Accesos**:
  - SSH (gestión y mantenimiento del servidor).
  - HTTP/HTTPS (tráfico público hacia el frontend y la API).

### Estación de Trabajo del Desarrollador

Computadora local desde donde se realiza el desarrollo y se envían los cambios al repositorio remoto.

- **Función**: Editar código, ejecutar tests locales, realizar commits y pushes a GitHub.
- **Conectividad**: Acceso a Internet para interactuar con GitHub; no requiere acceso directo al VPS.

## Componentes Lógicos

### GitHub Repository

Fuente única de verdad del código fuente del proyecto.

- **Rama protegida**: `main` (única rama que dispara el pipeline de despliegue).
- **Secrets configurados**:
  - `SONAR_HOST_URL`: URL base de la instancia de SonarQube.
  - `SONAR_TOKEN`: Token de autenticación para SonarScanner y SonarQube.
  - `DOCKPLOY_WEBHOOK`: URL completa del webhook de despliegue.
- **Webhook implícito**: GitHub Actions detecta los eventos `push` en `main` y encola el workflow.

### Self-Hosted Runner (Componente GitHub Actions)

Agente de ejecución registrado en el repositorio de GitHub.

- **Estado**: Debe permanecer en estado `Idle` y `Online` en la sección *Settings > Actions > Runners* del repositorio.
- **Identificación**: Etiquetado como `self-hosted`; el workflow lo selecciona con `runs-on: self-hosted`.
- **Servicios locales a los que accede**:
  - SonarQube (por HTTP en puerto interno).
  - Docker Daemon (por socket UNIX o TCP local).
  - Dockploy (por HTTP en puerto interno o loopback).

### SonarQube Instance

Servidor de análisis de calidad de código.

- **Alcance**: Analiza los proyectos `com.ethos.backend` y `com.ethos.frontend`.
- **Integración**: Expone una API REST que consume SonarScanner CLI.
- **Quality Gate**: Define los umbrales mínimos aceptables de calidad. Si un análisis no los cumple, el pipeline se detiene y no se ejecuta el despliegue.
- **Persistencia**: Almacena históricos de análisis, métricas evolutivas y configuraciones de perfiles de calidad.

### Dockploy Service

Servicio de orquestación de despliegues.

- **Mecanismo de activación**: Recibe una solicitud HTTP `POST` con el header `Content-Type: application/json`.
- **Acciones típicas tras recibir el webhook**:
  - Ejecutar `git pull` del repositorio (o recibir la señal de que hay nuevo código).
  - Reconstruir las imágenes Docker: `docker-compose build`.
  - Reiniciar los servicios de forma controlada: `docker-compose up -d`.
  - Ejecutar limpieza de imágenes huérfanas o contenedores detenidos.

### Docker Engine

Runtime de contenedores que ejecuta las imágenes de producción.

- **Función**: Construir, ejecutar y gestionar el ciclo de vida de los contenedores definidos en `docker-compose.yml`.
- **Componentes gestionados**:
  - Red interna `etica_network` (bridge) para comunicación container-to-container.
  - Volumen persistente `postgres_data` para la base de datos.

### Servicios Docker (Contenedores de Producción)

#### Frontend Container (`etica_frontend`)

- **Base**: `nginx:alpine`
- **Puerto expuesto**: `8080:80` (el puerto 8080 del host mapea al 80 del contenedor).
- **Contenido**: Build estático de React compilado por Vite.
- **Configuración en runtime**: `VITE_API_URL` se inyecta como build-arg en la imagen.
- **Dependencias**: Requiere que el backend esté iniciado (`depends_on` con `condition: service_started`).

#### Backend Container (`etica_backend`)

- **Base**: `node:22-alpine`
- **Puerto expuesto**: `3001:3001`
- **Contenido**: Código transpilado de TypeScript y node_modules de producción.
- **Entrypoint**: Ejecuta primero las migraciones de TypeORM y luego inicia el servidor Express.
- **Variables de entorno**: Todas las sensibles (`DB_PASSWORD`, `JWT_SECRET`, etc.) se inyectan vía archivo `.env` del host en Docker Compose.

#### PostgreSQL Container (`etica_postgres`)

- **Imagen**: `postgres:17`
- **Puerto expuesto**: Interno (solo accesible por la red Docker `etica_network`), no se publica directamente al host en producción.
- **Persistencia**: Volumen Docker `postgres_data` montado en `/var/lib/postgresql/data`.
- **Healthcheck**: `pg_isready` verifica disponibilidad cada 10 segundos; el backend espera a que el healthcheck pase antes de iniciar.

## Flujo de Red y Comunicación

| Origen | Destino | Protocolo | Puerto | Descripción |
|---|---|---|---|---|
| Desarrollador | GitHub | HTTPS | 443 | Push de código |
| GitHub Actions | Self-Hosted Runner | HTTPS/WSS | 443 | Descarga de jobs y logs |
| Self-Hosted Runner | SonarQube | HTTP/HTTPS | 9000 | Envío de resultados de análisis |
| Self-Hosted Runner | Dockploy | HTTP/HTTPS | *configurable* | Disparo de webhook de despliegue |
| Cliente Web | Frontend (Nginx) | HTTP/HTTPS | 8080 | Navegación y assets estáticos |
| Frontend (Nginx) | Backend (Node.js) | HTTP | 3001 | Peticiones API REST |
| Backend (Node.js) | PostgreSQL | TCP | 5432 | Consultas y transacciones SQL |

## Consideraciones de Seguridad del Entorno

- **SonarQube**: No está expuesto públicamente; solo el Self-Hosted Runner y administradores internos tienen acceso.
- **Dockploy**: El webhook debe protegerse mediante URL con token secreto único (ya proporcionado por Dockploy). No se expone en logs públicos.
- **Runner de GitHub**: El token de registro del runner (`GITHUB_TOKEN` de registro) debe rotarse periódicamente y almacenarse de forma segura en el servidor.
- **Base de datos**: El puerto 5432 de PostgreSQL no se mapea al host; solo es accesible dentro de la red interna de Docker.
- **Secrets del workflow**: Ninguna credencial sensible se escribe en el código fuente; todas se inyectan mediante `secrets.*` de GitHub Actions en tiempo de ejecución.

---

**Última actualización:** 22-07-2026
