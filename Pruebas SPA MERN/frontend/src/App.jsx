import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Configuración de Axios para comunicarse con el backend
const api = axios.create({
  baseURL: 'http://localhost:3001', // URL del backend
});

// Función para configurar el token en los headers de Axios
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Función para verificar si el token es válido
const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify-token');
    return response.data.isValid;
  } catch (error) {
    console.error('Error verificando el token:', error);
    return false;
  }
};

// Componente principal de la aplicación
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token); // Configurar el token en los headers de Axios
        const isValid = await verifyToken(); // Verificar el token con el backend
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función para manejar el login
  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password }); // Ruta correcta
      const { token } = response.data;
  
      localStorage.setItem('token', token);
      setAuthToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };
  

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    setIsAuthenticated(false); // Marcar al usuario como no autenticado
  };

  // Si está cargando, mostrar un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <nav>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

// Componente de Login
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password); // Llamar a la función de login
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

// Componente de Dashboard (ruta protegida)
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido a la ruta protegida.</p>
    </div>
  );
}

// Componente de Home
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Esta es la página de inicio.</p>
    </div>
  );
}

export default App;