/**
 * apiConfig.js — Configuración centralizada de la API
 * 
 * Aquí se define la URL base del servidor Spring Boot.
 * Si cambias de puerto o despliegas a producción, solo
 * necesitas modificar este archivo.
 */

// URL base del API de Spring Boot
export const API_BASE_URL = 'http://localhost:8080/api'

/**
 * Función helper para hacer peticiones HTTP al API.
 * Maneja errores, headers y parsing de JSON automáticamente.
 * 
 * @param {string} endpoint - Ruta relativa (ej: '/incidencias')
 * @param {object} options - Opciones adicionales de fetch
 * @returns {Promise<any>} Datos parseados de la respuesta
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    // Si la respuesta es 204 No Content (DELETE exitoso, etc.)
    if (response.status === 204) return null

    // Si hay error HTTP, lanzar excepción con detalle
    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(
        `Error ${response.status}: ${response.statusText}${errorText ? ` — ${errorText}` : ''}`
      )
    }

    // Verificar si hay contenido antes de parsear JSON
    const text = await response.text()
    if (!text) return null
    return JSON.parse(text)
  } catch (error) {
    // Re-lanzar errores de red con mensaje más claro
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el API esté corriendo en ' + API_BASE_URL)
    }
    throw error
  }
}
