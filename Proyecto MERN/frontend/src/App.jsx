import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '' });

  const apiUrl = 'http://localhost:5001/users'; // URL del backend

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Crear un nuevo usuario
  const createUser = async () => {
    try {
      const response = await axios.post(apiUrl, newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  // Actualizar un usuario
  const updateUser = async () => {
    try {
      const response = await axios.put(`${apiUrl}/${editUser.id}`, editUser);
      const updatedUsers = users.map(user =>
        user.id === editUser.id ? response.data : user
      );
      setUsers(updatedUsers);
      setEditUser({ id: '', name: '', email: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  // Eliminar un usuario
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Gestión de Usuarios</h1>

      {/* Crear Usuario */}
      <div>
        <h2>Crear Usuario</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={createUser}>Crear Usuario</button>
      </div>

      {/* Listar Usuarios */}
      <div>
        <h2>Usuarios</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
              <button onClick={() => setEditUser(user)}>Editar</button>
              <button onClick={() => deleteUser(user.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Editar Usuario */}
      {editUser.id && (
        <div>
          <h2>Editar Usuario</h2>
          <input
            type="text"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <button onClick={updateUser}>Actualizar Usuario</button>
        </div>
      )}
    </div>
  );
};

export default App;
