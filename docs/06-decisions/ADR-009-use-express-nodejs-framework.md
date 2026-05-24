# **ADR-009: Use Express Node.js Framework**

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

Se requiere un framework dentro del ecosistema de `Node.js` que facilite la creación de un servidor web y se encargue de manejar las peticiones.

## Decision

Usar `Express` como framework de `Node.js` para manejar estos aspectos.

## Consequences
### Positive

- **Unificación de Lenguaje**: Permite el uso de JavaScript en el backend y frontend.
- **Ligero y Flexible**: No impone una estructura rígida, dando total libertad para diseñar la arquitectura de la aplicación.
- **Ecosistema de Middlewares**: Cuenta con varios módulos preconstruidos que simplifican tareas como la autenticación y el análisis de datos.
- **Curva de Aprendizaje**: Es muy fácil de aprender y empezar a usar.

### Negative

- **Código Repetitivo**: Debido a su enfoque minimalista, a menudo requiere escribir más código base (boilerplate) para configurar cosas básicas.
- **Problemas con Tareas Pesadas**: No es ideal para cálculos matemáticos intensivos o procesamiento paralelo.
- **Calidad de Librerías de Terceros**: Al depender fuertemente de paquetes externos, la calidad y el mantenimiento de algunos de ellos pueden variar.