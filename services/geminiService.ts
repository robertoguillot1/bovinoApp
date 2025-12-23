import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeHealthStatus = async (symptoms: string, breed: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Actúa como un asistente experto veterinario. 
      Tengo un bovino de raza ${breed} que presenta los siguientes síntomas: ${symptoms}.
      Proporciona un breve análisis de los posibles problemas y 3 acciones inmediatas recomendadas.
      Responde en ESPAÑOL. Mantén el tono profesional pero conciso para una aplicación móvil.
    `;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "No hay análisis disponible en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Servicio de IA no disponible. Por favor revise su conexión.";
  }
};

export const suggestHerdOptimization = async (farmData: string): Promise<string> => {
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          Analiza este resumen de datos de la finca: ${farmData}.
          Sugiere 2 consejos rápidos de optimización para la producción de leche y la salud del hato.
          Responde en ESPAÑOL. Formato de lista con viñetas cortas.
        `;
        
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        
        return response.text || "Consejos de optimización no disponibles.";
      } catch (error) {
        console.error("Gemini API Error:", error);
        return "Consejos no disponibles.";
      }
}

export const consultVeterinarian = async (message: string, base64Image?: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-latest for robust multimodal (vision + text) capabilities
    const model = 'gemini-2.5-flash-latest';
    
    const parts: any[] = [{ text: message }];

    if (base64Image) {
      // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
      const cleanBase64 = base64Image.split(',')[1] || base64Image;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: `
          Eres un Veterinario Experto en ganadería bovina (IA BovineGuard).
          Tu objetivo es analizar síntomas descritos o imágenes de animales enfermos.
          1. Identifica posibles patologías basándote en la imagen o texto.
          2. Sugiere tratamientos farmacológicos comunes (principios activos) y medidas de manejo.
          3. IMPORTANTE: Siempre incluye un descargo de responsabilidad indicando que eres una IA y se debe consultar a un veterinario presencial para casos graves.
          4. Sé empático, profesional y directo. Usa formato Markdown para listas y negritas.
        `
      }
    });

    return response.text || "No pude procesar tu consulta. Intenta nuevamente.";
  } catch (error) {
    console.error("Gemini Vet Error:", error);
    return "Error de conexión con el servicio veterinario. Por favor verifica tu internet.";
  }
};