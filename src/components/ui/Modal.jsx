/**
 * Modal.jsx — Componente de ventana modal reutilizable
 * 
 * Se usa para mostrar contenido superpuesto sobre la página,
 * con un overlay oscuro detrás que bloquea la interacción
 * con el contenido de fondo.
 * 
 * Características:
 * - Se cierra al hacer clic en el overlay
 * - Se cierra con el botón X
 * - Animación de entrada (slideUp + fadeIn)
 * - Header con título y botón cerrar
 * - Body para contenido libre
 * - Footer opcional para botones de acción
 * 
 * Uso:
 *   <Modal
 *     isOpen={showModal}
 *     onClose={() => setShowModal(false)}
 *     title="Cambiar Estado"
 *   >
 *     <p>Contenido del modal...</p>
 *   </Modal>
 */

import { X } from 'lucide-react'

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {React.ReactNode} [props.footer] - Botones de acción (opcional)
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  // No renderizar nada si el modal no está abierto
  if (!isOpen) return null

  return (
    // Overlay oscuro con blur — se cierra al hacer clic
    <div className="modal-overlay" onClick={onClose}>
      {/* 
        Caja del modal — stopPropagation evita que el clic
        dentro del modal lo cierre accidentalmente
      */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {/* Botón cerrar (X) */}
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del modal — contenido libre */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer opcional — botones de acción */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
