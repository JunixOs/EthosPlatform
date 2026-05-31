# **ADR-016: Use Vite Build Tool**

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

Se requiere de una herramienta o tecnología que facilite las configuraciones de `React` y que sea veloz.

## Decision

Usar `Vite` como `Herramienta de Compilación` para ejecutar y configurar `React` en el proyecto.

## Consequences
### Positive

- **Velocidad Extrema**: Inicia el servidor de desarrollo en milisegundos. No empaqueta toda la aplicación antes de iniciar, como lo hacen herramientas tradicionales.
- **Recarga Rápida (HMR)**: La Sustitución de Módulos en Caliente (HMR) es instantánea. Al guardar un archivo, solo se recarga el módulo específico, sin importar el tamaño de la app.
- **Configuración Cero para Múltiples Frameworks**: Funciona de forma excelente y con configuraciones predeterminadas para proyectos con `React`, `Vue`, `Svelte` y otros.
- **Soporte Nativo**: Incluye soporte preconfigurado para `TypeScript`, `CSS` preprocesado (`Sass`, `Less`) y `PostCSS`.

### Negative

- **Soporte en Proyectos Heredados**: Migrar proyectos antiguos o existentes (con Webpack) a `Vite` puede requerir una reconfiguración considerable y no siempre es directo.
- **Ecosistema de Plugins más Joven**: Aunque crece rápidamente, no tiene la misma cantidad de plugins y paquetes heredados que herramientas más antiguas.
- **Diferencias entre Desarrollo y Producción**: En algunos casos aislados, el comportamiento del código puede variar ligeramente entre el servidor nativo de desarrollo y el empaquetador de producción.