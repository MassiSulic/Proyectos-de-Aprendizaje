import React from 'react';

function Dashboard() {
  const userName = localStorage.getItem('userName'); // Obtén el nombre del usuario

  return (
    <div>
      <h1>Bienvenido, {userName}!</h1>
      <p>Este es tu dashboard.</p>
    </div>
  );
}

export default Dashboard;