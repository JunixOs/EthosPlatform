# **Architectural Style**

## 1. Estilo Arquitectónico Elegido

La aplicación usará una `Arquitectura Cliente-Servidor` de `3-Tiers`, el cual dividirá el sistema en tres módulos o capas `Presentación`, `Lógica` y `Datos`.

Las capas se agruparán de la siguiente manera:

```plaintext
Frontend:
    - Presentación
Backend:
    - Lógica
    - Datos
```

Para la capa de `Presentación` (`Frontend`) se utilizará una `Arquitectura Basada en Componentes`.

En el Backend, para las capas de `Lógica` y `Datos`, se usará una combinación entre `Clean Architecture` y `Vertical Slicing Architecture`, con ligeras variaciones para adaptarla a nuestras necesidades.

## 2. ¿Por qué se eligió?

- Mantenibilidad
- Escalabilidad
- Facilidad de Testing

## 3. Ventajas

- Facilidad de debugging.
- Menos dependencias cruzadas.
- Los cambios en una capa o módulo no afectan a los demás.

## 4. Desventajas

- Mayor complejidad inicial.
- Mayor riesgo de acoplamiento.

## 5. Reglas Arquitectónicas

- Solo la capa de `Datos` se comunica directamente con la Base de Datos.
- Comunicación mediante interfaces.
- `Presentación` no depende de `Datos`.
- `Lógica` no depende de `Presentación`.

## 6. Patrones Usados

| Patrón               | Uso                          |
| -------------------- | ---------------------------- |
| Repository           | acceso a datos               |
| Factory              | creación de objetos          |
| Dependency Injection | inversión de control         |