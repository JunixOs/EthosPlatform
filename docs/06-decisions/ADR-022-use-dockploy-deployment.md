# **ADR-022: Use Dockploy for Webhook-Based Continuous Deployment**

**Author:** Ordoñez Silva, Junior

**Version:** 1.0

**Created At:** 21-07-2026

**Modified By:**

**Accepted By:**
- Ordoñez Silva, Junior

## Status

Aceptado

## Context

Una vez superada la fase de integración continua (build, tests, análisis de calidad), el código aprobado debe llegar al entorno de producción de forma automatizada. EthosPlatform se despliega como contenedores Docker orquestados mediante `docker-compose.yml`.

Se evaluó la mejor forma de conectar el pipeline de GitHub Actions con el Docker Host de producción para ejecutar los comandos de build y deploy de manera segura y automatizada.

## Decision

Usar **Dockploy** como herramienta de despliegue continuo, activada mediante un webhook HTTP `POST` disparado desde GitHub Actions una vez aprobado el Quality Gate de SonarQube.

## Consequences
### Positive

- **Simplicidad Operativa**: No requiere configurar claves SSH, usuarios de despliegue ni exponer el puerto 22 del servidor al pipeline de CI. La comunicación se reduce a una petición HTTP segura a un endpoint de Dockploy.
- **Desacoplamiento entre CI y CD**: GitHub Actions no necesita conocer los detalles internos del Docker Host (rutas, permisos, usuarios). Solo envía una señal; Dockploy se encarga del resto.
- **Seguridad por Token de Webhook**: La URL del webhook contiene un token único y secreto generado por Dockploy. Sin ese token, no es posible disparar un despliegue.
- **Reconstrucción Controlada**: Dockploy gestiona secuencialmente `docker-compose build`, `docker-compose up -d` y limpieza de recursos, evitando errores manuales en la consola del servidor.

### Negative

- **Dependencia de un Servicio Externo**: Si Dockploy experimenta caídas o cambios en su API, el mecanismo de despliegue podría interrumpirse temporalmente.
- **Menor Visibilidad desde GitHub**: El pipeline de GitHub Actions solo sabe que el webhook fue enviado exitosamente. No recibe retroalimentación directa sobre si los contenedores se reiniciaron correctamente, salvo que Dockploy implemente notificaciones de callback.
- **Capacidades Limitadas de Rollback**: A diferencia de estrategias de despliegue más avanzadas (blue/green, canary), un webhook simple típicamente ejecuta un deploy en el lugar, lo que implica que un build defectuoso podría dejar el servicio en estado no deseado hasta una intervención manual.

## Alternatives Considered

- **SSH Directo desde GitHub Actions**:
  - *Pros*: Control total del servidor, capacidad de ejecutar cualquier comando, retroalimentación inmediata de éxito o fallo.
  - *Contras*: Requiere almacenar una clave SSH privada en GitHub Secrets. Expone el servicio SSH al runner (aunque sea interno). Mayor superficie de ataque si la clave se compromete. Más complejo de mantener (rotación de claves, hardening de SSH).
- **GitHub Actions + Docker Context Remoto**:
  - *Pros*: El propio runner podría construir imágenes y enviarlas a un registry, luego actualizar el Docker remoto.
  - *Contras*: Requiere un Docker Registry privado, autenticación y gestión de imágenes, añadiendo complejidad innecesaria para la escala actual del proyecto.
- **Watchtower (auto-deploy por detección de imagen)**:
  - *Pros*: Detecta cambios en imágenes de un registry y reinicia contenedores automáticamente.
  - *Contras*: Requiere un registry de imágenes Docker configurado y publicado. No se integra directamente con el evento de "push a main" ni con el Quality Gate.
