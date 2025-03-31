import React, { useState } from "react";
import main from "./geminiService";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;
    const chatResponse = await main({mensaje: input});
    setResponse(chatResponse);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat con Gemini AI</h2>
      <textarea
        rows="3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <br />
      <button onClick={handleSend}>Enviar</button>
      <h3>Respuesta:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;
