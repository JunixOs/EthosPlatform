# **Especificación de Caso de Uso**

En la fase de `especificación de requisitos` del proceso de `ingeniería de requisitos`, una técnica usada es la `especificación de casos de uso`.

## 1. Estructura Estándar

Un documento o plantilla típico de caso de uso incluye los siguientes elementos esenciales:

- **Identificador y Nombre**: Un nombre claro que describa la acción (Ej.: Registrar Usuario).
- **Actor(es)**: Quién interactúa con el sistema (Usuario, Administrador, Sistema de pagos, etc.).
- **Descripción breve**: Resumen del propósito del caso de uso.
- **Precondiciones**: Estado o reglas que deben cumplirse en el sistema antes de iniciar el proceso.
- **Postcondiciones**: El estado en el que queda el sistema una vez que el caso de uso finaliza con éxito.
- **Flujo principal (o básico)**: La secuencia normal y esperada de pasos que realiza el actor para lograr su objetivo sin errores.
- **Flujos alternativos**: Caminos o variaciones que toma el proceso debido a condiciones específicas (Ej.: El usuario ingresa una contraseña incorrecta).
- **Flujos de excepción**: Pasos ejecutados cuando ocurre un error que impide finalizar el proceso

## 2. Nivel de Detalle

- **Breve**: Un resumen de una o dos líneas (ideal para etapas tempranas).
- **Informal**: Un párrafo sencillo que describe la interacción.
- **Formal / Detallado**: Descripción exhaustiva paso a paso de todos los flujos y escenarios posibles, es fundamental para programación y pruebas.