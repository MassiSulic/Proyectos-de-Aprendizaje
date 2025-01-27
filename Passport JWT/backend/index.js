const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Importar bcrypt
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_password',
  database: 'mi_base_de_datos',
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Configurar la estrategia de autenticación con JWT
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'tu_secreto_jwt',
};

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, done) => {
    // Verificar si el usuario existe en la base de datos usando el ID del payload del JWT
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [jwtPayload.id], (err, results) => {
      if (err) {
        return done(err, false);
      }
      if (results.length > 0) {
        const user = results[0];
        return done(null, user); // Usuario encontrado
      } else {
        return done(null, false); // Usuario no encontrado
      }
    });
  })
);

// Ruta de login (genera un JWT)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en la base de datos
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error en la base de datos' });
    }

    // Verificar si el usuario existe
    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verificar la contraseña usando bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar el JWT
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1h' });
    res.json({ mensaje: 'Login exitoso', token });
  });
});

// Ruta protegida (requiere autenticación con JWT)
app.get('/protegido', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ mensaje: 'Acceso concedido a ruta protegida', user: req.user });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});