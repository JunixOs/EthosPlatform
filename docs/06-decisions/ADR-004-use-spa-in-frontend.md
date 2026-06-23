# **ADR-004: Use SPA In Frontend**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 20-05-2026

**Modified By:** 

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Propuesto

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere un enfoque para el Frontend que permita una navegación fluida, velocidad de respuesta y compatibilidad multiplataforma.

## Decision

Usar `Single Page Application` con un enfoque de `Representación del Lado del Cliente` para el Frontend.

En el enfoque de `Representación del Lado del Cliente` la lógica de la aplicación se ejecuta completamente en el navegador, obteniendo datos de las API y construyendo la interfaz de usuario de forma dinámica.

## Consequences
### Positive

- **Velocidad y Capacidad de Respuesta**: Reduce los tiempos de carga y da como resultado una experiencia de usuario más fluida y fluida.
- **Experiencia de Usuario Mejorada**: Los usuarios ya no experimentan las discordantes recargas e interrupciones de páginas que son comunes en los sitios web tradicionales.
- **Compatibilidad Multiplataforma**: Permite crear una única base de código que se ejecute en varias plataformas.

### Negative

- **Desafíos del SEO**: Los motores de búsqueda pueden tener dificultades para indexar el contenido, lo que podría afectar la clasificación del sitio en los motores de búsqueda.
- **Tiempo de Carga Inicial**: Puede ser más largo que el de los sitios web tradicionales.
- **Desarrollo Complejo**: Desarrollar SPA puede ser más complejo que crear sitios web tradicionales.
- **Preocupaciones de Seguridad**: Las SPA pueden ser vulnerables a ciertos problemas de seguridad, como ataques de secuencias de comandos entre sitios (XSS) si no están protegidas adecuadamente.