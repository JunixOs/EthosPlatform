# **Integration Patterns**

## 1. Comunicación Síncrona

- `Frontend` hacia `API REST`

## 2. Comunicación Asíncrona

- Consulta de datos desde la capa de `Datos` hacia `Base de Datos` (uso de `await`).

## 3. Estrategias de Resiliencia

- **Timeout**

## 4. Contratos

### 4.1. API REST

**Requests**: Mapear cada `request` con muchos campos a clases para evitar muchos parámetros en los controladores.

```json
{
    "id": "002-adbsd-sasdsd"
}
```

**Reponse**:

```json
{
    "success": "True",
    "errorMessage": "",
    "errorCode": "",
    "httpErrorCode": "",
    "data": [
        {
            "id": "002-adbsd-sasdsd",
            "nombre": "Antonio",
            ...
        },
        {
            ...
        }
    ]
}
```

**Exceptions**:

```json
{
    "success": "False",
    "errorMessage": "No se encontro al usuario especificado.",
    "errorCode": "NOT_FOUND_USER",
    "httpErrorCode": "404",
    "data": []
}
```