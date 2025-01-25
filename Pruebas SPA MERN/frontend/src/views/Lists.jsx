import axios from "axios";
import { useEffect, useState } from "react";

const api = axios.create({
  baseURL: "http://localhost:5001", // URL del backend
});

function Lists() {
  const [message, setMessage] = useState("Nada que ver por aquí...");

  useEffect(() => {
    api
      .get("/")
      .then((respuesta) => setMessage(respuesta.data))
      .catch((error) => console.error(error));
    }, []);

  return (
    <div>
      <h1>React + Vite</h1>
      <p>Mensaje del servidor: {message}</p>
    </div>
  );
}

export default Lists;
