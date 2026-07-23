# **ADR-018: Use GitHub Actions as CI/CD Platform**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 21-07-2026

**Modified By:**

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Aceptado

## Context

EthosPlatform requiere un pipeline automatizado que compile, pruebe, analice calidad y despliegue el código cada vez que se integren cambios a la rama principal (`main`).

Se evaluó la necesidad de adoptar una plataforma de integración continua (CI) y entrega continua (CD) que se integre de forma nativa con el repositorio de código actual (GitHub).

## Decision

Usar **GitHub Actions** como plataforma de orquestación del pipeline de CI/CD del proyecto.

## Consequences
### Positive

- **Integración Nativa**: GitHub Actions está embebido en el repositorio. No requiere configuraciones externas de webhooks ni autenticaciones adicionales para detectar eventos de código.
- **YAML Declarativo**: Los workflows se definen en archivos `.yml` versionados junto al código, lo que facilita la trazabilidad de cambios en el pipeline.
- **Marketplace de Acciones**: Existe un extenso catálogo de acciones reutilizables (checkout, setup-node, cache, entre otras) que acelera la creación y mantenimiento del pipeline.
- **Gratuito para Repositorios Públicos y con Límites Generosos para Privados**: Apto para el tamaño y frecuencia de despliegue actual del proyecto.

### Negative

- **Acoplamiento a GitHub**: Si en el futuro se migra el código a otra plataforma (GitLab, Bitbucket), el pipeline deberá reescribirse casi por completo.
- **Complejidad en Monorepos**: Aunque soporta matrices y filtros, la configuración de jobs condicionales por workspace (backend vs. frontend) puede volverse verbosa.
- **Observabilidad Limitada**: Los logs de ejecución se purgan después de un tiempo. Para auditoría a largo plazo se requiere exportar logs o usar herramientas de terceros.

## Alternatives Considered

- **GitLab CI/CD**: Requeriría migrar el repositorio a GitLab o configurar un mirror, generando sobrecarga innecesaria.
- **Jenkins**: Ofrece flexibilidad total, pero implica mantener un servidor dedicado exclusivamente para CI, aumentando la complejidad operativa.
- **CircleCI / Travis CI**: Plataformas externas robustas, pero añaden una capa de autenticación y facturación adicional sin ventajas significativas sobre la integración nativa de GitHub Actions.
