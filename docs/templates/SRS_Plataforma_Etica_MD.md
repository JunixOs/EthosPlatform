**Universidad Nacional Agraria de la Selva**

Facultad de Ingeniería en Informática y Sistemas

**ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE**

***Plataforma Comunitaria de Experiencias Éticas y Morales***

Conforme al Estándar ISO/IEC/IEEE 29148:2018

+:--------------------------------+:--------------------------------+
| **AUTORES**                     | **INFORMACIÓN**                 |
+---------------------------------+---------------------------------+
| Ordoñez Silva, Yonel Jr.        | Curso: Ética y Práctica         |
|                                 | Profesional                     |
| Javier Orneta, Ángel Paolo      |                                 |
|                                 | Docente: Pozo Malpartida, Jorge |
| Yllesca Zambrano, Thalia Diana  | Luis                            |
|                                 |                                 |
| Ponce Rojas, Yimi Kevin         | Semestre: 2026-I                |
|                                 |                                 |
|                                 | Versión: 1.0 --- Conforme IEEE  |
|                                 | 29148:2018                      |
|                                 |                                 |
|                                 | Fecha: mayo 2026                |
+---------------------------------+---------------------------------+

**Control de Versiones**

  ------------- ------------ ------------------------ ---------------------
  **Versión**   **Fecha**    **Descripción**          **Autores**

  1.0           04-05-2026   Elicitación Sprint 01 -- Equipo Completo
                             Lluvia de Ideas          
                             (R01-R24)                

  1.1           08-05-2026   Elicitación Sprint 02 -- Equipo Completo
                             Benchmarking (R25-R67,   
                             RNF01-09)                

  2.0           19-05-2026   ERS final: casos de uso, Equipo Completo
                             diagramas de clases,     
                             trazabilidad,            
                             cronograma. Conforme     
                             ISO/IEC/IEEE 29148:2018  
  ------------- ------------ ------------------------ ---------------------

**1. Introducción**

**1.1 Propósito**

El presente documento constituye la Especificación de Requisitos de
Software (SRS) de la plataforma web comunitaria orientada a la
publicación e interacción de experiencias personales relacionadas con
dilemas éticos y morales, desarrollada como proyecto del curso Ética y
Práctica Profesional en la Facultad de Ingeniería en Informática y
Sistemas (FIIS) de la Universidad Nacional Agraria de la Selva (UNAS),
semestre 2026-I.

Este documento ha sido elaborado conforme al estándar ISO/IEC/IEEE
29148:2018 «Systems and software engineering --- Life cycle processes
--- Requirements engineering», el cual establece los lineamientos para
la captura, análisis, documentación y gestión de requisitos a lo largo
del ciclo de vida del software. Su función es servir como acuerdo formal
entre el equipo de desarrollo y los stakeholders, garantizando un
entendimiento común del alcance, funcionalidades y restricciones del
sistema.

Los destinatarios de este documento son: el equipo de desarrollo, el
docente como stakeholder principal, los estudiantes como usuarios
finales, y cualquier evaluador académico del proyecto.

**1.2 Descripción del Proyecto**

El proyecto consiste en el desarrollo de una plataforma web comunitaria
que permite a sus usuarios registrarse, autenticarse y compartir
experiencias personales estructuradas relacionadas con reflexiones
éticas y morales. La plataforma combina características de un blog
social con las de una comunidad interactiva, incorporando:

- Publicación de experiencias con campos reflexivos sobre moral y ética
  personal.

- Interacción comunitaria: respuestas (un solo nivel), reacciones «me
  gusta» y favoritos.

- Sistema de etiquetado, búsqueda y paginación de contenidos.

- Feed personalizado basado en usuarios seguidos.

- Panel de administración con herramientas de moderación y gestión.

- Seguridad: autenticación JWT/sesiones, cifrado de contraseñas, bloqueo
  por intentos fallidos.

- UX moderna: modo claro/oscuro, diseño responsive, borradores
  automáticos.

El sistema será accesible desde navegadores web modernos (Chrome,
Firefox, Edge, Safari) y estará optimizado para dispositivos de
escritorio y móviles.

**1.3 Definiciones, Acrónimos y Abreviaciones**

  ---------------- --------------------------------------------------
  **Término**      **Definición**

  SRS              Software Requirements Specification ---
                   Especificación de Requisitos de Software.

  RF               Requisito Funcional: describe una función o
                   comportamiento del sistema.

  RNF              Requisito No Funcional: atributo de calidad,
                   rendimiento o restricción arquitectural.

  MoSCoW           Método de priorización: Must have / Should have /
                   Could have / Won\'t have.

  JWT              JSON Web Token --- estándar RFC 7519 para
                   autenticación basada en tokens.

  Feed             Listado personalizado de experiencias basado en
                   los usuarios que sigue el usuario autenticado.

  Borrador         Versión no publicada de una experiencia, guardada
                   automáticamente o manualmente.

  Experiencia      Publicación estructurada que describe un dilema
                   ético/moral vivido por un usuario, con campos:
                   título, descripción, reflexión moral y reflexión
                   ética.

  Admin            Usuario con rol de administrador; posee
                   privilegios de moderación y gestión del sistema.

  Visitante        Usuario no autenticado; puede visualizar contenido
                   público pero no interactuar.

  Sesión larga     Sesión con expiración de 24 horas, activada con la
                   opción «Recordarme».

  Sesión corta     Sesión con expiración de 2 horas, aplicada cuando
                   el usuario no activa «Recordarme».
  ---------------- --------------------------------------------------

***Tabla 1: Definiciones, Acrónimos y Abreviaciones***

**1.4 Alcance del Sistema**

El presente proyecto cubre el análisis, diseño, desarrollo e
implementación de una plataforma web para la gestión e interacción de
experiencias publicadas por usuarios registrados. El sistema incluirá:

- Autenticación, registro y gestión de perfiles de usuario.

- Creación, edición, eliminación, filtrado y búsqueda de experiencias.

- Respuestas (un nivel), reacciones, etiquetado y marcado de favoritos.

- Feed personalizado, secciones de contenido reciente y destacado.

- Panel de administración: gestión de usuarios, contenido y moderación.

- Página dedicada al equipo de desarrollo (editable solo por
  administradores).

- Modo claro/oscuro, diseño responsive, borradores automáticos.

- Seguridad: JWT/sesiones, bcrypt/Argon2, bloqueo por intentos fallidos.

Fuera del alcance: mensajería privada en tiempo real, videollamadas,
integración con redes sociales externas, aplicaciones móviles nativas,
pagos, múltiples idiomas e inteligencia artificial avanzada.

**1.5 Referencias Normativas**

- ISO/IEC/IEEE 29148:2018 --- Systems and software engineering --- Life
  cycle processes --- Requirements engineering.

- ISO/IEC/IEEE 15288:2015 --- System and software engineering --- System
  life cycle processes.

- IEEE 830-1998 --- Recommended Practice for Software Requirements
  Specifications.

- Scrum Guide (Schwaber & Sutherland, 2020).

- OWASP Top Ten 2021 --- Open Web Application Security Project.

- RFC 7519 --- JSON Web Token (JWT).

**2. Stakeholders**

De acuerdo con ISO/IEC/IEEE 29148:2018, un stakeholder es cualquier
individuo, organización o sistema que tenga interés legítimo en el
sistema o que sea afectado por él. Se identificaron los siguientes:

  ----------------- --------------------- ---------------- -------------
  **Stakeholder**   **Descripción**       **Rol en el      **Prioridad
                                          Sistema**        (MoSCoW)**

  Docente de Ética  Imparte el curso;     Usuario /        **Must**
                    evalúa las            Administrador    
                    publicaciones y el                     
                    correcto                               
                    funcionamiento de la                   
                    plataforma.                            

  Estudiantes de    Alumnos del curso en  Usuario Estándar **Must**
  Ética             la UNAS; usuarios                      
                    principales de la                      
                    plataforma.                            

  Estudiantes en    Estudiantes de        Usuario Estándar **Could**
  General           secundaria o                           
                    universidad                            
                    interesados en ética.                  

  Público en        Personas no           Visitante /      **Should**
  General           académicas            Usuario          
                    interesadas en                         
                    reflexiones éticas.                    

  Equipo de         Ordoñez, Javier       Administrador    **Must**
  Desarrollo        Orneta, Yllesca                        
                    Zambrano, Yimi.                        
                    Responsables de                        
                    diseño, desarrollo y                   
                    pruebas.                               
  ----------------- --------------------- ---------------- -------------

***Tabla 2: Stakeholders Identificados***

**3. Proceso de Elicitación de Requisitos**

Conforme al estándar ISO/IEC/IEEE 29148:2018, la elicitación de
requisitos se realizó de forma iterativa empleando metodología ágil
Scrum. Se ejecutaron dos sprints de elicitación, cada uno con su propia
técnica, producto y ciclo de retrospectiva.

**3.1 Sprint 01 --- Lluvia de Ideas (Brainstorming)**

Objetivo: Identificar funcionalidades clave desde la perspectiva del
equipo mediante sesión colaborativa estructurada.

Duración: 2 horas (04-05-2026). Participantes: Equipo completo de
desarrollo.

Resultado: 24 requisitos identificados (R01--R24), cubriendo
autenticación, gestión de usuarios, experiencias y administración. R07 y
R15 fueron descompuestos en sub-requisitos para mayor verificabilidad,
conforme al principio de atomicidad del estándar IEEE 29148.

**3.2 Sprint 02 --- Benchmarking**

Objetivo: Identificar buenas prácticas de plataformas similares
consolidadas en el mercado.

Plataformas analizadas: Reddit, Medium, DEV Community.

Duración: 3 horas (08-05-2026). Participantes: Equipo completo de
desarrollo.

  -------------------- --------------- --------------- ---------------
  **Característica**   **Reddit**      **Medium**      **DEV
                                                       Community**

  Perfiles de Usuario  Completo        Orientado a     Completo
                                       Autor           

  Modo Oscuro          Sí              Sí              Sí

  Etiquetas / Tags     Flair           Sí              Hasta 4

  Reacciones           Votos           Aplausos        Múltiples tipos

  Borradores           Sí              Sí              Sí
  Automáticos                                          

  Moderación           Avanzada        Básica          Completa

  Feed Personalizado   Sí              Sí              Sí

  Responsive           Sí              Sí              Sí

  Bloqueo por intentos Sí              Básico          Sí
  fallidos                                             
  -------------------- --------------- --------------- ---------------

***Tabla 3: Benchmarking Comparativo de Plataformas***

Resultado: 43 requisitos funcionales adicionales (R25--R67) y 9
requisitos no funcionales (RNF01--RNF09).

**4. Análisis de Viabilidad**

Conforme a ISO/IEC/IEEE 29148:2018 §6.2.3, previo a la especificación
formal de requisitos se debe validar la viabilidad del sistema desde
múltiples dimensiones.

  --------------- -------------------------------- ---------------------
  **Dimensión**   **Análisis**                     **Conclusión**

  Técnica         Stack web estándar (React/Vue +  **VIABLE. Sin
                  Node.js/Django + PostgreSQL).    licencias
                  Tecnologías open-source; el      especializadas.**
                  equipo posee conocimiento base.  

  Operacional     Stakeholders con acceso a        **VIABLE. Accesible
                  dispositivos con navegadores     para todos.**
                  modernos. Plataforma web elimina 
                  instalación.                     

  Temporal        Semestre 2026-I. Requisitos Must **VIABLE CON ALCANCE
                  y Should alcanzables con 8       AJUSTADO.**
                  sprints de 1-2 semanas.          
                  Requisitos Could y Won\'t se     
                  difieren.                        

  Económica       Herramientas gratuitas (VS Code, **VIABLE. Costo ≈
                  GitHub, PostgreSQL, Node.js).    0.**
                  Hosting en servicios gratuitos   
                  (Railway, Vercel, Render).       

  Legal / Ética   La plataforma maneja datos       **VIABLE con política
                  personales (correo,              de privacidad
                  publicaciones). Requiere aviso   básica.**
                  de privacidad y consentimiento   
                  en registro.                     
  --------------- -------------------------------- ---------------------

***Tabla 4: Análisis de Viabilidad (IEEE 29148:2018 §6.2.3)***

**5. Modelos del Sistema**

**5.1 Actores del Sistema**

  ---------------- --------------------------------------------------
  **Actor**        **Descripción**

  Visitante        Usuario no autenticado. Puede visualizar contenido
                   público: landing page, perfiles públicos y
                   experiencias publicadas.

  Usuario          Usuario autenticado. Puede crear, editar y
                   eliminar sus experiencias; interactuar con
                   contenido de otros (respuestas, reacciones,
                   favoritos, seguimiento); y gestionar su perfil.

  Administrador    Usuario con rol elevado. Accede al panel de
                   administración; puede gestionar usuarios, moderar
                   contenido, editar la página dedicada y revisar
                   logs de auditoría.
  ---------------- --------------------------------------------------

***Tabla 5: Actores del Sistema***

**5.2 Casos de Uso Principales**

  -------- -------------------- ------------------ -------------------------------------------- ---------------
  **ID     **Nombre**           **Actores**        **Requisitos**                               **Prioridad**
  CU**                                                                                          

  CU-01    Autenticación y      Visitante,         R01,R02,R15a/b,R19,R61,R62                   **Must**
           Sesiones             Usuario, Admin                                                  

  CU-02    Gestión de Usuarios  Usuario,           R06,R12,R21,R22,R25-R28,R37,R46-R48          **Must**
                                Administrador                                                   

  CU-03    Gestión de           Usuario, Admin,    R07a/b,R10,R13-R14,R31-R32,R38-R39,R43-R45   **Must**
           Experiencias         Visitante                                                       

  CU-04    Etiquetado y         Usuario, Admin,    R41,R42,R50-R55                              **Should**
           Búsqueda             Visitante                                                       

  CU-05    Interacción Social   Usuario, Visitante R03,R05,R11,R29,R30,R34,R56-R59              **Should**

  CU-06    Moderación y         Usuario,           R04,R17,R33,R35-R37,R60,R63                  **Could**
           Seguridad            Administrador                                                   

  CU-07    Administración del   Administrador      R16-R24,R35,R60,R63,R65-R67                  **Must**
           Sistema                                                                              
  -------- -------------------- ------------------ -------------------------------------------- ---------------

***Tabla 6: Casos de Uso Principales***

**5.2.1 CU-01: Módulo Autenticación y Sesiones**

![](media/3867dd33a631507d6ff81a96ea3a9456df3eeb00.png){width="7.083333333333333in"
height="4.0625in"}

***Figura 1: Diagrama de Casos de Uso --- Autenticación y Sesiones***

**5.2.2 CU-02: Módulo Gestión de Usuarios**

![](media/8e348356c27ae8d63a7c3f22c5056d934c8914f3.png){width="7.291666666666667in"
height="4.583333333333333in"}

***Figura 2: Diagrama de Casos de Uso --- Gestión de Usuarios***

**5.2.3 CU-03: Módulo Gestión de Experiencias**

![](media/51d09dd5278ba74b8aceea5be1eff20c288f521b.png){width="7.291666666666667in"
height="4.895833333333333in"}

***Figura 3: Diagrama de Casos de Uso --- Gestión de Experiencias***

**5.2.4 CU-04/05: Interacción Social, Etiquetado y Moderación**

![](media/fb8c1fa88a88c5bdaa3e6865954563dbd6b79625.png){width="7.291666666666667in"
height="4.895833333333333in"}

***Figura 4: Diagrama de Casos de Uso --- Interacción Social, Etiquetado
y Moderación***

**5.2.5 CU-07: Módulo Administración**

![](media/a0512c5a070d4740682552205a0aa0d246605bac.png){width="7.291666666666667in"
height="4.0625in"}

***Figura 5: Diagrama de Casos de Uso --- Administración del Sistema***

**6. Diagrama de Clases del Sistema**

El siguiente diagrama de clases representa el modelo de dominio del
sistema, mostrando todas las entidades identificadas durante el proceso
de elicitación y especificación, sus atributos tipados, métodos y
relaciones con multiplicidades. Fue construido con base en los
requisitos priorizados conforme a MoSCoW y se alinea directamente con la
arquitectura modular definida en la Sección 8.

![](media/bc3b214c4e67a916afb25e9526b7ae828e73be57.png){width="8.958333333333334in"
height="11.354166666666666in"}

***Figura 6: Diagrama de Clases Completo --- Plataforma Ética Compartida
(FIIS-UNAS)***

**6.1 Descripción de Entidades Principales**

  ---------------- --------------- -------------------------------------
  **Entidad**      **Módulo**      **Descripción**

  Usuario          MOD-01, MOD-02  Entidad central. Almacena identidad,
                                   credenciales hasheadas, rol,
                                   configuración de privacidad y control
                                   de sesiones/bloqueos.

  Experiencia      MOD-03          Publicación principal. Contiene
                                   título (opcional), descripción, dos
                                   campos reflexivos (moral/ética),
                                   estado (publicada/borrador) y
                                   metadatos temporales.

  Respuesta        MOD-05          Comentario a una experiencia. Un solo
                                   nivel de anidación permitido.
                                   Eliminación en cascada al borrar la
                                   experiencia padre.

  Reaccion         MOD-05          «Me gusta» con comportamiento toggle:
                                   un usuario, una reacción por
                                   experiencia.

  Etiqueta /       MOD-04          Sistema de categorización.
  ExpEtiqueta                      ExpEtiqueta es la tabla join que
                                   limita a 5 etiquetas por experiencia.

  Sesion           MOD-01          Gestión de tokens JWT o cookies
                                   HttpOnly. Dos tipos: corta (2h) y
                                   larga (24h).

  LogAuditoria     MOD-06, MOD-07  Registro inmutable de acciones
                                   administrativas: edición,
                                   eliminación, suspensión. Incluye
                                   timestamp, adminId y objetivo.

  IntentoFallido   MOD-01          Registro de intentos de autenticación
                                   fallidos con IP y timestamp. Base
                                   para el mecanismo de bloqueo temporal
                                   (R62).

  Reporte          MOD-06          Denuncia de contenido inapropiado.
                                   Vinculado a Experiencia o Respuesta.
                                   Flujo: pendiente → oculto → resuelto.

  PaginaProyecto   MOD-07          Entidad singleton que almacena el
                                   contenido de la página dedicada al
                                   proyecto. Solo editable por
                                   administradores (R17, R18).
  ---------------- --------------- -------------------------------------

***Tabla 7: Descripción de Entidades del Diagrama de Clases***

**7. Especificación Detallada de Requisitos**

Los requisitos a continuación han sido especificados conforme a la
estructura recomendada por ISO/IEC/IEEE 29148:2018 §9, incluyendo
identificador único, declaración, criterio de verificación y prioridad
MoSCoW. Cada requisito cumple con las propiedades de: correctitud,
completitud, no ambigüedad, verificabilidad, consistencia, trazabilidad
y modificabilidad.

**7.1 Requisitos Funcionales --- Must Have**

  -------- ------------------------- ----------------------- ----------------
  **ID**   **Requisito**             **Criterio de           **Módulo**
                                     Verificación**          

  R01      El sistema debe permitir  Credenciales válidas →  Autenticación
           el inicio de sesión       acceso. Inválidas →     
           mediante correo           mensaje de error        
           electrónico y contraseña. descriptivo en español. 

  R02      El sistema debe permitir  Usuario creado          Autenticación
           el registro de nuevos     correctamente; correo   
           usuarios con nombre,      duplicado rechazado con 
           correo y contraseña.      mensaje claro.          

  R15a     El sistema debe gestionar Sesión activa 24 h;     Autenticación
           sesiones largas con       expirada                
           expiración de 24 horas    automáticamente tras    
           cuando el usuario activa  ese tiempo.             
           «Recordarme».                                     

  R15b     El sistema debe gestionar Sesión expirada a las 2 Autenticación
           sesiones cortas con       h; usuario redirigido   
           expiración de 2 horas     al login.               
           cuando el usuario no                              
           activa «Recordarme».                              

  R19      El sistema debe verificar Usuario sin rol admin → Autenticación
           el rol de administrador   403. Acceso al panel    
           mediante middleware antes solo con rol admin.     
           de permitir acceso a                              
           rutas protegidas del                              
           panel.                                            

  R61      El sistema debe registrar Log accesible por       Seguridad
           cada intento fallido de   admin; incluye IP,      
           inicio de sesión con IP y correo intentado y      
           marca de tiempo.          timestamp.              

  R62      El sistema debe bloquear  Cuenta bloqueada;       Seguridad
           temporalmente una cuenta  usuario informado del   
           durante 15 minutos tras 5 tiempo de espera;       
           intentos consecutivos     desbloqueo automático.  
           fallidos.                                         

  R07a     El sistema debe permitir  Experiencia creada;     Experiencias
           crear una experiencia con título duplicado        
           título (opcional, único)  rechazado; descripción  
           y descripción             vacía rechazada.        
           (obligatoria).                                    

  R07b     Al crear una experiencia, Ambos campos se         Experiencias
           el sistema debe solicitar almacenan y muestran    
           los campos reflexivos     correctamente.          
           «¿Qué dice la moral sobre                         
           esto?» y «¿Qué dice tu                            
           ética sobre esto?».                               

  R10      El sistema debe permitir  Experiencia y           Experiencias
           al usuario eliminar sus   respuestas eliminadas;  
           propias experiencias; las confirmación previa     
           respuestas asociadas se   mostrada.               
           eliminan en cascada.                              

  R14      El sistema debe permitir  Cambios persistidos;    Experiencias
           al usuario editar título, fecha de modificación   
           descripción, moral, ética actualizada (R45).      
           y etiquetas de sus                                
           experiencias publicadas.                          

  R38      El sistema debe guardar   Borrador persistido sin Experiencias
           automáticamente el        acción del usuario;     
           borrador de la            indicador visual de     
           experiencia en edición    guardado mostrado.      
           cada 30 segundos.                                 

  R44      El sistema debe permitir  Borrador no visible     Experiencias
           guardar manualmente una   para otros; accesible   
           experiencia como borrador desde el perfil del     
           sin publicarla.           autor.                  

  R16      El sistema debe contar    Página accesible        Administración
           con una página dedicada a públicamente con el     
           mostrar las experiencias  contenido del proyecto. 
           del equipo de desarrollo                          
           del sitio web.                                    

  R17      El sistema debe impedir a Intento de edición sin  Administración
           los usuarios estándar     rol admin → error 403.  
           editar el contenido de la                         
           página dedicada.                                  

  R18      El sistema debe permitir  Admin puede editar;     Administración
           únicamente a los          cambios reflejados      
           administradores editar la inmediatamente.         
           página dedicada.                                  

  R20      El sistema debe disponer  Panel accesible solo    Administración
           de un panel de            para admins con         
           administración con        secciones funcionando.  
           gestión de usuarios y de                          
           la página dedicada.                               

  R21      El sistema debe permitir  Usuario y todo su       Administración
           al administrador eliminar contenido eliminados;   
           cualquier cuenta de       confirmación requerida. 
           usuario.                                          

  R22      El sistema debe permitir  Cambios persistidos     Administración
           al administrador editar   correctamente desde el  
           nombre, correo y estado   panel.                  
           de cualquier usuario.                             

  R23      El sistema debe permitir  Experiencia editada;    Administración
           al administrador editar   fecha de modificación   
           el contenido de cualquier actualizada.            
           experiencia publicada.                            

  R24      El sistema debe permitir  Experiencia y           Administración
           al administrador eliminar respuestas eliminadas;  
           cualquier experiencia     confirmación previa.    
           publicada.                                        

  R09      El sistema debe ofrecer   Al cambiar el modo,     UX
           modo claro y modo oscuro, todos los elementos UI  
           seleccionable por el      se adaptan; preferencia 
           usuario desde la          persiste al recargar.   
           interfaz.                                         

  R64      El sistema debe ser       Prueba en 320, 768 y    UX
           responsive, funcionando   1920 px sin             
           en pantallas desde 320 px desbordamiento ni       
           (móvil) hasta 1920 px     funcionalidades rotas.  
           (escritorio).                                     

  R65      El sistema debe mostrar   Sin confirmación no se  UX
           un diálogo de             ejecuta la eliminación; 
           confirmación antes de     «Cancelar» la cancela   
           ejecutar cualquier        correctamente.          
           eliminación permanente de                         
           contenido.                                        

  R66      El sistema debe mostrar   Los 10 errores más      UX
           mensajes de error claros, comunes tienen mensajes 
           en español, que describan descriptivos en         
           el problema y sugieran    español.                
           una acción.                                       
  -------- ------------------------- ----------------------- ----------------

***Tabla 8: Requisitos Funcionales --- Must Have (prioridad máxima)***

**7.2 Requisitos Funcionales --- Should Have**

  -------- ------------------------- ----------------------- ----------------
  **ID**   **Requisito**             **Criterio de           **Módulo**
                                     Verificación**          

  R03      El sistema debe mostrar   Página lista al menos   Social
           una landing page con la   los últimos 20 usuarios 
           lista de usuarios         con nombre y avatar.    
           registrados (nombre y                             
           foto de perfil).                                  

  R04      El sistema debe prohibir  Intento de editar       Seguridad
           a un usuario editar       contenido ajeno → error 
           contenido publicado por   403.                    
           otro usuario.                                     

  R05      El sistema debe permitir  Respuesta guardada y    Social
           añadir una respuesta (un  visible; no se permiten 
           solo nivel) a una         sub-respuestas.         
           experiencia de otro                               
           usuario.                                          

  R06      El sistema debe permitir  Cambios persistidos;    Usuarios
           al usuario modificar su   correo duplicado        
           nombre, correo y          rechazado.              
           contraseña desde                                  
           configuración.                                    

  R11      El sistema debe permitir  Respuesta eliminada sin Social
           al usuario eliminar sus   afectar la experiencia  
           propias respuestas a      ni otras respuestas.    
           experiencias.                                     

  R12      El sistema debe permitir  Usuario y contenido     Usuarios
           eliminar una cuenta de    eliminados; sesiones    
           usuario; todo su          activas invalidadas.    
           contenido se elimina con                          
           ella.                                             

  R13      El sistema debe permitir  Filtro reduce           Experiencias
           filtrar experiencias      resultados mientras se  
           propias por palabras      escribe; sin recarga de 
           clave en el título, en    página.                 
           tiempo real.                                      

  R25      El sistema debe permitir  Perfil visible sin      Usuarios
           visualizar el perfil      autenticación si el     
           público de cualquier      usuario tiene perfil    
           usuario (nombre, foto,    público.                
           bio, experiencias).                               

  R26      El sistema debe permitir  Biografía guardada y    Usuarios
           al usuario configurar una mostrada en perfil      
           biografía personal        público y privado.      
           (máximo 300 caracteres).                          

  R27      El sistema debe permitir  Foto almacenada y       Usuarios
           subir y actualizar una    mostrada;               
           foto de perfil (PNG/JPG;  formato/tamaño inválido 
           máximo 2 MB).             rechazado.              

  R29      El sistema debe permitir  Reacción registrada;    Social
           reaccionar con «me gusta» segundo clic elimina la 
           a una experiencia; un     reacción (toggle).      
           usuario, una reacción por                         
           experiencia.                                      

  R30      El sistema debe mostrar   Conteos actualizados en Social
           el conteo de respuestas y tiempo real o tras      
           «me gusta» en cada        recargar; visibles sin  
           tarjeta de experiencia.   autenticación.          

  R31      El sistema debe ordenar   Las experiencias más    Experiencias
           las experiencias por      recientes aparecen      
           fecha de publicación      primero por defecto.    
           descendente de forma                              
           predeterminada.                                   

  R41      El sistema debe permitir  Etiquetas guardadas;    Etiquetado
           añadir hasta 5 etiquetas  más de 5 rechazadas con 
           a una experiencia al      mensaje de error.       
           crearla o editarla.                               

  R42      El sistema debe permitir  Al seleccionar          Etiquetado
           buscar experiencias por   etiqueta, solo aparecen 
           etiqueta seleccionando    experiencias con esa    
           una desde la interfaz.    etiqueta.               

  R43      El sistema debe mostrar   Vista previa idéntica   Experiencias
           una vista previa de la    al formato de           
           experiencia antes de      publicación;            
           publicarla.               publicación disponible  
                                     desde la vista previa.  

  R45      El sistema debe registrar Fechas visibles en la   Experiencias
           y mostrar la fecha de     tarjeta; fecha de       
           creación y la fecha de    modificación            
           última modificación de    actualizada en cada     
           cada experiencia.         edición.                

  R46      El sistema debe mostrar   Experiencias listadas   Usuarios
           todas las experiencias    en orden cronológico    
           publicadas de un usuario  inverso en el perfil.   
           en su página de perfil.                           

  R47      El sistema debe permitir  Nombre actualizado en   Usuarios
           al usuario editar su      perfil y publicaciones; 
           nombre visible sin        correo sin cambios.     
           modificar su correo de                            
           acceso.                                           

  R51      El sistema debe permitir  Resultados devueltos en Etiquetado
           realizar búsquedas        menos de 3 s; sin       
           generales por palabras    resultados muestra      
           clave en título o         mensaje informativo.    
           descripción.                                      

  R52      El sistema debe paginar   Paginación funciona     Etiquetado
           los resultados, mostrando correctamente;          
           un máximo de 10           controles de            
           experiencias por página.  primera/última página   
                                     apropiados.             

  R56      El sistema debe mostrar   Sección actualizada     Social
           en la página principal    automáticamente; orden  
           una sección de            cronológico inverso.    
           experiencias más                                  
           recientes (últimas 10).                           

  R60      El sistema debe registrar Log consultable desde   Administración
           en un log de auditoría    el panel; incluye       
           las acciones              admin, acción, objetivo 
           administrativas           y timestamp.            
           (eliminación, edición,                            
           suspensión).                                      

  R67      El sistema debe mostrar   Spinner visible en      UX
           un indicador de carga     búsquedas, cargas de    
           (spinner) para            feed y envíos de        
           operaciones que demoren   formularios.            
           más de 500 ms.                                    
  -------- ------------------------- ----------------------- ----------------

***Tabla 9: Requisitos Funcionales --- Should Have***

**7.3 Requisitos Funcionales --- Could Have**

  -------- ------------------------- ----------------------- --------------
  **ID**   **Requisito**             **Criterio de           **Módulo**
                                     Verificación**          

  R28      El sistema debe permitir  Perfil privado no       Usuarios
           al usuario configurar su  visible para usuarios   
           perfil como público o     no seguidos.            
           privado.                                          

  R32      El sistema debe permitir  Al seleccionar el       Experiencias
           ordenar las experiencias  orden, la lista se      
           por popularidad (mayor    reordena correctamente. 
           número de «me gusta»).                            

  R33      El sistema debe permitir  Reporte registrado;     Moderación
           reportar una experiencia  usuario notificado de   
           o respuesta por contenido que fue recibido.       
           inapropiado.                                      

  R34      El sistema debe permitir  Contenido del bloqueado Social
           al usuario bloquear a     oculto; bloqueo         
           otro, impidiendo ver su   reversible desde        
           contenido.                configuración.          

  R35      El sistema debe permitir  Contenido oculto no     Moderación
           al administrador ocultar  visible para usuarios;  
           (sin eliminar) contenido  visible para admin con  
           reportado mientras lo     indicador.              
           revisa.                                           

  R36      El sistema debe registrar Historial visible desde Moderación
           el historial de reportes  el panel de             
           de cada experiencia       administración.         
           (usuario, motivo, fecha).                         

  R37      El sistema debe permitir  Usuario suspendido no   Moderación
           al administrador          puede iniciar sesión;   
           suspender temporalmente a suspensión expira       
           un usuario especificando  automáticamente.        
           la duración.                                      

  R39      El sistema debe permitir  Borrador recuperado con Experiencias
           al usuario retomar y      todos los campos en el  
           continuar la edición de   estado guardado.        
           un borrador guardado.                             

  R48      El sistema debe mostrar   Estadísticas            Usuarios
           en el perfil del usuario: actualizadas tras cada  
           total de experiencias     publicación o reacción. 
           publicadas y total de «me                         
           gusta» recibidos.                                 

  R49      El sistema debe permitir  Lista de favoritos      Social
           marcar experiencias como  disponible en el        
           favoritas y acceder a     perfil; agregar/quitar  
           ellas desde el perfil.    con un clic.            

  R50      El sistema debe permitir  Resultados muestran     Etiquetado
           filtrar experiencias por  solo experiencias del   
           nombre de autor mediante  autor buscado.          
           campo de búsqueda.                                

  R54      El sistema debe limitar a No se puede guardar con Etiquetado
           5 el número de etiquetas  más de 5 etiquetas;     
           por experiencia           error claro mostrado.   
           (validación en backend y                          
           frontend).                                        

  R55      El sistema debe mostrar   Sección muestra entre 3 Etiquetado
           una sección de            y 5 experiencias con al 
           experiencias relacionadas menos una etiqueta en   
           basadas en etiquetas      común.                  
           compartidas.                                      

  R57      El sistema debe mostrar   Sección muestra entre 3 Social
           experiencias destacadas   y 5 experiencias        
           (mayor puntaje de «me     actualizadas cada hora. 
           gusta» en las últimas 48                          
           horas).                                           

  R58      El sistema debe permitir  Seguimiento registrado; Social
           seguir a otros usuarios.  el seguidor puede ver   
                                     el feed de experiencias 
                                     del seguido.            

  R59      El sistema debe mostrar   Feed solo muestra       Social
           un feed personalizado con contenido de usuarios   
           experiencias de los       seguidos; sin seguidos, 
           usuarios seguidos,        muestra mensaje         
           ordenado por fecha.       orientativo.            

  R63      El sistema debe detectar  Contenido con términos  Moderación
           y rechazar                prohibidos rechazado;   
           experiencias/respuestas   mensaje de error; sin   
           con términos de una lista publicación.            
           negra configurable por el                         
           administrador.                                    
  -------- ------------------------- ----------------------- --------------

***Tabla 10: Requisitos Funcionales --- Could Have***

**7.4 Requisitos No Funcionales (IEEE 29148 §9.5)**

Los requisitos no funcionales definen los atributos de calidad del
sistema conforme al modelo ISO/IEC 25010 (SQuaRE). Cada requisito
incluye criterio de verificación medible.

  -------- ------------------ ------------------------ ---------------- ------------
  **ID**   **Requisito**      **Criterio de            **Categoría ISO  **MoSCoW**
                              Verificación**           25010**          

  RNF01    Las contraseñas    Inspección de base de    Seguridad        **Must**
           deben almacenarse  datos: solo hashes,                       
           con hash seguro    nunca texto plano.                        
           usando bcrypt                                                
           (cost ≥ 10) o                                                
           Argon2.                                                      

  RNF02    El sistema debe    Token válido → acceso.   Seguridad        **Must**
           autenticar         Token expirado o                          
           sesiones mediante  manipulado → 401.                         
           JWT con expiración                                           
           o cookies HttpOnly                                           
           con flags Secure y                                           
           SameSite=Strict.                                             

  RNF03    Todas las rutas    Sin token/sesión → 401.  Seguridad        **Must**
           privadas deben     Rol incorrecto → 403.                     
           protegerse con                                               
           middleware que                                               
           verifique                                                    
           autenticación y                                              
           rol.                                                         

  RNF04    El sistema debe    Test de carga con 50     Rendimiento      **Should**
           responder a        usuarios: percentil 95                    
           solicitudes CRUD   \< 3 s.                                   
           comunes en menos                                             
           de 3 segundos bajo                                           
           carga de 50                                                  
           usuarios                                                     
           concurrentes.                                                

  RNF05    El sistema debe    Test de carga: sin       Rendimiento      **Could**
           soportar al menos  errores 5xx y tiempo de                   
           50 usuarios        respuesta \< 3 s.                         
           concurrentes sin                                             
           degradación                                                  
           perceptible.                                                 

  RNF06    Un usuario nuevo   Prueba de usabilidad con Usabilidad       **Should**
           debe poder         3 usuarios: todos                         
           publicar su        completan en \< 5 min.                    
           primera                                                      
           experiencia en                                               
           menos de 5 minutos                                           
           sin asistencia.                                              

  RNF07    El sistema debe    Auditoría de 10 páginas  Usabilidad       **Should**
           mantener           aleatorias: sin                           
           consistencia       inconsistencias en                        
           visual (colores,   paleta ni tipografía.                     
           tipografía,                                                  
           espaciado) en                                                
           todas las páginas.                                           

  RNF08    El sistema debe    Prueba de humo en 4      Compatibilidad   **Should**
           funcionar sin      navegadores: 0 errores                    
           errores críticos   críticos.                                 
           en Chrome,                                                   
           Firefox, Edge y                                              
           Safari en sus                                                
           versiones                                                    
           actuales.                                                    

  RNF09    El sistema debe    Prueba en 4 resoluciones Compatibilidad   **Could**
           adaptarse sin      estándar: sin                             
           pérdida de         desbordamiento ni                         
           funcionalidad a    botones inaccesibles.                     
           pantallas de 320                                             
           px a 2560 px.                                                
  -------- ------------------ ------------------------ ---------------- ------------

***Tabla 11: Requisitos No Funcionales (ISO/IEC 25010 --- SQuaRE)***

**8. Modularización del Sistema**

La organización modular facilita la asignación de responsabilidades, la
gestión de dependencias y la trazabilidad entre requisitos, casos de
uso, componentes de diseño y pruebas, conforme al principio de partición
funcional del estándar ISO/IEC/IEEE 29148:2018.

  -------- ----------------- -------------------------------------------
  **ID**   **Módulo**        **Requisitos Asociados**

  MOD-01   Autenticación y   R01, R02, R15a, R15b, R19, R61, R62, RNF01,
           Sesiones          RNF02, RNF03

  MOD-02   Gestión de        R06, R12, R21, R22, R25, R26, R27, R28,
           Usuarios          R34, R37, R47, R48

  MOD-03   Gestión de        R07a, R07b, R10, R13, R14, R38, R39, R43,
           Experiencias      R44, R45, R55

  MOD-04   Etiquetado y      R41, R42, R50, R51, R52, R54, R55
           Búsqueda          

  MOD-05   Interacción       R03, R05, R11, R29, R30, R31, R32, R49,
           Social            R56, R57, R58, R59

  MOD-06   Moderación y      R04, R17, R33, R35, R36, R37, R60, R63,
           Seguridad         RNF01, RNF02, RNF03

  MOD-07   Administración    R16, R18, R20, R21, R22, R23, R24, R35, R60

  MOD-08   UX y              R08, R09, R40, R64, R65, R66, R67, RNF06,
           Accesibilidad     RNF07, RNF08, RNF09

  MOD-09   Rendimiento e     RNF04, RNF05
           Infraestructura   
  -------- ----------------- -------------------------------------------

***Tabla 12: Módulos del Sistema y Requisitos Asociados***

**9. Relación entre Requisitos**

**9.1 Dependencias**

  ---------- -------------- -------------------------------- --------------
  **Req.**   **Depende de** **Naturaleza de la Dependencia** **Tipo**

  R05        R01, R07a      Para responder una experiencia:  Precondición
                            usuario autenticado y            
                            experiencia existente.           

  R10        R11            Al eliminar una experiencia, sus Inclusión
                            respuestas deben eliminarse en   
                            cascada.                         

  R13        R07a           El filtro por título requiere    Precondición
                            que existan experiencias con     
                            título asignado.                 

  R19        R01, R02       La autenticación de admin        Precondición
                            requiere que el sistema de       
                            sesiones esté implementado.      

  R38        R44            El guardado automático es una    Extensión
                            extensión del guardado manual de 
                            borradores.                      

  R39        R38, R44       Continuar un borrador requiere   Precondición
                            que este haya sido guardado      
                            previamente.                     

  R42        R41            Buscar por etiqueta requiere que Precondición
                            las experiencias tengan          
                            etiquetas asignadas.             

  R55        R41, R42       Mostrar experiencias             Extensión
                            relacionadas requiere el sistema 
                            de etiquetado completo.          

  R59        R58            El feed personalizado requiere   Precondición
                            que el usuario siga a otros.     

  R62        R61            Para bloquear por intentos       Extensión
                            fallidos, el sistema debe        
                            registrarlos primero.            

  R60        R19, R20       El log de auditoría requiere que Precondición
                            el sistema de administración     
                            esté activo.                     
  ---------- -------------- -------------------------------- --------------

***Tabla 13: Dependencias entre Requisitos***

**9.2 Conflictos y Duplicados Resueltos**

  ----------------- --------------- ---------------------------------------------
  **Req. A**        **Req. B**      **Resolución**

  R09 (Modo oscuro) R40 (Prefs.     R09 integrado como subconjunto de R40. R09 es
                    visuales)       Must; R40 es Could para funcionalidades
                                    adicionales.

  R38               R44 (Borrador   Son complementarios: R44 es guardado
  (Auto-borrador)   manual)         explícito; R38 es guardado periódico
                                    automático. Ambos se mantienen.

  R41 (Etiquetas    R53             Mismo requisito desde perspectivas distintas.
  crear)            (Categorizar)   R41 como activo (Should). R53 marcado Won\'t
                                    (redundante, cubierto por R41 y R54).
  ----------------- --------------- ---------------------------------------------

***Tabla 14: Conflictos y Duplicados Resueltos***

**10. Matriz de Trazabilidad**

La matriz de trazabilidad vincula cada requisito con su stakeholder de
origen, caso de uso, módulo responsable y prioridad MoSCoW, conforme al
principio de rastreabilidad bidireccional exigido por ISO/IEC/IEEE
29148:2018 §9.6.

  ------------------ --------------- ------------- -------------- -------------- ------------------
  **Requisito(s)**   **Stakeholder   **Caso de     **Módulo**     **Técnica**    **MoSCoW**
                     Origen**        Uso**                                       

  R01, R02           Docente de      CU-01         MOD-01         Brainstorm     **Must**
                     Ética,                                                      
                     Estudiantes                                                 

  R07a, R07b         Estudiantes,    CU-03         MOD-03         Brainstorm     **Must**
                     Docente                                                     

  R10, R14           Usuarios        CU-03         MOD-03         Brainstorm     **Must**
                     estándar                                                    

  R15a, R15b         Todos los       CU-01         MOD-01         Brainstorm     **Must**
                     usuarios                                                    

  R16, R17, R18      Docente, Equipo CU-07         MOD-07         Brainstorm     **Must**

  R19, R20           Equipo de       CU-07         MOD-01, MOD-07 Brainstorm     **Must**
                     Desarrollo                                                  

  R21-R24            Docente, Equipo CU-07         MOD-07         Brainstorm     **Must**

  R38, R44           Estudiantes,    CU-03         MOD-03         Benchmarking   **Must**
                     Docente                                                     

  R61, R62           Todos           CU-01         MOD-01, MOD-06 Benchmarking   **Must**

  R64-R66            Todos los       ---           MOD-08         Benchmarking   **Must**
                     stakeholders                                                

  RNF01-RNF03        Todos           CU-01         MOD-01, MOD-06 Benchmarking   **Must**

  R03, R05, R56      Público,        CU-05         MOD-05         Ambas          **Should**
                     Estudiantes                                                 

  R06, R47           Usuarios        CU-02         MOD-02         Brainstorm     **Should**
                     estándar                                                    

  R25-R27            Todos           CU-02         MOD-02         Benchmarking   **Should**

  R29, R30           Todos           CU-05         MOD-05         Benchmarking   **Should**

  R41-R43            Estudiantes,    CU-04         MOD-04         Benchmarking   **Should**
                     Docente                                                     

  R51, R52           Todos           CU-04         MOD-04         Benchmarking   **Should**

  R33-R37            Admin,          CU-06         MOD-06         Benchmarking   **Could**
                     Moderadores                                                 

  R57-R59            Estudiantes,    CU-05         MOD-05         Benchmarking   **Could**
                     Público                                                     

  RNF04-RNF05        Equipo de       ---           MOD-09         Benchmarking   **Should/Could**
                     Desarrollo                                                  
  ------------------ --------------- ------------- -------------- -------------- ------------------

***Tabla 15: Matriz de Trazabilidad de Requisitos (IEEE 29148:2018
§9.6)***

**11. Cronograma de Implementación**

El cronograma vincula cada sprint con los requisitos a implementar,
asegurando que todos los requisitos Must y Should sean cubiertos antes
de la entrega final del semestre 2026-I. Sigue el modelo de
planificación ágil recomendado en el Scrum Guide (2020) e integrado en
el proceso de IEEE 29148:2018.

  ------------ ------------- -------------------- ----------------------- ------------
  **Sprint**   **Semanas**   **Foco Principal**   **Requisitos            **Prior.**
                                                  Vinculados**            

  Sprint 1     Sem. 7        Autenticación y      R01, R02, R15a, R15b,   **Must**
                             Sesiones             R19, RNF01, RNF02,      
                                                  RNF03                   

  Sprint 2     Sem. 8        Gestión de           R07a, R07b, R10, R14,   **Must**
                             Experiencias (CRUD)  R44, R45, R65           

  Sprint 3     Sem. 9        Borradores, Búsqueda R13, R38, R39, R43,     **Should**
                             y Filtrado           R51, R52                

  Sprint 4     Sem. 10-11    Panel de             R16-R24, R60, R66, R67  **Must**
                             Administración                               

  Sprint 5     Sem. 12-13    Perfiles, Etiquetas  R25-R30, R41, R42, R46, **Should**
                             e Interacción        R47                     

  Sprint 6     Sem. 14       Feed, Seguridad      R09, R31, R56, R61,     **Should**
                             Avanzada y UX        R62, R64, RNF04         

  Sprint 7     Sem. 15       Features Could (si   R33-R37, R49, R57-R59,  **Could**
                             hay tiempo)          R63                     

  Sprint 8     Sem. 16       Pruebas,             Todos los Must y Should **Must**
                             Correcciones y       --- plan de pruebas,    
                             Entrega Final        corrección de defectos, 
                                                  revisión final          
  ------------ ------------- -------------------- ----------------------- ------------

***Tabla 16: Cronograma de Implementación por Sprint --- Semestre
2026-I***

![](media/86b7acf1392dc86987915274a433111d127a9b9e.png){width="8.541666666666666in"
height="4.270833333333333in"}

***Figura 7: Diagrama de Gantt --- Cronograma de Sprints 2026-I***

**12. Resumen de Requisitos Consolidados**

  -------------------- -------------- --------------- --------------- -----------
  **Sprint / Fuente**  **Técnica      **Req.          **Req. No       **Total**
                       Aplicada**     Funcionales**   Funcionales**   

  Sprint 01 (R01-R24)  Lluvia de      24              ---             **24**
                       Ideas                                          

  Sprint 02 (R25-R67)  Benchmarking   43              9               **52**

  **TOTAL**            **2 Sprints**  **67**          **9**           **76**
  -------------------- -------------- --------------- --------------- -----------

***Tabla 17: Consolidación Total de Requisitos***

  --------------------------------------------------------------------------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------- ----------------
  **Must Have**                                                                                                               **Should Have**                                                                                                           **Could Have**                                                                    **Won\'t Have**

  R01,R02,R07a,R07b,R09,R10,R14,R15a,R15b,R16,R17,R18,R19,R20,R21,R22,R23,R24,R38,R44,R61,R62,R64,R65,R66,RNF01,RNF02,RNF03   R03,R04,R05,R06,R11,R12,R13,R25,R26,R27,R29,R30,R31,R41,R42,R43,R45,R46,R47,R51,R52,R56,R60,R67,RNF04,RNF06,RNF07,RNF08   R28,R32,R33,R34,R35,R36,R37,R39,R48,R49,R50,R54,R55,R57,R58,R59,R63,RNF05,RNF09   R53 (duplicado
                                                                                                                                                                                                                                                                                                                                          de R41/R54 ---
                                                                                                                                                                                                                                                                                                                                          cubierto y
                                                                                                                                                                                                                                                                                                                                          unificado)
  --------------------------------------------------------------------------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------- ----------------

***Tabla 18: Distribución de Requisitos por Prioridad MoSCoW***

*Nota: Los conflictos entre R09/R40, R38/R44 y R41/R53 fueron resueltos
conforme al proceso de resolución de conflictos de la sección 9.2. R53
se marca como Won\'t Have (redundante).*
