# 🔴⚪ Pokédex — DCAC Challenge

Una Pokédex interactiva construida con React 18 y el stack tecnológico de DCAC.

## ✨ Funcionalidades

- **Listado con Infinite Scroll** — Carga progresiva con Intersection Observer
- **Búsqueda en tiempo real** — Debounce de 300ms con RTK Query
- **Filtros combinables** — Por tipo y generación, con estado persistido en URL
- **Vista de Detalle** — Sprites, stats animados, habilidades, datos físicos
- **Mi Equipo** — Hasta 6 pokémon favoritos con persistencia offline
- **Comparación** — Formulario con Formik + Yup + Radar Chart (Recharts)
- **Estado de conexión** — Indicador online/offline en el header
- **Cache persistente** — Datos disponibles offline tras el primer uso

---

## 🚀 Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
# Abre http://localhost:5173

# 3. Build de producción
npm run build
npm run preview
```

**Requisitos**: Node.js 18+

---

## 🏗️ Stack tecnológico

| Librería | Versión | Uso |
|----------|---------|-----|
| React | 18.x | UI |
| Vite | 5.x | Bundler |
| Redux Toolkit | 2.x | State management |
| RTK Query | (incluido en RTK) | Data fetching + cache |
| redux-persist | 6.x | Persistencia offline |
| React Router | v6 | Navegación + URL params |
| Styled Components | 6.x | CSS-in-JS theming |
| Formik | 2.x | Formulario comparación |
| Yup | 1.x | Validación del formulario |
| Recharts | 2.x | Radar chart de stats |
| react-hot-toast | 2.x | Notificaciones toast |
| react-intersection-observer | 9.x | Infinite scroll |

**API**: [PokéAPI](https://pokeapi.co) — REST, sin autenticación

---

## 🧠 Decisiones técnicas

### Cache con RTK Query + redux-persist

El punto más delicado del proyecto fue la integración de RTK Query con redux-persist.

**Estrategia adoptada:**
- RTK Query maneja el cache en memoria con `keepUnusedDataFor: 3600` (1 hora)
- `redux-persist` persiste el reducer de la API en `localStorage` usando `whitelist: ['queries']`
- El `teamSlice` (favoritos) tiene su propia configuración de persistencia independiente
- El `connectionSlice` **no** se persiste (siempre refleja el estado real del navegador)

**Gotcha resuelto — serializability:**
RTK Query almacena metadata interna no-serializable. Se configuró el middleware con:
```js
serializableCheck: {
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  ignoredPaths: ['pokemonApi.queries', 'pokemonApi.mutations', ...]
}
```

**Gotcha resuelto — rehydratación:**
`PersistGate` en `main.jsx` bloquea el primer render hasta que el store esté completamente rehidratado desde `localStorage`. Esto evita el "flash" de estado vacío.

### Búsqueda por nombre exacto

Se optó por búsqueda exacta (`GET /pokemon/{name}`) en lugar de cargar todos los nombres:
- **Pros**: menos datos iniciales, más simple
- **Contras**: requiere nombre completo en inglés (UX simplificada)
- El resultado se cachea automáticamente por RTK Query — la misma búsqueda no genera un segundo request

### Infinite Scroll

- Implementado con `Intersection Observer` via `react-intersection-observer`
- Los resultados se acumulan en estado local del componente (`allPokemon`) para no inflar el store global
- Al cambiar filtros o búsqueda, el offset y la lista se resetean

### Filtros combinables (tipo + generación)

PokéAPI no soporta filtros combinados. La intersección se hace en el cliente:
1. `GET /type/{name}` → nombres del tipo
2. `GET /generation/{id}` → nombres de la generación  
3. Intersección de ambos sets en JavaScript

### Modo offline

Gracias a la combinación de:
- `keepUnusedDataFor: 3600` → mantiene datos en memoria durante la sesión
- `redux-persist` → serializa el cache a `localStorage` entre recargas
- Indicador en el header que muestra el estado de la conexión

Los datos cacheados sobreviven al refresh del navegador.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── store.js          # configureStore + persistStore
│   └── hooks.js          # useAppDispatch, useAppSelector
├── services/
│   └── pokemonApi.js     # createApi con todos los endpoints
├── features/
│   ├── team/
│   │   └── teamSlice.js  # Favoritos (persistido)
│   └── connection/
│       └── connectionSlice.js
├── pages/
│   ├── Home/             # Lista + filtros + búsqueda + infinite scroll
│   ├── Detail/           # Vista completa del pokémon
│   ├── Team/             # Mi Equipo (favoritos)
│   ├── Compare/          # Formulario + RadarChart
│   └── NotFound/         # 404
├── components/
│   ├── Layout/           # Header + Layout outlet
│   ├── PokemonCard/      # Card + Skeleton
│   ├── TypeBadge/        # Badge coloreado por tipo
│   ├── StatBar/          # Barra de progreso animada
│   ├── SearchBar/        # Input con debounce
│   ├── FilterPanel/      # Chips de tipo/generación
│   └── EmptyState/       # Estado vacío con animación
├── hooks/
│   ├── useDebounce.js
│   └── useOnlineStatus.js
├── styles/
│   ├── theme.js          # Design tokens
│   └── GlobalStyles.js   # Reset + animaciones
└── utils/
    └── pokemonUtils.js   # Helpers y formatters
```


---

## 🌐 Demo & Deploy

[Este proyecto está configurado para un fácil despliegue en [Vercel](https://vercel.com).](https://pokedex-six-silk.vercel.app/)

### Desplegar en Vercel

1. Hacé un fork o cloná este repositorio en tu cuenta de GitHub.
2. Ingresá a tu cuenta de Vercel y creá un nuevo proyecto.
3. Importá el repositorio desde GitHub.
4. Vercel detectará automáticamente que es un proyecto **Vite**. La configuración por defecto (`npm run build` y directorio de salida `dist`) funcionará perfectamente.
5. Haz clic en **Deploy**.

*(El archivo `vercel.json` incluido en el proyecto se asegura de que las rutas de React Router funcionen correctamente recargando la página).*

---

