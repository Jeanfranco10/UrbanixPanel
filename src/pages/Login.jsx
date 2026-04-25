/**
 * Login.jsx — Página de inicio de sesión de Urbanix
 * 
 * Esta es la primera página que ve el usuario al entrar a la app.
 * Presenta un formulario de login con diseño premium:
 * 
 * - Fondo con gradiente animado
 * - Card de login centrada con glassmorphism
 * - Logo de Urbanix
 * - Campos de usuario y contraseña
 * - Botón de login con animación
 * - Mensajes de error visuales
 * - Credenciales de demo para pruebas
 * 
 * Credenciales mock:
 *   admin / admin123
 *   inspector / inspector123
 * 
 * Al autenticarse, redirige al Dashboard ("/").
 */

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Building2, User, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  // --- ESTADOS DEL FORMULARIO ---
  const [username, setUsername] = useState('')        // Campo usuario
  const [password, setPassword] = useState('')        // Campo contraseña
  const [showPassword, setShowPassword] = useState(false) // Mostrar/ocultar contraseña
  const [error, setError] = useState('')              // Mensaje de error
  const [isLoading, setIsLoading] = useState(false)   // Indicador de carga del botón

  // Hooks de autenticación y tema
  const { login, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()

  // Si ya está autenticado, redirigir al Dashboard automáticamente
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  /**
   * Maneja el envío del formulario de login
   * Valida campos, llama a login() y maneja errores
   */
  async function handleSubmit(e) {
    e.preventDefault()     // Evitar recarga de página
    setError('')           // Limpiar errores previos

    // Validación básica de campos vacíos
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    try {
      // Intentar login con las credenciales ingresadas
      const result = await login(username.trim(), password)
      if (!result.success) {
        // Mostrar error si las credenciales son incorrectas
        setError(result.error)
      }
      // Si es exitoso, el cambio de isAuthenticated
      // dispara el Navigate de arriba automáticamente
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* ============================================
          FONDO ANIMADO CON FORMAS GEOMÉTRICAS
          ============================================ */}
      <div className="login-bg">
        <div className="login-bg-shape shape-1" />
        <div className="login-bg-shape shape-2" />
        <div className="login-bg-shape shape-3" />
      </div>

      {/* ============================================
          CARD DE LOGIN (centrada en pantalla)
          ============================================ */}
      <div className="login-card">
        {/* --- LOGO Y TÍTULO --- */}
        <div className="login-header">
          {/* Icono del logo con gradiente */}
          <div className="login-logo">
            <Building2 size={28} />
          </div>
          <h1 className="login-title">URBANIX</h1>
          <p className="login-subtitle">Panel Administrativo</p>
          <p className="login-description">
            Gestión de Incidencias Urbanas
          </p>
        </div>

        {/* --- FORMULARIO --- */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Mensaje de error (visible cuando hay error) */}
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Campo de usuario */}
          <div className="login-field">
            <label htmlFor="login-username" className="login-label">
              Usuario
            </label>
            <div className="login-input-wrapper">
              {/* Icono dentro del input */}
              <User size={18} className="login-input-icon" />
              <input
                id="login-username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="login-input"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              Contraseña
            </label>
            <div className="login-input-wrapper">
              {/* Icono de candado */}
              <Lock size={18} className="login-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'} // Alternar visibilidad
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="login-input"
                autoComplete="current-password"
              />
              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botón de login */}
          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              // Spinner de carga dentro del botón
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                Ingresando...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* --- CREDENCIALES DE DEMO --- */}
        <div className="login-demo">
          <p className="login-demo-title">Credenciales de prueba:</p>
          <div className="login-demo-creds">
            <div className="login-demo-item" onClick={() => { setUsername('admin'); setPassword('admin123') }}>
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="login-demo-item" onClick={() => { setUsername('inspector'); setPassword('inspector123') }}>
              <strong>Inspector:</strong> inspector / inspector123
            </div>
          </div>
        </div>
      </div>

      {/* Botón de tema en esquina */}
      <button
        className="login-theme-toggle"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        aria-label="Cambiar tema"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
