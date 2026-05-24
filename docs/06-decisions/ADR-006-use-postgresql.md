# **ADR-006: Use PostgreSQL**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 24-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Pendiente

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere de un `Sistema Gestor de Bases de Datos Relacionales` que sea potente, fiable, flexible y que sea gratuito.

## Decision

Usar `PostgreSQL` como `Sistema Gestor de Bases de Datos` para el proyecto.

## Consequences
### Positive

- **Open Source**: Es gratis y libre de costos de licencia, respaldado por una amplia comunidad.
- **Extensible**: Te permite definir o crear tus propios tipos de datos, funciones y lenguajes.
- **Alta Concurrencia**: Permite lecturas y escrituras simultáneas sin bloquear la base de datos.

### Negative

- **Mayor Consumo de Recursos**: Tiende a consumir más que otras bases de datos más ligeras al ejecutar consultas complejas.
- **Optimización en Tareas Simples**: Su arquitectura puede resultar excesiva comparadas con motores más simples.
- **Escalado Horizontal Complejo**: La distribución de bases de datos en varias máquinas requiere herramientas o configuraciones adicionales.