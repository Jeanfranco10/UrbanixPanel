/**
 * DetalleIncidencia.jsx — Vista completa de una incidencia individual
 * Con funcionalidad de agregar archivos multimedia
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  User,
  Tag,
  Image,
  Clock,
  RefreshCw,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react'
import { fetchIncidenciaById, updateEstadoIncidencia } from '../services/api'
import { apiFetch } from '../services/apiConfig'
import {
  estadoLabels,
  formatDate,
} from '../utils/constants'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

export default function DetalleIncidencia() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [incidencia, setIncidencia] = useState(null)
  const [loading, setLoading] = useState(true)

  // Modal cambiar estado
  const [showModal, setShowModal] = useState(false)
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [comentario, setComentario] = useState('')
  const [updating, setUpdating] = useState(false)

  // Modal agregar multimedia
  const [showModalMedia, setShowModalMedia] = useState(false)
  const [formMedia, setFormMedia] = useState({ url: '', tipo: 'foto', nombreArchivo: '' })
  const [savingMedia, setSavingMedia] = useState(false)

  useEffect(() => {
    loadIncidencia()
  }, [id])

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

  async function handleCambiarEstado() {
    if (!nuevoEstado) return
    setUpdating(true)
    try {
      await updateEstadoIncidencia(incidencia.id, nuevoEstado, comentario, user?.id)
      await loadIncidencia()
      setShowModal(false)
      setNuevoEstado('')
      setComentario('')
    } catch (error) {
      console.error('Error actualizando estado:', error)
    } finally {
      setUpdating(false)
    }
  }

  async function handleAgregarMedia() {
    if (!formMedia.url.trim()) return
    setSavingMedia(true)
    try {
      await apiFetch('/archivos', {
        method: 'POST',
        body: JSON.stringify({
          incidencia: { id: incidencia.id },
          tipo: formMedia.tipo,
          url: formMedia.url,
          nombreArchivo: formMedia.nombreArchivo || null,
        }),
      })
      await loadIncidencia()
      setShowModalMedia(false)
      setFormMedia({ url: '', tipo: 'foto', nombreArchivo: '' })
    } catch (error) {
      console.error('Error agregando multimedia:', error)
    } finally {
      setSavingMedia(false)
    }
  }

  async function handleEliminarMedia(mediaId) {
    try {
      await apiFetch(`/archivos/${mediaId}`, { method: 'DELETE' })
      await loadIncidencia()
    } catch (error) {
      console.error('Error eliminando archivo:', error)
    }
  }

  function getEstadosDisponibles() {
    const flujo = {
      pendiente: ['en_revision', 'rechazado'],
      en_revision: ['en_proceso', 'rechazado'],
      en_proceso: ['resuelto', 'rechazado'],
      resuelto: ['cerrado'],
      rechazado: [],
      cerrado: [],
    }
    return flujo[incidencia?.estado] || []
  }

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

  if (loading) {
    return <div className="empty-state"><div className="spinner" /></div>
  }

  if (!incidencia) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Incidencia no encontrada</div>
        <div className="empty-state-text">No se encontró una incidencia con el ID {id}</div>
        <button className="btn-primary" onClick={() => navigate('/incidencias')} style={{ marginTop: '16px' }}>
          Volver a incidencias
        </button>
      </div>
    )
  }

  const estadosDisponibles = getEstadosDisponibles()

  return (
    <div>
      {/* --- HEADER --- */}
      <div className="detail-header">
        <div className="detail-header-left">
          <button className="detail-back-btn" onClick={() => navigate('/incidencias')} title="Volver">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="detail-code">{incidencia.codigo}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Registrada el {formatDate(incidencia.creadoEn || incidencia.created_at)}
            </div>
          </div>
        </div>
        <div className="detail-badges">
          <Badge type="estado" value={incidencia.estado} />
          <Badge type="prioridad" value={incidencia.prioridad} />
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

      {/* --- GRID --- */}
      <div className="detail-grid">
        {/* COLUMNA IZQUIERDA */}
        <div>
          {/* Descripción */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title"><FileText size={18} />Descripción del Reporte</h2>
            </div>
            <div className="content-card-body">
              <p style={{ lineHeight: '1.7', color: 'var(--text-primary)' }}>{incidencia.descripcion}</p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title"><MapPin size={18} />Ubicación</h2>
            </div>
            <div className="content-card-body">
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
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Multimedia */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title"><Image size={18} />Archivos Multimedia</h2>
              <button
                onClick={() => setShowModalMedia(true)}
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: 'var(--accent-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                }}
              >
                <Plus size={14} />
                Agregar
              </button>
            </div>
            <div className="content-card-body">
              {incidencia.multimedia?.length > 0 ? (
                <div className="media-gallery">
                  {incidencia.multimedia.map(media => (
                    <div key={media.id} className="media-item" style={{ position: 'relative' }}>
                      <img
                        src={media.miniaturaUrl || media.miniatura_url || media.url}
                        alt={`${media.tipo} adjunto`}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      {/* Botón eliminar sobre la imagen */}
                      <button
                        onClick={() => handleEliminarMedia(media.id)}
                        title="Eliminar archivo"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(239,68,68,0.85)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                      {/* Tipo de archivo */}
                      <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'capitalize',
                      }}>
                        {media.tipo}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                  No hay archivos multimedia adjuntos
                </p>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div>
          {/* Reportante */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title"><User size={18} />Reportante</h2>
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
                <span className="info-value" style={{ textTransform: 'capitalize' }}>{incidencia.usuario?.rol}</span>
              </div>
            </div>
          </div>

          {/* Clasificación */}
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <div className="content-card-header">
              <h2 className="content-card-title"><Tag size={18} />Clasificación</h2>
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

          {/* Historial */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title"><Clock size={18} />Historial de Estados</h2>
            </div>
            <div className="content-card-body">
              {incidencia.historial?.length > 0 ? (
                <div className="timeline">
                  {incidencia.historial.map(entry => (
                    <div key={entry.id} className="timeline-item">
                      <div className="timeline-dot" style={{ background: getEstadoColor(entry.estadoNuevo || entry.estado_nuevo) }} />
                      <div className="timeline-content">
                        <div className="timeline-title">
                          {(entry.estadoAnterior || entry.estado_anterior)
                            ? `${estadoLabels[entry.estadoAnterior || entry.estado_anterior]} → ${estadoLabels[entry.estadoNuevo || entry.estado_nuevo]}`
                            : estadoLabels[entry.estadoNuevo || entry.estado_nuevo]
                          }
                        </div>
                        <div className="timeline-date">
                          {formatDate(entry.creadoEn || entry.created_at)}
                          {' · '}
                          {entry.usuario?.nombre || 'Sistema'}
                        </div>
                        {entry.comentario && (
                          <div className="timeline-comment">{entry.comentario}</div>
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
          MODAL CAMBIAR ESTADO
          ============================================ */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setNuevoEstado(''); setComentario('') }}
        title="Cambiar Estado de Incidencia"
        footer={
          <>
            <button className="btn-secondary" onClick={() => { setShowModal(false); setNuevoEstado(''); setComentario('') }}>Cancelar</button>
            <button className="btn-primary" onClick={handleCambiarEstado} disabled={!nuevoEstado || updating}>
              {updating ? 'Guardando...' : 'Confirmar Cambio'}
            </button>
          </>
        }
      >
        <div style={{ marginBottom: '18px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '8px' }}>Estado actual:</p>
          <Badge type="estado" value={incidencia.estado} />
        </div>
        <div className="form-group">
          <label className="form-label">Nuevo estado</label>
          <select className="form-select" value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
            <option value="">Seleccionar estado...</option>
            {estadosDisponibles.map(estado => (
              <option key={estado} value={estado}>{estadoLabels[estado]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Comentario (opcional)</label>
          <textarea
            className="form-textarea"
            placeholder="Escribe un comentario sobre este cambio de estado..."
            value={comentario}
            onChange={e => setComentario(e.target.value)}
          />
        </div>
      </Modal>

      {/* ============================================
          MODAL AGREGAR MULTIMEDIA
          ============================================ */}
      <Modal
        isOpen={showModalMedia}
        onClose={() => { setShowModalMedia(false); setFormMedia({ url: '', tipo: 'foto', nombreArchivo: '' }) }}
        title="Agregar Archivo Multimedia"
        footer={
          <>
            <button className="btn-secondary" onClick={() => { setShowModalMedia(false); setFormMedia({ url: '', tipo: 'foto', nombreArchivo: '' }) }}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleAgregarMedia} disabled={savingMedia || !formMedia.url.trim()}>
              {savingMedia ? 'Guardando...' : 'Agregar Archivo'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">URL del archivo *</label>
          <input
            className="form-input"
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formMedia.url}
            onChange={e => setFormMedia({ ...formMedia, url: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={formMedia.tipo} onChange={e => setFormMedia({ ...formMedia, tipo: e.target.value })}>
            <option value="foto">Foto</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre del archivo (opcional)</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ej: foto_bache.jpg"
            value={formMedia.nombreArchivo}
            onChange={e => setFormMedia({ ...formMedia, nombreArchivo: e.target.value })}
          />
        </div>

        {/* Preview de la imagen si es foto */}
        {formMedia.tipo === 'foto' && formMedia.url && (
          <div style={{ marginTop: '8px' }}>
            <label className="form-label">Vista previa</label>
            <img
              src={formMedia.url}
              alt="Preview"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}