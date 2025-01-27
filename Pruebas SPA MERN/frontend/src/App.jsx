// Codigo funcionando pero no verifica el token el backend

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//Components
import Navbar from "./components/Navbar.jsx";

// Views
import Home from "./views/Home.jsx";
import Lists from "./views/Lists.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Dashboard from "./views/Dashboard.jsx";

function App() {

  let token = localStorage.getItem('token')

  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Lists" element={<Lists />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Dashboard" element={ !token ? <Login /> : <Dashboard />} />
    </Routes>
  </Router>
  )
  
}

export default App;
