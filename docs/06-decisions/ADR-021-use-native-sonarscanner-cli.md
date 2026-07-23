# **ADR-021: Use Native SonarScanner CLI Instead of GitHub Action**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 21-07-2026

**Modified By:**

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Aceptado

## Context

Para enviar los resultados de análisis de código a SonarQube, GitHub Actions ofrece la acción oficial `SonarSource/sonarqube-scan-action`. Esta acción descarga automáticamente el SonarScanner CLI adecuado para la plataforma y lo ejecuta.

Sin embargo, el servidor que funge como Self-Hosted Runner ya cuenta con la herramienta **SonarScanner CLI** preinstalada, disponible en el `PATH` del sistema operativo y mantenida por el equipo de infraestructura.

## Decision

Usar directamente el comando `sonar-scanner` nativo del Self-Hosted Runner en lugar de la GitHub Action `SonarSource/sonarqube-scan-action@v5`.

## Consequences
### Positive

- **Eliminación de Descargas Repetitivas**: La GitHub Action descarga el CLI en cada ejecución. Al usar el binario local, se ahorra tiempo de red y espacio temporal en cada job.
- **Control de Versiones por el Equipo**: El equipo decide cuándo actualizar la versión del SonarScanner CLI, realizando pruebas de compatibilidad previas en un entorno controlado.
- **Independencia de la Red/GitHub Marketplace**: Si GitHub Marketplace experimenta latencia o la acción oficial cambia su API/parámetros, el pipeline no se ve afectado.
- **Alineación con la Arquitectura Self-Hosted**: La filosofía del runner propio es aprovechar las herramientas ya instaladas y estandarizadas en el servidor.

### Negative

- **Riesgo de Desincronización**: Si el equipo olvida actualizar el SonarScanner CLI en el servidor, el pipeline podría ejecutar una versión obsoleta incompatible con la instancia de SonarQube.
- **Menos Portabilidad**: El workflow asume que `sonar-scanner` existe en el `PATH`. Si en el futuro se migra a un runner nuevo o se añade un segundo runner, cada máquina debe tener el CLI instalado y configurado idénticamente.
- **Sin Ocultamiento Automático de Sensibles**: La acción oficial de GitHub enmascara automáticamente ciertos parámetros en los logs. Al usar `run: |`, el equipo debe asegurarse de que los tokens no se expongan (GitHub Actions ya lo hace con `secrets.*`, pero la responsabilidad recae en la correcta interpolación de variables).

## Alternatives Considered

- **SonarSource/sonarqube-scan-action@v5**:
  - *Pros*: Descarga automática del CLI correcto, abstracción de parámetros, portabilidad inmediata a cualquier runner nuevo.
  - *Contras*: Descarga redundante en cada ejecución en un runner propio. Dependencia de la disponibilidad de GitHub Marketplace y de la continuidad de la acción oficial.
