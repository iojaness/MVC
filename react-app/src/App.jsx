import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes
import Navbar from './components/Navbar.jsx';

// Páginas
import Home from './pages/Home.jsx';
import TrayectosEspeciales from './pages/TrayectosEspeciales.jsx';

// ...
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/trayectos-especiales" element={<TrayectosEspeciales />} />
</Routes>


function App() {
  const [user, setUser]           = useState('');
  const [pass, setPass]           = useState('');
  const [mensaje, setMensaje]     = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    const data = await res.json();
    if (res.ok) {
      setLoggedIn(true);
      setMensaje('');
    } else {
      setMensaje(`❌ ${data.error}`);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Si NO está logueado → mostrar login */}
      {!isLoggedIn ? (
        <div className="login-container">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuario"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
            <button type="submit">Ingresar</button>
          </form>
          {mensaje && <p className="message">{mensaje}</p>}
        </div>
      ) : (
        // Si está logueado → Navbar + Rutas
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trayectos-especiales" element={<TrayectosEspeciales />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
