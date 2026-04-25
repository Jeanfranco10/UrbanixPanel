/**
 * Ubicaciones.jsx — Gestión de Ubicaciones
 * CRUD completo: listar, crear, editar y eliminar
 */

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { apiFetch } from '../services/apiConfig'
import Modal from '../components/ui/Modal'

export default function Ubicaciones() {
    const [ubicaciones, setUbicaciones] = useState([])
    const [loading, setLoading] = useState(true)

    // Modal crear/editar
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)

    // Formulario
    const [form, setForm] = useState({
        latitud: '',
        longitud: '',
        direccion: '',
        referencia: '',
        distrito: '',
        ciudad: 'Lima',
        pais: 'Perú',
    })
    const [saving, setSaving] = useState(false)

    // Modal confirmar eliminación
    const [showConfirm, setShowConfirm] = useState(false)
    const [eliminandoId, setEliminandoId] = useState(null)

    useEffect(() => {
        loadUbicaciones()
    }, [])

    async function loadUbicaciones() {
        try {
            const data = await apiFetch('/ubicaciones')
            setUbicaciones(data)
        } catch (error) {
            console.error('Error cargando ubicaciones:', error)
        } finally {
            setLoading(false)
        }
    }

    function abrirCrear() {
        setEditando(null)
        setForm({ latitud: '', longitud: '', direccion: '', referencia: '', distrito: '', ciudad: 'Lima', pais: 'Perú' })
        setShowModal(true)
    }

    function abrirEditar(ubicacion) {
        setEditando(ubicacion)
        setForm({
            latitud: ubicacion.latitud || '',
            longitud: ubicacion.longitud || '',
            direccion: ubicacion.direccion || '',
            referencia: ubicacion.referencia || '',
            distrito: ubicacion.distrito || '',
            ciudad: ubicacion.ciudad || 'Lima',
            pais: ubicacion.pais || 'Perú',
        })
        setShowModal(true)
    }

    function cerrarModal() {
        setShowModal(false)
        setEditando(null)
    }

    async function handleGuardar() {
        if (!form.latitud || !form.longitud) return
        setSaving(true)
        try {
            if (editando) {
                await apiFetch(`/ubicaciones/${editando.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(form),
                })
            } else {
                await apiFetch('/ubicaciones', {
                    method: 'POST',
                    body: JSON.stringify(form),
                })
            }
            await loadUbicaciones()
            cerrarModal()
        } catch (error) {
            console.error('Error guardando ubicación:', error)
        } finally {
            setSaving(false)
        }
    }

    function confirmarEliminar(id) {
        setEliminandoId(id)
        setShowConfirm(true)
    }

    async function handleEliminar() {
        try {
            await apiFetch(`/ubicaciones/${eliminandoId}`, { method: 'DELETE' })
            await loadUbicaciones()
        } catch (error) {
            console.error('Error eliminando ubicación:', error)
        } finally {
            setShowConfirm(false)
            setEliminandoId(null)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Ubicaciones</h1>
                    <p className="page-subtitle">{ubicaciones.length} ubicaciones registradas</p>
                </div>
                <button className="btn-primary" onClick={abrirCrear} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} />
                    Nueva Ubicación
                </button>
            </div>

            {/* --- TABLA --- */}
            <div className="content-card">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Dirección</th>
                            <th style={thStyle}>Distrito</th>
                            <th style={thStyle}>Ciudad</th>
                            <th style={thStyle}>Coordenadas</th>
                            <th style={thStyle}>Referencia</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ubicaciones.map(u => (
                            <tr key={u.id}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                        <strong>{u.direccion || '—'}</strong>
                                    </div>
                                </td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{u.distrito || '—'}</td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{u.ciudad}</td>
                                <td style={{ ...tdStyle, fontSize: 'var(--font-size-xs)', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                                    {u.latitud && u.longitud ? `${u.latitud}, ${u.longitud}` : '—'}
                                </td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    {u.referencia || '—'}
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => abrirEditar(u)} title="Editar" style={btnIconStyle('#3b82f6')}>
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => confirmarEliminar(u.id)} title="Eliminar" style={btnIconStyle('#ef4444')}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {ubicaciones.length === 0 && (
                    <div className="empty-state">
                        <MapPin size={40} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
                        <div className="empty-state-title">Sin ubicaciones</div>
                        <div className="empty-state-text">Crea la primera ubicación con el botón de arriba</div>
                    </div>
                )}
            </div>

            {/* ============================================
          MODAL CREAR / EDITAR
          ============================================ */}
            <Modal
                isOpen={showModal}
                onClose={cerrarModal}
                title={editando ? 'Editar Ubicación' : 'Nueva Ubicación'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                        <button
                            className="btn-primary"
                            onClick={handleGuardar}
                            disabled={saving || !form.latitud || !form.longitud}
                        >
                            {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Ubicación'}
                        </button>
                    </>
                }
            >
                {/* Coordenadas */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Latitud *</label>
                        <input
                            className="form-input"
                            type="number"
                            step="0.0000001"
                            placeholder="Ej: -12.0464"
                            value={form.latitud}
                            onChange={e => setForm({ ...form, latitud: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Longitud *</label>
                        <input
                            className="form-input"
                            type="number"
                            step="0.0000001"
                            placeholder="Ej: -77.0428"
                            value={form.longitud}
                            onChange={e => setForm({ ...form, longitud: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Ej: Av. Arequipa 123"
                        value={form.direccion}
                        onChange={e => setForm({ ...form, direccion: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Referencia</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Ej: Frente al parque"
                        value={form.referencia}
                        onChange={e => setForm({ ...form, referencia: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Distrito</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Ej: Miraflores"
                        value={form.distrito}
                        onChange={e => setForm({ ...form, distrito: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Ciudad</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Lima"
                            value={form.ciudad}
                            onChange={e => setForm({ ...form, ciudad: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">País</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Perú"
                            value={form.pais}
                            onChange={e => setForm({ ...form, pais: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>

            {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
          ============================================ */}
            <Modal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Eliminar Ubicación"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
                        <button
                            onClick={handleEliminar}
                            style={{ ...btnIconStyle('#ef4444'), padding: '8px 20px', borderRadius: '8px', fontWeight: 600 }}
                        >
                            Eliminar
                        </button>
                    </>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    ¿Estás seguro que deseas eliminar esta ubicación? Si está asociada a incidencias o casos podría causar errores.
                </p>
            </Modal>
        </div>
    )
}

// --- Estilos inline ---
const thStyle = {
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
}

const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-light)',
    fontSize: 'var(--font-size-sm)',
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