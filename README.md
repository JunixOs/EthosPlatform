# **EthosPlatform**

Plataforma web comunitaria que permite a sus usuarios compartir experiencias personales estructuradas relacionadas con reflexiones éticas y morales.

**ÍNDICE**
- [**EthosPlatform**](#ethosplatform)
  - [Instalación](#instalación)
  - [Uso](#uso)
  - [Tecnologías y Herramientas](#tecnologías-y-herramientas)
  - [Autores y Créditos](#autores-y-créditos)
  - [Licencia](#licencia)

## Instalación

1. En tu máquina, ubícate en la carpeta donde se descargara el proyecto.
2. Luego, descarga el proyecto desde `GitHub` usando `git`.

```bash
git clone https://github.com/JunixOs/EthosPlatform.git
```

1. Una vez descargado muévete a la carpeta del proyecto

```bash
cd EthosPlatform/
``` 

4. Una vez dentro instala las dependencias con PNPM:

```bash
pnpm install
```

## Uso

1. Para ejecutar el proyecto, primero debes configurar un `.env` dentro de la carpeta `/apps/backend/`:

```bash
cd ./apps/backend/
touch .env
```

2. Dentro del archivo `.env` del Backend colocar lo siguiente:

```text
PORT={puerto-frontend}
FRONTEND_URL={url-frontend}

DB_HOST={ip-db}
DB_PORT={puerto-db}
DB_USER={nombre-usuario-db}
DB_PASSWORD={contraseña-usuario-db}
DB_NAME={nombre-db}
NODE_ENV=development
```

3. Posteriormente, nos dirigimos a `/apps/frontend/` y creamos el `.env`:

```bash
cd /apps/frontend/
touch .env
```

4. Dentro de este `.env` colocamos lo siguiente:

```
VITE_API_URL={url-api-rest}
```

5. Luego te diriges a la raíz del proyecto e inicias el proyecto:

```bash
cd ..
cd ..

pnpm -r dev
```

4. Para acceder dirígete a tu navegador, si deseas probar la API Rest debes usar `Postman`.

## Tecnologías y Herramientas

El proyecto se basa en el ecosistema de `Node.js`:

- **Backend**:
    - Framework Node.js
    - Typescript
    - Liberia TypeORM
    - Librería Express
- **Frontend**:
    - Librería React
    - Vite
    - Framework TailwindCSS

## Autores y Créditos 

Javier Orneta, Ángel Paolo
Ordoñez Silva, Yonel Junior

## Licencia

Este proyecto está bajo la `MIT License`.