/**
 * ThemeContext.jsx — Contexto de React para el sistema de temas
 * 
 * Este contexto provee a toda la aplicación:
 * - El estado actual del tema ('light' o 'dark')
 * - Una función para alternar entre temas
 * 
 * El tema se persiste en localStorage para que se mantenga
 * al recargar la página.
 * 
 * Se aplica el atributo data-theme al <html> para que las
 * variables CSS cambien automáticamente.
 */

import { createContext, useContext, useState, useEffect } from 'react'

// Crear el contexto con valores por defecto
const ThemeContext = createContext({
  theme: 'light',       // Tema por defecto
  toggleTheme: () => {} // Función placeholder
})

/**
 * ThemeProvider — Componente que envuelve la app y provee el contexto
 * 
 * Uso:
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 * 
 * Cualquier componente hijo puede acceder al tema con useTheme()
 */
export function ThemeProvider({ children }) {
  // Inicializar el tema desde localStorage, o usar 'light' por defecto
  const [theme, setTheme] = useState(() => {
    // Intentar leer el tema guardado previamente
    const saved = localStorage.getItem('urbanix-theme')
    return saved || 'light'
  })

  // Efecto que se ejecuta cada vez que cambia el tema
  useEffect(() => {
    // Aplicar el atributo data-theme al elemento <html>
    // Esto activa las variables CSS correspondientes al tema
    document.documentElement.setAttribute('data-theme', theme)
    
    // Guardar la preferencia en localStorage para persistencia
    localStorage.setItem('urbanix-theme', theme)
  }, [theme]) // Se ejecuta cuando 'theme' cambia

  /**
   * toggleTheme — Alterna entre tema claro y oscuro
   * Si está en 'light', cambia a 'dark' y viceversa
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Proveer el tema y la función toggle a todos los hijos
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme — Hook personalizado para acceder al contexto del tema
 * 
 * Uso en cualquier componente:
 *   const { theme, toggleTheme } = useTheme()
 *   
 *   // Verificar tema actual
 *   if (theme === 'dark') { ... }
 *   
 *   // Cambiar tema
 *   <button onClick={toggleTheme}>Cambiar tema</button>
 */
export function useTheme() {
  return useContext(ThemeContext)
}
