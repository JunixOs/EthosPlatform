# **ADR-005: Use Component Based Architecture In Frontend**

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

Se requiere una arquitectura para el Frontend o la capa de `Presentación`, que sea fácil de mantener y que permita un desarrollo rápido.

## Decision

Usar la `Arquitectura Basada en Componentes` con un enfoque `Frontend Component-Based`, donde los componentes representan partes reutilizables de interfaz y experiencia de usuario como Button, Modal, Dashboard, etc. Considerando usar como complemento la `Feature-Based Architecture` el cual es una evolución moderna de la arquitectura basada en componentes.

## Consequences
### Positive

- **Alta Reutilización**: Un mismo componente puede usarse en diferentes partes de la aplicación.
- **Mantenimiento simplificado**: Aislar la lógica permite actualizar o reemplazar componentes individuales sin alterar el resto del sistema.
- **Desarrollo en paralelo**: Diferentes equipos pueden trabajar al mismo tiempo en componentes distintos sin pisarse el código.
- **Pruebas más eficientes**: Los módulos autocontenidos se pueden testear de forma individual antes de integrarlos al sistema general.

### Negative

- **Complejidad de integración**: Asegurar que muchos componentes interactúen y se comuniquen fluidamente entre sí puede ser difícil.
- **Mayor costo y tiempo inicial**: Diseñar interfaces claras y una arquitectura sólida requiere una planificación previa más exhaustiva.
- **Gasto de recursos**: Gestionar múltiples piezas interdependientes puede generar una sobrecarga (overhead) en el sistema si no está bien optimizado.