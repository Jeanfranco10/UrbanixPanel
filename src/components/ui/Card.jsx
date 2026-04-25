/**
 * Card.jsx — Componente de tarjeta de métrica para el Dashboard
 * 
 * Muestra una métrica clave con:
 * - Título descriptivo
 * - Valor numérico grande
 * - Indicador de cambio porcentual (↑ o ↓)
 * - Icono representativo
 * 
 * Inspirado en las métricas card del diseño de referencia
 * (Total Employee, Full time, Part time).
 * 
 * Uso:
 *   <Card
 *     title="Total Incidencias"
 *     value={120}
 *     change={5}
 *     icon={AlertTriangle}
 *   />
 */

import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * @param {object} props
 * @param {string} props.title - Título de la métrica (ej: "Total Incidencias")
 * @param {number|string} props.value - Valor numérico a mostrar
 * @param {number} props.change - Porcentaje de cambio (positivo = mejora, negativo = empeora)
 * @param {string} props.changeText - Texto adicional junto al cambio (ej: "este mes")
 * @param {React.Component} props.icon - Componente de icono de Lucide
 * @param {string} [props.accentColor] - Color de acento personalizado para el icono
 */
export default function Card({ title, value, change, changeText, icon: Icon, accentColor }) {
  // Determinar si el cambio es positivo o negativo
  const isPositive = change >= 0

  return (
    <div className="metric-card">
      {/* Línea superior: título + icono */}
      <div className="metric-card-header">
        <span className="metric-card-title">{title}</span>
        {/* Icono con fondo coloreado */}
        {Icon && (
          <div
            className="metric-card-icon"
            style={accentColor ? {
              background: `${accentColor}15`,  // 15 = alpha bajo para el fondo
              color: accentColor
            } : {}}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Valor grande de la métrica */}
      <div className="metric-card-value">{value}</div>

      {/* Indicador de cambio porcentual */}
      {change !== undefined && (
        <div className={`metric-card-change ${isPositive ? 'positive' : 'negative'}`}>
          {/* Flecha hacia arriba o abajo según el cambio */}
          {isPositive
            ? <TrendingUp size={14} />
            : <TrendingDown size={14} />
          }
          {/* Valor del porcentaje */}
          {Math.abs(change).toFixed(0)}%
          {/* Texto adicional (ej: "este mes") */}
          {changeText && <span>{changeText}</span>}
        </div>
      )}
    </div>
  )
}
