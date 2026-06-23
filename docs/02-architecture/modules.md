# **Modules**

## 1. Lista de Módulos

| **Módulo**       | **Responsabilidad**     |
| ------------ | ------------------- |
| **Autenticación y Sesiones**     | Autenticación y manejar la sesión       |
| **Gestión de Usuarios**         | Gestión de usuarios |
| **Gestión de Experiencias**      | Gestión de experiencias         |
| **Etiquetado y Búsqueda**    | Gestionar etiquetas y búsqueda de experiencias               |
| **Interacción Social** | Reacciones, comentarios y seguir a otros usuarios               |
| **Moderación y Seguridad** | Control de publicaciones y usuarios               |

## 2. Responsabilidades

- **Autenticación y Sesiones**: 
    - Inicios de sesión de los usuarios.
    - Gestión de duración de sesiones.
    - Gestión de expiración de sesiones.
- **Gestión de Usuarios**: 
    - Registro de usuarios.
    - Edición de datos de usuario
    - Eliminación de cuentas de usuario.
    - Administración de usuarios por el administrador.
- **Gestión de Experiencias**: 
    - Crear experiencias.
    - Modificar experiencias.
    - Visualización de experiencias.
- **Etiquetado y Búsqueda**: 
    - Crear etiquetas.
    - Asociar etiquetas a experiencias.
    - Limitar las etiquetas por experiencia.
    - Búsqueda de experiencias por etiquetas.
    - Búsqueda de experiencias por filtros.
- **Interacción Social**: 
    - Crear respuestas a experiencias.
    - Editar respuestas a experiencias.
    - Eliminar respuestas a experiencias.
    - Recciones a experiencias. 
    - Seguir usuarios.
    - Bloquear usuarios. 
    - Feed personalizado.
    - Landing page.
- **Moderación y Seguridad**: 
    - Ocultar contenido.
    - Gestionar reportes. 
    - Gestionar el sistema.
    - Gestionar la página dedicada del sistema.

## 3. Dependencias

- `Autenticación y Sesiones` depende de que se desarrollen las funcionalidades de `Gestión de Usuarios`.
- `Gestión de Experiencias` depende de que se desarrollen las funcionalidades de `Gestión de Usuarios` y `Autenticación y Sesiones`.
- `Etiquetado y Búsqueda` depende de que se desarrollen las funcionalidades de `Gestión de Experiencias`.
- `Interacción Social` depende de que se desarrollen las funcionalidades de `Gestión de Usuarios`, `Autenticación y Sesiones` y `Gestión de Experiencias`.
- `Moderación y Seguridad` depende de que se desarrollen las funcionalidades de `Gestión de Usuarios`, `Gestión de Experiencias` e `Interacción Social`.

## 4. Reglas de Comunicación

La comunicación debe hacerse por medio de `Eventos` o `Interfaces`.