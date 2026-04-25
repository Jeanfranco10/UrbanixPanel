/**
 * Badge.jsx — Componente de badge (etiqueta visual) para estados y prioridades
 * 
 * Se usa en toda la aplicación para mostrar el estado o prioridad
 * de una incidencia/caso de forma visual con colores.
 * 
 * Tipos de badge:
 * - Estado: pendiente, en_revision, en_proceso, resuelto, rechazado, cerrado
 * - Prioridad: baja, media, alta, critica
 * 
 * Los colores se definen en index.css mediante las clases .badge-*
 * 
 * Uso:
 *   <Badge type="estado" value="pendiente" />
 *   <Badge type="prioridad" value="alta" />
 */

import { estadoLabels, prioridadLabels } from '../../data/mockData'

/**
 * @param {object} props
 * @param {'estado'|'prioridad'} props.type - Tipo de badge
 * @param {string} props.value - Valor del estado/prioridad (ej: 'pendiente', 'alta')
 */
export default function Badge({ type, value }) {
  // Determinar la clase CSS y el texto a mostrar según el tipo
  let className = 'badge'
  let label = value

  if (type === 'estado') {
    // Para estados: la clase es badge-{valor} (ej: badge-pendiente)
    className += ` badge-${value}`
    // El label es el nombre legible (ej: 'Pendiente' en vez de 'pendiente')
    label = estadoLabels[value] || value
  } else if (type === 'prioridad') {
    // Para prioridades: la clase es badge-prioridad-{valor}
    className += ` badge-prioridad-${value}`
    label = prioridadLabels[value] || value
  }

  return (
    <span className={className}>
      {/* Punto de color al inicio del badge */}
      <span className="badge-dot" />
      {/* Texto del badge */}
      {label}
    </span>
  )
}
