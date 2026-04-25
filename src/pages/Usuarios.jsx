/**
 * Usuarios.jsx — Gestión de Usuarios
 *
 * Funcionalidades:
 * - Lista de usuarios con búsqueda por nombre/correo
 * - Crear y editar usuario mediante modal (selects para área y rol)
 * - Eliminar usuario con confirmación
 * - Activar / Desactivar usuario (toggle)
 */

import { useState, useEffect, useMemo } from 'react'
import {
    Plus,
    Pencil,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Search,
    XCircle,
} from 'lucide-react'
import { apiFetch } from '../services/apiConfig'
import Modal from '../components/ui/Modal'

// Valores del enum RolUsuario
const ROLES = ['ciudadano', 'inspector', 'responsable_area', 'administrador']

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Datos para el select de área
    const [areas, setAreas] = useState([])

    // Modal crear/editar
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        contrasena: '',        // solo en crear; en editar opcional
        rol: 'ciudadano',
        areaId: '',
        activo: true,
        fotoUrl: '',
    })
    const [saving, setSaving] = useState(false)

    // Modal confirmar eliminación
    const [showConfirm, setShowConfirm] = useState(false)
    const [eliminandoId, setEliminandoId] = useState(null)

    // Cargar usuarios y áreas
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

    // Filtro de búsqueda local
    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return usuarios
        const term = searchTerm.toLowerCase()
        return usuarios.filter(
            u =>
                u.nombre.toLowerCase().includes(term) ||
                u.correo.toLowerCase().includes(term)
        )
    }, [usuarios, searchTerm])

    // --- MODAL CREAR/EDITAR ---
    function abrirCrear() {
        setEditando(null)
        setForm({
            nombre: '',
            correo: '',
            telefono: '',
            contrasena: '',
            rol: 'ciudadano',
            areaId: '',
            activo: true,
            fotoUrl: '',
        })
        setShowModal(true)
    }

    function abrirEditar(user) {
        setEditando(user)
        setForm({
            nombre: user.nombre || '',
            correo: user.correo || '',   // se muestra pero el PATCH no lo actualiza (por ahora)
            telefono: user.telefono || '',
            contrasena: '',              // en editar se deja vacío (solo si se quiere cambiar)
            rol: user.rol || 'ciudadano',
            areaId: user.area?.id || (typeof user.area === 'object' ? user.area.id : user.area) || '',
            activo: user.activo ?? true,
            fotoUrl: user.fotoUrl || '',
        })
        setShowModal(true)
    }

    function cerrarModal() {
        setShowModal(false)
        setEditando(null)
    }

    async function handleGuardar() {
        if (!form.nombre.trim() || !form.correo.trim()) return
        setSaving(true)

        // Construir payload para el backend
        const payload = {
            nombre: form.nombre,
            correo: form.correo,
            telefono: form.telefono,
            contrasenaHash: form.contrasena || undefined, // solo si se escribió
            rol: form.rol,
            area: form.areaId ? { id: Number(form.areaId) } : null,
            activo: form.activo,
            fotoUrl: form.fotoUrl || null,
        }

        // Si estamos editando y no se escribió contraseña, la quitamos para no enviar null
        if (editando && !form.contrasena) {
            delete payload.contrasenaHash
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

    // --- TOGGLE ACTIVO/INACTIVO ---
    async function toggleActivo(user) {
        const nuevoEstado = !user.activo
        try {
            await apiFetch(`/usuarios/${user.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ activo: nuevoEstado }),
            })
            setUsuarios(prev =>
                prev.map(u => (u.id === user.id ? { ...u, activo: nuevoEstado } : u))
            )
        } catch (error) {
            console.error('Error cambiando estado activo:', error)
        }
    }

    // --- ELIMINAR ---
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
            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '8px 12px 8px 32px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)',
                        fontSize: 'var(--font-size-sm)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        style={{ position: 'absolute', left: '380px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                        <XCircle size={16} />
                    </button>
                )}
            </div>

            {/* --- TABLA --- */}
            <div className="content-card">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Nombre</th>
                            <th style={thStyle}>Correo</th>
                            <th style={thStyle}>Teléfono</th>
                            <th style={thStyle}>Rol</th>
                            <th style={thStyle}>Área</th>
                            <th style={thStyle}>Activo</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user.id} style={{ ...trStyle, opacity: user.activo === false ? 0.5 : 1 }}>
                                <td style={tdStyle}><strong>{user.nombre}</strong></td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{user.correo}</td>
                                <td style={tdStyle}>{user.telefono || '—'}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: '999px',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 600,
                                        background: user.rol === 'administrador' ? 'rgba(99,102,241,0.15)' :
                                            user.rol === 'responsable_area' ? 'rgba(245,158,11,0.15)' :
                                                user.rol === 'inspector' ? 'rgba(16,185,129,0.15)' :
                                                    'rgba(107,114,128,0.15)', // ciudadano u otros
                                        color: user.rol === 'administrador' ? '#6366f1' :
                                            user.rol === 'responsable_area' ? '#f59e0b' :
                                                user.rol === 'inspector' ? '#10b981' : '#6b7280',
                                    }}>
                                        {user.rol}
                                    </span>
                                </td>
                                <td style={tdStyle}>{user.area?.nombre || (typeof user.area === 'string' ? user.area : '—')}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => toggleActivo(user)}
                                        style={{ ...btnIconStyle(user.activo !== false ? '#10b981' : '#6b7280'), margin: 'auto' }}
                                        title={user.activo !== false ? 'Desactivar' : 'Activar'}
                                    >
                                        {user.activo !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                    </button>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => abrirEditar(user)} title="Editar" style={btnIconStyle('#3b82f6')}>
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => confirmarEliminar(user.id)} title="Eliminar" style={btnIconStyle('#ef4444')}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <Search size={40} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
                        <div className="empty-state-title">Sin resultados</div>
                        <div className="empty-state-text">
                            {searchTerm ? 'Ningún usuario coincide con la búsqueda' : 'No hay usuarios registrados'}
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================
          MODAL CREAR / EDITAR USUARIO
      ============================================ */}
            <Modal
                isOpen={showModal}
                onClose={cerrarModal}
                title={editando ? 'Editar Usuario' : 'Nuevo Usuario'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                        <button className="btn-primary" onClick={handleGuardar} disabled={saving || !form.nombre.trim() || !form.correo.trim()}>
                            {saving ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input className="form-input" type="text" placeholder="Nombre completo" value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>

                <div className="form-group">
                    <label className="form-label">Correo *</label>
                    <input className="form-input" type="email" placeholder="correo@ejemplo.com" value={form.correo}
                        onChange={e => setForm({ ...form, correo: e.target.value })}
                        disabled={!!editando}  // el correo no se puede cambiar en edición según el PATCH actual
                        title={editando ? 'El correo no se puede modificar con el controlador actual' : ''}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Teléfono</label>
                        <input className="form-input" type="text" placeholder="999888777" value={form.telefono}
                            onChange={e => setForm({ ...form, telefono: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Contraseña {editando ? '(dejar vacío para no cambiar)' : '*'}</label>
                        <input className="form-input" type="password" placeholder="Contraseña" value={form.contrasena}
                            onChange={e => setForm({ ...form, contrasena: e.target.value })} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Rol</label>
                        <select className="form-select" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                            {ROLES.map(rol => (
                                <option key={rol} value={rol}>{rol}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Área</label>
                        <select className="form-select" value={form.areaId} onChange={e => setForm({ ...form, areaId: e.target.value })}>
                            <option value="">Sin área</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>{area.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">URL de foto</label>
                    <input className="form-input" type="text" placeholder="https://..." value={form.fotoUrl}
                        onChange={e => setForm({ ...form, fotoUrl: e.target.value })} />
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

                {editando && (
                    <div style={{ fontSize: 'var(--font-size-xs)', color: '#f59e0b', marginTop: '8px' }}>
                        ⚠️ El controlador actual solo actualiza nombre, teléfono y contraseña.
                        El resto de campos se muestran pero no se guardarán hasta que amplíes el PATCH.
                    </div>
                )}
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
                    ¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.
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