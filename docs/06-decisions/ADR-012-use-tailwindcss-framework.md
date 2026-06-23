# **ADR-012: Use TailwindCSS Framework**

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

Se requiere un framework de CSS como alternativa a `Bootstrap` para la construcción del frontend del proyecto, que permite diseño responsive de forma rápida.

## Decision

Usar `TailwindCSS` como reemplazo a `Bootstrap` para el diseño del frontend.

## Consequences
### Positive

- **Desarrollo más Rápido**: No es necesario cambiar de archivo ni inventar nombres de clases. Se pueden aplicar estilos directamente en el marcado HTML mediante clases predefinidas.
- **Altamente Personalizable**: A diferencia de frameworks como `Bootstrap`, no impone una estética o diseño por defecto, lo que permite crear interfaces únicas.
- **Ligero y Optimizado**: Al compilar, `Tailwind` elimina todo el CSS que no se haya utilizado en tu proyecto.
- **Consistencia Visual**: Mantiene la coherencia en el espaciado, paleta de colores y tamaños en todo el proyecto.

### Negative

- **HTML Saturado**: El uso de múltiples clases de utilidad puede hacer que el código HTML se vea "sucio" o difícil de leer.
- **Curva de Aprendizaje**: Al principio, puede resultar tedioso memorizar las clases de `Tailwind` o buscar constantemente en la documentación oficial.
- **Falta de Componentes Nativos**: `Tailwind` solo proporciona utilidades, no componentes listos para usar (como botones o barras de navegación) a menos que utilices servicios de pago.