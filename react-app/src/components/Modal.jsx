// src/components/Modal.jsx
import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo semitransparente */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />

      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg p-6 z-10 max-w-lg w-full relative">
        {/* Botón para cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Contenido que envíes desde TrayectosEspeciales */}
        {children}
      </div>
    </div>
  );
}
