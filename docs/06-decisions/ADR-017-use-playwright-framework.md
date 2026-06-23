# **ADR-017: Use Playwright Framework**

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

Se necesita de una herramienta o framework para ejecutar las pruebas `E2E (End to End)` dentro del proyecto.

## Decision

Usar el Framework `Playwright` para la ejecución de las pruebas `E2E (End to End)` dentro del proyecto.

## Consequences
### Positive

- **Velocidad y Eficiencia**: Utiliza conexiones `WebSocket` persistentes en lugar del protocolo HTTP tradicional, lo que hace que la ejecución de las pruebas sea más rápida y fluida.
- **Esperas Automáticas**: Detecta automáticamente cuándo los elementos de la interfaz están listos antes de interactuar con ellos, eliminando la necesidad de añadir pausas manuales (`sleep`) en el código.
- **Multi-navegador**: Soporta todos los navegadores web modernos, incluyendo la familia Chromium (Chrome, Edge), Firefox y WebKit (Safari).
- **Herramientas de Desarrollo Integradas**: Cuenta con utilidades visuales como el `Playwright Inspector` y grabadores de código integrados (con excelentes extensiones para VS Code) que generan el código automáticamente mientras se navega por la página.

### Negative

- **Curva de Aprendizaje**: Al utilizar programación asíncrona y requerir escribir scripts de prueba, puede resultar complejo para perfiles sin conocimientos sólidos de desarrollo o automatización.
- **Mayor Consumo de Espacio y Recursos**: Debido a que `Playwright` incluye sus propios motores de navegador para garantizar un comportamiento idéntico en todos los entornos, el tamaño de sus dependencias iniciales es bastante grande.
- **Comunidad en Crecimiento**: Aunque es muy popular y cuenta con el respaldo de Microsoft, su comunidad no es tan masiva ni histórica como la de herramientas pioneras como `Selenium WebDriver`, lo que significa que para problemas extremadamente específicos hay menos foros o soluciones documentadas.