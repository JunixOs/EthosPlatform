Si documentas bien `00-overview`, el resto del SDD será mucho más fácil de construir porque esta sección define el contexto y las restricciones que afectan todas las decisiones posteriores.

---

# ¿Qué es `00-overview`?

Esta sección responde una pregunta muy simple:

> **¿Qué es este sistema y por qué existe?**

No describe:

* clases,
* APIs,
* tablas,
* tecnologías,
* arquitectura interna.

Eso se documentará después.

Aquí se documenta el problema de negocio y el contexto general.

---

# Estructura propuesta

```text
00-overview/
├── vision.md
├── project-scope.md
├── stakeholders.md
├── business-context.md
└── constraints.md
```

---

# Relación entre documentos

Piensa en ellos como una cadena lógica:

```text
Vision
   ↓
Scope
   ↓
Stakeholders
   ↓
Business Context
   ↓
Constraints
```

Primero defines la visión.

Luego defines qué entra y qué no entra.

Después identificas quiénes participan.

Luego explicas cómo interactúa el sistema con el mundo.

Finalmente documentas las restricciones.

---

# 1. vision.md

Este es probablemente el documento más importante de toda la carpeta.

---

# Objetivo

Responder:

> ¿Qué problema intenta resolver el sistema?

---

# Qué debe contener

---

## 1. Introducción

Explica el problema actual.

Ejemplo:

```markdown
Actualmente las clínicas veterinarias gestionan
sus operaciones mediante hojas de cálculo,
registros físicos y sistemas aislados.

Esto genera:

- pérdida de información
- duplicación de datos
- errores administrativos
- poca trazabilidad
```

---

## 2. Visión del producto

Describe el futuro deseado.

Ejemplo:

```markdown
ZooTech será una plataforma SaaS que permitirá
a clínicas veterinarias administrar pacientes,
citas, inventario y facturación desde una única
solución centralizada.
```

---

## 3. Objetivos del negocio

No son objetivos técnicos.

Ejemplo:

```markdown
Objetivos:

- reducir tiempo administrativo
- mejorar trazabilidad
- centralizar información
- aumentar productividad
- facilitar crecimiento de clínicas
```

---

## 4. Propuesta de valor

¿Por qué alguien usaría tu sistema?

Ejemplo:

```markdown
ZooTech permite administrar toda la operación
veterinaria desde una única plataforma,
reduciendo errores y mejorando la atención
al cliente.
```

---

## 5. Métricas de éxito

Muy pocas personas documentan esto.

Ejemplo:

```markdown
Métricas:

- reducir tiempo de registro en 50%
- disminuir errores administrativos en 30%
- aumentar adopción digital en clínicas
```

---

# Resultado esperado

Cuando alguien lea este documento debe entender:

```text
Qué problema resuelve
Para quién
Por qué existe
Cómo sabremos que tuvo éxito
```

---

# 2. project-scope.md

Aquí defines los límites del proyecto.

---

# Objetivo

Responder:

> ¿Qué hace el sistema?

y también

> ¿Qué NO hace el sistema?

---

# Qué documentar

---

## Funcionalidades incluidas

Ejemplo:

```markdown
Incluido:

- gestión de mascotas
- gestión de propietarios
- agenda veterinaria
- inventario
- facturación
- reportes
```

---

## Funcionalidades excluidas

Esto evita muchos problemas futuros.

Ejemplo:

```markdown
No incluido:

- telemedicina
- marketplace veterinario
- integración con laboratorios
- aplicación móvil nativa
```

---

## Alcance de la primera versión

Ejemplo:

```markdown
Versión 1:

- autenticación
- mascotas
- clientes
- citas
```

---

## Futuras versiones

Ejemplo:

```markdown
Versión 2:

- inventario

Versión 3:

- facturación

Versión 4:

- analítica
```

---

# Ejemplo práctico

Mucha gente escribe:

```markdown
El sistema gestionará clínicas veterinarias.
```

Eso no sirve.

Mucho mejor:

```markdown
El sistema permitirá:

- registrar mascotas
- registrar propietarios
- gestionar citas
- administrar historial clínico

No permitirá:

- realizar consultas por videollamada
- vender productos online
```

---

# 3. stakeholders.md

Aquí documentas quiénes tienen interés en el sistema.

---

# Objetivo

Responder:

> ¿Quién usa o influye en el sistema?

---

# Qué documentar

---

## Stakeholders internos

Ejemplo:

| Stakeholder       | Interés            |
| ----------------- | ------------------ |
| Product Owner     | éxito del producto |
| Equipo Desarrollo | implementación     |
| QA                | calidad            |
| Soporte           | atención usuarios  |

---

## Stakeholders externos

Ejemplo:

| Stakeholder   | Interés         |
| ------------- | --------------- |
| Veterinario   | usar sistema    |
| Recepcionista | gestionar citas |
| Administrador | reportes        |
| Cliente final | atención rápida |

---

## Necesidades

Ejemplo:

### Veterinario

```markdown
Necesita:

- consultar historial médico
- registrar diagnósticos
- gestionar tratamientos
```

---

### Recepcionista

```markdown
Necesita:

- crear citas
- reprogramar citas
- registrar clientes
```

---

# ¿Por qué es importante?

Porque muchos requisitos surgen directamente de aquí.

---

# 4. business-context.md

Aquí comienzas a mostrar el entorno donde vive el sistema.

---

# Objetivo

Responder:

> ¿Con qué personas y sistemas interactúa?

---

# Aquí aparece el primer diagrama importante

Normalmente un Context Diagram o C4 Nivel 1.

---

## Ejemplo textual

```text
Veterinario
     |
     v
 ZooTech
     |
     +---- Email Service
     |
     +---- Payment Gateway
```

---

# Qué documentar

---

## Actores

Ejemplo:

```markdown
Actores:

- Veterinario
- Recepcionista
- Administrador
```

---

## Sistemas externos

Ejemplo:

```markdown
Integraciones:

- Stripe
- SendGrid
- SUNAT
```

---

## Flujo de información

Ejemplo:

```markdown
ZooTech envía correos mediante SendGrid.

ZooTech procesa pagos mediante Stripe.
```

---

# Ejemplo práctico

---

## Actor

```markdown
Recepcionista
```

---

## Acción

```markdown
Registra una cita.
```

---

## Flujo

```text
Recepcionista
      |
      v
 ZooTech
      |
      v
 PostgreSQL
```

---

# ¿Por qué es importante?

Porque evita que la arquitectura se diseñe aislada del negocio.

---

# 5. constraints.md

Uno de los documentos más subestimados.

---

# Objetivo

Responder:

> ¿Qué limitaciones existen?

---

Las restricciones afectan TODAS las decisiones futuras.

---

# Tipos de restricciones

---

## Restricciones tecnológicas

Ejemplo:

```markdown
Backend:
.NET 9

Frontend:
React

Base de datos:
PostgreSQL
```

---

## Restricciones organizacionales

Ejemplo:

```markdown
El equipo tiene experiencia únicamente
en tecnologías Microsoft.
```

---

## Restricciones presupuestarias

Ejemplo:

```markdown
Infraestructura máxima:
100 USD mensuales
```

---

## Restricciones legales

Ejemplo:

```markdown
Los datos deben almacenarse
dentro del país.
```

---

## Restricciones de negocio

Ejemplo:

```markdown
El sistema debe soportar
multi-tenancy desde el inicio.
```

---

## Restricciones operativas

Ejemplo:

```markdown
Despliegue mediante Docker.

No se permitirá Kubernetes
en la primera versión.
```

---

# Ejemplo completo

```markdown
# Restricciones

## Tecnológicas

- .NET 9
- PostgreSQL
- React

## Negocio

- Multi-tenant obligatorio

## Presupuesto

- máximo 100 USD/mes

## Operación

- despliegue Docker
```

---

# Resultado final esperado

Al terminar la carpeta `00-overview`, cualquier persona debería poder responder:

### ¿Qué es el sistema?

→ vision.md

### ¿Qué hace?

→ project-scope.md

### ¿Qué no hace?

→ project-scope.md

### ¿Quién está involucrado?

→ stakeholders.md

### ¿Con quién interactúa?

→ business-context.md

### ¿Qué limitaciones existen?

→ constraints.md

---

# Ejemplo resumido de una carpeta real

```text
00-overview/
│
├── vision.md
│   ├── Problema
│   ├── Visión
│   ├── Objetivos
│   └── Métricas
│
├── project-scope.md
│   ├── Incluido
│   ├── Excluido
│   └── Roadmap
│
├── stakeholders.md
│   ├── Actores
│   ├── Intereses
│   └── Necesidades
│
├── business-context.md
│   ├── Actores
│   ├── Sistemas externos
│   └── Context Diagram
│
└── constraints.md
    ├── Tecnológicas
    ├── Negocio
    ├── Presupuesto
    └── Legales
```

Se recomienda que antes de pasar a `01-requirements`, se desarrollen estos cinco documentos en el proyecto. Debido a que ahí suelen aparecer inconsistencias de alcance y restricciones mucho antes de comenzar el diseño detallado de arquitectura.