/**
 * Header.jsx — Barra superior de la aplicación
 * 
 * Muestra:
 * - Saludo dinámico según la hora del día ("Buenos días/tardes/noches")
 * - Barra de búsqueda global
 * - Botón de toggle de tema (claro/oscuro)
 * - Campana de notificaciones
 * - Avatar y nombre del usuario administrador
 * - Botón hamburguesa en móvil para abrir el sidebar
 * 
 * Usa el contexto ThemeContext para alternar el tema.
 * Usa el contexto AuthContext para mostrar datos del usuario logueado.
 */

import { useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, Menu, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

/**
 * @param {object} props
 * @param {function} props.onMenuClick - Función para abrir el sidebar (móvil)
 */
export default function Header({ onMenuClick }) {
  // Obtener el tema actual y la función para cambiarlo
  const { theme, toggleTheme } = useTheme()
  // Obtener datos del usuario y función de logout
  const { user, logout } = useAuth()
  // Hook para redirigir al login después del logout
  const navigate = useNavigate()

  /**
   * Cierra la sesión y redirige al login
   */
  function handleLogout() {
    logout()
    navigate('/login')
  }

  /**
   * Genera un saludo dinámico basado en la hora actual
   * - Mañana (6-12): "Buenos días"
   * - Tarde (12-19): "Buenas tardes"
   * - Noche (19-6): "Buenas noches"
   */
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return 'Buenos días'
    if (hour >= 12 && hour < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  /**
   * Obtiene la fecha actual formateada en español
   * Ejemplo: "11 de abril de 2026"
   */
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <header className="header">
      {/* --- SECCIÓN IZQUIERDA: Hamburguesa (móvil) + Saludo --- */}
      <div className="header-left" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        {/* Botón hamburguesa (solo visible en móvil vía CSS) */}
        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        {/* Texto de saludo */}
        <div>
          <div className="header-greeting">
            {/* Mostrar el nombre del usuario logueado */}
            {getGreeting()}, {user?.nombre?.split(' ')[0] || 'Admin'} 👋
          </div>
          <div className="header-subtitle">
            Resumen de tu día — {getFormattedDate()}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DERECHA: Búsqueda + Acciones + Perfil --- */}
      <div className="header-right">
        {/* Campo de búsqueda */}
        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar incidencias..."
            id="global-search"
            aria-label="Buscar incidencias"
          />
        </div>

        {/* Botón de toggle de tema (Sol = claro, Luna = oscuro) */}
        <button
          className="header-action-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
          aria-label="Cambiar tema"
          id="theme-toggle"
        >
          {/* Mostrar sol si está en modo oscuro (para cambiar a claro) */}
          {/* Mostrar luna si está en modo claro (para cambiar a oscuro) */}
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Botón de notificaciones */}
        <button
          className="header-action-btn"
          title="Notificaciones"
          aria-label="Ver notificaciones"
          id="notifications-btn"
        >
          <Bell size={20} />
          {/* Punto rojo indicando notificaciones no leídas */}
          <span className="notification-dot" />
        </button>

        {/* Perfil del usuario logueado */}
        <div className="header-profile">
          {/* Avatar con las iniciales del usuario */}
          <div className="header-avatar">{user?.iniciales || 'AD'}</div>
          <div>
            <div className="header-profile-name">{user?.nombre || 'Admin'}</div>
            <div className="header-profile-role" style={{ textTransform: 'capitalize' }}>
              {user?.rol || 'Administrador'}
            </div>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          className="header-action-btn"
          onClick={handleLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          id="logout-btn"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
