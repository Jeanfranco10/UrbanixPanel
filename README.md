<p align="center">
  <img src="public/favicon.svg" alt="Urbanix Logo" width="80" />
</p>

<h1 align="center">Urbanix — Panel Administrativo</h1>

<p align="center">
  Sistema de gestión de incidencias urbanas para administradores municipales.<br/>
  Monitoreo, seguimiento y resolución de reportes ciudadanos en tiempo real.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-7.14-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white" alt="Netlify" />
</p>

<p align="center">
  <a href="https://urbanix-panel.netlify.app/">🌐 Ver Demo en Vivo</a>
</p>

<p align="center">
  <strong>Credenciales de prueba:</strong><br/>
  📧 Correo: <code>admin@local.pe</code><br/>
  🔑 Clave: <code>admin123</code>
</p>

---

## 📋 Descripción

**Urbanix** es un panel administrativo web diseñado para la gestión integral de incidencias urbanas. Permite a los administradores municipales visualizar, filtrar, asignar y dar seguimiento a reportes ciudadanos sobre problemas en la ciudad (baches, alumbrado, basura, etc.).

El frontend consume una API REST desarrollada en **Java Spring Boot**, desplegada de forma independiente en Render.

### Características principales

- 📊 **Dashboard interactivo** — Métricas en tiempo real con gráficos (Recharts)
- 🔍 **Gestión de incidencias** — Listado con filtros por estado, prioridad y categoría
- 📁 **Gestión de casos** — Agrupación de incidencias relacionadas
- 🗺️ **Áreas municipales** — Administración de zonas y responsables
- 🏷️ **Categorías** — Clasificación de tipos de incidencia
- 📍 **Ubicaciones** — Gestión de puntos geográficos
- 👥 **Usuarios** — Administración de cuentas del sistema
- 🌗 **Modo claro/oscuro** — Con persistencia en localStorage
- 🔐 **Autenticación** — Login contra API real con sesión persistente
- 📱 **Diseño responsive** — Adaptable a desktop, tablet y móvil

---

## 🛠️ Tech Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| [React](https://react.dev/) | 19.2 | Librería de UI |
| [Vite](https://vite.dev/) | 8.0 | Build tool y dev server |
| [React Router](https://reactrouter.com/) | 7.14 | Navegación SPA |
| [Recharts](https://recharts.org/) | 3.8 | Gráficos del dashboard |
| [Lucide React](https://lucide.dev/) | 1.8 | Íconos SVG |
| Vanilla CSS | — | Estilos con sistema de temas |

---

## 📁 Estructura del Proyecto

```
urbanix-web/
├── public/
│   ├── _redirects            # Configuración de Netlify para SPA
│   ├── favicon.svg           # Ícono del navegador
│   └── icons.svg             # Sprite de íconos SVG
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx    # Barra superior (búsqueda, tema, usuario)
│   │   │   ├── Sidebar.jsx   # Menú lateral de navegación
│   │   │   └── Layout.jsx    # Layout principal (sidebar + contenido)
│   │   ├── ui/
│   │   │   ├── Badge.jsx     # Badges de estado y prioridad
│   │   │   ├── Card.jsx      # Tarjetas reutilizables
│   │   │   └── Modal.jsx     # Modales de confirmación/edición
│   │   └── ProtectedRoute.jsx # Guard de rutas autenticadas
│   │
│   ├── context/
│   │   ├── AuthContext.jsx   # Estado de sesión y login
│   │   └── ThemeContext.jsx  # Modo claro/oscuro
│   │
│   ├── data/
│   │   └── mockData.js       # Datos mock para pruebas locales
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx     # Página principal con métricas
│   │   ├── Incidencias.jsx   # Lista de incidencias con filtros
│   │   ├── DetalleIncidencia.jsx # Vista detallada de incidencia
│   │   ├── Casos.jsx         # Gestión de casos agrupadores
│   │   ├── Areas.jsx         # Áreas municipales
│   │   ├── Categorias.jsx    # Categorías de incidencias
│   │   ├── Ubicaciones.jsx   # Gestión de ubicaciones
│   │   ├── Usuarios.jsx      # Gestión de usuarios
│   │   └── Login.jsx         # Página de autenticación
│   │
│   ├── services/
│   │   ├── api.js            # Capa de servicios (llamadas HTTP)
│   │   └── apiConfig.js      # URL base y helper apiFetch()
│   │
│   ├── utils/
│   │   └── constants.js      # Labels, formateadores de fecha
│   │
│   ├── App.jsx               # Router y providers
│   ├── main.jsx              # Entry point de React
│   └── index.css             # Sistema de diseño y estilos globales
│
├── index.html                # Template HTML principal
├── vite.config.js            # Configuración de Vite
├── eslint.config.js          # Configuración de ESLint
└── package.json              # Dependencias y scripts
```

---

## 🚀 Instalación y Ejecución Local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Jeanfranco10/UrbanixPanel.git
   cd UrbanixPanel
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la URL del API** *(opcional)*

   Por defecto, el frontend apunta al backend en producción. Si necesitas apuntar a un backend local, edita el archivo `src/services/apiConfig.js`:

   ```js
   // Producción (por defecto)
   export const API_BASE_URL = 'https://urbanixbackend.onrender.com/api';

   // Desarrollo local
   // export const API_BASE_URL = 'http://localhost:8080/api';
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

---

## 🗺️ Rutas de la Aplicación

| Ruta | Página | Acceso |
|------|--------|--------|
| `/login` | Login | 🔓 Pública |
| `/` | Dashboard | 🔐 Protegida |
| `/incidencias` | Lista de incidencias | 🔐 Protegida |
| `/incidencias/:id` | Detalle de incidencia | 🔐 Protegida |
| `/casos` | Gestión de casos | 🔐 Protegida |
| `/areas` | Áreas municipales | 🔐 Protegida |
| `/categorias` | Categorías | 🔐 Protegida |
| `/ubicaciones` | Ubicaciones | 🔐 Protegida |
| `/usuarios` | Gestión de usuarios | 🔐 Protegida |

---

## 🔗 Conexión con el Backend

El frontend consume una API REST de **Spring Boot** desplegada en Render.

**URL de producción del API:**
```
https://urbanixbackend.onrender.com/api
```

### Endpoints consumidos

| Módulo | Endpoints |
|--------|-----------|
| **Incidencias** | `GET /incidencias` · `GET /incidencias/{id}` · `PATCH /incidencias/{id}` · `GET /incidencias/caso/{id}` |
| **Casos** | `GET /casos` |
| **Áreas** | `GET /areas` |
| **Categorías** | `GET /categorias` |
| **Usuarios** | `GET /usuarios` · `GET /usuarios/id/{id}` · `GET /usuarios/login` |
| **Historial** | `GET /historial/incidencia/{id}` · `POST /historial` |
| **Archivos** | `GET /archivos/incidencia/{id}` |
| **Asignaciones** | `GET /asignaciones/caso/{id}` |
| **Evidencias** | `GET /evidencias-resolucion/caso/{id}` |

> **Nota:** El backend en Render puede tardar ~30 segundos en responder la primera petición si la instancia está inactiva (plan gratuito).

---

## ☁️ Despliegue

El proyecto está desplegado en **Netlify** con despliegue continuo desde GitHub.

**URL de producción:** [https://urbanix-panel.netlify.app/](https://urbanix-panel.netlify.app/)

### Configuración de Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** El archivo `public/_redirects` maneja el routing SPA:
  ```
  /* /index.html   200
  ```

### Desplegar manualmente

```bash
# Generar el build
npm run build

# La carpeta dist/ contiene los archivos estáticos listos para desplegar
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│              (React + Vite)                         │
│         urbanix-panel.netlify.app                   │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Pages   │→ │ Services │→ │  apiFetch()      │──┼──→  Backend API
│  │          │  │ (api.js) │  │  (apiConfig.js)  │  │     Spring Boot
│  └──────────┘  └──────────┘  └──────────────────┘  │     Render
│       ↑                                             │
│  ┌──────────┐  ┌──────────────────┐                 │
│  │Components│  │ Context          │                 │
│  │ (ui/)    │  │ Auth + Theme     │                 │
│  └──────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

---

## ✍️ Autor

**Jean Franco** — Desarrollo frontend y diseño del panel administrativo.

---

## 📄 Licencia

Este es un proyecto personal. Todos los derechos reservados.
