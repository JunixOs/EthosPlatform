# ADR-001: Use Server-Client Architecture

## Status

Pendiente

## Context

Se está desarrollando un sistema web comunitario que permite a los usuarios compartir experiencias personales estructurales relacionadas con reflexiones y morales.

Se requiere una arquitectura que permita que el sistema escale de forma sencilla, que facilite el trabajo colaborativo y que simplifique el mantenimiento del codigo.

## Decision

Usar una arquitectura Cliente-Servidor para el sistema en general.

Se usará un Modelo de `Tres Capas (3-tier)`, el cual añade un servidor de aplicaciones intermedio (API) que procesa la lógica del negocio antes de consultar los datos.

## Consequences
### Positive

- **Gestión Centralizada**: Todos los datos y recursos críticos residen en el servidor.
- **Seguridad Reforzada**: Los administradores pueden aplicar políticas de seguridad uniformes en toda la red al haber un único punto de gestión de accesos y permisos.
- **Mantenimiento Simplificado**: Las mejoras de software se realizan principalmente en el servidor.
- **Escalabilidad Flexible**:  Permite ampliar la capacidad del servidor (escalabilidad vertical) o añadir más servidores y clientes a la red (escalabilidad horizontal) conforme aumentan las necesidades del negocio.
- **Modularidad**: El cliente y el servidor funcionan de manera independiente; un fallo en el dispositivo del usuario no compromete el sistema general, y viceversa.
- **Trabajo Colaborativo**: Tanto de los usuarios del sistema como de los desarrolladores.

### Negative

- **Punto Único de Fallo**: Si el servidor cae toda la red se paraliza.
- **Congestión del Tráfico**: Si hay muchos clientes solicitando recursos el sistema se puede saturar y ralentizar.