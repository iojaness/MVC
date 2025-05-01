// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "../App.css"; // puedes mover los estilos ahí o dejarlos en App.css

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">Nexus</div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/proyectos">Proyectos</Link></li>
        <li><Link to="/documentacion">Documentación</Link></li>
        <li><Link to="/scrum">Scrum</Link></li>
        <li><Link to="/horas">Horas</Link></li>
      </ul>
    </nav>
  );
}
