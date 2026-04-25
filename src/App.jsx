/**
 * App.jsx — Componente raíz de la aplicación Urbanix
 * 
 * Configura:
 * 1. AUTENTICACIÓN — AuthProvider envuelve toda la app
 * 2. TEMA — ThemeProvider para modo claro/oscuro
 * 3. ROUTER — Rutas públicas (login) y protegidas (panel)
 * 
 * Flujo de navegación:
 *   /login → Página de login (pública)
 *   / → Dashboard (protegida, requiere login)
 *   /incidencias → Lista de incidencias (protegida)
 *   /incidencias/:id → Detalle de incidencia (protegida)
 *   /casos → Gestión de casos (protegida)
 *   /areas → Áreas municipales (protegida)
 * 
 * Si el usuario no está logueado e intenta acceder a una ruta
 * protegida, ProtectedRoute lo redirige automáticamente al login.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'

// Páginas de la aplicación
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Incidencias from './pages/Incidencias'
import DetalleIncidencia from './pages/DetalleIncidencia'
import Casos from './pages/Casos'
import Areas from './pages/Areas'
import Categorias from './pages/Categorias'
import Ubicaciones from './pages/Ubicaciones'
import Usuarios from './pages/Usuarios'

export default function App() {
  return (
    // AuthProvider gestiona la sesión del usuario
    <AuthProvider>
      {/* ThemeProvider gestiona el tema claro/oscuro */}
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* 
              RUTA PÚBLICA — Login
              Accesible sin autenticación.
              Si ya está logueado, redirige al Dashboard.
            */}
            <Route path="/login" element={<Login />} />

            {/* 
              RUTAS PROTEGIDAS — Panel Administrativo
              ProtectedRoute verifica la autenticación.
              Si no está logueado, redirige a /login.
              Layout provee el sidebar + header.
            */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard = página principal al entrar */}
              <Route index element={<Dashboard />} />
              {/* Lista de incidencias con filtros */}
              <Route path="incidencias" element={<Incidencias />} />
              {/* Detalle de una incidencia (:id = parámetro dinámico) */}
              <Route path="incidencias/:id" element={<DetalleIncidencia />} />
              {/* Gestión de casos agrupadores */}
              <Route path="casos" element={<Casos />} />
              {/* Áreas municipales */}
              <Route path="areas" element={<Areas />} />
              {/* Gestión de categorías */}
              <Route path="categorias" element={<Categorias />} />
              {/* Gestión de ubicaciones */}
              <Route path="ubicaciones" element={<Ubicaciones />} />
              {/* Gestión de usuarios */}
              <Route path="usuarios" element={<Usuarios />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}
