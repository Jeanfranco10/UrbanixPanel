/**
 * constants.js — Constantes y utilidades del panel Urbanix
 * 
 * Contiene labels, mapeos y funciones de formato que se usan
 * en múltiples páginas. Estas NO dependen de datos mock ni del API.
 */

// ============================================
// LABELS — Nombres legibles para estados y prioridades
// Se usan en badges, selects y textos del panel
// ============================================

/**
 * Mapeo de nombres legibles para cada estado de incidencia/caso
 */
export const estadoLabels = {
  pendiente: 'Pendiente',
  en_revision: 'En Revisión',
  en_proceso: 'En Proceso',
  resuelto: 'Resuelto',
  rechazado: 'Rechazado',
  cerrado: 'Cerrado',
}

/**
 * Mapeo de nombres legibles para cada nivel de prioridad
 */
export const prioridadLabels = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
}

// ============================================
// FUNCIONES DE FORMATO — Para fechas
// ============================================

/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} dateStr - Fecha en formato ISO (ej: '2026-03-15T10:30:00')
 * @returns {string} Fecha formateada (ej: '15 mar 2026, 10:30')
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea solo la fecha sin hora
 * @param {string} dateStr - Fecha en formato ISO
 * @returns {string} Fecha formateada (ej: '15 mar 2026')
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
