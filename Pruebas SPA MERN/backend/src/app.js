const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Crear una instancia de Express
const app = express();

app.use(cors({
  origin: '*',
  credentials: true, // Permite el envío de cookies y encabezados de autenticación
}));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Clave secreta para firmar los tokens JWT (debería estar en variables de entorno)
const JWT_SECRET = 'mi_clave_secreta';

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de la solicitud
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token, denegar el acceso
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // Guardar el ID del usuario en la solicitud
    next(); // Permitir el acceso a la ruta protegida
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

// Ruta de registro
app.post('/auth/register', (req, res) => {
  const { email, password } = req.body;

  // Aquí deberías guardar el usuario en una base de datos
  // Por simplicidad, solo generamos un token sin guardar el usuario
  const userId = 1; // ID ficticio del usuario

  // Generar un token JWT
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

  // Devolver el token al frontend
  res.json({ token });
});

// Ruta de login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simulación de verificación de credenciales
  const userId = 1; // ID ficticio del usuario

  // Generar un token JWT
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

  // Devolver el token al frontend
  res.json({ token });
});

// Ruta protegida (requiere autenticación)
app.get('/api/protected', authMiddleware, (req, res) => {
  // Si el middleware de autenticación pasa, el usuario está autenticado
  res.json({ message: 'Esta es una ruta protegida.', userId: req.userId });
});

// Ruta para verificar el token
app.get('/auth/verify-token', authMiddleware, (req, res) => {
  // Si el token es válido, el middleware pasa y devolvemos un mensaje de éxito
  res.json({ isValid: true, userId: req.userId });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});