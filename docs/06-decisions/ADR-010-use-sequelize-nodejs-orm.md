# **ADR-010: Use Sequelize Node.js ORM**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 24-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Propuesto

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere de una herramienta dentro del ecosistema de `Node.js` para el manejo e interacción con los registros de la base de datos `PostgreSQL`.

## Decision

Usar `Squelize` de `Node.js` como `ORM (Object Relational Mapping)` para nuestro proyecto.

## Consequences
### Positive

- **Multi-dialecto**: Soporta una amplia variedad de bases de datos relacionales, incluyendo PostgreSQL, MySQL, SQLite y Microsoft SQL Server.
- **Desarrollo Rápido**: Permite interactuar con la base de datos usando objetos de JavaScript, ahorrando tiempo al no tener que escribir consultas SQL desde cero.
- **Sincronización Automática**: Facilita la creación y actualización de tablas y relaciones en la base de datos directamente desde tu código.
- **Seguridad**: Previene ataques de inyección SQL mediante la parametrización automática de consultas.

### Negative

- **Curva de Aprendizaje**: Abstraer SQL puede ser complejo, y entender cómo funcionan las asociaciones, hooks y transacciones de `Sequelize` requiere tiempo.
- **Problemas con Consultas Complejas**: Cuando necesitas realizar uniones (joins) masivas o subconsultas avanzadas, la sintaxis se vuelve engorrosa y puede generar consultas SQL poco eficientes.
- **Sobrecarga de Rendimiento**: Al ser un `ORM` pesado y repleto de funciones, puede consumir más memoria y tiempo de CPU que un simple constructor de consultas o SQL puro.