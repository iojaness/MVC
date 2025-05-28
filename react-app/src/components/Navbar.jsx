// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../App.css';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Mi App
      </Link>

      <ul className="flex items-center gap-6">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>

        <li className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="hover:underline focus:outline-none flex items-center gap-1"
          >
            Carga de información <span>▾</span>
          </button>
          {openDropdown && (
            <ul className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-lg w-48 z-10">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/trayectos-especiales">Trayectos Especiales</Link>
              </li>
              {/* Si luego agregas más secciones, van acá */}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
