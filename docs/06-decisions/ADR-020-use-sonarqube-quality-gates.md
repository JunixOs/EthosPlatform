# **ADR-020: Use SonarQube as Quality Gate Authority**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 21-07-2026

**Modified By:**

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Aceptado

## Context

EthosPlatform es un monorepo con dos aplicaciones principales (backend y frontend) escritas en TypeScript. A medida que el equipo y la base de código crecen, es necesario establecer un mecanismo objetivo y automatizado que impida que código de baja calidad, con bugs potenciales o vulnerabilidades de seguridad, llegue al entorno de producción.

Se requiere una herramienta que analice métricas de calidad de forma continua, mantenga un histórico evolutivo y pueda bloquear el pipeline de despliegue si no se cumplen ciertos umbrales.

## Decision

Usar **SonarQube** como la autoridad central de calidad de código, configurado con Quality Gates activos que bloquean el despliegue si el análisis no es satisfactorio.

## Consequences
### Positive

- **Bloqueo Automático de Código de Baja Calidad**: La configuración `sonar.qualitygate.wait=true` en el pipeline garantiza que ningún commit que introduzca bugs críticos, vulnerabilidades o cobertura insuficiente llegue a producción.
- **Visibilidad Histórica**: SonarQube mantiene un registro temporal de métricas (cobertura, deuda técnica, duplicación), permitiendo evaluar la evolución de la salud del proyecto.
- **Análisis Multilenguaje y Multiproyecto**: Una sola instancia de SonarQube puede analizar tanto el backend (Node.js/TS) como el frontend (React/TS), centralizando la gobernanza de calidad.
- **Integración con CI/CD Nativa**: La API REST de SonarQube permite que el Self-Hosted Runner consulte el estado del Quality Gate de forma síncrona antes de continuar con el despliegue.

### Negative

- **Requiere Infraestructura Adicional**: SonarQube necesita un servidor con recursos dedicados (mínimo 2 GB RAM para Community Edition, más base de datos embebida o externa).
- **Curva de Configuración Inicial**: Los perfiles de calidad, umbrales de cobertura y reglas de seguridad requieren ajuste iterativo al inicio para evitar falsos positivos o bloqueos excesivos.
- **Tiempo de Análisis**: En proyectos grandes, el análisis y la evaluación del Quality Gate pueden añadir varios minutos al pipeline total.

## Alternatives Considered

- **SonarCloud (SaaS)**:
  - *Pros*: Sin infraestructura propia que mantener, integración directa con GitHub.
  - *Contras*: Para repositorios privados puede generar costos. Menor control sobre los datos de código fuente analizados (tercerización de la información).
- **ESLint + Vitest Coverage Thresholds (sin SonarQube)**:
  - *Pros*: Ligero, sin servidor adicional.
  - *Contras*: No proporciona análisis de deuda técnica, duplicación de código ni seguridad (SAST). La configuración de reglas complejas se vuelve difícil de centralizar y auditar.
- **CodeClimate / DeepSource**:
  - *Pros*: Servicios SaaS especializados en calidad.
  - *Contras*: Menor madurez en análisis de seguridad para TypeScript/Node.js comparado con SonarQube. Requieren acceso público al repositorio o configuraciones de red adicionales.
