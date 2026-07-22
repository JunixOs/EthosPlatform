# EthosPlatform

> Plataforma web comunitaria que permite a sus usuarios compartir experiencias personales estructuradas relacionadas con reflexiones éticas y morales.

---

## Tabla de contenidos

- [Propósito e idea del proyecto](#propósito-e-idea-del-proyecto)
- [Arquitectura y stack tecnológico](#arquitectura-y-stack-tecnológico)
- [Estructura del monorepo](#estructura-del-monorepo)
- [Requisitos previos](#requisitos-previos)
- [Instalación y uso local](#instalación-y-uso-local)
- [Scripts disponibles](#scripts-disponibles)
- [Testing](#testing)
- [Estrategia de despliegue (CI/CD)](#estrategia-de-despliegue-cicd)
- [Configuración de producción con Docker](#configuración-de-producción-con-docker)
- [Documentación](#documentación)
- [Autores y créditos](#autores-y-créditos)
- [Licencia](#licencia)

---

## Propósito e idea del proyecto

**EthosPlatform** nace como un espacio digital seguro y anónimo donde las personas pueden narrar, reflexionar y debatir sobre dilemas morales y experiencias éticas vividas en su día a día. A través de una interfaz moderna e intuitiva, los usuarios pueden:

- Publicar experiencias personales estructuradas.
- Interactuar con la comunidad mediante etiquetado, comentarios y moderación colaborativa.
- Explorar contenido categorizado y moderado para fomentar un entorno de respeto y aprendizaje mutuo.

El sistema está diseñado bajo una arquitectura limpia que separa claramente las responsabilidades entre presentación, dominio e infraestructura, facilitando el mantenimiento a largo plazo y la escalabilidad.

---

## Arquitectura y stack tecnológico

El proyecto se organiza como un **monorepo** gestionado con **pnpm workspaces**. Está dividido en tres capas principales: aplicaciones (`apps`), paquetes compartidos (`packages`) y pruebas end-to-end (`tests`).

### Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 22 | Runtime de JavaScript/TypeScript |
| TypeScript | ~6.0 | Tipado estático y desarrollo robusto |
| Express | ^5.2.1 | Framework HTTP para la API REST |
| TypeORM | ^0.3.20 | ORM para modelado y migraciones de PostgreSQL |
| PostgreSQL | 17 | Base de datos relacional de producción |
| Zod | ^4.4.3 | Validación de esquemas de entrada |
| JWT (jsonwebtoken) | ^9.0.3 | Autenticación basada en tokens |
| Vitest | ^4.1.10 | Framework de testing unitario e integración |

### Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| React | ^19.2.6 | Librería UI declarativa |
| Vite | ^8.0.16 | Build tool y dev server ultrarrápido |
| TypeScript | ~6.0 | Tipado estático en toda la capa de presentación |
| TailwindCSS | ^4.3.0 | Framework de utilidades CSS |
| React Router DOM | ^7.17.0 | Enrutamiento del lado del cliente |
| Zustand | ^5.0.14 | Gestión de estado global ligera |
| Vitest + jsdom | ^4.1.10 | Testing de componentes y lógica de UI |
| Playwright | — | Testing end-to-end (E2E) |

### Infraestructura y DevOps

| Tecnología | Propósito |
|---|---|
| **pnpm** | Gestor de paquetes y workspaces del monorepo |
| **Docker + Docker Compose** | Contenedorización y orquestación de producción |
| **GitHub Actions** | Orquestación del pipeline de CI/CD |
| **Self-Hosted Runner** | Ejecución del pipeline en la infraestructura propia |
| **SonarQube + SonarScanner CLI** | Análisis continuo de calidad y seguridad del código |
| **Dockploy** | Despliegue continuo activado por webhook |
| **Nginx** | Servidor web estático para el frontend en producción |

---

## Estructura del monorepo

```
ethos-platform-app/
├── .github/workflows/          # Workflows de CI/CD (GitHub Actions)
├── apps/
│   ├── backend/                # API REST (Node.js + Express + TypeORM)
│   └── frontend/               # SPA React (Vite + TailwindCSS)
├── packages/
│   ├── shared/                 # Utilidades y lógica compartida
│   ├── types/                  # Definiciones de tipos globales
│   └── ui/                     # Componentes de interfaz reutilizables
├── tests/
│   └── e2e/                    # Pruebas end-to-end con Playwright
├── docs/                         # Documentación del proyecto (arquitectura, ADRs, guías)
├── docker-compose.yml            # Orquestación de producción
├── package.json                  # Scripts y configuración raíz del monorepo
└── pnpm-workspace.yaml           # Definición de workspaces de pnpm
```

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado en tu máquina:

- **Node.js** `22.x` (se recomienda usar [nvm](https://github.com/nvm-sh/nvm) o [fnm](https://github.com/Schniz/fnm))
- **pnpm** `11.8.0` o superior (se habilita automáticamente via `corepack`)
- **Git**
- **Docker** y **Docker Compose** (solo si deseas levantar el entorno de producción localmente)
- Una instancia de **PostgreSQL** local o en contenedor (para desarrollo)

Verifica tu entorno:

```bash
node -v   # v22.x.x
pnpm -v   # 11.8.0+
git --version
```

---

## Instalación y uso local

### 1. Clonar el repositorio

```bash
git clone https://github.com/JunixOs/EthosPlatform.git
cd EthosPlatform
```

### 2. Instalar dependencias

```bash
pnpm install
```

> Esto instalará todas las dependencias del monorepo, incluyendo backend, frontend, paquetes compartidos y pruebas E2E.

### 3. Configurar variables de entorno

#### Backend (`apps/backend/.env`)

Copia el archivo de ejemplo:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edita `apps/backend/.env` con tus valores:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
DB_NAME=ethos_platform
NODE_ENV=development

# Obligatorio: secreto para firmar tokens JWT (mínimo 32 caracteres)
JWT_SECRET=cambia_esto_por_un_secreto_seguro_de_al_menos_32_caracteres
```

#### Frontend (`apps/frontend/.env`)

Crea el archivo:

```bash
touch apps/frontend/.env
```

Con el siguiente contenido:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Crear la base de datos

Asegúrate de tener PostgreSQL corriendo y crea la base de datos especificada en `DB_NAME`.

### 5. Ejecutar en modo desarrollo

Desde la raíz del proyecto:

```bash
pnpm dev
```

Esto levantará simultáneamente:

- **Backend** en `http://localhost:3001`
- **Frontend** en `http://localhost:5173`

### 6. Poblar datos de prueba (opcional)

```bash
pnpm db:seed
```

---

## Scripts disponibles

Todos los scripts se ejecutan desde la raíz del proyecto (`package.json` raíz).

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia backend y frontend en modo desarrollo |
| `pnpm build` | Compila todas las aplicaciones del monorepo |
| `pnpm build:backend` | Compila únicamente el backend |
| `pnpm build:frontend` | Compila únicamente el frontend |
| `pnpm test` | Ejecuta todos los tests unitarios e integrales |
| `pnpm test:backend` | Tests del backend con Vitest |
| `pnpm test:frontend` | Tests del frontend con Vitest |
| `pnpm test:coverage` | Tests con reporte de cobertura para ambas apps |
| `pnpm lint` | Ejecuta ESLint en backend y frontend |
| `pnpm format` | Formatea el código con Prettier |
| `pnpm format:check` | Verifica el formato sin modificar archivos |
| `pnpm db:seed` | Ejecuta el seeder de la base de datos |
| `pnpm e2e` | Ejecuta las pruebas end-to-end con Playwright |
| `pnpm e2e:ui` | Ejecuta Playwright con interfaz gráfica de depuración |
| `pnpm sonar:scan` | Ejecuta SonarScanner CLI localmente (requiere configuración previa) |
| `pnpm quality:check` | Ejecuta tests con cobertura y análisis de SonarQube |

---

## Testing

El proyecto adopta una estrategia de testing en tres niveles:

1. **Unitarios e integrales** (`vitest`)
   - Backend: entorno `node`, cobertura con `v8`.
   - Frontend: entorno `jsdom`, cobertura con `v8`.
2. **End-to-End (E2E)** (`playwright`)
   - Flujos completos de usuario en navegador real.
3. **Análisis estático**
   - Linting con ESLint.
   - Formateo con Prettier.
   - Análisis de calidad con SonarQube.

Ejecutar tests con cobertura:

```bash
pnpm test:coverage
```

Los reportes de cobertura se generan en `apps/backend/coverage/` y `apps/frontend/coverage/`, en formatos `text`, `html`, `lcov` y `json-summary`.

---

## Estrategia de despliegue (CI/CD)

EthosPlatform utiliza un pipeline de **Integración Continua (CI) + Entrega Continua (CD)** completamente automatizado. Cada `push` a la rama `main` desencadena el siguiente flujo:

```
┌─────────┐    ┌──────────────┐    ┌──────────────────┐    ┌───────────┐    ┌─────────┐
│  Push   │───▶│ GitHub       │───▶│ Self-Hosted      │───▶│ SonarQube │───▶│ Dockploy│
│  main   │    │ Actions      │    │ Runner           │    │ Quality   │    │ Deploy  │
└─────────┘    └──────────────┘    └──────────────────┘    │ Gate      │    └─────────┘
                                                          └───────────┘
```

### Fases del pipeline

| Fase | Herramienta | Descripción |
|---|---|---|
| **Checkout** | `actions/checkout@v4` | Descarga limpia del código en el runner |
| **Build & Dependencies** | pnpm + Node.js 22 | Instalación de dependencias y compilación |
| **Lint** | ESLint | Verificación de calidad de código estático |
| **Tests** | Vitest | Ejecución de tests con generación de cobertura LCOV |
| **Quality Gate** | SonarScanner CLI + SonarQube | Análisis de seguridad, bugs, deuda técnica y cobertura. Bloquea el pipeline si no se cumplen los umbrales. |
| **Deploy** | Dockploy (webhook) | Disparo de webhook que reconstruye y reinicia los contenedores Docker en producción |

### Componentes clave del despliegue

- **GitHub Actions**: Orquesta el pipeline declarativo en `.github/workflows/deploy.yml`.
- **Self-Hosted Runner**: Servidor propio que ejecuta los jobs. Tiene acceso directo a SonarQube, Docker y Dockploy dentro de la red privada.
- **SonarQube**: Autoridad de calidad. Proyectos configurados: `com.ethos.backend` y `com.ethos.frontend`.
- **Dockploy**: Recibe la señal de despliegue vía HTTP POST y ejecuta `docker-compose build && docker-compose up -d`.

### Secrets requeridos en GitHub

Configura los siguientes secrets en tu repositorio (`Settings > Secrets and variables > Actions`):

| Secret | Descripción |
|---|---|
| `SONAR_HOST_URL` | URL de tu instancia de SonarQube (ej: `http://sonar.tudominio.com:9000`) |
| `SONAR_TOKEN` | Token de análisis generado en SonarQube |
| `DOCKPLOY_WEBHOOK` | URL completa del webhook de despliegue de Dockploy |

---

## Configuración de producción con Docker

El entorno de producción se levanta mediante **Docker Compose** (`docker-compose.yml`), orquestando tres servicios:

| Servicio | Imagen base | Puerto expuesto | Descripción |
|---|---|---|---|
| `frontend` | `nginx:alpine` | `8080:80` | Build estático de React servido por Nginx |
| `backend` | `node:22-alpine` | `3001:3001` | API REST con Express y TypeORM |
| `postgres` | `postgres:17` | Interno (5432) | Base de datos relacional persistente |

### Levantar en producción

Asegúrate de tener un archivo `.env` en el servidor con las variables necesarias:

```env
VITE_API_URL=https://api.tudominio.com
PORT=3001
FRONTEND_URL=https://tudominio.com
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ethos_platform
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_secreto_jwt_muy_seguro
```

Luego ejecuta:

```bash
docker-compose up -d --build
```

### Características de producción

- `restart: unless-stopped` en todos los servicios.
- Red interna dedicada (`etica_network`) para comunicación segura entre contenedores.
- Healthcheck en PostgreSQL; el backend espera a que la base de datos esté saludable antes de iniciar.
- El backend ejecuta migraciones de TypeORM automáticamente al arrancar.

---

## Documentación

El proyecto incluye documentación extensa bajo la carpeta `docs/`:

- **`docs/00-overview/`**: Visión, alcance y stakeholders.
- **`docs/01-requirements/`**: Requisitos funcionales y no funcionales, casos de uso.
- **`docs/02-architecture/`**: Vista de arquitectura, estilo, patrones de integración y modelos C4.
- **`docs/03-data-model/`**: Modelo relacional y diagramas entidad-relación.
- **`docs/04-ui-ux/`**: Prototipos de interfaz.
- **`docs/05-deployment/`**: Tecnologías de despliegue, entorno de producción y flujo de despliegue.
- **`docs/06-decisions/`**: Registro de Decisiones de Arquitectura (ADRs).
- **`docs/guides/`**: Guías de desarrollo, testing y documentación.

---

## Autores y créditos

- **Javier Orneta, Ángel Paolo**
- **Ordoñez Silva, Yonel Junior**

---

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

Copyright (c) 2026 Js24
