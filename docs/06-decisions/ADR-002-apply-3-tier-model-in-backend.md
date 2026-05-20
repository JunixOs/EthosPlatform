# **ADR-002: Apply 3-Tier Model In Backend**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 19-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior


## Status

Pendiente

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere una arquitectura sencilla, que permita la separación de responsabilidades, reutilización de código y facilidad de pruebas.

## Decision

Se usará un Modelo de `Tres Capas (3-tier)` (Presentación, Lógica y Datos) para la Arquitectura Cliente-Servidor, este enfoque se basa en la Arquitectura MVC, y añade un servidor de aplicaciones intermedio (API) que procesa la lógica del negocio antes de consultar los datos.

## Consequences
### Positive

- **Separación de Responsabilidades**: Permite trabajar en Backend (`Datos` y `Lógica`) y Frontend (`Presentación`) al mismo tiempo sin interferencias.
- **Mantenimiento y Escalabilidad**: Gracias a la división de partes es más sencillo actualizar la UI, cambiar la BD o corregir errores.
- **Reutilización de Código**: Un mismo modelo de BD puede alimentar diferentes vistas.
- **Facilidad de Pruebas**: Permite realizar pruebas unitarias a los `Datos` y la `Lógica` sin depender de la `Presentación`.

### Negative

- **Curva de Aprendizaje**: Los principiantes pueden tardar en comprender como interactúan las 3 capas.
- **Acoplamiento Potencial**: Si no se diseña bien, la `Lógica` puede terminar absorbiendo demasiada lógica de negocio.