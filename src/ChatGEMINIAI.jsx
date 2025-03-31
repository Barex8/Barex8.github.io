import React, { useState } from "react";
import main from "./geminiService";

export default function Chat({tagsName,returnResponse}) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;
    const chatResponse = await main({message: input,tags: tagsName});
    
    console.log("Respuesta de la IA:", chatResponse);
    if (typeof chatResponse !== "string") {
      console.error("Error: chatResponse no es un string", chatResponse);
      return;
    }
    
    const convertedArray = chatResponse.replace(/[\[\]]/g, "").split(",");   
    returnResponse(convertedArray);

    setResponse(chatResponse);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat con Gemini AI</h2>
      <textarea
        rows="3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu chiste..."
      />
      <br />
      <button onClick={handleSend}>Enviar</button>
      <h3>Respuesta:</h3>
      <p>{response}</p>
    </div>
  );
}