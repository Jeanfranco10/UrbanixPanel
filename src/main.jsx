/**
 * main.jsx — Punto de entrada de la aplicación React
 * 
 * Aquí se inicializa React y se monta el componente raíz <App />
 * dentro del elemento #root del HTML.
 * 
 * StrictMode activa advertencias adicionales durante el desarrollo
 * para detectar problemas potenciales en el código.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'     // Estilos globales y sistema de temas
import App from './App'  // Componente raíz de la aplicación

// Montar la aplicación React en el DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
