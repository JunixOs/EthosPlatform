# **ADR-003: Separate Backend And Frontend**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 20-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Propuesto

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere desacoplar el lado del cliente y el lado del servidor.

## Decision

Separar el Frontend y Backend de la aplicación.

## Consequences
### Positive

- **Reutilización**: Un mismo Backend puede servir a múltiples plataformas.
- **Independencia de Equipos**: Facilita el trabajo en paralelo dentro de la interfaz y el servidor.
- **Escalabilidad**: Permite escalar el Frontend o el Backend sin romper el otro.
- **Actualizaciones Rápidas**: Cambios en una parte de la aplicación puede publicarse sin modificar la otra.

### Negative

- **Complejidad Inicial**: Requiere configurar dos proyectos distintos, manejar rutas, autenticación por tokens y dominios cruzados (`CORS`).
- **Duplicación de Código**: Ciertas validaciones o modelos deben escribirse tanto en el Fontend como en el Backend.