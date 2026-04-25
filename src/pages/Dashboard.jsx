/**
 * Dashboard.jsx — Página principal del Panel Administrativo
 * 
 * Esta es la primera página que ve el administrador al entrar.
 * Muestra un resumen visual de todas las incidencias del sistema:
 * 
 * 1. MÉTRICAS SUPERIORES (4 cards):
 *    - Total de incidencias
 *    - Pendientes (sin atender)
 *    - En proceso (siendo atendidas)
 *    - Resueltas
 * 
 * 2. GRÁFICA DE BARRAS:
 *    - Distribución de incidencias por estado
 *    - Permite ver rápidamente el estado general del sistema
 * 
 * 3. GRÁFICA DONUT:
 *    - Distribución por nivel de prioridad
 *    - Identifica cuántas son críticas vs bajas
 * 
 * 4. ÚLTIMAS INCIDENCIAS:
 *    - Lista de las 5 más recientes
 *    - Acceso rápido a los reportes nuevos
 * 
 * 5. CASOS ACTIVOS:
 *    - Casos en progreso que requieren atención
 * 
 * Los datos se cargan desde el API real de Spring Boot.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  AlertTriangle,       // Icono de incidencias
  Clock,               // Icono de pendientes
  Loader,              // Icono de en proceso
  CheckCircle2,        // Icono de resueltas
  TrendingUp,          // Icono de tendencia
} from 'lucide-react'
import { fetchDashboardMetrics } from '../services/api'
import {
  estadoLabels,
  prioridadLabels,
  formatDate,
} from '../utils/constants'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function Dashboard() {
  // Estado para almacenar las métricas cargadas
  const [metrics, setMetrics] = useState(null)
  // Estado de carga (true mientras se obtienen los datos)
  const [loading, setLoading] = useState(true)
  // Hook para navegación programática
  const navigate = useNavigate()

  // Cargar métricas al montar el componente
  useEffect(() => {
    loadMetrics()
  }, []) // Array vacío = se ejecuta solo una vez al montar

  /**
   * Carga las métricas del dashboard desde la API
   */
  async function loadMetrics() {
    try {
      const data = await fetchDashboardMetrics()
      setMetrics(data)        // Guardar métricas en el estado
    } catch (error) {
      console.error('Error cargando métricas:', error)
    } finally {
      setLoading(false)       // Desactivar indicador de carga
    }
  }

  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
      </div>
    )
  }

  // Si no hay datos, mostrar mensaje
  if (!metrics) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Error al cargar datos</div>
        <div className="empty-state-text">No se pudieron obtener las métricas del dashboard</div>
      </div>
    )
  }

  // ============================================
  // PREPARAR DATOS PARA LAS GRÁFICAS
  // ============================================

  /**
   * Datos para la gráfica de BARRAS — distribución por estado
   * Cada barra representa un estado con su color correspondiente
   */
  const barData = [
    { name: 'Pendiente',    value: metrics.porEstado.pendiente,    color: '#f59e0b' },
    { name: 'En Revisión',  value: metrics.porEstado.en_revision,  color: '#3b82f6' },
    { name: 'En Proceso',   value: metrics.porEstado.en_proceso,   color: '#f97316' },
    { name: 'Resuelto',     value: metrics.porEstado.resuelto,     color: '#10b981' },
    { name: 'Rechazado',    value: metrics.porEstado.rechazado,    color: '#ef4444' },
    { name: 'Cerrado',      value: metrics.porEstado.cerrado,      color: '#6b7280' },
  ]

  /**
   * Datos para la gráfica DONUT — distribución por prioridad
   * Cada segmento del donut representa una prioridad
   */
  const donutData = [
    { name: 'Baja',     value: metrics.porPrioridad.baja,     color: '#10b981' },
    { name: 'Media',    value: metrics.porPrioridad.media,    color: '#f59e0b' },
    { name: 'Alta',     value: metrics.porPrioridad.alta,     color: '#f97316' },
    { name: 'Crítica',  value: metrics.porPrioridad.critica,  color: '#ef4444' },
  ]

  /**
   * Tooltip personalizado para la gráfica de barras
   * Muestra el nombre del estado y la cantidad al pasar el mouse
   */
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {payload[0].payload.name}
          </p>
          <p style={{ color: payload[0].payload.color, fontWeight: 700, margin: '4px 0 0' }}>
            {payload[0].value} incidencias
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {/* --- TÍTULO DE LA PÁGINA --- */}
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Resumen general de incidencias urbanas del sistema
      </p>

      {/* ============================================
          SECCIÓN 1: CARDS DE MÉTRICAS (fila superior)
          ============================================ */}
      <div className="metrics-grid">
        {/* Card: Total de incidencias */}
        <Card
          title="Total Incidencias"
          value={metrics.total}
          change={5}
          changeText="este mes"
          icon={AlertTriangle}
          accentColor="#6366f1"
        />
        {/* Card: Pendientes (sin atender) */}
        <Card
          title="Pendientes"
          value={metrics.porEstado.pendiente}
          change={-3}
          changeText="vs anterior"
          icon={Clock}
          accentColor="#f59e0b"
        />
        {/* Card: En proceso (siendo atendidas) */}
        <Card
          title="En Proceso"
          value={metrics.porEstado.en_proceso}
          change={8}
          changeText="este mes"
          icon={Loader}
          accentColor="#f97316"
        />
        {/* Card: Resueltas */}
        <Card
          title="Resueltas"
          value={metrics.porEstado.resuelto}
          change={12}
          changeText="este mes"
          icon={CheckCircle2}
          accentColor="#10b981"
        />
      </div>

      {/* ============================================
          SECCIÓN 2: GRÁFICAS (barras + donut)
          ============================================ */}
      <div className="dashboard-grid">
        {/* --- GRÁFICA DE BARRAS: Por estado --- */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <TrendingUp size={18} />
              Distribución por Estado
            </h2>
            {/* Selector de período de tiempo */}
            <select className="card-date-select" defaultValue="6m">
              <option value="1m">Último mes</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Último año</option>
            </select>
          </div>
          <div className="content-card-body">
            {/* ResponsiveContainer adapta la gráfica al ancho */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} barSize={40} barGap={8}>
                {/* Líneas de fondo de la gráfica */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                {/* Eje X con nombres de estados */}
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                {/* Eje Y con valores numéricos */}
                <YAxis
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                {/* Tooltip personalizado al pasar el mouse */}
                <Tooltip content={<CustomBarTooltip />} cursor={false} />
                {/* Barras con colores por estado */}
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- GRÁFICA DONUT: Por prioridad --- */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              Por Prioridad
            </h2>
          </div>
          <div className="content-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Donut chart con espacio en el centro */}
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}       // Radio interno (crea el agujero del donut)
                  outerRadius={95}       // Radio externo
                  paddingAngle={3}       // Espacio entre segmentos
                  dataKey="value"
                  stroke="none"
                >
                  {/* Asignar color a cada segmento */}
                  {donutData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto central del donut */}
            <div className="donut-center" style={{ marginTop: '-140px', marginBottom: '80px' }}>
              <div className="donut-center-value">{metrics.total}</div>
              <div className="donut-center-label">Total</div>
            </div>
            {/* Leyenda de colores */}
            <div className="chart-legend">
              {donutData.map(item => (
                <div key={item.name} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          SECCIÓN 3: LISTAS (últimas incidencias + casos activos)
          ============================================ */}
      <div className="dashboard-grid">
        {/* --- ÚLTIMAS INCIDENCIAS --- */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              🕐 Últimas Incidencias
            </h2>
            {/* Botón para ver todas las incidencias */}
            <button
              className="btn-outline-sm"
              onClick={() => navigate('/incidencias')}
            >
              Ver todas
            </button>
          </div>
          <div className="content-card-body">
            {/* Renderizar las 5 incidencias más recientes */}
            {metrics.ultimas.map(inc => (
              <div
                key={inc.id}
                className="list-item"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/incidencias/${inc.id}`)}
              >
                {/* Icono de la categoría */}
                <div
                  className="list-item-icon"
                  style={{
                    background: `${inc.categoria?.color}15`,
                    color: inc.categoria?.color,
                    fontSize: '20px',
                  }}
                >
                  {inc.categoria?.icono}
                </div>
                {/* Información de la incidencia */}
                <div className="list-item-info">
                  <div className="list-item-title">
                    <span className="incident-code">{inc.codigo}</span>
                    {' — '}
                    {inc.descripcion.substring(0, 50)}...
                  </div>
                  <div className="list-item-subtitle">
                    {inc.usuario?.nombre} · {formatDate(inc.creadoEn || inc.created_at)}
                  </div>
                </div>
                {/* Badge de estado */}
                <div className="list-item-badge">
                  <Badge type="estado" value={inc.estado} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CASOS ACTIVOS --- */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              📂 Casos Activos
            </h2>
            <button
              className="btn-outline-sm"
              onClick={() => navigate('/casos')}
            >
              Ver todos
            </button>
          </div>
          <div className="content-card-body">
            {/* Renderizar los casos que están en progreso */}
            {metrics.casosActivos.map(caso => (
              <div key={caso.id} className="list-item">
                {/* Icono del caso */}
                <div
                  className="list-item-icon"
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                  }}
                >
                  📋
                </div>
                {/* Información del caso */}
                <div className="list-item-info">
                  <div className="list-item-title">{caso.titulo}</div>
                  <div className="list-item-subtitle">
                    {caso.area?.nombre} · {caso.totalReportes || caso.total_reportes} reportes
                  </div>
                </div>
                <div className="list-item-badge">
                  <Badge type="estado" value={caso.estado} />
                </div>
              </div>
            ))}

            {/* Mensaje si no hay casos activos */}
            {metrics.casosActivos.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-text">No hay casos activos</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
