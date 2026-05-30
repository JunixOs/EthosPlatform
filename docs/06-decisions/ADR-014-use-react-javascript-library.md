# **ADR-014: Use React JavaScript Library**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 30-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Pendiente

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere de una tecnología para el desarrollo de la Interfaz de Usuario o Frontend de la aplicación, que sea rápido, flexible y escalable.

## Decision

Usar la librería de JavaScript, `React`, para el desarrollo de la `UI` de la aplicación.

## Consequences
### Positive

- **Componentes Reutilizables**: Permite dividir la interfaz en bloques de código independientes, lo que facilita enormemente el mantenimiento y escalabilidad a largo plazo.
- **Alto Rendimiento**: Gracias al `DOM` virtual, que permite actualizar solo los elementos necesarios en la página en lugar de recargar todo el `DOM`, ahorra recursos y mejora la fluidez.
- **Comunidad y Ecosistema Enormes**: Cuenta con el respaldo de Meta (Facebook), una gran cantidad de librerías de terceros y una alta demanda laboral.

### Negative

- **Curva de Aprendizaje**: Al no ser un framework completo con reglas estrictas, exige conocimientos previos sólidos de JavaScript moderno y requiere aprender a integrar múltiples herramientas.
- **Evolución Rápida**: La biblioteca se actualiza con frecuencia, lo que puede hacer que la documentación quede rápidamente obsoleta lo cual obliga a los desarrolladores a adaptarse a nuevos métodos.
- **Problema de "Solo la Vista"**: React se encarga principalmente de la `UI`. Para una aplicación completa, se deben elegir y combinar otras librerías para el enrutamiento (routing), gestión de estado y llamadas API.