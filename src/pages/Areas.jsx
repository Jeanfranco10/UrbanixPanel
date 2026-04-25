/**
 * Areas.jsx — Página de Áreas Municipales
 * Con funcionalidad de crear, editar y activar/desactivar
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  User,
  Briefcase,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { fetchAreas } from '../services/api'
import { apiFetch } from '../services/apiConfig'
import { estadoLabels } from '../utils/constants'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

export default function Areas() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])

  // Modal crear/editar
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)

  // Formulario
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    distritos: '',
    responsable: null,
    activo: true,
  })
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadAreas()
    loadUsuarios()
  }, [])

  async function loadAreas() {
    try {
      const data = await fetchAreas()
      setAreas(data)
    } catch (error) {
      console.error('Error cargando áreas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadUsuarios() {
    try {
      const data = await apiFetch('/usuarios')
      setUsuarios(data)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
  }

  function abrirCrear() {
    setEditando(null)
    setForm({ nombre: '', descripcion: '', distritos: '', responsable: null, activo: true })
    setShowModal(true)
  }

  function abrirEditar(area) {
    setEditando(area)
    setForm({
      nombre: area.nombre || '',
      descripcion: area.descripcion || '',
      distritos: area.distritos?.join(', ') || '',
      responsable: area.responsable?.id || null,
      activo: area.activo ?? true,
    })
    setShowModal(true)
  }

  function cerrarModal() {
    setShowModal(false)
    setEditando(null)
  }

  async function handleGuardar() {
    if (!form.nombre.trim()) return
    setSaving(true)

    // Convertir distritos de string a array
    const distritosArray = form.distritos
      ? form.distritos.split(',').map(d => d.trim()).filter(d => d)
      : []

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      distritos: distritosArray,
      responsable: form.responsable ? { id: parseInt(form.responsable) } : null,
      activo: form.activo,
    }

    try {
      if (editando) {
        await apiFetch(`/areas/${editando.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch('/areas', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      await loadAreas()
      cerrarModal()
    } catch (error) {
      console.error('Error guardando área:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActivo(area) {
    try {
      await apiFetch(`/areas/${area.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: !area.activo }),
      })
      await loadAreas()
    } catch (error) {
      console.error('Error actualizando estado:', error)
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
          <h1 className="page-title">Áreas Municipales</h1>
          <p className="page-subtitle">
            Organización territorial y departamental — {areas.length} áreas registradas
          </p>
        </div>
        <button className="btn-primary" onClick={abrirCrear} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          Nueva Área
        </button>
      </div>

      {/* --- GRID DE CARDS --- */}
      <div className="areas-grid">
        {areas.map(area => (
          <div key={area.id} className="area-card" style={{ opacity: area.activo ? 1 : 0.6 }}>

            {/* Cabecera con nombre y botones */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div className="area-card-name">
                <MapPin
                  size={18}
                  style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px', color: 'var(--accent-primary)' }}
                />
                {area.nombre}
              </div>
              {/* Botones editar y toggle */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => abrirEditar(area)}
                  title="Editar"
                  style={btnIconStyle('#3b82f6')}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleToggleActivo(area)}
                  title={area.activo ? 'Desactivar' : 'Activar'}
                  style={btnIconStyle(area.activo ? '#10b981' : '#6b7280')}
                >
                  {area.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
              </div>
            </div>

            {/* Badge activo/inactivo */}
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                background: area.activo ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                color: area.activo ? '#10b981' : '#6b7280',
              }}>
                {area.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Responsable */}
            <div className="area-card-responsable">
              <User size={14} />
              Responsable: <strong>{area.responsable?.nombre || 'No asignado'}</strong>
            </div>

            {/* Descripción */}
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
              {area.descripcion}
            </p>

            {/* Distritos */}
            <div className="area-card-distritos">
              {area.distritos?.map(distrito => (
                <span key={distrito} className="distrito-tag">📍 {distrito}</span>
              ))}
            </div>

            {/* Estadísticas */}
            <div className="area-stats">
              <div className="area-stat">
                <div className="area-stat-value">{area.totalCasos}</div>
                <div className="area-stat-label">Total Casos</div>
              </div>
              <div className="area-stat">
                <div className="area-stat-value" style={{ color: 'var(--accent-primary)' }}>
                  {area.casosActivos}
                </div>
                <div className="area-stat-label">Activos</div>
              </div>
            </div>

            {/* Casos asociados */}
            {area.casos?.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} />
                  Casos asociados
                </div>
                {area.casos.map(caso => (
                  <div
                    key={caso.id}
                    className="list-item"
                    style={{ cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => navigate('/casos')}
                  >
                    <div className="list-item-info">
                      <div className="list-item-title" style={{ fontSize: 'var(--font-size-sm)' }}>{caso.titulo}</div>
                      <div className="list-item-subtitle">{caso.totalReportes || caso.total_reportes} reportes</div>
                    </div>
                    <div className="list-item-badge">
                      <Badge type="estado" value={caso.estado} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sin áreas */}
      {areas.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Sin áreas registradas</div>
          <div className="empty-state-text">Crea la primera área con el botón de arriba</div>
        </div>
      )}

      {/* ============================================
          MODAL CREAR / EDITAR
          ============================================ */}
      <Modal
        isOpen={showModal}
        onClose={cerrarModal}
        title={editando ? 'Editar Área Municipal' : 'Nueva Área Municipal'}
        footer={
          <>
            <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
            <button className="btn-primary" onClick={handleGuardar} disabled={saving || !form.nombre.trim()}>
              {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Área'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ej: Área de Infraestructura"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-textarea"
            placeholder="Descripción del área..."
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Distritos (separados por coma)</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ej: Miraflores, San Isidro, Surco"
            value={form.distritos}
            onChange={e => setForm({ ...form, distritos: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Responsable</label>
          <select
            className="form-select"
            value={form.responsable || ''}
            onChange={e => setForm({ ...form, responsable: e.target.value || null })}
          >
            <option value="">Sin responsable</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.activo}
              onChange={e => setForm({ ...form, activo: e.target.checked })}
            />
            <span className="form-label" style={{ margin: 0 }}>Área activa</span>
          </label>
        </div>
      </Modal>
    </div>
  )
}

function btnIconStyle(color) {
  return {
    background: `${color}20`,
    color: color,
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}