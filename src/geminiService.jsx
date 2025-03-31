import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCgKuiE0hm1NA5B5VLnmu_853sp6BXMj_I" });

export default async function main({ message ,tags = []}) {  // ✅ Evita error si no se pasa argumento
  if (!message) {
    console.error("Error: No se proporcionó ningún mensaje a main()");
    return "Error: Mensaje vacío.";
  }

  try {
    const tagsString = tags.join(",");
    
    const completeMessage = "Contestame únicamente con las palabras entre [] Consideras que este frase entre {} cumple alguna de estas etiquetas?: {"+ message +"}. Contesta únicamente con ["+tagsString+"], pueden ser varias respuestas, pero tienen que ser solamente las palabras que estan entre[] y separadas por , . Además quiero que me lo devuelvas sin ningún enter (/n) de forma oculta.";
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: completeMessage }] }] 
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de Gemini.";
  } catch (error) {
    console.error("Error al llamar a Gemini:", error);
    return "Error al obtener respuesta de Gemini.";
  }
}

//Un judío y un escocés están cenando juntos. Al final de la cena, se oye al escocés decir: Yo pagaré. El titular del periódico a la mañana siguiente dice: Ventrílocuo judío encontrado muerto en un callejón