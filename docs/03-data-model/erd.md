# **Entity Relationship Diagram**

![Diagrama ERD](../diagrams/images/entity-relationship-diagram/Diagrama%20Entidad-Relacion%20-%20v1%20-%2023-05-2026.png)

## Entidades

- **Usuario**: Representa a la cuenta de un usuario dentro de la plataforma.
- **Experiencia**: Representan las experiencias compartidas por los usuarios.
- **Etiqueta**: Se asocian a una experiencia y sirven para facilitar su clasificación y filtrado.
- **Borrador**: Representa una experiencia preliminar que todavía no ha sido publicada.
- **Respuesta**: Comentarios de los usuarios a una experiencia.
- **Reporte**: Representa un reporte de un usuario a una experiencia o respuesta.
- **Reacción**: Representa una reacción de un usuario a una experiencia.
- **Favorito**: Representa una experiencia guardada en los favoritos de un usuario.
- **Seguimiento**: Representa la relación entre usuarios que se siguen.
- **Bloqueo**: Representa un usuario que bloquea a otro.

## Relaciones y Cardinalidades

### Usuario

- Un `Usuario` puede publicar varias `Respuestas`. (Usuario 1 --- N Respuesta).
- Un `Usuario` puede realizar varios `Reportes` (Usuario 1 --- N Reporte).
- Un `Usuario` publica múltiples `Experiencias`. (Usuario 1 --- N Experiencia).
- Un `Usuario` tiene múltiples `Borradores`. (Usuario 1 --- N Borrador).
- Un `Usuario` puede realizar varias `Reacciones`. (Usuario 1 --- N Reacción).
- Un `Usuario` puede tener varios `Favoritos` (Usuario 1 --- N Favoritos).
- Un `Usuario` puede seguir a varios `Usuarios` (Usuario 1 --- N Seguimiento).
- Un `Usuario` puede ser seguido por varios `Usuarios` (Usuario 1 --- N Seguimiento).
- Un `Usuario` puede bloquear a varios `Usuarios` (Usuario 1 --- N Bloqueo).
- Un `Usuario` puede ser bloqueado por varios `Usuarios` (Usuario 1 --- N Bloqueo).

### Experiencia

- Una `Experiencia` puede tener múltiples `Respuestas`. (Experiencia 1 --- N Respuesta).
- Una `Experiencia` puede tener múltiples `Etiquetas`. (Experiencia 1 --- N ExperienciaEtiqueta).
- Una `Experiencia` puede ser guardada como un `Borrador`. (Experiencia 1 --- 1 Borrador).
- Una `Experiencia` puede recibir múltiples `Reacciones`. (Experiencia 1 --- N Reacción).
- Una `Experiencia` puede ser guardada como favorito por varios `Usuarios` (Experiencia 1 --- N Favorito).
- Una `Experiencia` puede tener varios `Reportes` (Experiencia 1 --- N Reporte).

### Etiqueta

- Una `Etiqueta` puede ser asociada a varias `Experiencias` (Etiqueta 1 --- N Experiencia).

### Respuesta

- Una `Respuesta` puede tener varios `Reportes`. (Repuesta 1 --- N Reporte).
