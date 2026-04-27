/**
 * Sidebar.jsx — Barra de navegación lateral de Urbanix
 * 
 * Componente que muestra:
 * - Logo y nombre de la aplicación
 * - Links de navegación a cada módulo (Dashboard, Incidencias, Casos, Áreas)
 * - Badges con contadores
 * - Indicador visual de la ruta activa
 * 
 * Usa NavLink de React Router para resaltar automáticamente
 * la ruta activa con la clase 'active'.
 * 
 * En dispositivos móviles, el sidebar se puede abrir/cerrar
 * con un botón hamburguesa.
 */

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,  // Icono de dashboard (cuadrícula)
  AlertTriangle,    // Icono de incidencias (alerta)
  FolderOpen,       // Icono de casos (carpeta)
  MapPin,           // Icono de áreas (pin de mapa)
  Building2,        // Icono del logo (edificio)
  X,                // Icono para cerrar (X)
  Tag,
  Users
} from 'lucide-react'

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Si el sidebar está abierto (móvil)
 * @param {function} props.onClose - Función para cerrar el sidebar (móvil)
 */
export default function Sidebar({ isOpen, onClose }) {
  /**
   * Definición de los links de navegación
   * Cada objeto tiene: ruta, icono, etiqueta de texto, y badge opcional
   */
  const navLinks = [
    {
      path: '/',                    // Ruta del dashboard (página principal)
      icon: LayoutDashboard,        // Componente del icono
      label: 'Dashboard',           // Texto visible
      badge: null                   // Sin badge
    },
    {
      path: '/incidencias',
      icon: AlertTriangle,
      label: 'Incidencias',
      badge: null                   // Número total de incidencias (mock)
    },/*
    {
      path: '/casos',
      icon: FolderOpen,
      label: 'Casos',
      badge: null
    },
    {
      path: '/areas',
      icon: MapPin,
      label: 'Áreas Municipales',
      badge: null
    },*/
    {
      path: '/categorias',
      icon: Tag,
      label: 'Categorías',
      badge: null
    },
    {
      path: '/ubicaciones',
      icon: MapPin,
      label: 'Ubicaciones',
      badge: null
    },
    {
      path: '/usuarios',
      icon: Users,
      label: 'Usuarios',
      badge: null
    },
  ]

  return (
    <>
      {/* 
        Overlay oscuro que aparece detrás del sidebar en móvil.
        Al hacer clic en él, se cierra el sidebar.
      */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar principal */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* --- LOGO --- */}
        <div className="sidebar-logo">
          {/* Icono cuadrado con gradiente */}
          <div className="sidebar-logo-icon">
            <Building2 size={22} />
          </div>
          {/* Texto del logo */}
          <div>
            <div className="sidebar-logo-text">URBANIX</div>
            <div className="sidebar-logo-subtitle">Panel Admin</div>
          </div>
          {/* Botón cerrar (solo visible en móvil) */}
          <button
            className="mobile-menu-btn"
            onClick={onClose}
            style={{ marginLeft: 'auto' }}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- NAVEGACIÓN --- */}
        <nav className="sidebar-nav">
          {/* Título de sección */}
          <div className="sidebar-section-title">Principal</div>

          {/* Renderizar cada link de navegación */}
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              // NavLink añade automáticamente la clase 'active' a la ruta actual
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              // En móvil, cerrar el sidebar al navegar
              onClick={onClose}
              // Solo marcar como activa si la ruta coincide exactamente
              // (excepto para la raíz '/' que necesita 'end')
              end={link.path === '/'}
            >
              {/* Icono del link */}
              <link.icon className="icon" size={20} />
              {/* Texto del link */}
              {link.label}
              {/* Badge con contador (si existe) */}
              {link.badge && (
                <span className="sidebar-badge">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
