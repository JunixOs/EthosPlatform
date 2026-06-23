# **REQUISITOS NO FUNCIONALES**

Los requisitos no funcionales definen los atributos de calidad del sistema conforme al modelo `ISO/IEC 25010 (SQuaRE)`. Cada requisito incluye criterio de verificación medible.

| ID | Requisito | Criterio de Verificación | Categoría ISO 25010 | MoSCoW |
|----|------------|--------------------------|---------------------|---------|
| RNF01 | Las contraseñas deben almacenarse con hash seguro usando bcrypt (cost >= 10) o Argon2. | Inspección de base de datos: solo hashes, nunca texto plano. | Seguridad | Must |
| RNF02 | El sistema debe autenticar sesiones mediante JWT con expiración o cookies HttpOnly con flags Secure y SameSite=Strict. | Token válido -> acceso permitido. Token expirado o manipulado -> error 401. | Seguridad | Must |
| RNF03 | Todas las rutas privadas deben protegerse con middleware que verifique autenticación y rol. | Sin token o sesión -> error 401. Rol incorrecto -> error 403. | Seguridad | Must |
| RNF04 | El sistema debe responder a solicitudes CRUD comunes en menos de 3 segundos bajo carga de 50 usuarios concurrentes. | Test de carga con 50 usuarios: percentil 95 < 3 s. | Rendimiento | Should |
| RNF05 | El sistema debe soportar al menos 50 usuarios concurrentes sin degradación perceptible. | Test de carga sin errores 5xx y tiempo de respuesta < 3 s. | Rendimiento | Could |
| RNF06 | Un usuario nuevo debe poder publicar su primera experiencia en menos de 5 minutos sin asistencia. | Prueba de usabilidad con 3 usuarios: todos completan la tarea en < 5 min. | Usabilidad | Should |
| RNF07 | El sistema debe mantener consistencia visual (colores, tipografía y espaciado) en todas las páginas. | Auditoría de 10 páginas aleatorias: sin inconsistencias en paleta ni tipografía. | Usabilidad | Should |
| RNF08 | El sistema debe funcionar sin errores críticos en Chrome, Firefox, Edge y Safari en sus versiones actuales. | Prueba de humo en 4 navegadores: 0 errores críticos. | Compatibilidad | Should |
| RNF09 | El sistema debe adaptarse sin pérdida de funcionalidad a pantallas desde 320 px hasta 2560 px. | Prueba en 4 resoluciones estándar: sin desbordamiento ni botones inaccesibles. | Compatibilidad | Could |