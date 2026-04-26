/**
 * api.js — Capa de servicios que consume la API REST de Spring Boot
 * 
 * Este archivo centraliza todas las llamadas HTTP al backend.
 * El API corre en http://localhost:8080/api (configurable en apiConfig.js).
 * 
 * Estructura de endpoints consumidos:
 *   /api/incidencias      — CRUD de incidencias
 *   /api/casos            — CRUD de casos
 *   /api/areas            — CRUD de áreas municipales
 *   /api/categorias       — Listado de categorías
 *   /api/usuarios         — CRUD de usuarios
 *   /api/historial        — Historial de estados de incidencias
 *   /api/archivos         — Archivos multimedia de incidencias
 *   /api/asignaciones     — Asignaciones de inspectores a casos
 *   /api/evidencias-resolucion — Evidencia fotográfica de resolución
 */

import { apiFetch } from './apiConfig'

// ============================================
// INCIDENCIAS
// ============================================

/**
 * Obtiene todas las incidencias desde el API.
 * Las incidencias vienen con sus relaciones cargadas por JPA:
 *   - usuario (reportante)
 *   - categoria
 *   - caso (puede ser null)
 *   - ubicacion
 * 
 * Adicionalmente se resuelve el área a través del caso.
 * 
 * @returns {Promise<array>} Array de incidencias enriquecidas
 */
export async function fetchIncidencias() {
  const incidencias = await apiFetch('/incidencias')

  // Agregar el área municipal (viene a través del caso)
  return incidencias.map(inc => ({
    ...inc,
    area: inc.caso?.area || null,
  }))
}

/**
 * Obtiene una incidencia específica por su ID con todos los datos
 * relacionados (historial de estados y archivos multimedia).
 * 
 * Hace 3 llamadas en paralelo para obtener toda la info:
 *   1. GET /incidencias/{id} — datos de la incidencia
 *   2. GET /historial/incidencia/{id} — timeline de cambios
 *   3. GET /archivos/incidencia/{id} — fotos/videos adjuntos
 * 
 * @param {number} id - ID de la incidencia
 * @returns {Promise<object|null>} Incidencia completa o null si no existe
 */
export async function fetchIncidenciaById(id) {
  try {
    // Llamadas en paralelo para mejor rendimiento
    const [incidencia, historial, multimedia] = await Promise.all([
      apiFetch(`/incidencias/${id}`),
      apiFetch(`/historial/incidencia/${id}`),
      apiFetch(`/archivos/incidencia/${id}`),
    ])

    return {
      ...incidencia,
      area: incidencia.caso?.area || null,
      historial,    // Array de cambios de estado
      multimedia,   // Array de archivos adjuntos
    }
  } catch (error) {
    console.error(`Error cargando incidencia ${id}:`, error)
    return null
  }
}

/**
 * Actualiza el estado de una incidencia.
 * 
 * Proceso:
 * 1. Obtiene el estado actual de la incidencia
 * 2. Actualiza el estado con PATCH
 * 3. Registra el cambio en el historial
 * 
 * @param {number} incidenciaId - ID de la incidencia
 * @param {string} nuevoEstado - Nuevo estado a asignar
 * @param {string} comentario - Comentario del cambio (opcional)
 * @param {number} usuarioId - ID del admin que hace el cambio
 * @returns {Promise<object>} Resultado de la operación
 */
export async function updateEstadoIncidencia(incidenciaId, nuevoEstado, comentario = '', usuarioId = null) {
  // 1. Obtener el estado actual para el historial
  const incActual = await apiFetch(`/incidencias/${incidenciaId}`)
  const estadoAnterior = incActual.estado

  // 2. Actualizar el estado de la incidencia
  const incActualizada = await apiFetch(`/incidencias/${incidenciaId}`, {
    method: 'PATCH',
    body: JSON.stringify({ estado: nuevoEstado }),
  })

  // 3. Registrar el cambio en el historial de estados
  const registroHistorial = await apiFetch('/historial', {
    method: 'POST',
    body: JSON.stringify({
      incidencia: { id: incidenciaId },
      usuario: { id: usuarioId || incActual.usuario?.id || 1 },
      estadoAnterior: estadoAnterior,
      estadoNuevo: nuevoEstado,
      comentario: comentario || `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
    }),
  })

  return { success: true, incidencia: incActualizada, historial: registroHistorial }
}

// ============================================
// CASOS
// ============================================

/**
 * Obtiene todos los casos con datos expandidos.
 * 
 * El API retorna los casos con sus relaciones JPA (area, categoria).
 * Adicionalmente, para cada caso se obtienen:
 *   - Incidencias relacionadas
 *   - Asignaciones de inspectores
 *   - Evidencia de resolución
 * 
 * @returns {Promise<array>} Array de casos enriquecidos
 */
export async function fetchCasos() {
  const casos = await apiFetch('/casos')

  // Enriquecer cada caso con datos relacionados (en paralelo)
  const casosEnriquecidos = await Promise.all(
    casos.map(async (caso) => {
      try {
        const [incidencias, asignaciones, evidencia] = await Promise.all([
          apiFetch(`/incidencias/caso/${caso.id}`),
          apiFetch(`/asignaciones/caso/${caso.id}`),
          apiFetch(`/evidencias-resolucion/caso/${caso.id}`),
        ])

        return {
          ...caso,
          incidencias,
          asignaciones,
          evidencia,
        }
      } catch (error) {
        // Si falla la carga de datos relacionados, devolver caso básico
        console.warn(`Error cargando datos del caso ${caso.id}:`, error)
        return {
          ...caso,
          incidencias: [],
          asignaciones: [],
          evidencia: [],
        }
      }
    })
  )

  return casosEnriquecidos
}

// ============================================
// ÁREAS MUNICIPALES
// ============================================

/**
 * Obtiene todas las áreas municipales con sus responsables y estadísticas.
 * 
 * El API retorna las áreas con el responsable cargado por JPA.
 * Las estadísticas (totalCasos, casosActivos) se calculan cruzando
 * con los datos de casos.
 * 
 * @returns {Promise<array>} Array de áreas con datos calculados
 */
export async function fetchAreas() {
  // Obtener áreas y casos en paralelo
  const [areas, casos] = await Promise.all([
    apiFetch('/areas'),
    apiFetch('/casos'),
  ])

  // Enriquecer cada área con estadísticas calculadas
  return areas.map(area => {
    // Filtrar casos que pertenecen a esta área
    const casosDeArea = casos.filter(c =>
      (c.area?.id === area.id) || (c.areaId === area.id)
    )
    // Contar casos activos (no cerrados ni resueltos)
    const casosActivos = casosDeArea.filter(c =>
      ['pendiente', 'en_revision', 'en_proceso'].includes(c.estado)
    )

    return {
      ...area,
      // El responsable ya viene cargado por JPA como `responsable`
      // Si viene como `responsableId`, sería un ID numérico
      responsable: area.responsable || null,
      totalCasos: casosDeArea.length,
      casosActivos: casosActivos.length,
      casos: casosDeArea,
    }
  })
}

// ============================================
// DASHBOARD — Métricas calculadas
// ============================================

/**
 * Calcula todas las métricas para el dashboard.
 * 
 * No hay un endpoint específico de dashboard en el API,
 * por lo que se obtienen los datos base y se calculan
 * las métricas en el frontend.
 * 
 * @returns {Promise<object>} Objeto con todas las métricas
 */
export async function fetchDashboardMetrics() {
  // Obtener datos base en paralelo
  const [incidencias, casos, categorias, areas] = await Promise.all([
    apiFetch('/incidencias'),
    apiFetch('/casos'),
    apiFetch('/categorias'),
    apiFetch('/areas'),
  ])

  const total = incidencias.length

  // Contar incidencias por estado
  const porEstado = {
    pendiente: incidencias.filter(i => i.estado === 'pendiente').length,
    en_revision: incidencias.filter(i => i.estado === 'en_revision').length,
    en_proceso: incidencias.filter(i => i.estado === 'en_proceso').length,
    resuelto: incidencias.filter(i => i.estado === 'resuelto').length,
    rechazado: incidencias.filter(i => i.estado === 'rechazado').length,
    cerrado: incidencias.filter(i => i.estado === 'cerrado').length,
  }

  // Contar incidencias por prioridad
  const porPrioridad = {
    baja: incidencias.filter(i => i.prioridad === 'baja').length,
    media: incidencias.filter(i => i.prioridad === 'media').length,
    alta: incidencias.filter(i => i.prioridad === 'alta').length,
    critica: incidencias.filter(i => i.prioridad === 'critica').length,
  }

  // Contar incidencias por categoría (con datos de la categoría)
  const porCategoria = categorias.map(cat => ({
    ...cat,
    total: incidencias.filter(i =>
      (i.categoria?.id === cat.id) || (i.categoriaId === cat.id)
    ).length,
  })).filter(c => c.total > 0)

  // Contar incidencias por área (a través de los casos)
  const porArea = areas.map(area => {
    const casosArea = casos.filter(c =>
      (c.area?.id === area.id) || (c.areaId === area.id)
    )
    const casoIds = casosArea.map(c => c.id)
    const totalArea = incidencias.filter(i =>
      casoIds.includes(i.caso?.id || i.casoId)
    ).length
    return { ...area, total: totalArea }
  }).filter(a => a.total > 0)

  // Últimas 5 incidencias (más recientes primero)
  const ultimas = [...incidencias]
    .sort((a, b) => {
      const dateA = new Date(a.creadoEn || a.created_at || 0)
      const dateB = new Date(b.creadoEn || b.created_at || 0)
      return dateB - dateA
    })
    .slice(0, 5)

  // Casos activos (no cerrados ni resueltos)
  const casosActivos = casos
    .filter(c => ['pendiente', 'en_revision', 'en_proceso'].includes(c.estado))

  // Calcular cambios mes actual vs mes anterior
  const ahora = new Date()
  const inicioMesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)

  const incMesActual = incidencias.filter(i => new Date(i.creadoEn) >= inicioMesActual)
  const incMesAnterior = incidencias.filter(i => {
    const fecha = new Date(i.creadoEn)
    return fecha >= inicioMesAnterior && fecha < inicioMesActual
  })

  function calcCambio(actual, anterior) {
    if (anterior === 0) return actual > 0 ? 100 : 0
    return Math.round(((actual - anterior) / anterior) * 100)
  }

  const cambioTotal = calcCambio(incMesActual.length, incMesAnterior.length)
  const cambioPendiente = calcCambio(
    incMesActual.filter(i => i.estado === 'pendiente').length,
    incMesAnterior.filter(i => i.estado === 'pendiente').length
  )
  const cambioEnProceso = calcCambio(
    incMesActual.filter(i => i.estado === 'en_proceso').length,
    incMesAnterior.filter(i => i.estado === 'en_proceso').length
  )
  const cambioResuelto = calcCambio(
    incMesActual.filter(i => i.estado === 'resuelto').length,
    incMesAnterior.filter(i => i.estado === 'resuelto').length
  )

  return {
    total,
    porEstado,
    porPrioridad,
    porCategoria,
    porArea,
    ultimas,
    casosActivos,
    cambioTotal,
    cambioPendiente,
    cambioEnProceso,
    cambioResuelto
  }
}

// ============================================
// DATOS DE REFERENCIA
// ============================================

/**
 * Obtiene las categorías disponibles (para selects de filtros)
 */
export async function fetchCategorias() {
  return await apiFetch('/categorias')
}

/**
 * Obtiene la lista de usuarios
 */
export async function fetchUsuarios() {
  return await apiFetch('/usuarios')
}

/**
 * Obtiene un usuario por su ID
 * @param {number} id - ID del usuario
 * @returns {Promise<object|null>} Usuario o null
 */
export async function fetchUsuarioById(id) {
  try {
    return await apiFetch(`/usuarios/id/${id}`)
  } catch {
    return null
  }
}
