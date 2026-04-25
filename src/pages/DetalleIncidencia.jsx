/**
 * DetalleIncidencia.jsx — Vista completa de una incidencia individual
 * 
 * Esta página muestra toda la información detallada de una incidencia:
 * 
 * 1. HEADER — Código, estado y prioridad con badges
 * 2. DESCRIPCIÓN — Texto completo del reporte del ciudadano
 * 3. UBICACIÓN — Dirección, referencia, distrito y coordenadas
 * 4. REPORTANTE — Datos del ciudadano que hizo el reporte
 * 5. CATEGORÍA Y CASO — A qué categoría pertenece y su caso agrupador
 * 6. MULTIMEDIA — Fotos y videos adjuntos al reporte
 * 7. HISTORIAL — Timeline con todos los cambios de estado
 * 8. CAMBIO DE ESTADO — Modal para cambiar el estado actual
 * 
 * El ID de la incidencia se obtiene de la URL usando useParams().
 * Por ejemplo: /incidencias/5 → id = 5
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,         // Flecha para volver
  MapPin,            // Icono de ubicación
  User,              // Icono de usuario
  Tag,               // Icono de categoría
  FolderOpen,        // Icono de caso
  Image,             // Icono de multimedia
  Clock,             // Icono de historial
  RefreshCw,         // Icono de cambiar estado
  FileText,          // Icono de descripción
} from 'lucide-react'
import { fetchIncidenciaById, updateEstadoIncidencia } from '../services/api'
import {
  estadoLabels,
  prioridadLabels,
  formatDate,
} from '../utils/constants'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

export default function DetalleIncidencia() {
  // Obtener el ID de la incidencia desde la URL
  const { id } = useParams()
  // Hook para navegar (volver a la lista)
  const navigate = useNavigate()
  // Datos del usuario logueado (para registrar cambios de estado)
  const { user } = useAuth()

  // --- ESTADOS ---
  const [incidencia, setIncidencia] = useState(null)    // Datos de la incidencia
  const [loading, setLoading] = useState(true)           // Indicador de carga
  const [showModal, setShowModal] = useState(false)      // Mostrar/ocultar modal de cambio
  const [nuevoEstado, setNuevoEstado] = useState('')     // Estado seleccionado en el modal
  const [comentario, setComentario] = useState('')       // Comentario del cambio
  const [updating, setUpdating] = useState(false)        // Indicador de guardado

  // Cargar datos de la incidencia al montar o cuando cambia el ID
  useEffect(() => {
    loadIncidencia()
  }, [id])

  /**
   * Carga los datos completos de la incidencia desde la API
   */
  async function loadIncidencia() {
    setLoading(true)
    try {
      const data = await fetchIncidenciaById(id)
      setIncidencia(data)
    } catch (error) {
      console.error('Error cargando incidencia:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Maneja el cambio de estado de la incidencia
   * Se ejecuta al confirmar en el modal
   */
  async function handleCambiarEstado() {
    if (!nuevoEstado) return // Verificar que se seleccionó un estado

    setUpdating(true)
    try {
      // Llamar a la API para actualizar el estado
      await updateEstadoIncidencia(
        incidencia.id,
        nuevoEstado,
        comentario,
        user?.id // ID del admin que hace el cambio
      )
      // Recargar la incidencia para ver los cambios
      await loadIncidencia()
      // Cerrar el modal y limpiar campos
      setShowModal(false)
      setNuevoEstado('')
      setComentario('')
    } catch (error) {
      console.error('Error actualizando estado:', error)
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Define los estados disponibles según el flujo:
   * pendiente → en_revision → en_proceso → resuelto → cerrado
   * "rechazado" siempre está disponible
   */
  function getEstadosDisponibles() {
    const flujo = {
      pendiente: ['en_revision', 'rechazado'],
      en_revision: ['en_proceso', 'rechazado'],
      en_proceso: ['resuelto', 'rechazado'],
      resuelto: ['cerrado'],
      rechazado: [],              // Estado final
      cerrado: [],                // Estado final
    }
    return flujo[incidencia?.estado] || []
  }

  /**
   * Retorna el color CSS asociado a un estado
   * Se usa para colorear los puntos de la timeline
   */
  function getEstadoColor(estado) {
    const colores = {
      pendiente: '#f59e0b',
      en_revision: '#3b82f6',
      en_proceso: '#f97316',
      resuelto: '#10b981',
      rechazado: '#ef4444',
      cerrado: '#6b7280',
    }
    return colores[estado] || '#6b7280'
  }

  // Spinner de carga
  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
      </div>
    )
  }

  // Incidencia no encontrada
  if (!incidencia) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Incidencia no encontrada</div>
        <div className="empty-state-text">
          No se encontró una incidencia con el ID {id}
        </div>
        <button className="btn-primary" onClick={() => navigate('/incidencias')} style={{ marginTop: '16px' }}>
          Volver a incidencias
        </button>
      </div>
    )
  }

  // Estados disponibles para el cambio
  const estadosDisponibles = getEstadosDisponibles()

  return (
    <div>
      {/* ============================================
          HEADER DEL DETALLE
          ============================================ */}
      <div className="detail-header">
        <div className="detail-header-left">
          {/* Botón para volver a la lista */}
          <button
            className="detail-back-btn"
            onClick={() => navigate('/incidencias')}
            title="Volver a incidencias"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          {/* Código de la incidencia */}
          <div>
            <div className="detail-code">{incidencia.codigo}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Registrada el {formatDate(incidencia.creadoEn || incidencia.created_at)}
            </div>
          </div>
        </div>
        {/* Badges de estado y prioridad + botón cambiar estado */}
        <div className="detail-badges">
          <Badge type="estado" value={incidencia.estado} />
          <Badge type="prioridad" value={incidencia.prioridad} />
          {/* Mostrar botón solo si hay estados disponibles para cambiar */}
          {estadosDisponibles.length > 0 && (
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
              style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={16} />
              Cambiar Estado
            </button>
          )}
        </div>
      </div>

      {/* ============================================
          GRID DE INFORMACIÓN
          ============================================ */}
      <div className="detail-grid">
        {/* --- COLUMNA IZQUIERDA --- */}
        <div>
          {/* Descripción completa */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title">
                <FileText size={18} />
                Descripción del Reporte
              </h2>
            </div>
            <div className="content-card-body">
              <p style={{ lineHeight: '1.7', color: 'var(--text-primary)' }}>
                {incidencia.descripcion}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title">
                <MapPin size={18} />
                Ubicación
              </h2>
            </div>
            <div className="content-card-body">
              {/* Mostrar cada campo de ubicación en filas */}
              <div className="info-row">
                <span className="info-label">Dirección</span>
                <span className="info-value">{incidencia.ubicacion?.direccion || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Referencia</span>
                <span className="info-value">{incidencia.ubicacion?.referencia || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Distrito</span>
                <span className="info-value">{incidencia.ubicacion?.distrito || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Coordenadas</span>
                <span className="info-value">
                  {incidencia.ubicacion?.latitud && incidencia.ubicacion?.longitud
                    ? `${incidencia.ubicacion.latitud}, ${incidencia.ubicacion.longitud}`
                    : '—'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Multimedia (fotos/videos adjuntos) */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title">
                <Image size={18} />
                Archivos Multimedia
              </h2>
            </div>
            <div className="content-card-body">
              {incidencia.multimedia?.length > 0 ? (
                <div className="media-gallery">
                  {/* Renderizar cada archivo multimedia */}
                  {incidencia.multimedia.map(media => (
                    <div key={media.id} className="media-item" title={`Archivo ${media.tipo}`}>
                      <img
                        src={media.miniaturaUrl || media.miniatura_url || media.url}
                        alt={`${media.tipo} adjunto a ${incidencia.codigo}`}
                        onError={e => {
                          // Si la imagen no carga, mostrar placeholder
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Mensaje cuando no hay archivos adjuntos
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                  No hay archivos multimedia adjuntos
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA --- */}
        <div>
          {/* Datos del reportante */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title">
                <User size={18} />
                Reportante
              </h2>
            </div>
            <div className="content-card-body">
              <div className="info-row">
                <span className="info-label">Nombre</span>
                <span className="info-value">{incidencia.usuario?.nombre}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Correo</span>
                <span className="info-value">{incidencia.usuario?.correo}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Rol</span>
                <span className="info-value" style={{ textTransform: 'capitalize' }}>
                  {incidencia.usuario?.rol}
                </span>
              </div>
            </div>
          </div>

          {/* Categoría y caso */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title">
                <Tag size={18} />
                Clasificación
              </h2>
            </div>
            <div className="content-card-body">
              <div className="info-row">
                <span className="info-label">Categoría</span>
                <span className="info-value">
                  <span className="category-cell">
                    <span className="category-dot" style={{ background: incidencia.categoria?.color }} />
                    {incidencia.categoria?.icono} {incidencia.categoria?.nombre}
                  </span>
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Caso</span>
                <span className="info-value">
                  {incidencia.caso
                    ? incidencia.caso.titulo
                    : <span style={{ color: 'var(--text-secondary)' }}>Sin caso asignado</span>
                  }
                </span>
              </div>
              {incidencia.area && (
                <div className="info-row">
                  <span className="info-label">Área</span>
                  <span className="info-value">{incidencia.area.nombre}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline de historial de estados */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">
                <Clock size={18} />
                Historial de Estados
              </h2>
            </div>
            <div className="content-card-body">
              {incidencia.historial?.length > 0 ? (
                <div className="timeline">
                  {/* Renderizar cada cambio de estado como un punto en la timeline */}
                  {incidencia.historial.map(entry => (
                    <div key={entry.id} className="timeline-item">
                      {/* Punto de color del estado nuevo */}
                      <div
                        className="timeline-dot"
                        style={{ background: getEstadoColor(entry.estadoNuevo || entry.estado_nuevo) }}
                      />
                      <div className="timeline-content">
                        {/* Título: transición de estado */}
                        <div className="timeline-title">
                          {(entry.estadoAnterior || entry.estado_anterior)
                            ? `${estadoLabels[entry.estadoAnterior || entry.estado_anterior]} → ${estadoLabels[entry.estadoNuevo || entry.estado_nuevo]}`
                            : estadoLabels[entry.estadoNuevo || entry.estado_nuevo]
                          }
                        </div>
                        {/* Fecha del cambio y quién lo hizo */}
                        <div className="timeline-date">
                          {formatDate(entry.creadoEn || entry.created_at)}
                          {' · '}
                          {entry.usuario?.nombre || 'Sistema'}
                        </div>
                        {/* Comentario del cambio (si existe) */}
                        {entry.comentario && (
                          <div className="timeline-comment">
                            {entry.comentario}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                  No hay historial de cambios registrado
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          MODAL DE CAMBIO DE ESTADO
          ============================================ */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setNuevoEstado('')
          setComentario('')
        }}
        title="Cambiar Estado de Incidencia"
        footer={
          <>
            {/* Botón cancelar */}
            <button
              className="btn-secondary"
              onClick={() => {
                setShowModal(false)
                setNuevoEstado('')
                setComentario('')
              }}
            >
              Cancelar
            </button>
            {/* Botón confirmar */}
            <button
              className="btn-primary"
              onClick={handleCambiarEstado}
              disabled={!nuevoEstado || updating}
            >
              {updating ? 'Guardando...' : 'Confirmar Cambio'}
            </button>
          </>
        }
      >
        {/* Información del estado actual */}
        <div style={{ marginBottom: '18px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '8px' }}>
            Estado actual:
          </p>
          <Badge type="estado" value={incidencia.estado} />
        </div>

        {/* Selector de nuevo estado */}
        <div className="form-group">
          <label className="form-label" htmlFor="nuevo-estado">
            Nuevo estado
          </label>
          <select
            id="nuevo-estado"
            className="form-select"
            value={nuevoEstado}
            onChange={e => setNuevoEstado(e.target.value)}
          >
            <option value="">Seleccionar estado...</option>
            {estadosDisponibles.map(estado => (
              <option key={estado} value={estado}>
                {estadoLabels[estado]}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de comentario */}
        <div className="form-group">
          <label className="form-label" htmlFor="comentario-estado">
            Comentario (opcional)
          </label>
          <textarea
            id="comentario-estado"
            className="form-textarea"
            placeholder="Escribe un comentario sobre este cambio de estado..."
            value={comentario}
            onChange={e => setComentario(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
