import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para manejar el login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      setMensaje('Login exitoso');
    } catch (error) {
      setMensaje('Usuario o contraseña incorrectos');
    }
  };

  // Función para acceder a una ruta protegida
  const handleProtected = async () => {
    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje('No hay token, por favor inicia sesión');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/protegido', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje(response.data.mensaje);
    } catch (error) {
      setMensaje('Acceso denegado');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleProtected}>Acceder a ruta protegida</button>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;