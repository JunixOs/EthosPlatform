# **ADR-011: Use Bootstrap Framework**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 24-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Sustituido (ADR-012)

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere de una tecnología o framework para la construcción del frontend del proyecto, que permite diseño responsive de forma rápida.

## Decision

Usar el framework CSS de `Bootstrap` para el diseño del frontend.

## Consequences
### Positive

- **Desarrollo Rápido**: Permite maquetar y crear prototipos en horas gracias a sus componentes ya construidos.
- **Diseño Adaptativo**: Su sistema de cuadrícula (grid) garantiza que el sitio se vea bien en móviles, tablets y ordenadores sin esfuerzo adicional.
- **Compatibilidad**: Los elementos están probados y funcionan correctamente en todos los navegadores principales.

### Negative

- **Sitios Web Uniformes**: Al usar los estilos predeterminados, muchos sitios creados con `Bootstrap` se ven similares si no se personalizan a fondo.
- **Tamaño y Rendimiento**: Los archivos de `Bootstrap` incluyen mucho código que a menudo no se utiliza, lo que puede ralentizar el tiempo de carga de la página.
- **HTML Sobrecargado**: Requiere añadir muchas clases específicas en el código HTML para lograr los diseños deseados.