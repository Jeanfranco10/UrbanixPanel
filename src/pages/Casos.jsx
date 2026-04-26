/**
 * Casos.jsx — Página de gestión de casos
 * Con funcionalidad de crear y editar casos
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  Users,
  Camera,
  Calendar,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import { fetchCasos } from '../services/api'
import { apiFetch } from '../services/apiConfig'
import {
  estadoLabels,
  prioridadLabels,
  formatDate,
  formatDateShort,
} from '../utils/constants'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

export default function Casos() {
  const [casos, setCasos] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [filterEstado, setFilterEstado] = useState('')
  const [filterPrioridad, setFilterPrioridad] = useState('')

  // Datos para los selects del formulario
  const [categorias, setCategorias] = useState([])
  const [areas, setAreas] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])

  // Modal crear/editar
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'media',
    categoria: '',
    area: '',
    ubicacion: '',
    radioMetros: 200,
  })
  const [saving, setSaving] = useState(false)

  // Modal confirmar eliminación
  const [showConfirm, setShowConfirm] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    loadCasos()
    loadFormData()
  }, [])

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

  async function loadFormData() {
    try {
      const [cats, ars, ubics] = await Promise.all([
        apiFetch('/categorias'),
        apiFetch('/areas'),
        apiFetch('/ubicaciones'),
      ])
      setCategorias(cats)
      setAreas(ars)
      setUbicaciones(ubics)
    } catch (error) {
      console.error('Error cargando datos del formulario:', error)
    }
  }

  function toggleExpanded(casoId) {
    setExpandedId(prev => prev === casoId ? null : casoId)
  }

  function abrirCrear() {
    setEditando(null)
    setForm({
      titulo: '',
      descripcion: '',
      estado: 'pendiente',
      prioridad: 'media',
      categoria: '',
      area: '',
      ubicacion: '',
      radioMetros: 200,
    })
    setShowModal(true)
  }

  function abrirEditar(caso, e) {
    e.stopPropagation() // Evitar que se expanda/contraiga el caso
    setEditando(caso)
    setForm({
      titulo: caso.titulo || '',
      descripcion: caso.descripcion || '',
      estado: caso.estado || 'pendiente',
      prioridad: caso.prioridad || 'media',
      categoria: caso.categoria?.id || '',
      area: caso.area?.id || '',
      ubicacion: caso.ubicacion?.id || '',
      radioMetros: caso.radioMetros || 200,
    })
    setShowModal(true)
  }

  function cerrarModal() {
    setShowModal(false)
    setEditando(null)
  }

  function confirmarEliminar(id, e) {
    e.stopPropagation()
    setEliminandoId(id)
    setShowConfirm(true)
  }

  async function handleEliminar() {
    try {
      await apiFetch(`/casos/${eliminandoId}`, { method: 'DELETE' })
      await loadCasos()
    } catch (error) {
      console.error('Error eliminando caso:', error)
    } finally {
      setShowConfirm(false)
      setEliminandoId(null)
    }
  }

  async function handleGuardar() {
    if (!form.titulo.trim() || !form.categoria) return
    setSaving(true)

    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      estado: form.estado,
      prioridad: form.prioridad,
      categoria: { id: parseInt(form.categoria) },
      area: form.area ? { id: parseInt(form.area) } : null,
      ubicacion: form.ubicacion ? { id: parseInt(form.ubicacion) } : null,
      radioMetros: parseInt(form.radioMetros),
    }

    try {
      if (editando) {
        await apiFetch(`/casos/${editando.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch('/casos', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      await loadCasos()
      cerrarModal()
    } catch (error) {
      console.error('Error guardando caso:', error)
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    let result = [...casos]
    if (filterEstado) result = result.filter(c => c.estado === filterEstado)
    if (filterPrioridad) result = result.filter(c => c.prioridad === filterPrioridad)
    return result
  }, [casos, filterEstado, filterPrioridad])

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 className="page-title">Gestión de Casos</h1>
          <p className="page-subtitle">
            Casos que agrupan incidencias relacionadas — {casos.length} casos totales
          </p>
        </div>
        <button className="btn-primary" onClick={abrirCrear} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          Nuevo Caso
        </button>
      </div>

      {/* --- FILTROS --- */}
      <div className="filters-bar">
        <select className="filter-select" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select className="filter-select" value={filterPrioridad} onChange={e => setFilterPrioridad(e.target.value)}>
          <option value="">Todas las prioridades</option>
          {Object.entries(prioridadLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* --- LISTA DE CASOS --- */}
      {filtered.map(caso => {
        const isExpanded = expandedId === caso.id

        return (
          <div key={caso.id} className="caso-card">
            {/* Header del caso */}
            <div className="caso-card-header" onClick={() => toggleExpanded(caso.id)}>
              <div className="caso-card-info">
                <div style={{ flex: 1 }}>
                  <div className="caso-card-title">{caso.titulo}</div>
                  <div className="caso-card-meta">
                    {caso.area?.nombre || 'Sin área'}
                    {' · '}
                    {caso.totalReportes || caso.total_reportes} reportes
                    {' · '}
                    {formatDateShort(caso.creadoEn || caso.created_at)}
                  </div>
                </div>
                <Badge type="estado" value={caso.estado} />
                <Badge type="prioridad" value={caso.prioridad} />

                {/* Botón editar */}
                <button
                  onClick={(e) => abrirEditar(caso, e)}
                  title="Editar caso"
                  style={{
                    background: 'rgba(59,130,246,0.15)',
                    color: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px',
                  }}
                >
                  <Pencil size={14} />
                </button>
                {/* Botón eliminar */}
                <button
                  onClick={(e) => confirmarEliminar(caso.id, e)}
                  title="Eliminar caso"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {isExpanded
                ? <ChevronUp size={20} style={{ color: 'var(--text-secondary)' }} />
                : <ChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
              }
            </div>

            {/* Body expandible */}
            {isExpanded && (
              <div className="caso-card-body">
                <div style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.6', borderBottom: '1px solid var(--border-light)' }}>
                  {caso.descripcion}
                </div>

                {/* Incidencias */}
                <div className="content-card" style={{ marginTop: '16px' }}>
                  <div className="content-card-header">
                    <h3 className="content-card-title">
                      <AlertTriangle size={16} />
                      Incidencias Relacionadas ({caso.incidencias?.length || 0})
                    </h3>
                  </div>
                  <div className="content-card-body" style={{ padding: 0 }}>
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
                          <tr key={inc.id} className="clickable" onClick={() => navigate(`/incidencias/${inc.id}`)}>
                            <td><span className="incident-code">{inc.codigo}</span></td>
                            <td style={{ maxWidth: '300px' }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
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

                {/* Asignaciones */}
                {caso.asignaciones?.length > 0 && (
                  <div className="content-card" style={{ marginTop: '16px' }}>
                    <div className="content-card-header">
                      <h3 className="content-card-title"><Users size={16} />Asignaciones</h3>
                    </div>
                    <div className="content-card-body">
                      {caso.asignaciones.map(asig => {
                        const inspectorNombre = asig.asignadoA?.nombre || asig.inspector?.nombre || 'Inspector'
                        const inspectorInicial = inspectorNombre.charAt(0)
                        const asignadorNombre = asig.asignadoPor?.nombre || asig.asignador?.nombre || '—'
                        const estaCompletada = asig.activo === false || asig.estado === 'completada'
                        return (
                          <div key={asig.id} className="assignment-card">
                            <div className="assignment-avatar">{inspectorInicial}</div>
                            <div className="assignment-info">
                              <div className="assignment-name">{inspectorNombre}</div>
                              <div className="assignment-detail">Asignado por {asignadorNombre}{asig.notas && ` · ${asig.notas}`}</div>
                            </div>
                            <div className="assignment-date">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} />
                                Límite: {formatDateShort(asig.fechaLimite || asig.fecha_limite)}
                              </div>
                              <div style={{ marginTop: '4px' }}>
                                <span className="badge" style={{ background: estaCompletada ? 'var(--estado-resuelto-bg)' : 'var(--estado-en-proceso-bg)', color: estaCompletada ? 'var(--estado-resuelto)' : 'var(--estado-en-proceso)' }}>
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

                {/* Evidencia */}
                {caso.evidencia?.length > 0 && (
                  <div className="content-card" style={{ marginTop: '16px' }}>
                    <div className="content-card-header">
                      <h3 className="content-card-title"><Camera size={16} />Evidencia de Resolución</h3>
                    </div>
                    <div className="content-card-body">
                      {caso.evidencia.map(ev => {
                        const inspectorNombre = ev.inspector?.nombre || ev.inspectorId || '—'
                        return (
                          <div key={ev.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                            <div style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--border-color)', flexShrink: 0 }}>
                              <img src={ev.url} alt="Evidencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--text-primary)', marginBottom: '4px' }}>Evidencia fotográfica</div>
                              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>{ev.descripcion}</div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Subido por {inspectorNombre} · {formatDate(ev.creadoEn || ev.created_at)}</div>
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

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Sin casos</div>
          <div className="empty-state-text">No se encontraron casos con los filtros seleccionados</div>
        </div>
      )}

      {/* ============================================
          MODAL CREAR / EDITAR
          ============================================ */}
      <Modal
        isOpen={showModal}
        onClose={cerrarModal}
        title={editando ? 'Editar Caso' : 'Nuevo Caso'}
        footer={
          <>
            <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button className="btn-primary" onClick={handleGuardar} disabled={saving || !form.titulo.trim() || !form.categoria}>
              {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Caso'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Título *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ej: Baches en Av. Arequipa"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-textarea"
            placeholder="Descripción del caso..."
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Estado</label>
            <select className="form-select" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
              {Object.entries(estadoLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Prioridad</label>
            <select className="form-select" value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })}>
              {Object.entries(prioridadLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Categoría *</label>
          <select className="form-select" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
            <option value="">Seleccionar categoría...</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Área Municipal</label>
          <select className="form-select" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
            <option value="">Sin área asignada</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>{area.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Ubicación</label>
          <select className="form-select" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })}>
            <option value="">Sin ubicación</option>
            {ubicaciones.map(u => (
              <option key={u.id} value={u.id}>{u.direccion || `${u.latitud}, ${u.longitud}`}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Radio en metros</label>
          <input
            className="form-input"
            type="number"
            min="50"
            max="2000"
            value={form.radioMetros}
            onChange={e => setForm({ ...form, radioMetros: e.target.value })}
          />
        </div>
      </Modal>

      {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
          ============================================ */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Eliminar Caso"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button
              onClick={handleEliminar}
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
            >
              Eliminar
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          ¿Estás seguro que deseas eliminar este caso? Las incidencias asociadas quedarán sin caso asignado.
        </p>
      </Modal>
    </div>
  )
}