/**
 * ProtectedRoute.jsx — Componente que protege rutas privadas
 * 
 * Envuelve las rutas que requieren autenticación.
 * Si el usuario NO está logueado, lo redirige al login.
 * Si SÍ está logueado, renderiza el contenido normalmente.
 * 
 * Uso en las rutas:
 *   <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
 *     <Route index element={<Dashboard />} />
 *     ...
 *   </Route>
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - El contenido protegido
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Mientras se verifica la sesión guardada, mostrar spinner
  // Esto evita un "flash" donde se ve el login por un instante
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <div className="spinner" />
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  // 'replace' evita que el login quede en el historial del navegador
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, renderizar el contenido protegido
  return children
}
