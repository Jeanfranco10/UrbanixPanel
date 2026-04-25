/**
 * mockData.js — Datos simulados para Urbanix
 * 
 * Este archivo contiene todos los datos de prueba que simulan
 * lo que vendría de la API REST. Cuando el backend esté listo,
 * estos datos se reemplazarán por llamadas reales a la API.
 * 
 * Estructura de datos basada en el modelo de BD especificado
 * en urbanix_panel.md (sección 5).
 */

// ============================================
// CATEGORÍAS — Clasificación temática de incidencias
// Cada categoría tiene un icono emoji y un color para identificarla
// ============================================
export const categorias = [
  { id: 1, nombre: 'Baches',        icono: '🕳️', color: '#ef4444' },
  { id: 2, nombre: 'Alumbrado',     icono: '💡', color: '#f59e0b' },
  { id: 3, nombre: 'Basura',        icono: '🗑️', color: '#10b981' },
  { id: 4, nombre: 'Agua',          icono: '💧', color: '#3b82f6' },
  { id: 5, nombre: 'Parques',       icono: '🌳', color: '#22c55e' },
  { id: 6, nombre: 'Tránsito',      icono: '🚦', color: '#8b5cf6' },
  { id: 7, nombre: 'Infraestructura', icono: '🏗️', color: '#f97316' },
  { id: 8, nombre: 'Ruido',         icono: '🔊', color: '#ec4899' },
]

// ============================================
// USUARIOS — Ciudadanos que reportan e inspectores
// El campo 'rol' determina si es ciudadano o inspector
// ============================================
export const usuarios = [
  { id: 1,  nombre: 'Carlos Mendoza',    correo: 'carlos@mail.com',    rol: 'ciudadano' },
  { id: 2,  nombre: 'María López',       correo: 'maria@mail.com',     rol: 'ciudadano' },
  { id: 3,  nombre: 'Juan Pérez',        correo: 'juan@mail.com',      rol: 'ciudadano' },
  { id: 4,  nombre: 'Ana García',        correo: 'ana@mail.com',       rol: 'ciudadano' },
  { id: 5,  nombre: 'Roberto Sánchez',   correo: 'roberto@mail.com',   rol: 'ciudadano' },
  { id: 6,  nombre: 'Lucía Fernández',   correo: 'lucia@mail.com',     rol: 'ciudadano' },
  { id: 7,  nombre: 'Pedro Ramírez',     correo: 'pedro@mail.com',     rol: 'ciudadano' },
  { id: 8,  nombre: 'Sofía Torres',      correo: 'sofia@mail.com',     rol: 'ciudadano' },
  { id: 9,  nombre: 'Diego Vargas',      correo: 'diego@mail.com',     rol: 'inspector' },
  { id: 10, nombre: 'Laura Morales',     correo: 'laura@mail.com',     rol: 'inspector' },
  { id: 11, nombre: 'Andrés Jiménez',    correo: 'andres@mail.com',    rol: 'inspector' },
  { id: 12, nombre: 'Carmen Ruiz',       correo: 'carmen@mail.com',    rol: 'inspector' },
]

// ============================================
// ÁREAS MUNICIPALES — Organizaciones territoriales
// Cada área tiene un responsable y cubre ciertos distritos
// ============================================
export const areasMunicipales = [
  {
    id: 1,
    nombre: 'Obras Públicas',
    distritos: ['Centro', 'Norte', 'Sur'],
    responsable_id: 9,           // Diego Vargas (inspector)
    descripcion: 'Departamento encargado de infraestructura vial y urbana'
  },
  {
    id: 2,
    nombre: 'Servicios Urbanos',
    distritos: ['Centro', 'Este', 'Oeste'],
    responsable_id: 10,          // Laura Morales
    descripcion: 'Gestión de limpieza, alumbrado y servicios básicos'
  },
  {
    id: 3,
    nombre: 'Medio Ambiente',
    distritos: ['Norte', 'Este'],
    responsable_id: 11,          // Andrés Jiménez
    descripcion: 'Parques, áreas verdes y gestión ambiental'
  },
  {
    id: 4,
    nombre: 'Tránsito y Movilidad',
    distritos: ['Centro', 'Sur', 'Oeste'],
    responsable_id: 12,          // Carmen Ruiz
    descripcion: 'Señalización, semáforos y movilidad urbana'
  },
  {
    id: 5,
    nombre: 'Agua y Saneamiento',
    distritos: ['Norte', 'Sur', 'Este', 'Oeste'],
    responsable_id: 9,           // Diego Vargas
    descripcion: 'Red de agua potable y drenaje'
  },
]

// ============================================
// CASOS — Agrupadores de incidencias relacionadas
// Un caso junta varias incidencias de la misma zona/categoría
// ============================================
export const casos = [
  {
    id: 1,
    titulo: 'Baches en Av. Principal',
    descripcion: 'Múltiples reportes de baches en la Avenida Principal entre calles 5 y 12',
    estado: 'en_proceso',
    prioridad: 'alta',
    area_id: 1,                  // Obras Públicas
    total_reportes: 5,
    created_at: '2026-03-15T10:30:00'
  },
  {
    id: 2,
    titulo: 'Fallas de alumbrado en Zona Centro',
    descripcion: 'Reportes de lámparas sin funcionar en el centro histórico',
    estado: 'en_revision',
    prioridad: 'media',
    area_id: 2,                  // Servicios Urbanos
    total_reportes: 3,
    created_at: '2026-03-18T14:00:00'
  },
  {
    id: 3,
    titulo: 'Acumulación de basura en Parque Norte',
    descripcion: 'Recolección insuficiente en área del parque y alrededores',
    estado: 'pendiente',
    prioridad: 'alta',
    area_id: 3,                  // Medio Ambiente
    total_reportes: 4,
    created_at: '2026-03-20T09:15:00'
  },
  {
    id: 4,
    titulo: 'Fuga de agua en Col. San Marcos',
    descripcion: 'Fuga permanente reportada por vecinos de la colonia',
    estado: 'resuelto',
    prioridad: 'critica',
    area_id: 5,                  // Agua y Saneamiento
    total_reportes: 6,
    created_at: '2026-03-10T08:00:00'
  },
  {
    id: 5,
    titulo: 'Semáforos dañados en cruce 5ta y Central',
    descripcion: 'Semáforos sin funcionar causando congestionamiento',
    estado: 'en_proceso',
    prioridad: 'critica',
    area_id: 4,                  // Tránsito y Movilidad
    total_reportes: 3,
    created_at: '2026-03-22T11:45:00'
  },
  {
    id: 6,
    titulo: 'Deterioro en parque infantil',
    descripcion: 'Juegos infantiles rotos y peligrosos en parque central',
    estado: 'pendiente',
    prioridad: 'media',
    area_id: 3,
    total_reportes: 2,
    created_at: '2026-03-25T16:20:00'
  },
  {
    id: 7,
    titulo: 'Drenaje obstruido en Calle Roble',
    descripcion: 'Drenaje tapado que provoca inundaciones menores al llover',
    estado: 'cerrado',
    prioridad: 'alta',
    area_id: 5,
    total_reportes: 3,
    created_at: '2026-02-28T07:30:00'
  },
  {
    id: 8,
    titulo: 'Reparación de pavimento Zona Sur',
    descripcion: 'Tramo deteriorado que afecta a vehículos y peatones',
    estado: 'rechazado',
    prioridad: 'baja',
    area_id: 1,
    total_reportes: 1,
    created_at: '2026-03-28T13:00:00'
  },
]

// ============================================
// INCIDENCIAS — Reportes individuales de ciudadanos
// Esta es la tabla principal del sistema. Cada incidencia
// puede pertenecer a un caso (caso_id) o ser independiente.
// ============================================
export const incidencias = [
  {
    id: 1,
    codigo: 'INC-00001',
    descripcion: 'Bache grande en la esquina de Av. Principal y Calle 7. Tiene aproximadamente 50cm de diámetro y representa peligro para vehículos y motociclistas.',
    estado: 'en_proceso',
    prioridad: 'alta',
    usuario_id: 1,               // Carlos Mendoza
    categoria_id: 1,             // Baches
    caso_id: 1,                  // Caso "Baches en Av. Principal"
    ubicacion: {
      direccion: 'Av. Principal esq. Calle 7',
      referencia: 'Frente a la farmacia del pueblo',
      distrito: 'Centro',
      latitud: 19.4326,
      longitud: -99.1332
    },
    created_at: '2026-03-15T10:30:00'
  },
  {
    id: 2,
    codigo: 'INC-00002',
    descripcion: 'Lámpara del poste #245 no enciende desde hace una semana. La calle queda completamente oscura por las noches.',
    estado: 'en_revision',
    prioridad: 'media',
    usuario_id: 2,               // María López
    categoria_id: 2,             // Alumbrado
    caso_id: 2,
    ubicacion: {
      direccion: 'Calle Hidalgo #120',
      referencia: 'A dos cuadras de la plaza central',
      distrito: 'Centro',
      latitud: 19.4310,
      longitud: -99.1350
    },
    created_at: '2026-03-18T14:20:00'
  },
  {
    id: 3,
    codigo: 'INC-00003',
    descripcion: 'Contenedor de basura desbordado en la entrada del parque. Genera mal olor y atrae animales.',
    estado: 'pendiente',
    prioridad: 'alta',
    usuario_id: 3,               // Juan Pérez
    categoria_id: 3,             // Basura
    caso_id: 3,
    ubicacion: {
      direccion: 'Entrada principal Parque Norte',
      referencia: 'Junto al estacionamiento',
      distrito: 'Norte',
      latitud: 19.4450,
      longitud: -99.1280
    },
    created_at: '2026-03-20T09:15:00'
  },
  {
    id: 4,
    codigo: 'INC-00004',
    descripcion: 'Fuga de agua potable visible en la banqueta. El agua corre constantemente y se desperdicia.',
    estado: 'resuelto',
    prioridad: 'critica',
    usuario_id: 4,               // Ana García
    categoria_id: 4,             // Agua
    caso_id: 4,
    ubicacion: {
      direccion: 'Col. San Marcos, Calle Pinos #45',
      referencia: 'Frente a la tienda de abarrotes',
      distrito: 'Sur',
      latitud: 19.4200,
      longitud: -99.1400
    },
    created_at: '2026-03-10T08:00:00'
  },
  {
    id: 5,
    codigo: 'INC-00005',
    descripcion: 'Semáforo en rojo permanente en cruce vehicular. Causa congestionamiento en hora pico.',
    estado: 'en_proceso',
    prioridad: 'critica',
    usuario_id: 5,               // Roberto Sánchez
    categoria_id: 6,             // Tránsito
    caso_id: 5,
    ubicacion: {
      direccion: 'Cruce 5ta Avenida y Calle Central',
      referencia: 'Frente al centro comercial',
      distrito: 'Centro',
      latitud: 19.4335,
      longitud: -99.1315
    },
    created_at: '2026-03-22T11:45:00'
  },
  {
    id: 6,
    codigo: 'INC-00006',
    descripcion: 'Bache en carril derecho de Av. Principal a la altura de Calle 9. Los vehículos deben esquivarlo invadiendo el carril contrario.',
    estado: 'en_proceso',
    prioridad: 'alta',
    usuario_id: 6,               // Lucía Fernández
    categoria_id: 1,             // Baches
    caso_id: 1,                  // Mismo caso que INC-00001
    ubicacion: {
      direccion: 'Av. Principal y Calle 9',
      referencia: 'Cerca del banco nacional',
      distrito: 'Centro',
      latitud: 19.4330,
      longitud: -99.1328
    },
    created_at: '2026-03-16T15:30:00'
  },
  {
    id: 7,
    codigo: 'INC-00007',
    descripcion: 'Juego de resbaladilla roto en el parque central. Los niños pueden lastimarse con los bordes metálicos expuestos.',
    estado: 'pendiente',
    prioridad: 'media',
    usuario_id: 7,               // Pedro Ramírez
    categoria_id: 5,             // Parques
    caso_id: 6,
    ubicacion: {
      direccion: 'Parque Central, zona de juegos',
      referencia: 'Área infantil lado norte',
      distrito: 'Centro',
      latitud: 19.4340,
      longitud: -99.1340
    },
    created_at: '2026-03-25T16:20:00'
  },
  {
    id: 8,
    codigo: 'INC-00008',
    descripcion: 'Poste de alumbrado inclinado peligrosamente. Podría caer con viento fuerte.',
    estado: 'en_revision',
    prioridad: 'alta',
    usuario_id: 8,               // Sofía Torres
    categoria_id: 2,             // Alumbrado
    caso_id: 2,
    ubicacion: {
      direccion: 'Calle Morelos #80',
      referencia: 'Esquina con la panadería',
      distrito: 'Centro',
      latitud: 19.4315,
      longitud: -99.1355
    },
    created_at: '2026-03-19T10:00:00'
  },
  {
    id: 9,
    codigo: 'INC-00009',
    descripcion: 'Basura tirada fuera de los contenedores en la zona oriente del parque. Hay bolsas acumuladas desde hace días.',
    estado: 'pendiente',
    prioridad: 'media',
    usuario_id: 1,
    categoria_id: 3,
    caso_id: 3,
    ubicacion: {
      direccion: 'Parque Norte, zona oriente',
      referencia: 'Cerca de la cancha de basquetbol',
      distrito: 'Norte',
      latitud: 19.4455,
      longitud: -99.1275
    },
    created_at: '2026-03-21T07:45:00'
  },
  {
    id: 10,
    codigo: 'INC-00010',
    descripcion: 'Fuga de agua en la calle. Se forma un charco grande que dificulta el paso de peatones.',
    estado: 'resuelto',
    prioridad: 'alta',
    usuario_id: 2,
    categoria_id: 4,
    caso_id: 4,
    ubicacion: {
      direccion: 'Col. San Marcos, Calle Cedros #12',
      referencia: 'A media cuadra de la escuela',
      distrito: 'Sur',
      latitud: 19.4205,
      longitud: -99.1395
    },
    created_at: '2026-03-11T09:30:00'
  },
  {
    id: 11,
    codigo: 'INC-00011',
    descripcion: 'Nuevo bache formándose en Av. Principal cerca de Calle 5. Aún es pequeño pero crece rápido.',
    estado: 'pendiente',
    prioridad: 'media',
    usuario_id: 3,
    categoria_id: 1,
    caso_id: 1,
    ubicacion: {
      direccion: 'Av. Principal y Calle 5',
      referencia: 'Frente a la cafetería',
      distrito: 'Centro',
      latitud: 19.4322,
      longitud: -99.1338
    },
    created_at: '2026-03-17T12:00:00'
  },
  {
    id: 12,
    codigo: 'INC-00012',
    descripcion: 'Ruido excesivo de construcción en horarios no autorizados. Trabajan desde las 6am incluyendo fines de semana.',
    estado: 'en_revision',
    prioridad: 'baja',
    usuario_id: 4,
    categoria_id: 8,             // Ruido
    caso_id: null,               // Sin caso asociado
    ubicacion: {
      direccion: 'Calle Roble #78',
      referencia: 'Construcción nueva junto al parque',
      distrito: 'Este',
      latitud: 19.4380,
      longitud: -99.1250
    },
    created_at: '2026-03-26T06:30:00'
  },
  {
    id: 13,
    codigo: 'INC-00013',
    descripcion: 'Hundimiento en la banqueta. Posible problema de drenaje debajo.',
    estado: 'en_proceso',
    prioridad: 'alta',
    usuario_id: 5,
    categoria_id: 7,             // Infraestructura
    caso_id: null,
    ubicacion: {
      direccion: 'Calle Álamo #200',
      referencia: 'Frente a la biblioteca pública',
      distrito: 'Oeste',
      latitud: 19.4350,
      longitud: -99.1420
    },
    created_at: '2026-03-27T14:15:00'
  },
  {
    id: 14,
    codigo: 'INC-00014',
    descripcion: 'Drenaje tapado emite olor fétido. Los vecinos reportan molestias constantes.',
    estado: 'cerrado',
    prioridad: 'alta',
    usuario_id: 6,
    categoria_id: 4,
    caso_id: 7,                  // Caso cerrado
    ubicacion: {
      direccion: 'Calle Roble #30',
      referencia: 'Esquina con Av. Las Flores',
      distrito: 'Norte',
      latitud: 19.4460,
      longitud: -99.1300
    },
    created_at: '2026-02-28T07:30:00'
  },
  {
    id: 15,
    codigo: 'INC-00015',
    descripcion: 'Señalización vial borrada en cruce peatonal. Los peatones cruzan sin protección.',
    estado: 'pendiente',
    prioridad: 'media',
    usuario_id: 7,
    categoria_id: 6,
    caso_id: 5,
    ubicacion: {
      direccion: 'Calle Central #50',
      referencia: 'Frente a la escuela secundaria',
      distrito: 'Centro',
      latitud: 19.4332,
      longitud: -99.1318
    },
    created_at: '2026-03-23T08:00:00'
  },
  {
    id: 16,
    codigo: 'INC-00016',
    descripcion: 'Árbol caído bloqueando parcialmente la banqueta. Necesita ser removido.',
    estado: 'rechazado',
    prioridad: 'baja',
    usuario_id: 8,
    categoria_id: 5,
    caso_id: null,
    ubicacion: {
      direccion: 'Camino al Parque Ecológico',
      referencia: 'A 200m de la entrada',
      distrito: 'Este',
      latitud: 19.4385,
      longitud: -99.1245
    },
    created_at: '2026-03-28T13:00:00'
  },
  {
    id: 17,
    codigo: 'INC-00017',
    descripcion: 'Fuga de agua en registro roto. El agua brota con presión.',
    estado: 'resuelto',
    prioridad: 'critica',
    usuario_id: 1,
    categoria_id: 4,
    caso_id: 4,
    ubicacion: {
      direccion: 'Col. San Marcos, Av. Central #8',
      referencia: 'Junto a la gasolinera',
      distrito: 'Sur',
      latitud: 19.4195,
      longitud: -99.1405
    },
    created_at: '2026-03-12T11:00:00'
  },
  {
    id: 18,
    codigo: 'INC-00018',
    descripcion: 'Contenedor de reciclaje dañado. La tapa no cierra y los residuos se dispersan con el viento.',
    estado: 'pendiente',
    prioridad: 'baja',
    usuario_id: 2,
    categoria_id: 3,
    caso_id: 3,
    ubicacion: {
      direccion: 'Parque Norte, entrada sur',
      referencia: 'Junto al transformador eléctrico',
      distrito: 'Norte',
      latitud: 19.4445,
      longitud: -99.1285
    },
    created_at: '2026-03-22T15:30:00'
  },
  {
    id: 19,
    codigo: 'INC-00019',
    descripcion: 'Tres lámparas consecutivas sin funcionar. Tramo oscuro de aproximadamente 100 metros.',
    estado: 'en_revision',
    prioridad: 'media',
    usuario_id: 3,
    categoria_id: 2,
    caso_id: 2,
    ubicacion: {
      direccion: 'Calle Juárez #150-170',
      referencia: 'Zona de restaurantes del centro',
      distrito: 'Centro',
      latitud: 19.4305,
      longitud: -99.1360
    },
    created_at: '2026-03-20T19:00:00'
  },
  {
    id: 20,
    codigo: 'INC-00020',
    descripcion: 'Grieta en el pavimento que se extiende por 3 metros. Peligro para ciclistas.',
    estado: 'en_proceso',
    prioridad: 'alta',
    usuario_id: 4,
    categoria_id: 1,
    caso_id: 1,
    ubicacion: {
      direccion: 'Av. Principal entre Calles 10 y 11',
      referencia: 'Frente al estacionamiento público',
      distrito: 'Centro',
      latitud: 19.4328,
      longitud: -99.1325
    },
    created_at: '2026-03-18T16:45:00'
  },
  {
    id: 21,
    codigo: 'INC-00021',
    descripcion: 'Coladera sin tapa en paso peatonal. Riesgo de accidente para personas y mascotas.',
    estado: 'en_proceso',
    prioridad: 'critica',
    usuario_id: 5,
    categoria_id: 7,
    caso_id: null,
    ubicacion: {
      direccion: 'Calle Reforma #22',
      referencia: 'Cruce con Av. Independencia',
      distrito: 'Centro',
      latitud: 19.4338,
      longitud: -99.1335
    },
    created_at: '2026-03-29T08:20:00'
  },
  {
    id: 22,
    codigo: 'INC-00022',
    descripcion: 'Escombros abandonados en terreno baldío. Riesgo de proliferación de fauna nociva.',
    estado: 'pendiente',
    prioridad: 'baja',
    usuario_id: 6,
    categoria_id: 3,
    caso_id: null,
    ubicacion: {
      direccion: 'Calle Nogal s/n',
      referencia: 'Terreno baldío junto a la tortillería',
      distrito: 'Oeste',
      latitud: 19.4355,
      longitud: -99.1415
    },
    created_at: '2026-03-30T10:10:00'
  },
  {
    id: 23,
    codigo: 'INC-00023',
    descripcion: 'Bache profundo en calle residencial. Varios vehículos han sufrido daños.',
    estado: 'pendiente',
    prioridad: 'alta',
    usuario_id: 7,
    categoria_id: 1,
    caso_id: 1,
    ubicacion: {
      direccion: 'Av. Principal y Calle 12',
      referencia: 'Frente al consultorio dental',
      distrito: 'Centro',
      latitud: 19.4324,
      longitud: -99.1320
    },
    created_at: '2026-03-19T09:00:00'
  },
  {
    id: 24,
    codigo: 'INC-00024',
    descripcion: 'Semáforo emite señales intermitentes. Confunde a los conductores.',
    estado: 'en_proceso',
    prioridad: 'alta',
    usuario_id: 8,
    categoria_id: 6,
    caso_id: 5,
    ubicacion: {
      direccion: '5ta Avenida y Calle Central',
      referencia: 'Esquina noroeste del cruce',
      distrito: 'Centro',
      latitud: 19.4336,
      longitud: -99.1312
    },
    created_at: '2026-03-23T17:30:00'
  },
  {
    id: 25,
    codigo: 'INC-00025',
    descripcion: 'Bancas del parque vandalizadas. Necesitan reparación o reemplazo.',
    estado: 'pendiente',
    prioridad: 'baja',
    usuario_id: 1,
    categoria_id: 5,
    caso_id: 6,
    ubicacion: {
      direccion: 'Parque Central, área de descanso',
      referencia: 'Cerca de la fuente',
      distrito: 'Centro',
      latitud: 19.4342,
      longitud: -99.1342
    },
    created_at: '2026-03-26T11:00:00'
  },
  {
    id: 26,
    codigo: 'INC-00026',
    descripcion: 'Tubería rota visible en la calle. Desperdicio constante de agua potable.',
    estado: 'resuelto',
    prioridad: 'critica',
    usuario_id: 2,
    categoria_id: 4,
    caso_id: 4,
    ubicacion: {
      direccion: 'Col. San Marcos, Calle Olivos #67',
      referencia: 'A una cuadra del mercado',
      distrito: 'Sur',
      latitud: 19.4198,
      longitud: -99.1398
    },
    created_at: '2026-03-13T06:45:00'
  },
  {
    id: 27,
    codigo: 'INC-00027',
    descripcion: 'Alcantarilla obstruida. Cuando llueve se inunda la esquina completa.',
    estado: 'cerrado',
    prioridad: 'alta',
    usuario_id: 3,
    categoria_id: 4,
    caso_id: 7,
    ubicacion: {
      direccion: 'Calle Roble y Av. Las Flores',
      referencia: 'Esquina suroeste',
      distrito: 'Norte',
      latitud: 19.4462,
      longitud: -99.1298
    },
    created_at: '2026-03-01T13:20:00'
  },
  {
    id: 28,
    codigo: 'INC-00028',
    descripcion: 'Construcción genera vibraciones que afectan casas vecinas. Los muros presentan grietas nuevas.',
    estado: 'en_revision',
    prioridad: 'alta',
    usuario_id: 4,
    categoria_id: 8,
    caso_id: null,
    ubicacion: {
      direccion: 'Calle Roble #80',
      referencia: 'Mismo predio que INC-00012',
      distrito: 'Este',
      latitud: 19.4382,
      longitud: -99.1248
    },
    created_at: '2026-03-27T10:00:00'
  },
  {
    id: 29,
    codigo: 'INC-00029',
    descripcion: 'Muro perimetral del parque dañado. Se pueden ver grietas estructurales visibles.',
    estado: 'pendiente',
    prioridad: 'media',
    usuario_id: 5,
    categoria_id: 7,
    caso_id: null,
    ubicacion: {
      direccion: 'Parque Norte, barda perimetral este',
      referencia: 'Sección cerca del estacionamiento',
      distrito: 'Norte',
      latitud: 19.4448,
      longitud: -99.1272
    },
    created_at: '2026-03-31T08:30:00'
  },
  {
    id: 30,
    codigo: 'INC-00030',
    descripcion: 'Drenaje pluvial desbordado en temporada de lluvias. Inunda calles aledañas.',
    estado: 'cerrado',
    prioridad: 'alta',
    usuario_id: 6,
    categoria_id: 4,
    caso_id: 7,
    ubicacion: {
      direccion: 'Calle Roble #45',
      referencia: 'Frente al consultorio médico',
      distrito: 'Norte',
      latitud: 19.4458,
      longitud: -99.1295
    },
    created_at: '2026-03-02T16:00:00'
  },
]

// ============================================
// HISTORIAL DE ESTADOS — Cambios de estado de cada incidencia
// Cada vez que un administrador cambia el estado, se registra aquí
// con comentario opcional y quién realizó el cambio.
// ============================================
export const historialEstados = [
  // Historial de INC-00001: pendiente → en_revision → en_proceso
  {
    id: 1,
    incidencia_id: 1,
    estado_anterior: null,
    estado_nuevo: 'pendiente',
    comentario: 'Incidencia registrada por el ciudadano',
    usuario_id: 1,
    created_at: '2026-03-15T10:30:00'
  },
  {
    id: 2,
    incidencia_id: 1,
    estado_anterior: 'pendiente',
    estado_nuevo: 'en_revision',
    comentario: 'Se asignó al equipo de Obras Públicas para inspección',
    usuario_id: 9,               // Inspector Diego
    created_at: '2026-03-16T09:00:00'
  },
  {
    id: 3,
    incidencia_id: 1,
    estado_anterior: 'en_revision',
    estado_nuevo: 'en_proceso',
    comentario: 'Se programó reparación para la próxima semana. Material solicitado.',
    usuario_id: 9,
    created_at: '2026-03-17T14:30:00'
  },
  // Historial de INC-00004: pendiente → en_revision → en_proceso → resuelto
  {
    id: 4,
    incidencia_id: 4,
    estado_anterior: null,
    estado_nuevo: 'pendiente',
    comentario: 'Reporte recibido con urgencia alta',
    usuario_id: 4,
    created_at: '2026-03-10T08:00:00'
  },
  {
    id: 5,
    incidencia_id: 4,
    estado_anterior: 'pendiente',
    estado_nuevo: 'en_revision',
    comentario: 'Equipo de emergencia notificado',
    usuario_id: 10,
    created_at: '2026-03-10T08:30:00'
  },
  {
    id: 6,
    incidencia_id: 4,
    estado_anterior: 'en_revision',
    estado_nuevo: 'en_proceso',
    comentario: 'Cuadrilla en sitio. Se cortó el suministro temporalmente para reparar.',
    usuario_id: 10,
    created_at: '2026-03-10T10:00:00'
  },
  {
    id: 7,
    incidencia_id: 4,
    estado_anterior: 'en_proceso',
    estado_nuevo: 'resuelto',
    comentario: 'Fuga reparada exitosamente. Suministro restablecido.',
    usuario_id: 10,
    created_at: '2026-03-11T16:00:00'
  },
  // INC-00016: pendiente → rechazado
  {
    id: 8,
    incidencia_id: 16,
    estado_anterior: null,
    estado_nuevo: 'pendiente',
    comentario: 'Reporte registrado',
    usuario_id: 8,
    created_at: '2026-03-28T13:00:00'
  },
  {
    id: 9,
    incidencia_id: 16,
    estado_anterior: 'pendiente',
    estado_nuevo: 'rechazado',
    comentario: 'Árbol está en propiedad privada. No corresponde a la municipalidad.',
    usuario_id: 11,
    created_at: '2026-03-29T10:00:00'
  },
]

// ============================================
// ASIGNACIONES — Inspectores asignados a casos
// Registran quién fue asignado, por quién, y la fecha límite.
// ============================================
export const asignaciones = [
  {
    id: 1,
    caso_id: 1,
    asignado_a: 9,               // Diego Vargas (inspector)
    asignado_por: 10,            // Laura Morales (asignó)
    fecha_limite: '2026-04-05',
    notas: 'Priorizar reparación de los baches más grandes primero',
    estado: 'activa',
    created_at: '2026-03-17T09:00:00'
  },
  {
    id: 2,
    caso_id: 2,
    asignado_a: 10,              // Laura Morales
    asignado_por: 9,
    fecha_limite: '2026-04-02',
    notas: 'Coordinar con empresa eléctrica para el reemplazo de postes',
    estado: 'activa',
    created_at: '2026-03-19T11:00:00'
  },
  {
    id: 3,
    caso_id: 4,
    asignado_a: 9,
    asignado_por: 12,
    fecha_limite: '2026-03-15',
    notas: 'URGENTE: Fuga de alto volumen',
    estado: 'completada',
    created_at: '2026-03-10T08:15:00'
  },
  {
    id: 4,
    caso_id: 5,
    asignado_a: 12,              // Carmen Ruiz
    asignado_por: 9,
    fecha_limite: '2026-04-01',
    notas: 'Revisar controlador del semáforo y cableado eléctrico',
    estado: 'activa',
    created_at: '2026-03-22T14:00:00'
  },
  {
    id: 5,
    caso_id: 7,
    asignado_a: 11,              // Andrés Jiménez
    asignado_por: 10,
    fecha_limite: '2026-03-10',
    notas: 'Desazolvar drenaje y verificar estructura',
    estado: 'completada',
    created_at: '2026-03-01T09:00:00'
  },
]

// ============================================
// ARCHIVOS MULTIMEDIA — Fotos/videos adjuntos a incidencias
// Cada incidencia puede tener múltiples archivos.
// Las URLs son placeholders (en producción vendrían del servidor).
// ============================================
export const archivosMultimedia = [
  {
    id: 1,
    incidencia_id: 1,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    miniatura_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=150',
    created_at: '2026-03-15T10:30:00'
  },
  {
    id: 2,
    incidencia_id: 1,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400',
    miniatura_url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=150',
    created_at: '2026-03-15T10:31:00'
  },
  {
    id: 3,
    incidencia_id: 3,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    miniatura_url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=150',
    created_at: '2026-03-20T09:15:00'
  },
  {
    id: 4,
    incidencia_id: 4,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1584824486539-74b1e600d4e6?w=400',
    miniatura_url: 'https://images.unsplash.com/photo-1584824486539-74b1e600d4e6?w=150',
    created_at: '2026-03-10T08:00:00'
  },
  {
    id: 5,
    incidencia_id: 5,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    miniatura_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=150',
    created_at: '2026-03-22T11:45:00'
  },
]

// ============================================
// EVIDENCIA DE RESOLUCIÓN — Fotos que sube el inspector al resolver
// Demuestra que el caso fue atendido correctamente.
// ============================================
export const evidenciaResolucion = [
  {
    id: 1,
    caso_id: 4,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
    descripcion: 'Tubería reparada y sellada. Prueba de presión satisfactoria.',
    subido_por: 9,               // Inspector Diego
    created_at: '2026-03-11T16:00:00'
  },
  {
    id: 2,
    caso_id: 7,
    tipo: 'foto',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
    descripcion: 'Drenaje desazolvado. Flujo de agua normalizado.',
    subido_por: 11,              // Inspector Andrés
    created_at: '2026-03-08T15:30:00'
  },
]

// ============================================
// FUNCIONES HELPER — Utilidades para buscar datos relacionados
// Estas funciones simulan las JOINs de la base de datos.
// ============================================

/**
 * Busca un usuario por su ID
 * @param {number} id - ID del usuario
 * @returns {object|undefined} Objeto usuario o undefined si no existe
 */
export const getUsuarioById = (id) => usuarios.find(u => u.id === id)

/**
 * Busca una categoría por su ID
 * @param {number} id - ID de la categoría
 * @returns {object|undefined} Objeto categoría o undefined si no existe
 */
export const getCategoriaById = (id) => categorias.find(c => c.id === id)

/**
 * Busca un área municipal por su ID
 * @param {number} id - ID del área
 * @returns {object|undefined} Objeto área o undefined si no existe
 */
export const getAreaById = (id) => areasMunicipales.find(a => a.id === id)

/**
 * Busca un caso por su ID
 * @param {number} id - ID del caso
 * @returns {object|undefined} Objeto caso o undefined si no existe
 */
export const getCasoById = (id) => casos.find(c => c.id === id)

/**
 * Obtiene todas las incidencias que pertenecen a un caso
 * @param {number} casoId - ID del caso
 * @returns {array} Array de incidencias filtradas
 */
export const getIncidenciasByCaso = (casoId) => incidencias.filter(i => i.caso_id === casoId)

/**
 * Obtiene el historial de estado de una incidencia específica
 * @param {number} incidenciaId - ID de la incidencia
 * @returns {array} Array de cambios de estado, ordenados cronológicamente
 */
export const getHistorialByIncidencia = (incidenciaId) =>
  historialEstados
    .filter(h => h.incidencia_id === incidenciaId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))  // Más reciente primero

/**
 * Obtiene los archivos multimedia de una incidencia
 * @param {number} incidenciaId - ID de la incidencia
 * @returns {array} Array de archivos multimedia
 */
export const getMultimediaByIncidencia = (incidenciaId) =>
  archivosMultimedia.filter(a => a.incidencia_id === incidenciaId)

/**
 * Obtiene las asignaciones de un caso
 * @param {number} casoId - ID del caso
 * @returns {array} Array de asignaciones
 */
export const getAsignacionesByCaso = (casoId) =>
  asignaciones.filter(a => a.caso_id === casoId)

/**
 * Obtiene la evidencia de resolución de un caso
 * @param {number} casoId - ID del caso
 * @returns {array} Array de evidencias
 */
export const getEvidenciaByCaso = (casoId) =>
  evidenciaResolucion.filter(e => e.caso_id === casoId)

/**
 * Mapeo de nombres legibles para cada estado
 * Se usa para mostrar textos amigables al usuario
 */
export const estadoLabels = {
  pendiente: 'Pendiente',
  en_revision: 'En Revisión',
  en_proceso: 'En Proceso',
  resuelto: 'Resuelto',
  rechazado: 'Rechazado',
  cerrado: 'Cerrado',
}

/**
 * Mapeo de nombres legibles para cada nivel de prioridad
 */
export const prioridadLabels = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
}

/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} dateStr - Fecha en formato ISO (ej: '2026-03-15T10:30:00')
 * @returns {string} Fecha formateada (ej: '15 mar 2026, 10:30')
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea solo la fecha sin hora
 * @param {string} dateStr - Fecha en formato ISO
 * @returns {string} Fecha formateada (ej: '15 mar 2026')
 */
export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
