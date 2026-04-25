/**
 * Categorias.jsx — Gestión de Categorías
 *
 * Permite listar, crear, editar y eliminar categorías
 * desde el panel de administración.
 */

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { apiFetch } from '../services/apiConfig'
import Modal from '../components/ui/Modal'

export default function Categorias() {
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)

    // Modal crear/editar
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null) // null = crear, objeto = editar

    // Formulario
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        icono: '',
        color: '#6366f1',
        activo: true,
    })

    const [saving, setSaving] = useState(false)

    // Modal confirmar eliminación
    const [showConfirm, setShowConfirm] = useState(false)
    const [eliminandoId, setEliminandoId] = useState(null)

    useEffect(() => {
        loadCategorias()
    }, [])

    async function loadCategorias() {
        try {
            const data = await apiFetch('/categorias')
            setCategorias(data)
        } catch (error) {
            console.error('Error cargando categorías:', error)
        } finally {
            setLoading(false)
        }
    }

    function abrirCrear() {
        setEditando(null)
        setForm({ nombre: '', descripcion: '', icono: '', color: '#6366f1', activo: true })
        setShowModal(true)
    }

    function abrirEditar(cat) {
        setEditando(cat)
        setForm({
            nombre: cat.nombre || '',
            descripcion: cat.descripcion || '',
            icono: cat.icono || '',
            color: cat.color || '#6366f1',
            activo: cat.activo ?? true,
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
        try {
            if (editando) {
                // Editar — PATCH
                await apiFetch(`/categorias/${editando.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(form),
                })
            } else {
                // Crear — POST
                await apiFetch('/categorias', {
                    method: 'POST',
                    body: JSON.stringify(form),
                })
            }
            await loadCategorias()
            cerrarModal()
        } catch (error) {
            console.error('Error guardando categoría:', error)
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
            await apiFetch(`/categorias/${eliminandoId}`, { method: 'DELETE' })
            await loadCategorias()
        } catch (error) {
            console.error('Error eliminando categoría:', error)
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
                    <h1 className="page-title">Categorías</h1>
                    <p className="page-subtitle">{categorias.length} categorías registradas</p>
                </div>
                <button className="btn-primary" onClick={abrirCrear} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} />
                    Nueva Categoría
                </button>
            </div>

            {/* --- TABLA --- */}
            <div className="content-card">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Categoría</th>
                            <th style={thStyle}>Descripción</th>
                            <th style={thStyle}>Icono</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map(cat => (
                            <tr key={cat.id} style={trStyle}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: cat.color || '#6366f1',
                                                display: 'inline-block',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <strong>{cat.nombre}</strong>
                                    </div>
                                </td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    {cat.descripcion || '—'}
                                </td>
                                <td style={tdStyle}>{cat.icono || '—'}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: '999px',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 600,
                                        background: cat.activo ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                                        color: cat.activo ? '#10b981' : '#6b7280',
                                    }}>
                                        {cat.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => abrirEditar(cat)}
                                            title="Editar"
                                            style={btnIconStyle('#3b82f6')}
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => confirmarEliminar(cat.id)}
                                            title="Eliminar"
                                            style={btnIconStyle('#ef4444')}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categorias.length === 0 && (
                    <div className="empty-state">
                        <Tag size={40} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
                        <div className="empty-state-title">Sin categorías</div>
                        <div className="empty-state-text">Crea la primera categoría con el botón de arriba</div>
                    </div>
                )}
            </div>

            {/* ============================================
          MODAL CREAR / EDITAR
          ============================================ */}
            <Modal
                isOpen={showModal}
                onClose={cerrarModal}
                title={editando ? 'Editar Categoría' : 'Nueva Categoría'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                        <button className="btn-primary" onClick={handleGuardar} disabled={saving || !form.nombre.trim()}>
                            {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Ej: Bache en pista"
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Descripción de la categoría..."
                        value={form.descripcion}
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Icono</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Ej: road"
                            value={form.icono}
                            onChange={e => setForm({ ...form, icono: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Color</label>
                        <input
                            type="color"
                            value={form.color}
                            onChange={e => setForm({ ...form, color: e.target.value })}
                            style={{
                                width: '48px',
                                height: '38px',
                                border: '1px solid var(--border-light)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: 'transparent',
                                padding: '2px',
                            }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={form.activo}
                            onChange={e => setForm({ ...form, activo: e.target.checked })}
                        />
                        <span className="form-label" style={{ margin: 0 }}>Categoría activa</span>
                    </label>
                </div>
            </Modal>

            {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
          ============================================ */}
            <Modal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Eliminar Categoría"
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
                    ¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.
                </p>
            </Modal>
        </div>
    )
}

// --- Estilos inline reutilizables ---
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

const trStyle = {
    transition: 'background 0.15s',
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