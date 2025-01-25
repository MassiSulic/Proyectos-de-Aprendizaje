import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/Lists">Lists</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Register">Register</Link></li>
        <li><Link to="/Dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;