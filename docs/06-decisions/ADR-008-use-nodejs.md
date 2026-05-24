# **ADR-008: Use Node.js**

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

Se necesita cambiar de `Flask` a una tecnología para manejar la capa de `Lógica` y la comunicación de esta capa con la capa de `Presentación`. 

## Decision

Usar el entorno de ejecución de `Node.js` para gestionar la capa de `Lógica` y las comunicaciones con la capa de `Presentación`.

## Consequences
### Positive

- **Desarrollo Backend**: Permite crear la lógica de servidores y APIs utilizando el mismo lenguaje que se usa en el navegador.
- **Asíncrono y No Bloqueante**: Puede manejar miles de conexiones simultáneas de manera eficiente sin colgarse.
- **Multiplataforma**: Funciona en Windows, macOS y Linux.

### Negative

- **Inestabilidad de Módulos**: La calidad y madurez de las librerías en `npm` pueden ser muy variables.
- **Difícil Gestión de Dependencias**: La gran cantidad de módulos y la actualización constante pueden generar problemas de compatibilidad o riesgos de seguridad. 
- **Código Asíncrono Complejo**: El uso constante de `callbacks` o `promises` puede dificultar la lectura y el mantenimiento del código si no se aplican buenas prácticas.