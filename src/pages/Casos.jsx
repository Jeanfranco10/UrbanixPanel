/**
 * Casos.jsx — Página de gestión de casos
 * 
 * Los CASOS son agrupadores de incidencias relacionadas.
 * Por ejemplo, si hay 5 reportes de baches en la misma avenida,
 * se agrupan bajo un solo caso "Baches en Av. Principal".
 * 
 * Funcionalidades:
 * 1. Lista de casos con su estado, prioridad y área
 * 2. Cards expandibles — al hacer clic se muestran:
 *    - Incidencias relacionadas al caso
 *    - Asignaciones (inspector asignado, fecha límite)
 *    - Evidencia de resolución (fotos del inspector)
 * 3. Filtros por estado y prioridad
 * 
 * Corresponde al módulo 3.4 de la especificación.
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,        // Flecha abajo (expandir)
  ChevronUp,          // Flecha arriba (contraer)
  Users,              // Icono de asignaciones
  Camera,             // Icono de evidencia
  Calendar,           // Icono calendario
  AlertTriangle,      // Icono incidencias
} from 'lucide-react'
import { fetchCasos } from '../services/api'
import {
  estadoLabels,
  prioridadLabels,
  formatDate,
  formatDateShort,
} from '../utils/constants'
import Badge from '../components/ui/Badge'

export default function Casos() {
  // --- ESTADOS ---
  const [casos, setCasos] = useState([])              // Lista de casos
  const [loading, setLoading] = useState(true)         // Indicador de carga
  const [expandedId, setExpandedId] = useState(null)   // ID del caso expandido
  const [filterEstado, setFilterEstado] = useState('')  // Filtro por estado
  const [filterPrioridad, setFilterPrioridad] = useState('') // Filtro por prioridad

  const navigate = useNavigate()

  // Cargar casos al montar
  useEffect(() => {
    loadCasos()
  }, [])

  /**
   * Carga todos los casos desde la API
   */
  async function loadCasos() {
    try {
      const data = await fetchCasos()
      setCasos(data)
    } catch (error) {
      console.error('Error cargando casos:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Alterna la expansión de un caso
   * Si el caso ya está expandido, lo contrae. Si no, lo expande.
   */
  function toggleExpanded(casoId) {
    setExpandedId(prev => prev === casoId ? null : casoId)
  }

  /**
   * Filtra los casos según estado y prioridad seleccionados
   */
  const filtered = useMemo(() => {
    let result = [...casos]
    if (filterEstado) result = result.filter(c => c.estado === filterEstado)
    if (filterPrioridad) result = result.filter(c => c.prioridad === filterPrioridad)
    return result
  }, [casos, filterEstado, filterPrioridad])

  // Spinner de carga
  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      {/* --- TÍTULO --- */}
      <h1 className="page-title">Gestión de Casos</h1>
      <p className="page-subtitle">
        Casos que agrupan incidencias relacionadas — {casos.length} casos totales
      </p>

      {/* ============================================
          FILTROS
          ============================================ */}
      <div className="filters-bar">
        {/* Filtro por estado */}
        <select
          className="filter-select"
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Filtro por prioridad */}
        <select
          className="filter-select"
          value={filterPrioridad}
          onChange={e => setFilterPrioridad(e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          {Object.entries(prioridadLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* ============================================
          LISTA DE CASOS (Cards expandibles)
          ============================================ */}
      {filtered.map(caso => {
        // Determinar si este caso está expandido
        const isExpanded = expandedId === caso.id

        return (
          <div key={caso.id} className="caso-card">
            {/* --- HEADER DEL CASO (siempre visible) --- */}
            <div
              className="caso-card-header"
              onClick={() => toggleExpanded(caso.id)}
            >
              <div className="caso-card-info">
                {/* Título y metadatos del caso */}
                <div style={{ flex: 1 }}>
                  <div className="caso-card-title">{caso.titulo}</div>
                  <div className="caso-card-meta">
                    {/* Área + total de reportes + fecha */}
                    {caso.area?.nombre || 'Sin área'}
                    {' · '}
                    {caso.totalReportes || caso.total_reportes} reportes
                    {' · '}
                    {formatDateShort(caso.creadoEn || caso.created_at)}
                  </div>
                </div>

                {/* Badges de estado y prioridad */}
                <Badge type="estado" value={caso.estado} />
                <Badge type="prioridad" value={caso.prioridad} />
              </div>

              {/* Flecha de expandir/contraer */}
              {isExpanded
                ? <ChevronUp size={20} style={{ color: 'var(--text-secondary)' }} />
                : <ChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
              }
            </div>

            {/* --- BODY DEL CASO (visible solo si está expandido) --- */}
            {isExpanded && (
              <div className="caso-card-body">
                {/* Descripción del caso */}
                <div style={{
                  padding: '16px 0',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: '1.6',
                  borderBottom: '1px solid var(--border-light)',
                }}>
                  {caso.descripcion}
                </div>

                {/* --- INCIDENCIAS RELACIONADAS --- */}
                <div className="content-card" style={{ marginTop: '16px' }}>
                  <div className="content-card-header">
                    <h3 className="content-card-title">
                      <AlertTriangle size={16} />
                      Incidencias Relacionadas ({caso.incidencias?.length || 0})
                    </h3>
                  </div>
                  <div className="content-card-body" style={{ padding: 0 }}>
                    {/* Mini-tabla de incidencias del caso */}
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Descripción</th>
                          <th>Estado</th>
                          <th>Prioridad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {caso.incidencias?.map(inc => (
                          <tr
                            key={inc.id}
                            className="clickable"
                            onClick={() => navigate(`/incidencias/${inc.id}`)}
                          >
                            <td><span className="incident-code">{inc.codigo}</span></td>
                            <td style={{ maxWidth: '300px' }}>
                              <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                              }}>
                                {inc.descripcion}
                              </span>
                            </td>
                            <td><Badge type="estado" value={inc.estado} /></td>
                            <td><Badge type="prioridad" value={inc.prioridad} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* --- ASIGNACIONES --- */}
                {caso.asignaciones?.length > 0 && (
                  <div className="content-card" style={{ marginTop: '16px' }}>
                    <div className="content-card-header">
                      <h3 className="content-card-title">
                        <Users size={16} />
                        Asignaciones
                      </h3>
                    </div>
                    <div className="content-card-body">
                      {caso.asignaciones.map(asig => {
                        // Resolver datos del inspector y asignador
                        // JPA puede cargar como objeto anidado o solo ID
                        const inspectorNombre = asig.asignadoA?.nombre || asig.inspector?.nombre || 'Inspector'
                        const inspectorInicial = inspectorNombre.charAt(0)
                        const asignadorNombre = asig.asignadoPor?.nombre || asig.asignador?.nombre || '—'
                        // En BD real: activo (boolean) en vez de estado (string)
                        const estaCompletada = asig.activo === false || asig.estado === 'completada'

                        return (
                          <div key={asig.id} className="assignment-card">
                            {/* Avatar del inspector */}
                            <div className="assignment-avatar">
                              {inspectorInicial}
                            </div>
                            {/* Información de la asignación */}
                            <div className="assignment-info">
                              <div className="assignment-name">
                                {inspectorNombre}
                              </div>
                              <div className="assignment-detail">
                                Asignado por {asignadorNombre}
                                {asig.notas && ` · ${asig.notas}`}
                              </div>
                            </div>
                            {/* Fecha límite */}
                            <div className="assignment-date">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} />
                                Límite: {formatDateShort(asig.fechaLimite || asig.fecha_limite)}
                              </div>
                              {/* Badge de estado de la asignación */}
                              <div style={{ marginTop: '4px' }}>
                                <span
                                  className="badge"
                                  style={{
                                    background: estaCompletada
                                      ? 'var(--estado-resuelto-bg)'
                                      : 'var(--estado-en-proceso-bg)',
                                    color: estaCompletada
                                      ? 'var(--estado-resuelto)'
                                      : 'var(--estado-en-proceso)',
                                  }}
                                >
                                  {estaCompletada ? 'Completada' : 'Activa'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* --- EVIDENCIA DE RESOLUCIÓN --- */}
                {caso.evidencia?.length > 0 && (
                  <div className="content-card" style={{ marginTop: '16px' }}>
                    <div className="content-card-header">
                      <h3 className="content-card-title">
                        <Camera size={16} />
                        Evidencia de Resolución
                      </h3>
                    </div>
                    <div className="content-card-body">
                      {caso.evidencia.map(ev => {
                        // Resolver nombre del inspector que subió la evidencia
                        const inspectorNombre = ev.inspector?.nombre || ev.inspectorId || '—'

                        return (
                          <div key={ev.id} style={{
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'flex-start',
                            padding: '12px',
                            background: 'var(--bg-input)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '10px',
                          }}>
                            {/* Miniatura de la evidencia */}
                            <div style={{
                              width: '80px',
                              height: '60px',
                              borderRadius: 'var(--radius-sm)',
                              overflow: 'hidden',
                              background: 'var(--border-color)',
                              flexShrink: 0,
                            }}>
                              <img
                                src={ev.url}
                                alt="Evidencia"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none' }}
                              />
                            </div>
                            {/* Descripción de la evidencia */}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                Evidencia fotográfica
                              </div>
                              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                {ev.descripcion}
                              </div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                                Subido por {inspectorNombre}
                                {' · '}
                                {formatDate(ev.creadoEn || ev.created_at)}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Mensaje cuando no hay casos */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Sin casos</div>
          <div className="empty-state-text">
            No se encontraron casos con los filtros seleccionados
          </div>
        </div>
      )}
    </div>
  )
}
