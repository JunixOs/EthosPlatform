Si `00-overview` responde **qué problema existe y por qué existe el sistema**, entonces:

# `01-requirements`

responde:

> **¿Qué debe hacer el sistema y qué características de calidad debe cumplir?**

Aquí comienza la transición entre negocio y diseño.

Muchos equipos cometen el error de mezclar requisitos con diseño técnico.

Por ejemplo:

❌ Incorrecto:

```text
El sistema usará PostgreSQL.
```

Eso NO es un requisito.

Eso es una decisión de diseño.

---

✔ Correcto:

```text
El sistema deberá almacenar información
de manera persistente.
```

Cómo se implementa se decidirá después.

---

# Estructura propuesta

```text
01-requirements/
├── functional-requirements.md
├── non-functional-requirements.md
├── use-cases/
├── user-stories/
└── quality-attributes.md
```

---

# Relación entre documentos

```text
Stakeholders
      ↓
User Stories
      ↓
Use Cases
      ↓
Functional Requirements
      ↓
Non Functional Requirements
      ↓
Quality Attributes
```

---

# ¿Por qué separar esto?

Porque son conceptos distintos.

Muchas organizaciones mezclan:

* historias de usuario
* casos de uso
* requisitos funcionales

y luego nadie sabe qué es qué.

---

# 1. functional-requirements.md

Este documento define:

> ¿Qué funciones debe ofrecer el sistema?

---

# Qué es un requisito funcional

Describe un comportamiento observable.

---

## Ejemplo

```text
El sistema permitirá registrar mascotas.
```

---

Otro:

```text
El sistema permitirá programar citas.
```

---

Otro:

```text
El sistema permitirá emitir comprobantes.
```

---

# Qué documentar

---

## Identificador

Muy importante.

Ejemplo:

```text
RF-001
RF-002
RF-003
```

---

## Nombre

Ejemplo:

```text
RF-001 Registro de Mascotas
```

---

## Descripción

Ejemplo:

```text
El sistema permitirá registrar una mascota
asociada a un propietario.
```

---

## Prioridad

Ejemplo:

```text
Alta
Media
Baja
```

---

## Fuente

¿Quién pidió esto?

Ejemplo:

```text
Veterinario
Product Owner
```

---

# Ejemplo completo

```markdown
RF-001 Registro de Mascotas

Descripción:
El sistema permitirá registrar mascotas.

Prioridad:
Alta

Fuente:
Veterinarios
```

---

# Buena práctica

Agrupar requisitos por módulo.

Ejemplo:

```text
Mascotas
 ├─ RF-001
 ├─ RF-002
 └─ RF-003

Citas
 ├─ RF-010
 ├─ RF-011
 └─ RF-012
```

---

# Qué NO poner aquí

No pongas:

```text
La tabla Pets tendrá...
```

Eso es diseño.

---

No pongas:

```text
Se usará JWT.
```

Eso es arquitectura.

---

# 2. non-functional-requirements.md

Aquí documentas:

> ¿Cómo debe comportarse el sistema?

No qué hace.

---

# Ejemplos

---

## Rendimiento

```text
Las consultas deberán responder
en menos de 2 segundos.
```

---

## Disponibilidad

```text
Disponibilidad mínima 99.5%.
```

---

## Seguridad

```text
Las contraseñas deberán almacenarse cifradas.
```

---

## Escalabilidad

```text
El sistema deberá soportar
500 usuarios concurrentes.
```

---

## Mantenibilidad

```text
Los módulos deberán ser independientes.
```

---

# Estructura recomendada

---

## RNF-001

```markdown
RNF-001 Tiempo de Respuesta

Descripción:
Las operaciones CRUD deberán responder
en menos de 2 segundos.

Prioridad:
Alta
```

---

## RNF-002

```markdown
RNF-002 Disponibilidad

Descripción:
Disponibilidad mínima 99.5%.
```

---

# Clasificación útil

Puedes agruparlos por:

```text
Performance
Security
Availability
Scalability
Usability
Maintainability
Reliability
```

---

# Ejemplo

```text
Performance
 ├─ RNF-001
 ├─ RNF-002

Security
 ├─ RNF-010
 ├─ RNF-011
```

---

# 3. use-cases/

Aquí guardas los diagramas y especificaciones de casos de uso.

---

# Objetivo

Describir interacciones completas entre actores y sistema.

---

# Estructura

```text
use-cases/
├── diagrams/
├── UC-001-create-pet.md
├── UC-002-create-appointment.md
└── UC-003-login.md
```

---

# Ejemplo de caso de uso

## UC-001

```markdown
Nombre:
Registrar Mascota

Actor:
Recepcionista

Objetivo:
Registrar una mascota.

Precondiciones:
- Cliente registrado

Postcondiciones:
- Mascota creada
```

---

## Flujo principal

```text
1. Recepcionista selecciona "Nueva Mascota"
2. Ingresa datos
3. Sistema valida
4. Sistema registra
5. Sistema confirma
```

---

## Flujo alternativo

```text
3A. Datos inválidos

3A.1 Sistema muestra error
```

---

# Relación con requisitos

```text
UC-001
   ↓
RF-001
RF-002
RF-003
```

Un caso de uso puede cubrir varios requisitos.

---

# 4. user-stories/

Aquí documentas historias de usuario.

---

# Objetivo

Representar necesidades desde la perspectiva del usuario.

---

# Formato clásico

```text
Como [rol]
Quiero [objetivo]
Para [beneficio]
```

---

# Ejemplo

```text
Como recepcionista

Quiero registrar mascotas

Para mantener actualizado
el historial clínico.
```

---

# Otro

```text
Como veterinario

Quiero consultar
historiales médicos

Para tomar mejores decisiones.
```

---

# Criterios de aceptación

Muy importante.

---

## Ejemplo

```markdown
Dado un propietario registrado

Cuando registro una mascota

Entonces la mascota debe
quedar asociada al propietario.
```

---

# Estructura

```text
user-stories/
├── US-001-register-pet.md
├── US-002-create-appointment.md
└── US-003-login.md
```

---

# Relación entre historias y requisitos

```text
US-001
    ↓
UC-001
    ↓
RF-001
RF-002
```

---

# 5. quality-attributes.md

Este documento es extremadamente importante para arquitectura.

Muchas decisiones arquitectónicas nacen aquí.

---

# Objetivo

Definir atributos de calidad prioritarios.

---

# ¿Qué son?

Características que determinan si el sistema es "bueno".

---

# Ejemplos

---

## Seguridad

```text
Proteger datos clínicos.
```

---

## Rendimiento

```text
Responder rápidamente.
```

---

## Disponibilidad

```text
Permanecer operativo.
```

---

## Escalabilidad

```text
Soportar crecimiento.
```

---

## Mantenibilidad

```text
Facilitar cambios futuros.
```

---

# Documentación recomendada

---

## Atributo

```markdown
Seguridad
```

---

## Importancia

```markdown
Muy Alta
```

---

## Justificación

```markdown
Se almacenan datos sensibles
de clientes y pacientes.
```

---

## Impacto arquitectónico

```markdown
Se requerirá:

- autenticación
- autorización
- auditoría
- cifrado
```

---

# Ejemplo completo

```markdown
Atributo:
Escalabilidad

Prioridad:
Alta

Justificación:
Se espera crecimiento anual.

Impacto:
Arquitectura modular.
Cache distribuido.
Procesamiento asíncrono.
```

---

# Diferencia entre RNF y Quality Attributes

Muchos los confunden.

---

## RNF

Son medibles.

Ejemplo:

```text
Respuesta menor a 2 segundos.
```

---

## Quality Attribute

Es una meta de calidad.

Ejemplo:

```text
Rendimiento.
```

---

Relación:

```text
Quality Attribute
       ↓
Performance
       ↓
RNF-001
RNF-002
RNF-003
```

---

# Ejemplo completo para tu proyecto

```text
01-requirements/
│
├── functional-requirements.md
│   ├─ RF-001 Registrar mascota
│   ├─ RF-002 Registrar cita
│   └─ RF-003 Facturación
│
├── non-functional-requirements.md
│   ├─ RNF-001 Rendimiento
│   ├─ RNF-002 Seguridad
│   └─ RNF-003 Disponibilidad
│
├── use-cases/
│   ├─ UC-001 Registrar mascota
│   ├─ UC-002 Login
│   └─ Diagramas
│
├── user-stories/
│   ├─ US-001 Registrar mascota
│   ├─ US-002 Crear cita
│   └─ US-003 Login
│
└── quality-attributes.md
    ├─ Seguridad
    ├─ Escalabilidad
    ├─ Mantenibilidad
    └─ Rendimiento
```

---

Cuando esta carpeta está bien construida, la siguiente (`02-business-rules`) se vuelve mucho más clara porque allí ya no hablarás de funcionalidades, sino de las **reglas del dominio** que gobiernan esas funcionalidades (por ejemplo: "una cita no puede programarse fuera del horario de atención" o "una factura no puede anularse después de 30 días"). Ahí es donde empieza a aparecer el conocimiento real del negocio.
