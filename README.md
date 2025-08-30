# Rick & Morty Frontend

Este proyecto es una aplicación web construida con React, Vite y TypeScript que consume una API GraphQL para mostrar y filtrar personajes de Rick & Morty. Incluye funcionalidades de favoritos, comentarios y filtrado avanzado.

## Características

- Listado de personajes con paginación y ordenamiento.
- Filtros por nombre, estado, especie y género.
- Modal de detalles con comentarios por personaje.
- Gestión de favoritos almacenados en localStorage.
- Navegación con react-router-dom (modal sincronizado con la URL).
- Estilos modernos con Tailwind CSS.

## Instalación

1. Clona el repositorio:
  ```bash
  git clone <url-del-repo>
  cd rick-morty-frontend
  ```
2. Instala las dependencias:
  ```bash
  npm install
  ```
3. Configura las variables de entorno si es necesario (por ejemplo, endpoints GraphQL en `.env`).

4. Inicia la aplicación:
  ```bash
  npm run dev
  ```

## Scripts útiles
- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Genera la build de producción.
- `npm run preview` — Previsualiza la build de producción.

## Dependencias principales
- React
- Vite
- TypeScript
- Tailwind CSS
- react-router-dom
- Apollo Client (opcional, si usas el cliente Apollo)

## Estructura del proyecto

```
├── public/
├── src/
│   ├── apolloClient.ts
│   ├── components/
│   ├── context/
│   ├── graphql/
│   ├── hooks/
│   ├── interfaces/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
```

## Notas
- Asegúrate de tener corriendo el backend GraphQL en `http://localhost:3001/graphql` o ajusta la URL según tu entorno.
- Los favoritos y comentarios se almacenan en el navegador (localStorage).
- El modal de detalles se sincroniza con la URL para permitir enlaces directos a personajes.

## Licencia
MIT

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
