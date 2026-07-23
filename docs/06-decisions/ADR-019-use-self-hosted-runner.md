# **ADR-019: Use Self-Hosted Runner for GitHub Actions**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 21-07-2026

**Modified By:**

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Aceptado

## Context

Una vez definido GitHub Actions como plataforma de CI/CD, fue necesario elegir el tipo de runner (agente de ejecución) que ejecutaría los jobs del workflow. Los runners pueden ser gestionados por GitHub (GitHub-hosted) o gestionados por el propio equipo (Self-hosted).

El entorno de producción de EthosPlatform incluye servicios internos críticos —como SonarQube y Dockploy— que residen dentro de una red privada y no están expuestos públicamente a Internet.

## Decision

Usar un **Self-Hosted Runner** registrado en el repositorio de GitHub para ejecutar los workflows de CI/CD.

## Consequences
### Positive

- **Acceso Directo a Servicios Internos**: El runner reside en la misma red privada que SonarQube y Dockploy, eliminando la necesidad de exponer estos servicios al público o configurar túneles VPN complejos.
- **Cero Costo de Minutos de GitHub**: No se consumen los minutos incluidos ni pagados de los runners hospedados por GitHub, lo cual es económicamente ventajoso para pipelines frecuentes o de larga duración.
- **Cache y Dependencias Persistentes**: Herramientas como Node.js, pnpm, SonarScanner CLI y Docker se instalan una sola vez en el servidor y se reutilizan entre ejecuciones, reduciendo drásticamente los tiempos de build.
- **Control Total del Entorno**: El equipo decide las versiones del sistema operativo, los recursos hardware (CPU, RAM, disco) y las políticas de seguridad del runner.

### Negative

- **Responsabilidad de Mantenimiento**: El equipo debe mantener el sistema operativo del runner, aplicar parches de seguridad, monitorear disponibilidad y rotar tokens de registro.
- **Single Point of Failure**: Si el servidor del runner falla o se desconecta, el pipeline completo se detiene hasta que se restaure el servicio.
- **Riesgo de Contaminación entre Ejecuciones**: Sin una limpieza adecuada del workspace (`clean: true` en checkout), archivos residuales de ejecuciones anteriores podrían interferir con builds posteriores.

## Alternatives Considered

- **GitHub-Hosted Runners (ubuntu-latest)**:
  - *Pros*: Mantenimiento cero, alta disponibilidad, entorno limpio en cada ejecución.
  - *Contras*: Requeriría exponer SonarQube y Dockploy públicamente (o mediante túneles/cloud VPN). Consumo de minutos facturables. Instalación de herramientas desde cero en cada job, aumentando el tiempo de ejecución.
- **Runner en Cloud (AWS EC2 / GCP Compute / Azure VM) separado de producción**:
  - *Pros*: Escalabilidad y desacoplamiento parcial.
  - *Contras*: Añade complejidad de red (peering, VPN) para comunicarse con SonarQube y Dockploy. Costo adicional de infraestructura cloud.
