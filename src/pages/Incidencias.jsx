/**
 * Incidencias.jsx — Página de lista de incidencias
 * 
 * Módulo principal del panel. Muestra una tabla con todas las
 * incidencias registradas en el sistema.
 * 
 * Funcionalidades:
 * 1. FILTROS — Permite filtrar por:
 *    - Búsqueda de texto (código o descripción)
 *    - Estado (pendiente, en_revision, etc.)
 *    - Prioridad (baja, media, alta, critica)
 *    - Categoría (baches, alumbrado, etc.)
 * 
 * 2. TABLA — Columnas visibles:
 *    - Código (INC-XXXXX)
 *    - Usuario reportante
 *    - Categoría con icono
 *    - Caso asociado (si existe)
 *    - Área municipal
 *    - Estado (badge de color)
 *    - Prioridad (badge de color)
 *    - Fecha de creación
 * 
 * 3. PAGINACIÓN — Muestra 10 registros por página
 * 
 * 4. NAVEGACIÓN — Al hacer clic en una fila, navega
 *    a la vista de detalle de esa incidencia
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchIncidencias, fetchCategorias } from '../services/api'
import {
  estadoLabels,
  prioridadLabels,
  formatDateShort,
} from '../utils/constants'
import Badge from '../components/ui/Badge'

// Número de incidencias por página de la tabla
const ITEMS_PER_PAGE = 10

export default function Incidencias() {
  // --- ESTADOS ---
  const [incidencias, setIncidencias] = useState([])     // Todas las incidencias
  const [categorias, setCategorias] = useState([])        // Categorías para filtro
  const [loading, setLoading] = useState(true)            // Indicador de carga
  const [search, setSearch] = useState('')                // Texto de búsqueda
  const [filterEstado, setFilterEstado] = useState('')    // Filtro por estado
  const [filterPrioridad, setFilterPrioridad] = useState('') // Filtro por prioridad
  const [filterCategoria, setFilterCategoria] = useState('') // Filtro por categoría
  const [currentPage, setCurrentPage] = useState(1)       // Página actual

  // Hook para navegar a la vista de detalle
  const navigate = useNavigate()

  // Cargar incidencias y categorías al montar el componente
  useEffect(() => {
    loadData()
  }, [])

  /**
   * Carga incidencias y categorías desde la API
   */
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

  /**
   * useMemo — Filtra las incidencias según los criterios activos.
   * Se recalcula solo cuando cambian las incidencias o los filtros.
   * Esto evita recalcular en cada render innecesariamente.
   */
  const filtered = useMemo(() => {
    let result = [...incidencias]

    // Filtrar por texto de búsqueda (código o descripción)
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(inc =>
        inc.codigo?.toLowerCase().includes(searchLower) ||
        inc.descripcion?.toLowerCase().includes(searchLower) ||
        inc.usuario?.nombre?.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por estado seleccionado
    if (filterEstado) {
      result = result.filter(inc => inc.estado === filterEstado)
    }

    // Filtrar por prioridad seleccionada
    if (filterPrioridad) {
      result = result.filter(inc => inc.prioridad === filterPrioridad)
    }

    // Filtrar por categoría seleccionada
    if (filterCategoria) {
      result = result.filter(inc => {
        const catId = inc.categoria?.id || inc.categoriaId
        return catId === Number(filterCategoria)
      })
    }

    return result
  }, [incidencias, search, filterEstado, filterPrioridad, filterCategoria])

  // Calcular paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  // Obtener solo los items de la página actual
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterEstado, filterPrioridad, filterCategoria])

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
      <h1 className="page-title">Incidencias</h1>
      <p className="page-subtitle">
        Gestión completa de reportes ciudadanos — {incidencias.length} registros totales
      </p>

      {/* ============================================
          BARRA DE FILTROS
          ============================================ */}
      <div className="filters-bar">
        {/* Búsqueda por texto */}
        <div className="filter-search">
          <Search size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por código, descripción o usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="search-incidencias"
          />
        </div>

        {/* Select de estado */}
        <select
          className="filter-select"
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          id="filter-estado"
        >
          <option value="">Todos los estados</option>
          {/* Renderizar opciones desde el mapeo de estados */}
          {Object.entries(estadoLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Select de prioridad */}
        <select
          className="filter-select"
          value={filterPrioridad}
          onChange={e => setFilterPrioridad(e.target.value)}
          id="filter-prioridad"
        >
          <option value="">Todas las prioridades</option>
          {Object.entries(prioridadLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Select de categoría */}
        <select
          className="filter-select"
          value={filterCategoria}
          onChange={e => setFilterCategoria(e.target.value)}
          id="filter-categoria"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icono} {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ============================================
          TABLA DE INCIDENCIAS
          ============================================ */}
      <div className="table-container">
        <table className="data-table">
          {/* Encabezados de columna */}
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
            </tr>
          </thead>

          <tbody>
            {/* Renderizar cada incidencia como una fila clickeable */}
            {paginatedItems.map(inc => (
              <tr
                key={inc.id}
                className="clickable"
                onClick={() => navigate(`/incidencias/${inc.id}`)}
                title={`Ver detalle de ${inc.codigo}`}
              >
                {/* Código de incidencia (estilo monoespaciado) */}
                <td>
                  <span className="incident-code">{inc.codigo}</span>
                </td>

                {/* Nombre del ciudadano reportante */}
                <td>{inc.usuario?.nombre || '—'}</td>

                {/* Categoría con icono de color */}
                <td>
                  <div className="category-cell">
                    <span
                      className="category-dot"
                      style={{ background: inc.categoria?.color }}
                    />
                    {inc.categoria?.nombre}
                  </div>
                </td>

                {/* Caso asociado (puede ser null) */}
                <td>
                  {inc.caso
                    ? <span style={{ fontSize: 'var(--font-size-sm)' }}>{inc.caso.titulo}</span>
                    : <span style={{ color: 'var(--text-secondary)' }}>—</span>
                  }
                </td>

                {/* Área municipal (a través del caso) */}
                <td>
                  {inc.area
                    ? inc.area.nombre
                    : <span style={{ color: 'var(--text-secondary)' }}>—</span>
                  }
                </td>

                {/* Badge de estado */}
                <td><Badge type="estado" value={inc.estado} /></td>

                {/* Badge de prioridad */}
                <td><Badge type="prioridad" value={inc.prioridad} /></td>

                {/* Fecha de creación */}
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {formatDateShort(inc.creadoEn || inc.created_at)}
                </td>
              </tr>
            ))}

            {/* Mensaje cuando no hay resultados */}
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <Filter size={48} className="empty-state-icon" />
                    <div className="empty-state-title">Sin resultados</div>
                    <div className="empty-state-text">
                      No se encontraron incidencias con los filtros seleccionados
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ============================================
            PAGINACIÓN
            ============================================ */}
        {totalPages > 1 && (
          <div className="table-pagination">
            {/* Texto indicando rango actual */}
            <span>
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              {' - '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              {' de '}
              {filtered.length}
            </span>

            {/* Botones de paginación */}
            <div className="pagination-buttons">
              {/* Botón anterior */}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Botones numéricos de página */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              {/* Botón siguiente */}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
