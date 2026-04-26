/**
 * Incidencias.jsx — Página de lista de incidencias
 * Con funcionalidad de crear y editar
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Pencil } from 'lucide-react'
import { fetchIncidencias, fetchCategorias } from '../services/api'
import { apiFetch } from '../services/apiConfig'
import {
  estadoLabels,
  prioridadLabels,
  formatDateShort,
} from '../utils/constants'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const ITEMS_PER_PAGE = 10

export default function Incidencias() {
  const [incidencias, setIncidencias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterPrioridad, setFilterPrioridad] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Datos para formulario
  const [usuarios, setUsuarios] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])
  const [casos, setCasos] = useState([])

  // Modal crear/editar
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'media',
    categoria: '',
    usuario: '',
    ubicacion: '',
    caso: '',
  })
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadData()
    loadFormData()
  }, [])

  async function loadData() {
    try {
      const [incData, catData] = await Promise.all([
        fetchIncidencias(),
        fetchCategorias(),
      ])
      setIncidencias(incData)
      setCategorias(catData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadFormData() {
    try {
      const [usrs, ubics, css] = await Promise.all([
        apiFetch('/usuarios'),
        apiFetch('/ubicaciones'),
        apiFetch('/casos'),
      ])
      setUsuarios(usrs)
      setUbicaciones(ubics)
      setCasos(css)
    } catch (error) {
      console.error('Error cargando datos del formulario:', error)
    }
  }

  const filtered = useMemo(() => {
    let result = [...incidencias]
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(inc =>
        inc.codigo?.toLowerCase().includes(searchLower) ||
        inc.descripcion?.toLowerCase().includes(searchLower) ||
        inc.usuario?.nombre?.toLowerCase().includes(searchLower)
      )
    }
    if (filterEstado) result = result.filter(inc => inc.estado === filterEstado)
    if (filterPrioridad) result = result.filter(inc => inc.prioridad === filterPrioridad)
    if (filterCategoria) {
      result = result.filter(inc => {
        const catId = inc.categoria?.id || inc.categoriaId
        return catId === Number(filterCategoria)
      })
    }
    return result
  }, [incidencias, search, filterEstado, filterPrioridad, filterCategoria])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterEstado, filterPrioridad, filterCategoria])

  function abrirCrear() {
    setEditando(null)
    setForm({ descripcion: '', estado: 'pendiente', prioridad: 'media', categoria: '', usuario: '', ubicacion: '', caso: '' })
    setShowModal(true)
  }

  function abrirEditar(inc, e) {
    e.stopPropagation()
    setEditando(inc)
    setForm({
      descripcion: inc.descripcion || '',
      estado: inc.estado || 'pendiente',
      prioridad: inc.prioridad || 'media',
      categoria: inc.categoria?.id || '',
      usuario: inc.usuario?.id || '',
      ubicacion: inc.ubicacion?.id || '',
      caso: inc.caso?.id || '',
    })
    setShowModal(true)
  }

  function cerrarModal() {
    setShowModal(false)
    setEditando(null)
  }

  async function handleGuardar() {
    if (!form.descripcion.trim() || !form.categoria || !form.usuario || !form.ubicacion) return
    setSaving(true)

    const payload = {
      descripcion: form.descripcion,
      estado: form.estado,
      prioridad: form.prioridad,
      categoria: { id: parseInt(form.categoria) },
      usuario: { id: parseInt(form.usuario) },
      ubicacion: { id: parseInt(form.ubicacion) },
      caso: form.caso ? { id: parseInt(form.caso) } : null,
    }

    try {
      if (editando) {
        await apiFetch(`/incidencias/${editando.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            descripcion: form.descripcion,
            estado: form.estado,
            prioridad: form.prioridad,
          }),
        })
      } else {
        await apiFetch('/incidencias', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      await loadData()
      cerrarModal()
    } catch (error) {
      console.error('Error guardando incidencia:', error)
    } finally {
      setSaving(false)
    }
  }

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
          <h1 className="page-title">Incidencias</h1>
          <p className="page-subtitle">
            Gestión completa de reportes ciudadanos — {incidencias.length} registros totales
          </p>
        </div>
        <button className="btn-primary" onClick={abrirCrear} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          Nueva Incidencia
        </button>
      </div>

      {/* --- FILTROS --- */}
      <div className="filters-bar">
        <div className="filter-search">
          <Search size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por código, descripción o usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
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
        <select className="filter-select" value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icono} {cat.nombre}</option>
          ))}
        </select>
      </div>

      {/* --- TABLA --- */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Usuario</th>
              <th>Categoría</th>
              <th>Caso</th>
              <th>Área Municipal</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(inc => (
              <tr
                key={inc.id}
                className="clickable"
                onClick={() => navigate(`/incidencias/${inc.id}`)}
                title={`Ver detalle de ${inc.codigo}`}
              >
                <td><span className="incident-code">{inc.codigo}</span></td>
                <td>{inc.usuario?.nombre || '—'}</td>
                <td>
                  <div className="category-cell">
                    <span className="category-dot" style={{ background: inc.categoria?.color }} />
                    {inc.categoria?.nombre}
                  </div>
                </td>
                <td>
                  {inc.caso
                    ? <span style={{ fontSize: 'var(--font-size-sm)' }}>{inc.caso.titulo}</span>
                    : <span style={{ color: 'var(--text-secondary)' }}>—</span>
                  }
                </td>
                <td>
                  {inc.area
                    ? inc.area.nombre
                    : <span style={{ color: 'var(--text-secondary)' }}>—</span>
                  }
                </td>
                <td><Badge type="estado" value={inc.estado} /></td>
                <td><Badge type="prioridad" value={inc.prioridad} /></td>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {formatDateShort(inc.creadoEn || inc.created_at)}
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => abrirEditar(inc, e)}
                    title="Editar incidencia"
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
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <Filter size={48} className="empty-state-icon" />
                    <div className="empty-state-title">Sin resultados</div>
                    <div className="empty-state-text">No se encontraron incidencias con los filtros seleccionados</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* --- PAGINACIÓN --- */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <span>
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              {' - '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              {' de '}
              {filtered.length}
            </span>
            <div className="pagination-buttons">
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} className={`pagination-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              ))}
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================
          MODAL CREAR / EDITAR
          ============================================ */}
      <Modal
        isOpen={showModal}
        onClose={cerrarModal}
        title={editando ? 'Editar Incidencia' : 'Nueva Incidencia'}
        footer={
          <>
            <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button
              className="btn-primary"
              onClick={handleGuardar}
              disabled={saving || !form.descripcion.trim() || !form.categoria || (!editando && (!form.usuario || !form.ubicacion))}
            >
              {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Incidencia'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Descripción *</label>
          <textarea
            className="form-textarea"
            placeholder="Describe la incidencia..."
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
          <select
            className="form-select"
            value={form.categoria}
            onChange={e => setForm({ ...form, categoria: e.target.value })}
            disabled={!!editando}
          >
            <option value="">Seleccionar categoría...</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Solo mostrar estos campos al crear */}
        {!editando && (
          <>
            <div className="form-group">
              <label className="form-label">Usuario Reportante *</label>
              <select className="form-select" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })}>
                <option value="">Seleccionar usuario...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre} ({u.correo})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación *</label>
              <select className="form-select" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })}>
                <option value="">Seleccionar ubicación...</option>
                {ubicaciones.map(u => (
                  <option key={u.id} value={u.id}>{u.direccion || `${u.latitud}, ${u.longitud}`}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Caso asociado</label>
              <select className="form-select" value={form.caso} onChange={e => setForm({ ...form, caso: e.target.value })}>
                <option value="">Sin caso</option>
                {casos.map(c => (
                  <option key={c.id} value={c.id}>{c.titulo}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}