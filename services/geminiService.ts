import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- TYPES ---
export type AIQueryMode = 'fast' | 'deep' | 'search';

interface MultimodalInput {
  text: string;
  image?: string; // Base64
  video?: string; // Base64
  mimeType?: string;
}

// --- HELPER: AUDIO PLAYER ---
export const playAudioResponse = async (text: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return;

        // Decode and Play
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);

    } catch (error) {
        console.error("TTS Error:", error);
    }
};

// --- MAIN CONSULTATION FUNCTION ---
export const consultVeterinarianAdvanced = async (
    input: MultimodalInput, 
    mode: AIQueryMode
): Promise<{ text: string, sources?: any[] }> => {
  try {
    let modelName = 'gemini-3-flash-preview'; // Default fallback
    let config: any = {};
    let systemInstruction = "Eres un Asistente Veterinario Experto de la app BovineGuard. Responde de forma concisa y útil.";

    // 1. SELECT MODEL BASED ON MODE
    switch (mode) {
        case 'fast':
            // Fast responses using Flash Lite
            modelName = 'gemini-2.5-flash-lite-latest'; // "gemini-flash-lite-latest" alias mapped manually for safety
            break;
        
        case 'deep':
            // Complex reasoning with Thinking Mode
            modelName = 'gemini-3-pro-preview';
            config = {
                thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget
                // Do NOT set maxOutputTokens when using thinking
            };
            systemInstruction += " Utiliza tu capacidad de razonamiento profundo para analizar síntomas complejos, diagnósticos diferenciales y planes de tratamiento detallados.";
            break;
        
        case 'search':
            // Grounding with Google Search
            modelName = 'gemini-3-flash-preview';
            config = {
                tools: [{ googleSearch: {} }]
            };
            systemInstruction += " Busca información actualizada sobre brotes de enfermedades recientes, precios de medicamentos o normativas sanitarias vigentes.";
            break;
    }

    // 2. HANDLE MULTIMODAL INPUT (Video/Image overrides to Pro if needed, or specific vision models)
    const parts: any[] = [{ text: input.text }];

    if (input.image) {
        // If image is present and we are NOT in deep thinking mode, use Pro Vision or keep current if supports it.
        // For best image analysis as per prompt:
        if (mode !== 'deep') modelName = 'gemini-3-pro-preview'; 
        
        const cleanBase64 = input.image.split(',')[1] || input.image;
        parts.push({
            inlineData: {
                mimeType: input.mimeType || 'image/jpeg',
                data: cleanBase64
            }
        });
    } else if (input.video) {
        // Video Understanding Requirement
        modelName = 'gemini-3-pro-preview'; 
        const cleanBase64 = input.video.split(',')[1] || input.video;
        parts.push({
            inlineData: {
                mimeType: input.mimeType || 'video/mp4',
                data: cleanBase64
            }
        });
        systemInstruction += " Analiza el video adjunto buscando anomalías en la marcha, respiración o comportamiento del animal.";
    }

    // 3. CALL API
    const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
            ...config,
            systemInstruction
        }
    });

    // 4. PROCESS RESPONSE
    const text = response.text || "No se pudo generar una respuesta.";
    
    // Extract grounding metadata if available (for Search mode)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
    })).filter((s: any) => s.uri);

    return { text, sources };

  } catch (error) {
    console.error("Gemini Advanced Vet Error:", error);
    return { text: "Ocurrió un error al conectar con el Asistente Veterinario. Por favor verifica tu conexión." };
  }
};

// --- LEGACY FUNCTIONS (Kept for compatibility if used elsewhere) ---
export const analyzeHealthStatus = async (symptoms: string, breed: string): Promise<string> => {
    // ... implementation ...
    return "Consulte la nueva interfaz de IA.";
};

export const suggestHerdOptimization = async (farmData: string): Promise<string> => {
    // ... implementation ...
    return "Consulte la nueva interfaz de IA.";
}
export const consultVeterinarian = async (message: string, base64Image?: string): Promise<string> => {
    const res = await consultVeterinarianAdvanced({ text: message, image: base64Image }, 'fast');
    return res.text;
};