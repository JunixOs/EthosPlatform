# **ADR-013: Use TypeORM Node.js ORM**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 29-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Pendiente

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere de una herramienta dentro del ecosistema de `Node.js` para el manejo e interacción con los registros de la base de datos `PostgreSQL`, que además, permita trabajar de forma nativa con TypeScript.

## Decision

Usar `TypeORM` de `Node.js` como `ORM (Object Relational Mapping)` para nuestro proyecto.

## Consequences
### Positive

- **Diseñado para TypeScript**: Hace uso de tipos estáticos y decoradores (como `@Entity` y `@Column`), lo que permite un código más seguro.
- **Soporte Multibase de Datos**: Es compatible con una amplia variedad de bases de datos, incluyendo PostgreSQL, MySQL, MariaDB, Oracle y MongoDB.
- **Sincronización y Migraciones**: Incluye herramientas para generar migraciones automáticas basadas en la modificación de entidades, o sincronizar directamente el esquema de base de datos con tu código.
- **Flexibilidad en Consultas**: Posee un potente `Query Builder` y permite ejecutar consultas SQL nativas cuando necesitas alto rendimiento.

### Negative

- **Curva de Aprendizaje**: Su alto nivel de abstracción requiere entender bien las tecnologías subyacentes. Abusar de la "magia" del `ORM` sin comprender cómo se traduce a SQL puede causar problemas.
- **Sobrecarga de Rendimiento**: En consultas muy complejas, el `ORM` añade sobrecarga por mapeo y metadatos, lo que lo hace más lento que escribir consultas SQL puras.
- **Depuración Compleja**: Cuando ocurren errores en mapeos complejos, rastrear el problema a través de las capas del `ORM` puede llegar a ser frustrante.