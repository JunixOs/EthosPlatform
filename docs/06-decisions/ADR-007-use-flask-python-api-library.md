# ADR-007: Use Flask Python API Library

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 22-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Sustituido (ADR-008)

### Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se necesita de un framework para el Backend que sea poco estricto con la estructura para que se adapte a la arquitectura del proyecto y que además permita exponer una API REST que pueda ser consumida desde el Frontend.

### Decision

Usar el microframework de Python `Flask` para la capa de `Lógica` de nuestra arquitectura `Cliente-Servidor`.

## Consequences
### Positive

- **Curva de Aprendizaje Baja**: Posee sintaxis intuitiva permitiendo desplegar proyectos sencillos en poco tiempo.
- **Altamente Personalizable**: Permite la integración sencilla de bases de datos (PostgreSQL o MongoDB) y librerías de terceros.
- **Ligero y Rápido**: Consume menos recursos del sistema en comparación con frameworks más robustos y completos.

### Negative

- **Escalabilidad**: Flask, al responder una solicitud a la vez, se puede volver lento cuando reciba muchas solicitudes.
- **Falta de Funcionalidades**: No incluye componentes como panel de administración o sistemas de seguridad predeterminados, lo que requiere configuración manual.
- **Dependencia de Terceros**: Flask integra extensiones para casi todo, por lo que se depende de que otros lo mantengan y actualicen.