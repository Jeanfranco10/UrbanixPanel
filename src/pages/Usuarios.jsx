/**
 * Usuarios.jsx — Gestión de Usuarios
 * CRUD completo: listar, crear, editar, eliminar y buscar por nombre
 */

import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2, Users, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import { apiFetch } from '../services/apiConfig'
import Modal from '../components/ui/Modal'

const ROL_LABELS = {
    ciudadano: 'Ciudadano',
    inspector: 'Inspector',
    responsable_area: 'Responsable de Área',
    administrador: 'Administrador',
}

const ROL_COLORS = {
    ciudadano: '#6b7280',
    inspector: '#3b82f6',
    responsable_area: '#f97316',
    administrador: '#6366f1',
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [areas, setAreas] = useState([])
    const [busqueda, setBusqueda] = useState('')

    // Modal crear/editar
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        contrasenaHash: '',
        rol: 'ciudadano',
        area: '',
        activo: true,
    })
    const [saving, setSaving] = useState(false)

    // Modal confirmar eliminación
    const [showConfirm, setShowConfirm] = useState(false)
    const [eliminandoId, setEliminandoId] = useState(null)

    useEffect(() => {
        loadUsuarios()
        loadAreas()
    }, [])

    async function loadUsuarios() {
        try {
            const data = await apiFetch('/usuarios')
            setUsuarios(data)
        } catch (error) {
            console.error('Error cargando usuarios:', error)
        } finally {
            setLoading(false)
        }
    }

    async function loadAreas() {
        try {
            const data = await apiFetch('/areas')
            setAreas(data)
        } catch (error) {
            console.error('Error cargando áreas:', error)
        }
    }

    // Filtrar por nombre o correo
    const filtrados = useMemo(() => {
        if (!busqueda.trim()) return usuarios
        const q = busqueda.toLowerCase()
        return usuarios.filter(u =>
            u.nombre?.toLowerCase().includes(q) ||
            u.correo?.toLowerCase().includes(q)
        )
    }, [usuarios, busqueda])

    function abrirCrear() {
        setEditando(null)
        setForm({ nombre: '', correo: '', telefono: '', contrasenaHash: '', rol: 'ciudadano', area: '', activo: true })
        setShowModal(true)
    }

    function abrirEditar(usuario) {
        setEditando(usuario)
        setForm({
            nombre: usuario.nombre || '',
            correo: usuario.correo || '',
            telefono: usuario.telefono || '',
            contrasenaHash: '',
            rol: usuario.rol || 'ciudadano',
            area: usuario.area?.id || '',
            activo: usuario.activo ?? true,
        })
        setShowModal(true)
    }

    function cerrarModal() {
        setShowModal(false)
        setEditando(null)
    }

    async function handleGuardar() {
        if (!form.nombre.trim() || !form.correo.trim()) return
        if (!editando && !form.contrasenaHash.trim()) return
        setSaving(true)

        const payload = {
            nombre: form.nombre,
            correo: form.correo,
            telefono: form.telefono || null,
            rol: form.rol,
            activo: form.activo,
            area: form.area ? { id: parseInt(form.area) } : null,
        }

        // Solo enviar contraseña si se ingresó
        if (form.contrasenaHash.trim()) {
            payload.contrasenaHash = form.contrasenaHash
        }

        try {
            if (editando) {
                await apiFetch(`/usuarios/${editando.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                })
            } else {
                await apiFetch('/usuarios', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                })
            }
            await loadUsuarios()
            cerrarModal()
        } catch (error) {
            console.error('Error guardando usuario:', error)
        } finally {
            setSaving(false)
        }
    }

    async function handleToggleActivo(usuario) {
        try {
            await apiFetch(`/usuarios/${usuario.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ activo: !usuario.activo }),
            })
            await loadUsuarios()
        } catch (error) {
            console.error('Error actualizando estado:', error)
        }
    }

    function confirmarEliminar(id) {
        setEliminandoId(id)
        setShowConfirm(true)
    }

    async function handleEliminar() {
        try {
            await apiFetch(`/usuarios/${eliminandoId}`, { method: 'DELETE' })
            await loadUsuarios()
        } catch (error) {
            console.error('Error eliminando usuario:', error)
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
                    <h1 className="page-title">Usuarios</h1>
                    <p className="page-subtitle">{usuarios.length} usuarios registrados</p>
                </div>
                <button className="btn-primary" onClick={abrirCrear} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} />
                    Nuevo Usuario
                </button>
            </div>

            {/* --- BUSCADOR --- */}
            <div className="filters-bar" style={{ marginBottom: '20px' }}>
                <div className="filter-search">
                    <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLA --- */}
            <div className="content-card">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Usuario</th>
                            <th style={thStyle}>Correo</th>
                            <th style={thStyle}>Teléfono</th>
                            <th style={thStyle}>Rol</th>
                            <th style={thStyle}>Área</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map(u => (
                            <tr key={u.id} style={{ opacity: u.activo ? 1 : 0.6 }}>
                                {/* Avatar + nombre */}
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'var(--accent-gradient)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: 'var(--font-size-sm)',
                                            flexShrink: 0,
                                        }}>
                                            {u.nombre?.charAt(0).toUpperCase()}
                                        </div>
                                        <strong>{u.nombre}</strong>
                                    </div>
                                </td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{u.correo}</td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{u.telefono || '—'}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '3px 10px',
                                        borderRadius: '999px',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 600,
                                        background: `${ROL_COLORS[u.rol]}20`,
                                        color: ROL_COLORS[u.rol],
                                    }}>
                                        {ROL_LABELS[u.rol] || u.rol}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    {u.area?.nombre || '—'}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: '999px',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 600,
                                        background: u.activo ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                                        color: u.activo ? '#10b981' : '#6b7280',
                                    }}>
                                        {u.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => abrirEditar(u)} title="Editar" style={btnIconStyle('#3b82f6')}>
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleToggleActivo(u)} title={u.activo ? 'Desactivar' : 'Activar'} style={btnIconStyle(u.activo ? '#10b981' : '#6b7280')}>
                                            {u.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        </button>
                                        <button onClick={() => confirmarEliminar(u.id)} title="Eliminar" style={btnIconStyle('#ef4444')}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtrados.length === 0 && (
                    <div className="empty-state">
                        <Users size={40} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
                        <div className="empty-state-title">Sin usuarios</div>
                        <div className="empty-state-text">
                            {busqueda ? 'No se encontraron usuarios con esa búsqueda' : 'Crea el primer usuario con el botón de arriba'}
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
                title={editando ? 'Editar Usuario' : 'Nuevo Usuario'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                        <button
                            className="btn-primary"
                            onClick={handleGuardar}
                            disabled={saving || !form.nombre.trim() || !form.correo.trim() || (!editando && !form.contrasenaHash.trim())}
                        >
                            {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Nombre completo"
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Correo *</label>
                    <input
                        className="form-input"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={form.correo}
                        onChange={e => setForm({ ...form, correo: e.target.value })}
                        disabled={!!editando} // No permitir cambiar correo al editar
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        {editando ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        placeholder={editando ? 'Dejar vacío para mantener' : 'Contraseña'}
                        value={form.contrasenaHash}
                        onChange={e => setForm({ ...form, contrasenaHash: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="999999999"
                        value={form.telefono}
                        onChange={e => setForm({ ...form, telefono: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Rol</label>
                        <select className="form-select" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                            {Object.entries(ROL_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Área</label>
                        <select className="form-select" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
                            <option value="">Sin área</option>
                            {areas.map(a => (
                                <option key={a.id} value={a.id}>{a.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={form.activo}
                            onChange={e => setForm({ ...form, activo: e.target.checked })}
                        />
                        <span className="form-label" style={{ margin: 0 }}>Usuario activo</span>
                    </label>
                </div>
            </Modal>

            {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
          ============================================ */}
            <Modal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Eliminar Usuario"
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
                    ¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer y podría afectar incidencias relacionadas.
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