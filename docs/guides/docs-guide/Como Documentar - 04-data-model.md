Perfecto.

La carpeta `04-data-model` suele ser donde el diseño empieza a volverse más concreto. Si `03-architecture` responde:

> ¿Cómo está organizado el sistema?

Entonces `04-data-model` responde:

> ¿Cómo está organizada la información?

Aquí documentamos:

* entidades
* relaciones
* estructuras de almacenamiento
* reglas de persistencia
* estrategias de modelado

Sin entrar todavía en código específico del ORM.

---

# Objetivo de `04-data-model`

Esta carpeta debe permitir responder preguntas como:

* ¿Qué datos almacena el sistema?
* ¿Cómo se relacionan?
* ¿Qué significa cada dato?
* ¿Qué restricciones existen?
* ¿Cómo se maneja el multi-tenancy?
* ¿Cómo evolucionará el esquema?

---

# Estructura propuesta

```text
04-data-model/
├── erd/
├── relational-model.md
├── normalization.md
├── data-dictionary.md
├── migrations-strategy.md
└── multi-tenancy.md
```

---

# Relación entre documentos

```text
Dominio
    ↓
ERD
    ↓
Modelo Relacional
    ↓
Diccionario de Datos
    ↓
Estrategia de Persistencia
```

---

# 1. erd/

( Entity Relationship Diagram )

Probablemente el documento más conocido.

---

# Objetivo

Mostrar visualmente:

* entidades
* relaciones
* cardinalidades

---

# Ejemplo sencillo

Sistema veterinario:

```text
Owner
 └──< Pet

Pet
 └──< Appointment

Appointment
 └──1 Veterinarian
```

---

# ¿Qué documentar?

No solo el diagrama.

También una explicación.

---

## Ejemplo

### Entidad Owner

```markdown
Representa al propietario de una mascota.
```

---

### Entidad Pet

```markdown
Representa un paciente veterinario.
```

---

### Relación

```markdown
Un propietario puede tener muchas mascotas.

Una mascota pertenece a un único propietario.
```

---

# Cardinalidades

Siempre documentarlas.

---

## Uno a uno

```text
User 1 ---- 1 UserProfile
```

---

## Uno a muchos

```text
Owner 1 ---- N Pet
```

---

## Muchos a muchos

```text
User N ---- N Role
```

---

# Organización recomendada

```text
erd/
├── conceptual-erd.md
├── logical-erd.md
└── physical-erd.md
```

---

# Conceptual

Solo negocio.

```text
Cliente
Mascota
Cita
Factura
```

---

# Lógico

Con atributos principales.

```text
Pet
- Id
- Name
- BirthDate
```

---

# Físico

Con detalles reales.

```text
pets
- id UUID
- name VARCHAR(200)
```

---

# 2. relational-model.md

Aquí bajas del mundo conceptual al mundo SQL.

---

# Objetivo

Definir cómo se representan las entidades en la base de datos.

---

# Ejemplo

---

## Entidad

```text
Pet
```

---

## Tabla

```sql
Pets
```

---

## Modelo

```text
Pets
-----------------
Id
OwnerId
Name
BirthDate
Species
```

---

# Qué documentar

---

## Tabla

```markdown
Pets
```

---

## Propósito

```markdown
Almacena información de mascotas.
```

---

## Clave primaria

```markdown
Id
```

---

## Claves foráneas

```markdown
OwnerId → Owners.Id
```

---

## Índices

```markdown
IX_Pets_OwnerId
```

---

# Ejemplo completo

```markdown
Tabla: Pets

Propósito:
Almacenar pacientes veterinarios.

PK:
Id

FK:
OwnerId

Índices:
IX_Pets_OwnerId
```

---

# ¿Por qué existe este documento?

Porque muchas decisiones no se ven claramente en un ERD.

Por ejemplo:

```text
índices
particiones
constraints
```

---

# 3. normalization.md

Pocas personas documentan esto.

Y debería hacerse.

---

# Objetivo

Explicar cómo se evita duplicación de datos.

---

# Ejemplo malo

```text
Appointments

PetName
PetSpecies
PetOwnerName
PetOwnerPhone
```

Duplicación enorme.

---

# Ejemplo correcto

```text
Pets
Owners
Appointments
```

Relacionadas mediante claves.

---

# Qué documentar

---

## Nivel de normalización

Ejemplo:

```markdown
El esquema cumple hasta 3NF.
```

---

## Excepciones

MUY importante.

---

### Ejemplo

```markdown
La tabla MonthlyReports
está desnormalizada para
mejorar rendimiento.
```

---

# Beneficios

Documentar por qué ciertas tablas se desnormalizan.

---

# Ejemplo

```markdown
Razón:
Reducir tiempo de consulta
de reportes masivos.
```

---

# 4. data-dictionary.md

Uno de los documentos más valiosos.

---

# Objetivo

Explicar el significado de cada dato.

---

# Problema real

Dos desarrolladores ven:

```text
Status
```

---

Uno interpreta:

```text
Activo / Inactivo
```

---

Otro:

```text
Pendiente / Aprobado
```

---

Por eso existe el diccionario.

---

# Qué documentar

Para cada campo:

---

## Nombre

```text
Status
```

---

## Tipo

```text
varchar(50)
```

---

## Significado

```text
Estado operativo de la mascota.
```

---

## Valores permitidos

```text
Active
Inactive
Deceased
```

---

# Ejemplo

| Campo   | Tipo         | Significado       |
| ------- | ------------ | ----------------- |
| Name    | varchar(200) | Nombre de mascota |
| Species | varchar(50)  | Especie           |
| Status  | varchar(20)  | Estado clínico    |

---

# Ejemplo detallado

```markdown
Campo:
Status

Entidad:
Pet

Descripción:
Estado operativo de la mascota.

Valores:
- Active
- Inactive
- Deceased
```

---

# En proyectos grandes

Separar por entidad.

```text
data-dictionary/
├── pets.md
├── owners.md
├── appointments.md
└── billing.md
```

---

# 5. migrations-strategy.md

MUY importante.

Muchas arquitecturas fallan aquí.

---

# Objetivo

Documentar cómo evoluciona el esquema.

---

# Preguntas que responde

* ¿Quién crea migraciones?
* ¿Cómo se aplican?
* ¿Cómo se despliegan?
* ¿Cómo se revierten?

---

# Ejemplo

```markdown
Las migraciones se generan mediante EF Core.

Todas las migraciones son revisadas
en Pull Request.

No se permiten cambios manuales
en producción.
```

---

# Estrategia de despliegue

Ejemplo:

```text
Desarrollo
    ↓
QA
    ↓
Producción
```

---

# Rollback

Ejemplo:

```markdown
Toda migración debe incluir
procedimiento de reversión.
```

---

# Datos históricos

Ejemplo:

```markdown
No se eliminarán columnas
sin período de deprecación.
```

---

# Muy importante

Documentar reglas como:

```markdown
Nunca modificar migraciones ya aplicadas.
```

---

# 6. multi-tenancy.md

En tu caso particular (ZooTech) esto es especialmente importante.

---

# Objetivo

Documentar la estrategia multi-tenant.

---

# Preguntas que responde

* ¿Cómo se separan los tenants?
* ¿Cómo se resuelve el tenant?
* ¿Cómo se protegen los datos?

---

# Estrategias posibles

---

## Base de datos por tenant

```text
Tenant A → DB A

Tenant B → DB B
```

---

Ventajas:

```text
Aislamiento máximo
```

---

Desventajas:

```text
Administración compleja
```

---

## Schema por tenant

```text
tenant_a.pets
tenant_b.pets
```

---

Ventajas:

```text
Buen aislamiento
```

---

## Shared Database

```text
Pets
------------
TenantId
```

---

Ventajas:

```text
Más simple
```

---

Desventajas:

```text
Mayor riesgo de fuga de datos
```

---

# Qué documentar

---

## Estrategia elegida

Ejemplo:

```markdown
Database per Tenant
```

---

## Resolución

```markdown
Subdominio

clinic-a.zootech.com
clinic-b.zootech.com
```

---

## Aislamiento

```markdown
Cada tenant utiliza
su propia base de datos.
```

---

## Backup

```markdown
Backups independientes
por tenant.
```

---

# Ejemplo completo

```markdown
Estrategia:
Database Per Tenant

Resolución:
Subdominio

Aislamiento:
Base de datos independiente

Beneficios:
Mayor seguridad
```

---

# Estructura ideal para un proyecto real

Para un sistema mediano-grande:

```text
04-data-model/
│
├── erd/
│   ├── conceptual-erd.md
│   ├── logical-erd.md
│   └── physical-erd.md
│
├── relational-model/
│   ├── pets.md
│   ├── appointments.md
│   ├── billing.md
│   └── inventory.md
│
├── data-dictionary/
│   ├── pets.md
│   ├── owners.md
│   ├── appointments.md
│   └── invoices.md
│
├── normalization.md
├── migrations-strategy.md
└── multi-tenancy.md
```

---

# Relación con las carpetas anteriores

```text
00-overview
      ↓
01-requirements
      ↓
02-business-rules
      ↓
03-architecture
      ↓
04-data-model
```

Y más específicamente:

```text
Business Rules
      ↓
Entidades

Entidades
      ↓
ERD

ERD
      ↓
Modelo Relacional

Modelo Relacional
      ↓
Base de Datos
```

Por eso, antes de diseñar tablas, conviene haber definido bien los módulos (`03-architecture/modules.md`) y las reglas de negocio (`02-business-rules/domain-rules.md`), ya que normalmente las entidades y relaciones nacen directamente de esos documentos.
