/**
 * Layout.jsx — Layout principal de la aplicación
 * 
 * Este componente envuelve todas las páginas y proporciona
 * la estructura base: Sidebar + Header + Contenido.
 * 
 * Usa <Outlet> de React Router para renderizar la página
 * correspondiente a la ruta actual dentro del área de contenido.
 * 
 * También gestiona el estado del sidebar en dispositivos móviles
 * (abierto/cerrado).
 */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  // Estado para controlar si el sidebar está abierto en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Sidebar con navegación */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}  // Cerrar al hacer clic fuera o navegar
      />

      {/* Contenido principal (header + página) */}
      <main className="main-content">
        {/* Header pegajoso en la parte superior */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}  // Abrir sidebar desde el hamburguesa
        />

        {/* Área donde se renderiza la página actual según la ruta */}
        <div className="page-content page-enter">
          {/* Outlet renderiza el componente hijo de la ruta actual */}
          {/* Por ejemplo: / → Dashboard, /incidencias → Incidencias, etc. */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
