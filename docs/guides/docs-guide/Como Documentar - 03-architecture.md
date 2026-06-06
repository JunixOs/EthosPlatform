La carpeta `03-architecture/` es probablemente la parte más importante de todo el SDD porque aquí documentas:

* cómo está estructurado el sistema,
* por qué fue diseñado así,
* cómo interactúan sus partes,
* cómo evoluciona,
* y cómo debe entenderlo cualquier desarrollador nuevo.

La idea NO es llenar documentos enormes, sino capturar:

* decisiones importantes,
* límites,
* responsabilidades,
* dependencias,
* y comportamiento arquitectónico.

Usaremos un ejemplo sencillo y consistente para toda la explicación:

> **Sistema SaaS Veterinario Multi-Tenant**
>
> Funciones:
>
> * gestión de clínicas
> * gestión de mascotas
> * citas
> * inventario
> * facturación
> * autenticación

Stack imaginario:

* Frontend React
* Backend .NET
* PostgreSQL
* Redis
* RabbitMQ
* Arquitectura: Modular Monolith + Clean Architecture

---

# Objetivo real de `03-architecture/`

Esta carpeta responde preguntas como:

| Pregunta                            | Documento             |
| ----------------------------------- | --------------------- |
| ¿Cómo está estructurado el sistema? | architecture-overview |
| ¿Qué estilo arquitectónico usamos?  | architectural-style   |
| ¿Qué módulos existen?               | modules               |
| ¿Cómo se divide el dominio?         | bounded-contexts      |
| ¿Cómo se comunican las partes?      | integration-patterns  |
| ¿Cómo se ve a distintos niveles?    | c4                    |
| ¿Qué pasa en tiempo de ejecución?   | runtime-views         |

---

# Estructura

```text
03-architecture/
├── architecture-overview.md
├── architectural-style.md
├── modules.md
├── bounded-contexts.md
├── integration-patterns.md
├── c4/
│   ├── level-1-context.md
│   ├── level-2-container.md
│   ├── level-3-component.md
│   └── level-4-code.md
└── runtime-views/
```

---

# 1. architecture-overview.md

Este documento es la “vista ejecutiva” de la arquitectura.

NO debe entrar en demasiados detalles.

Debe permitir que alguien entienda:

* qué es el sistema,
* cómo está organizado,
* cuáles son sus partes principales,
* y cómo se conectan.

---

# Qué documentar aquí

## 1. Propósito del sistema

Ejemplo:

```markdown
El sistema ZooTech es una plataforma SaaS multi-tenant
para gestión veterinaria que permite administrar:
- mascotas
- clientes
- citas
- inventario
- facturación
```

---

## 2. Objetivos arquitectónicos

Aquí documentas los atributos de calidad más importantes.

Ejemplo:

```markdown
Objetivos:
- Alta mantenibilidad
- Escalabilidad horizontal futura
- Separación clara de responsabilidades
- Bajo acoplamiento
- Facilidad de testing
- Soporte multi-tenant
```

---

## 3. Arquitectura general

Explicas:

```markdown
La aplicación utiliza:
- Modular Monolith
- Clean Architecture
- DDD táctico parcial
- Event-Driven interno
```

---

## 4. Componentes principales

Ejemplo:

| Componente        | Responsabilidad              |
| ----------------- | ---------------------------- |
| Frontend          | Interfaz de usuario          |
| API               | Entrada HTTP                 |
| Application Layer | Casos de uso                 |
| Domain Layer      | Reglas de negocio            |
| Infrastructure    | Persistencia e integraciones |
| PostgreSQL        | Persistencia                 |
| Redis             | Caché                        |
| RabbitMQ          | Eventos                      |

---

## 5. Flujo de alto nivel

Ejemplo sencillo:

```text
Usuario → Frontend → API → Application → Domain → Database
```

---

## 6. Restricciones arquitectónicas

MUY importante.

Ejemplo:

```markdown
Restricciones:
- No comunicación directa entre módulos
- Toda lógica de negocio debe vivir en Domain
- Infrastructure nunca debe depender de Presentation
```

---

# Qué NO poner aquí

NO pongas:

* clases detalladas
* tablas detalladas
* lógica específica
* diagramas gigantes

Este documento debe ser entendible en 5-10 minutos.

---

# 2. architectural-style.md

Aquí explicas el “tipo de arquitectura”.

MUCHOS confunden esto con el overview.

No son lo mismo.

---

# Qué documentar aquí

## 1. Estilo arquitectónico elegido

Ejemplo:

```markdown
La aplicación utiliza un Modular Monolith basado en
Clean Architecture.
```

---

# Explica QUÉ significa

No asumas que todos lo saben.

---

## Ejemplo

```markdown
El sistema está compuesto por módulos independientes
desplegados dentro de una misma aplicación.

Cada módulo encapsula:
- lógica
- casos de uso
- persistencia
- eventos
```

---

# 2. ¿Por qué se eligió?

MUY importante.

Ejemplo:

```markdown
Razones:
- menor complejidad operacional
- despliegue simple
- facilidad de desarrollo inicial
- evolución futura a microservicios
```

---

# 3. Ventajas

Ejemplo:

```markdown
Ventajas:
- bajo costo operacional
- facilidad de debugging
- transacciones simples
- desarrollo rápido
```

---

# 4. Desventajas

Ejemplo:

```markdown
Desventajas:
- escalado independiente limitado
- mayor riesgo de acoplamiento
- deploy único
```

---

# 5. Reglas arquitectónicas

Aquí defines reglas.

Ejemplo:

```markdown
Reglas:
- módulos no comparten DbContext
- comunicación mediante interfaces/eventos
- Domain no depende de Infrastructure
```

---

# 6. Patrones usados

Ejemplo:

| Patrón               | Uso                          |
| -------------------- | ---------------------------- |
| Repository           | acceso a datos               |
| CQRS                 | separación lectura/escritura |
| Mediator             | desacoplar handlers          |
| Factory              | creación de objetos          |
| Dependency Injection | inversión de control         |

---

# 3. modules.md

Este documento es CRÍTICO.

Aquí defines los módulos del sistema.

---

# ¿Qué es un módulo?

Un módulo es una unidad funcional independiente.

Ejemplo:

```text
- Identity
- Pets
- Appointments
- Billing
- Inventory
```

---

# Qué documentar

---

# 1. Lista de módulos

Ejemplo:

| Módulo       | Responsabilidad     |
| ------------ | ------------------- |
| Identity     | autenticación       |
| Pets         | gestión de mascotas |
| Billing      | facturación         |
| Inventory    | stock               |
| Appointments | citas               |

---

# 2. Responsabilidades

Ejemplo:

```markdown
Appointments:
- crear citas
- cancelar citas
- reasignar veterinarios
- verificar disponibilidad
```

---

# 3. Dependencias

MUY importante.

Ejemplo:

```text
Appointments
 ├── Identity
 └── Pets
```

---

# 4. Reglas de comunicación

Ejemplo:

```markdown
Inventory no puede acceder directamente
a Billing Database.

La comunicación debe hacerse:
- vía eventos
- vía interfaces
```

---

# 5. Estructura interna del módulo

Ejemplo:

```text
Modules/
 └── Appointments/
      ├── Domain/
      ├── Application/
      ├── Infrastructure/
      └── Presentation/
```

---

# 6. Eventos del módulo

Ejemplo:

```markdown
Eventos publicados:
- AppointmentCreated
- AppointmentCancelled

Eventos consumidos:
- PetDeleted
- CustomerBlocked
```

---

# 4. bounded-contexts.md

Esto viene de DDD.

Incluso si NO usas DDD completo, sigue siendo MUY útil.

---

# Objetivo

Definir límites del dominio.

---

# Ejemplo REAL

Muchos sistemas fallan porque:

* “Cliente”
  significa algo diferente en distintos módulos.

---

# Ejemplo

En Billing:

```text
Customer = entidad fiscal
```

En Appointments:

```text
Customer = dueño de mascota
```

---

# Bounded Context evita esto.

---

# Qué documentar

---

# 1. Contextos

Ejemplo:

| Contexto  | Descripción         |
| --------- | ------------------- |
| Identity  | usuarios y permisos |
| Clinical  | historial médico    |
| Billing   | pagos               |
| Inventory | productos           |

---

# 2. Lenguaje ubicuo

Ejemplo:

```markdown
En Billing:
Invoice = documento fiscal

En Appointments:
Appointment = reserva veterinaria
```

---

# 3. Relaciones entre contextos

Ejemplo:

| Relación           | Tipo              |
| ------------------ | ----------------- |
| Billing → Identity | Shared Kernel     |
| Clinical → Pets    | Customer/Supplier |

---

# 4. Límites

Ejemplo:

```markdown
Clinical no puede modificar directamente
datos de Billing.
```

---

# 5. Traducciones

Ejemplo:

```markdown
CustomerDTO → BillingCustomer
```

---

# 5. integration-patterns.md

Aquí defines cómo se comunican componentes y módulos.

---

# Qué documentar

---

# 1. Comunicación síncrona

Ejemplo:

```text
Frontend → REST API
```

---

# 2. Comunicación asíncrona

Ejemplo:

```text
Billing → RabbitMQ → Notifications
```

---

# 3. Eventos

Ejemplo:

| Evento             | Productor    | Consumidor    |
| ------------------ | ------------ | ------------- |
| AppointmentCreated | Appointments | Notifications |

---

# 4. APIs externas

Ejemplo:

| Servicio | Uso     |
| -------- | ------- |
| Stripe   | pagos   |
| SendGrid | correos |

---

# 5. Estrategias de resiliencia

Ejemplo:

```markdown
- Retry
- Circuit Breaker
- Timeout
- Idempotencia
```

---

# 6. Contratos

Ejemplo:

```json
{
  "event": "AppointmentCreated",
  "appointmentId": 123
}
```

---

# 6. c4/

Aquí documentas la arquitectura visualmente.

El modelo C4 es probablemente la mejor forma moderna de documentar arquitectura.

---

# level-1-context.md

Vista más alta.

---

# Qué muestra

* usuarios
* sistemas externos
* sistema principal

---

# Ejemplo

```text
[Veterinario]
      |
      v
[ZooTech System]
      |
      +----> [Stripe]
      |
      +----> [Email Service]
```

---

# Qué documentar

* actores
* sistemas externos
* responsabilidades generales

---

# level-2-container.md

Aquí bajas un nivel.

---

# Qué muestra

Contenedores:

* frontend
* backend
* db
* cache
* broker

---

# Ejemplo

```text
[React Frontend]
        |
        v
[ASP.NET API]
   |        |
   v        v
[Postgres] [Redis]
```

---

# Qué documentar

| Container | Tecnología | Responsabilidad |
| --------- | ---------- | --------------- |
| Frontend  | React      | UI              |
| API       | .NET       | lógica          |
| Redis     | Redis      | cache           |

---

# level-3-component.md

Aquí muestras componentes internos.

---

# Ejemplo

Dentro de Appointments:

```text
Appointments API
   |
   +-- AppointmentService
   +-- AppointmentRepository
   +-- AppointmentValidator
```

---

# Qué documentar

* servicios
* handlers
* repositories
* adapters

---

# level-4-code.md

MUCHOS equipos NO lo usan.

Porque envejece rápido.

---

# Solo úsalo para:

* algoritmos complejos
* subsistemas críticos
* flujos importantes

---

# Ejemplo

```text
AppointmentService
 ├── CreateAppointment()
 ├── ValidateAvailability()
 └── PublishEvent()
```

---

# 7. runtime-views/

Aquí documentas comportamiento dinámico.

NO estructura estática.

---

# Qué va aquí

* secuencias
* concurrencia
* eventos
* workflows
* lifecycle

---

# Ejemplo de carpetas

```text
runtime-views/
├── appointment-booking.md
├── payment-processing.md
├── login-flow.md
└── tenant-resolution.md
```

---

# Ejemplo práctico

## login-flow.md

```text
1. Usuario envía credenciales
2. API valida usuario
3. JWT generado
4. Redis almacena sesión
5. Token retornado
```

---

# Aquí normalmente usas

* Sequence Diagrams
* Activity Diagrams
* State Diagrams

---

# RECOMENDACIÓN MUY IMPORTANTE

La documentación arquitectónica NO debe describir:

* cada clase,
* cada método,
* cada tabla.

Debe describir:

* decisiones,
* límites,
* responsabilidades,
* dependencias,
* comportamiento,
* comunicación.

---

# Lo que realmente debes mantener actualizado

PRIORIDAD ALTA:

✅ architecture-overview
✅ modules
✅ ADRs
✅ C4 level 1 y 2
✅ integration-patterns
✅ runtime críticos

PRIORIDAD MEDIA:

⚠️ bounded contexts
⚠️ component diagrams

PRIORIDAD BAJA:

❌ class diagrams gigantes
❌ level 4 detallado
❌ UML excesivo

---

# Flujo recomendado real

Cuando agregues una funcionalidad:

```text
1. Actualizar modules
2. Actualizar C4 si cambia arquitectura
3. Crear ADR si hay decisión importante
4. Actualizar runtime si cambia flujo crítico
```
