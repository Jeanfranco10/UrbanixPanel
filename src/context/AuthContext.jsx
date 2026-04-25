/**
 * AuthContext.jsx — Contexto de autenticación de Urbanix
 * 
 * Gestiona el estado de sesión del administrador:
 * - Si el usuario está autenticado o no
 * - Datos del usuario actual (nombre, rol, correo)
 * - Funciones para login y logout
 * 
 * Conectado al endpoint real:
 *   GET /api/usuarios/login?correo=X&clave=Y
 * 
 * La sesión se persiste en localStorage para que
 * no se pierda al recargar la página.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../services/apiConfig'

// Crear el contexto con valores por defecto
const AuthContext = createContext({
  user: null,            // Datos del usuario logueado
  isAuthenticated: false, // Si está autenticado
  login: () => {},       // Función de login
  logout: () => {},      // Función de logout
  loading: true,         // Si está verificando sesión
})

/**
 * AuthProvider — Envuelve la app y provee el estado de autenticación
 */
export function AuthProvider({ children }) {
  // Estado del usuario actual (null = no logueado)
  const [user, setUser] = useState(null)
  // Indica si estamos verificando la sesión guardada
  const [loading, setLoading] = useState(true)

  // Al montar, verificar si hay una sesión guardada en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('urbanix-user')
    if (savedUser) {
      try {
        // Restaurar la sesión guardada
        setUser(JSON.parse(savedUser))
      } catch {
        // Si los datos están corruptos, limpiar
        localStorage.removeItem('urbanix-user')
      }
    }
    setLoading(false) // Ya terminamos de verificar
  }, [])

  /**
   * login — Autentica al usuario contra el API de Spring Boot
   * 
   * Llama al endpoint: GET /api/usuarios/login?correo=X&clave=Y
   * 
   * Si el servidor responde 200 con el usuario → login exitoso.
   * Si responde 401 → credenciales incorrectas.
   * Si hay error de red → servidor no disponible.
   * 
   * @param {string} username - Correo electrónico del usuario
   * @param {string} password - Contraseña
   * @returns {object} { success: boolean, error?: string }
   */
  async function login(username, password) {
    try {
      // Llamar al endpoint de login del API
      const response = await fetch(
        `${API_BASE_URL}/usuarios/login?correo=${encodeURIComponent(username)}&clave=${encodeURIComponent(password)}`
      )

      if (response.ok) {
        // Login exitoso — el servidor retorna los datos del usuario
        const userData = await response.json()

        // Construir objeto de sesión con los datos del API
        const sessionData = {
          id: userData.id,
          nombre: userData.nombre,
          correo: userData.correo,
          rol: userData.rol,
          // Generar iniciales a partir del nombre
          iniciales: userData.nombre
            ? userData.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            : '??',
          fotoUrl: userData.fotoUrl || null,
        }

        setUser(sessionData)
        // Persistir sesión en localStorage
        localStorage.setItem('urbanix-user', JSON.stringify(sessionData))
        return { success: true }
      } else if (response.status === 401) {
        // Credenciales incorrectas
        return { success: false, error: 'Usuario o contraseña incorrectos' }
      } else {
        // Otro error del servidor
        return { success: false, error: `Error del servidor (${response.status})` }
      }
    } catch (error) {
      // Error de red (servidor no disponible)
      console.error('Error de conexión al login:', error)
      return {
        success: false,
        error: 'No se pudo conectar con el servidor. Verifica que el API esté corriendo.',
      }
    }
  }

  /**
   * logout — Cierra la sesión del usuario
   * Limpia el estado y el localStorage
   */
  function logout() {
    setUser(null)
    localStorage.removeItem('urbanix-user')
  }

  // Proveer el contexto a toda la app
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user, // true si user no es null
      login,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth — Hook para acceder al contexto de autenticación
 * 
 * Uso:
 *   const { user, isAuthenticated, login, logout } = useAuth()
 */
export function useAuth() {
  return useContext(AuthContext)
}
