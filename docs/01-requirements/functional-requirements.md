# *REQUERIMIENTOS FUNCIONALES*

## I. Requisitos Funcionales - *Must Have*

| ID   | Requisito | Criterio de Verificación | Módulo |
|------|------------|--------------------------|---------|
| R01 | El sistema debe permitir el inicio de sesión mediante correo electrónico y contraseña. | Credenciales válidas -> autenticación exitosa. Credenciales inválidas -> mensaje de error descriptivo en español. | Autenticación |
| R02 | El sistema debe permitir el registro de nuevos usuarios con nombre, correo y contraseña. | Usuario creado correctamente; correo duplicado rechazado con mensaje claro. | Autenticación |
| R15a | El sistema debe gestionar sesiones largas con expiración de 24 horas cuando el usuario activa "Recordarme". | Sesión activa durante 24 h; expirada automáticamente tras ese tiempo. | Autenticación |
| R15b | El sistema debe gestionar sesiones cortas con expiración de 2 horas cuando el usuario no activa "Recordarme". | Sesión expirada a las 2 h; usuario redirigido al login. | Autenticación |
| R19 | El sistema debe verificar el rol de administrador mediante middleware antes de permitir acceso a rutas protegidas del panel. | Usuario sin rol admin -> error 403. Acceso al panel permitido solo con rol admin. | Autenticación |
| R61 | El sistema debe registrar cada intento fallido de inicio de sesión con IP y marca de tiempo. | Log accesible por administrador; incluye IP, correo intentado y timestamp. | Seguridad |
| R62 | El sistema debe bloquear temporalmente una cuenta durante 15 minutos tras 5 intentos consecutivos fallidos. | Cuenta bloqueada; usuario informado del tiempo de espera; desbloqueo automático. | Seguridad |
| R07a | El sistema debe permitir crear una experiencia con título (opcional y único) y descripción (obligatoria). | Experiencia creada; título duplicado rechazado; descripción vacía rechazada. | Experiencias |
| R07b | Al crear una experiencia, el sistema debe solicitar los campos reflexivos "¿Qué dice la moral sobre esto?" y "¿Qué dice tu ética sobre esto?". | Ambos campos se almacenan y muestran correctamente. | Experiencias |
| R10 | El sistema debe permitir al usuario eliminar sus propias experiencias; las respuestas asociadas se eliminan en cascada. | Experiencia y respuestas eliminadas; confirmación previa mostrada. | Experiencias |
| R14 | El sistema debe permitir al usuario editar título, descripción, moral, ética y etiquetas de sus experiencias publicadas. | Cambios persistidos; fecha de modificación actualizada. | Experiencias |
| R38 | El sistema debe guardar automáticamente el borrador de la experiencia en edición cada 30 segundos. | Borrador persistido sin acción del usuario; indicador visual de guardado mostrado. | Experiencias |
| R44 | El sistema debe permitir guardar manualmente una experiencia como borrador sin publicarla. | Borrador no visible para otros; accesible desde el perfil del autor. | Experiencias |
| R16 | El sistema debe contar con una página dedicada a mostrar las experiencias del equipo de desarrollo del sitio web. | Página accesible públicamente con el contenido del proyecto. | Administración |
| R17 | El sistema debe impedir a los usuarios estándar editar el contenido de la página dedicada. | Intento de edición sin rol admin -> error 403. | Administración |
| R18 | El sistema debe permitir únicamente a los administradores editar la página dedicada. | Administrador puede editar; cambios reflejados inmediatamente. | Administración |
| R20 | El sistema debe disponer de un panel de administración con gestión de usuarios y de la página dedicada. | Panel accesible solo para administradores con secciones funcionando correctamente. | Administración |
| R21 | El sistema debe permitir al administrador eliminar cualquier cuenta de usuario. | Usuario y todo su contenido eliminados; confirmación requerida. | Administración |
| R22 | El sistema debe permitir al administrador editar nombre, correo y estado de cualquier usuario. | Cambios persistidos correctamente desde el panel. | Administración |
| R23 | El sistema debe permitir al administrador editar el contenido de cualquier experiencia publicada. | Experiencia editada; fecha de modificación actualizada. | Administración |
| R24 | El sistema debe permitir al administrador eliminar cualquier experiencia publicada. | Experiencia y respuestas eliminadas; confirmación previa mostrada. | Administración |
| R09 | El sistema debe ofrecer modo claro y modo oscuro seleccionable por el usuario desde la interfaz. | Al cambiar el modo, todos los elementos UI se adaptan; preferencia persistente al recargar. | UX |
| R64 | El sistema debe ser responsive, funcionando en pantallas desde 320 px (móvil) hasta 1920 px (escritorio). | Prueba en 320, 768 y 1920 px sin desbordamiento ni funcionalidades rotas. | UX |
| R65 | El sistema debe mostrar un diálogo de confirmación antes de ejecutar cualquier eliminación permanente de contenido. | Sin confirmación no se ejecuta la eliminación; la opción "Cancelar" funciona correctamente. | UX |
| R66 | El sistema debe mostrar mensajes de error claros, en español, que describan el problema y sugieran una acción. | Los 10 errores más comunes tienen mensajes descriptivos en español. | UX |

---

## II. Requisitos Funcionales - *Should Have*

| ID | Requisito | Criterio de Verificación | Módulo |
|----|------------|--------------------------|---------|
| R03 | El sistema debe mostrar una landing page con la lista de usuarios registrados (nombre y foto de perfil). | Página lista con al menos los últimos 20 usuarios mostrando nombre y avatar. | Social |
| R04 | El sistema debe prohibir a un usuario editar contenido publicado por otro usuario. | Intento de editar contenido ajeno -> error 403. | Seguridad |
| R05 | El sistema debe permitir añadir una respuesta (un solo nivel) a una experiencia de otro usuario. | Respuesta guardada y visible; no se permiten sub-respuestas. | Social |
| R06 | El sistema debe permitir al usuario modificar su nombre, correo y contraseña desde configuración. | Cambios persistidos; correo duplicado rechazado. | Usuarios |
| R11 | El sistema debe permitir al usuario eliminar sus propias respuestas a experiencias. | Respuesta eliminada sin afectar la experiencia ni otras respuestas. | Social |
| R12 | El sistema debe permitir eliminar una cuenta de usuario; todo su contenido se elimina con ella. | Usuario y contenido eliminados; sesiones activas invalidadas. | Usuarios |
| R13 | El sistema debe permitir filtrar experiencias propias por palabras clave en el título, en tiempo real. | El filtro reduce resultados mientras se escribe; sin recarga de página. | Experiencias |
| R25 | El sistema debe permitir visualizar el perfil público de cualquier usuario (nombre, foto, bio y experiencias). | Perfil visible sin autenticación si el usuario tiene perfil público. | Usuarios |
| R26 | El sistema debe permitir al usuario configurar una biografía personal (máximo 300 caracteres). | Biografía guardada y mostrada en perfil público y privado. | Usuarios |
| R27 | El sistema debe permitir subir y actualizar una foto de perfil (PNG/JPG; máximo 2 MB). | Foto almacenada y mostrada; formato o tamaño inválido rechazado. | Usuarios |
| R29 | El sistema debe permitir reaccionar con "me gusta" a una experiencia; un usuario puede tener una sola reacción por experiencia. | Reacción registrada; segundo clic elimina la reacción (toggle). | Social |
| R30 | El sistema debe mostrar el conteo de respuestas y "me gusta" en cada tarjeta de experiencia. | Conteos actualizados en tiempo real o tras recargar; visibles sin autenticación. | Social |
| R31 | El sistema debe ordenar las experiencias por fecha de publicación descendente de forma predeterminada. | Las experiencias más recientes aparecen primero por defecto. | Experiencias |
| R41 | El sistema debe permitir añadir hasta 5 etiquetas a una experiencia al crearla o editarla. | Etiquetas guardadas; más de 5 rechazadas con mensaje de error. | Etiquetado |
| R42 | El sistema debe permitir buscar experiencias por etiqueta seleccionando una desde la interfaz. | Al seleccionar una etiqueta, solo aparecen experiencias con esa etiqueta. | Etiquetado |
| R43 | El sistema debe mostrar una vista previa de la experiencia antes de publicarla. | Vista previa idéntica al formato de publicación; publicación disponible desde la vista previa. | Experiencias |
| R45 | El sistema debe registrar y mostrar la fecha de creación y la fecha de última modificación de cada experiencia. | Fechas visibles en la tarjeta; fecha de modificación actualizada en cada edición. | Experiencias |
| R46 | El sistema debe mostrar todas las experiencias publicadas de un usuario en su página de perfil. | Experiencias listadas en orden cronológico inverso en el perfil. | Usuarios |
| R47 | El sistema debe permitir al usuario editar su nombre visible sin modificar su correo de acceso. | Nombre actualizado en perfil y publicaciones; correo sin cambios. | Usuarios |
| R51 | El sistema debe permitir realizar búsquedas generales por palabras clave en título o descripción. | Resultados devueltos en menos de 3 s; si no hay resultados, se muestra un mensaje informativo. | Etiquetado |
| R52 | El sistema debe paginar los resultados mostrando un máximo de 10 experiencias por página. | La paginación funciona correctamente; controles de primera y última página disponibles. | Etiquetado |
| R56 | El sistema debe mostrar en la página principal una sección de experiencias más recientes (últimas 10). | Sección actualizada automáticamente; orden cronológico inverso. | Social |
| R60 | El sistema debe registrar en un log de auditoría las acciones administrativas (eliminación, edición y suspensión). | Log consultable desde el panel; incluye administrador, acción, objetivo y timestamp. | Administración |
| R67 | El sistema debe mostrar un indicador de carga para operaciones que demoren más de 500 ms. | Indicador visible en búsquedas, cargas de feed y envíos de formularios. | UX |

---

## III. Requisitos Funcionales - *Could Have*

| ID | Requisito | Criterio de Verificación | Módulo |
|----|------------|--------------------------|---------|
| R28 | El sistema debe permitir al usuario configurar su perfil como público o privado. | Perfil privado no visible para usuarios no seguidos. | Usuarios |
| R32 | El sistema debe permitir ordenar las experiencias por popularidad (mayor número de "me gusta"). | Al seleccionar el orden, la lista se reordena correctamente. | Experiencias |
| R33 | El sistema debe permitir reportar una experiencia o respuesta por contenido inapropiado. | Reporte registrado; usuario notificado de que fue recibido. | Moderación |
| R34 | El sistema debe permitir al usuario bloquear a otro, impidiendo ver su contenido. | Contenido del usuario bloqueado oculto; bloqueo reversible desde configuración. | Social |
| R35 | El sistema debe permitir al administrador ocultar (sin eliminar) contenido reportado mientras lo revisa. | Contenido oculto no visible para usuarios; visible para administrador con indicador. | Moderación |
| R36 | El sistema debe registrar el historial de reportes de cada experiencia (usuario, motivo y fecha). | Historial visible desde el panel de administración. | Moderación |
| R37 | El sistema debe permitir al administrador suspender temporalmente a un usuario especificando la duración. | Usuario suspendido no puede iniciar sesión; suspensión expira automáticamente. | Moderación |
| R39 | El sistema debe permitir al usuario retomar y continuar la edición de un borrador guardado. | Borrador recuperado con todos los campos en el estado guardado. | Experiencias |
| R48 | El sistema debe mostrar en el perfil del usuario el total de experiencias publicadas y el total de "me gusta" recibidos. | Estadísticas actualizadas tras cada publicación o reacción. | Usuarios |
| R49 | El sistema debe permitir marcar experiencias como favoritas y acceder a ellas desde el perfil. | Lista de favoritos disponible en el perfil; agregar y quitar con un clic. | Social |
| R50 | El sistema debe permitir filtrar experiencias por nombre de autor mediante un campo de búsqueda. | Los resultados muestran solo experiencias del autor buscado. | Etiquetado |
| R54 | El sistema debe limitar a 5 el número de etiquetas por experiencia (validación en backend y frontend). | No se puede guardar con más de 5 etiquetas; mensaje de error claro mostrado. | Etiquetado |
| R55 | El sistema debe mostrar una sección de experiencias relacionadas basadas en etiquetas compartidas. | La sección muestra entre 3 y 5 experiencias con al menos una etiqueta en común. | Etiquetado |
| R57 | El sistema debe mostrar experiencias destacadas (mayor puntaje de "me gusta" en las últimas 48 horas). | La sección muestra entre 3 y 5 experiencias actualizadas cada hora. | Social |
| R58 | El sistema debe permitir seguir a otros usuarios. | Seguimiento registrado; el seguidor puede ver el feed de experiencias del usuario seguido. | Social |
| R59 | El sistema debe mostrar un feed personalizado con experiencias de los usuarios seguidos, ordenado por fecha. | El feed solo muestra contenido de usuarios seguidos; si no sigue a nadie, muestra un mensaje orientativo. | Social |
| R63 | El sistema debe detectar y rechazar experiencias o respuestas con términos de una lista negra configurable por el administrador. | Contenido con términos prohibidos rechazado; mensaje de error mostrado; publicación no realizada. | Moderación |