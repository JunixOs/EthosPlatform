# **ADR-015: Use PNPM as Package Manager**

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

Se requiere de un gestor de paquetes alternativo a `npm` para la gestión del proyecto en `Node.js` y `React`.

## Decision

Usar `pnpm` como gestor de paquetes para `Node.js`.

## Consequences
### Positive

- **Ahorro Masivo de Espacio**: En lugar de copiar cada paquete en cada carpeta `node_modules`, `pnpm` guarda el paquete en un almacén global y utiliza enlaces simbólicos y duros para vincularlo a cada proyecto.
- **Velocidad de Instalación**: Las instalaciones son mucho más rápidas, ya que descarga paquetes en paralelo y utiliza la caché local eficientemente.
- **Estructura Estricta**: Por defecto, previene el uso de dependencias "fantasma". Si un paquete no está explícitamente en tu `package.json`.

### Negative

- **Ecosistema más Pequeño**: Aunque es totalmente compatible con la mayoría de paquetes de `npm`/`Yarn`, algunos paquetes poco comunes o scripts de configuración complejos pueden presentar problemas de compatibilidad debido a su estructura de enlaces.
- **Curva de Aprendizaje**: Al principio, la forma en que los archivos se enlazan puede resultar confusa para desarrolladores acostumbrados a la estructura tradicional de `npm`.
- **Soporte en CI/CD**: Algunos servidores de Integración Continua (`CI/CD`) o entornos automatizados pueden requerir configuraciones adicionales, ya que `npm` o `yarn` suelen venir instalados por defecto, mientras que `pnpm` exige su instalación explícita.