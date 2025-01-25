const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Datos recibidos:', { name, email, password }); // Log de depuración

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('Usuario ya existe:', existingUser); // Log de depuración
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword); // Log de depuración

    // Crea el usuario
    const newUser = { name, email, password: hashedPassword };
    const userId = await User.create(newUser);
    console.log('Usuario creado con ID:', userId); // Log de depuración

    // Genera un token JWT
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generado:', token); // Log de depuración

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error en el servidor:', error); // Log de depuración
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Envía el nombre del usuario en la respuesta
    res.json({ token, user: { name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

module.exports = { register, login };