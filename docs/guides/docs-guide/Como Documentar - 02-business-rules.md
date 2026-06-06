La carpeta `02-business-rules` es una de las más importantes y, paradójicamente, una de las menos documentadas en muchos proyectos.

Muchos equipos terminan mezclando:

* Requisitos funcionales
* Casos de uso
* Reglas de negocio
* Validaciones técnicas

Y eso genera mucha confusión.

---

# ¿Qué es `02-business-rules`?

Esta carpeta responde:

> ¿Cuáles son las reglas del negocio que gobiernan el comportamiento del sistema?

No responde:

> ¿Qué hace el sistema?

Eso ya lo definiste en `01-requirements`.

---

# Diferencia entre requisito y regla de negocio

Mucha gente los confunde.

---

## Requisito funcional

```text
El sistema permitirá registrar citas.
```

Describe una capacidad.

---

## Regla de negocio

```text
Una cita no puede programarse
fuera del horario de atención.
```

Describe una restricción del negocio.

---

Otro ejemplo:

### Requisito

```text
El sistema permitirá emitir facturas.
```

### Regla

```text
Una factura emitida no puede modificarse.
```

---

Observa la diferencia:

* El requisito dice qué hace.
* La regla dice bajo qué condiciones puede hacerlo.

---

# Estructura propuesta

```text
02-business-rules/
├── domain-rules.md
├── workflows.md
└── validation-rules.md
```

---

# Relación entre documentos

```text
Requisitos
      ↓
Reglas del Dominio
      ↓
Workflows
      ↓
Validaciones
```

---

# 1. domain-rules.md

Este es el documento más importante de toda la carpeta.

---

# Objetivo

Documentar reglas propias del negocio.

---

# ¿Qué es una regla de dominio?

Una regla que seguiría existiendo aunque el software desaparezca.

---

## Ejemplo

Imagina una clínica veterinaria sin software.

La regla:

```text
Una mascota debe tener propietario.
```

seguiría existiendo.

Por lo tanto:

✔ Es una regla de dominio.

---

## Otro ejemplo

```text
Las vacunas tienen fecha de vencimiento.
```

También existiría sin software.

✔ Regla de dominio.

---

# Qué documentar

---

## Identificador

```text
BR-001
BR-002
BR-003
```

(BR = Business Rule)

---

## Nombre

```text
BR-001 Propietario Obligatorio
```

---

## Descripción

```text
Toda mascota debe estar asociada
a un propietario.
```

---

## Justificación

¿Por qué existe?

```text
Permite identificar al responsable
de la mascota.
```

---

## Impacto

¿Qué módulos afecta?

```text
Pets
Appointments
Billing
```

---

# Ejemplo completo

```markdown
BR-001 Propietario Obligatorio

Descripción:
Toda mascota debe tener propietario.

Justificación:
Permite establecer responsabilidad
sobre el paciente.

Módulos afectados:
- Pets
- Appointments
```

---

# Cómo organizar reglas

Por dominio.

Ejemplo:

```text
Mascotas
 ├── BR-001
 ├── BR-002
 └── BR-003

Citas
 ├── BR-010
 ├── BR-011
 └── BR-012

Facturación
 ├── BR-020
 ├── BR-021
```

---

# Ejemplos reales

---

## Módulo Mascotas

```text
BR-001
Toda mascota debe tener propietario.
```

```text
BR-002
El microchip debe ser único.
```

```text
BR-003
La fecha de nacimiento no puede
ser futura.
```

---

## Módulo Citas

```text
BR-010
Una cita no puede solaparse
con otra del mismo veterinario.
```

```text
BR-011
Una cita cancelada no puede
ser atendida.
```

---

## Módulo Facturación

```text
BR-020
Una factura emitida no puede editarse.
```

```text
BR-021
Una factura anulada conserva historial.
```

---

# ¿Por qué es tan importante?

Porque estas reglas terminan convirtiéndose en:

```text
Entidades
Value Objects
Domain Services
Policies
Specifications
```

si más adelante usas DDD.

---

# 2. workflows.md

Aquí documentas procesos de negocio.

---

# Objetivo

Responder:

> ¿Cómo se ejecuta una operación del negocio de principio a fin?

---

# Diferencia con Casos de Uso

Mucha gente los confunde.

---

## Caso de Uso

Describe interacción usuario-sistema.

Ejemplo:

```text
Registrar Mascota
```

---

## Workflow

Describe proceso completo.

Ejemplo:

```text
Registrar Mascota
↓
Programar Consulta
↓
Atender Consulta
↓
Generar Receta
↓
Facturar
```

---

# Qué documentar

---

## Nombre del proceso

Ejemplo:

```text
Proceso de Atención Veterinaria
```

---

## Objetivo

```text
Atender una mascota desde
su ingreso hasta la facturación.
```

---

## Participantes

```text
Recepcionista
Veterinario
Sistema
Cliente
```

---

## Flujo

```text
1. Registrar cliente
2. Registrar mascota
3. Crear cita
4. Atender consulta
5. Registrar diagnóstico
6. Facturar
```

---

# Ejemplo visual

```text
Cliente
   ↓
Recepción
   ↓
Registro
   ↓
Consulta
   ↓
Diagnóstico
   ↓
Facturación
```

---

# Diagramas útiles

Aquí suelen aparecer:

* BPMN
* Activity Diagrams
* Flowcharts

---

# ¿Por qué importa?

Porque muchas veces los requisitos están correctos, pero el proceso completo tiene inconsistencias.

---

# Ejemplo

El sistema permite:

```text
Crear factura
```

Pero el workflow indica:

```text
La factura solo se crea
después de una consulta.
```

Esa dependencia se detecta aquí.

---

# 3. validation-rules.md

Aquí documentas reglas de validación.

---

# Objetivo

Definir restricciones verificables.

---

# Diferencia con Domain Rules

Esta es una duda muy común.

---

## Regla de dominio

```text
Una mascota debe tener propietario.
```

---

## Regla de validación

```text
El campo propietario es obligatorio.
```

---

Observa la diferencia.

La segunda es una implementación de la primera.

---

# Ejemplos

---

## Datos personales

```text
VR-001

El correo debe tener formato válido.
```

---

## Mascotas

```text
VR-010

Nombre obligatorio.
```

```text
VR-011

Peso mayor que cero.
```

```text
VR-012

Fecha de nacimiento válida.
```

---

## Facturación

```text
VR-020

Monto mayor que cero.
```

```text
VR-021

RUC válido.
```

---

# Estructura recomendada

---

## Identificador

```text
VR-001
```

---

## Campo

```text
Correo Electrónico
```

---

## Regla

```text
Debe cumplir RFC 5322.
```

---

## Mensaje

```text
Correo electrónico inválido.
```

---

# Ejemplo completo

```markdown
VR-001

Campo:
Correo

Regla:
Formato válido

Mensaje:
Correo electrónico inválido.
```

---

# ¿Qué NO poner aquí?

No pongas validaciones técnicas irrelevantes.

Por ejemplo:

```text
El controlador debe lanzar excepción.
```

Eso es implementación.

---

No pongas:

```text
Se usará FluentValidation.
```

Eso es arquitectura.

---

# Relación entre Domain Rules y Validation Rules

Esta relación es muy importante.

---

## Domain Rule

```text
Toda mascota debe tener propietario.
```

---

## Validation Rule

```text
El campo propietario es obligatorio.
```

---

## Código

```csharp
RuleFor(x => x.OwnerId)
    .NotEmpty();
```

---

Observa cómo una regla de negocio termina generando validaciones.

---

# Ejemplo completo de carpeta

```text
02-business-rules/
│
├── domain-rules.md
│
│   Mascotas
│   ├── BR-001 Propietario obligatorio
│   ├── BR-002 Microchip único
│
│   Citas
│   ├── BR-010 Sin solapamiento
│   └── BR-011 Canceladas no atendibles
│
├── workflows.md
│
│   ├── Atención Veterinaria
│   ├── Facturación
│   └── Gestión de Inventario
│
└── validation-rules.md
    ├── VR-001 Correo válido
    ├── VR-002 Nombre obligatorio
    ├── VR-003 Peso mayor a cero
    └── VR-004 Fecha válida
```

---

# Algo que recomiendo agregar

En proyectos medianos o grandes, suelo separar aún más:

```text
02-business-rules/
│
├── domain-rules/
│   ├── pets.md
│   ├── appointments.md
│   ├── billing.md
│   └── inventory.md
│
├── workflows/
│   ├── appointment-process.md
│   ├── billing-process.md
│   └── inventory-process.md
│
└── validation-rules/
    ├── pets.md
    ├── billing.md
    └── appointments.md
```

Porque cuando el sistema crece, un único archivo de cientos de reglas se vuelve difícil de mantener.

---

Antes de pasar a `03-architecture`, hay una observación importante:

**Las reglas de negocio son uno de los mejores indicadores para descubrir módulos, bounded contexts y agregados de dominio.**

Por ejemplo:

```text
Reglas sobre mascotas
    ↓
Módulo Pets

Reglas sobre citas
    ↓
Módulo Appointments

Reglas sobre facturación
    ↓
Módulo Billing
```

Por eso una buena documentación de `02-business-rules` suele simplificar enormemente el trabajo posterior de arquitectura y diseño del dominio.