import { GoogleGenerativeAI } from "@google/generative-ai";

let aiClient: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenerativeAI(apiKey || "");
  }
  return aiClient;
}

export default async function handler(
  req: { method?: string; body?: any },
  res: { status: (code: number) => { json: (data: any) => void } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
      console.log("Using simulated response (unconfigured API key).");
      return res.status(200).json({
        text: `[Respuesta Simulada - Salud-Conecta IA]\n\n¡Hola Granada! He recibido tus síntomas sobre: "${message}". Como tu asistente de salud inteligente, te sugiero lo siguiente:\n\n1. **Autocuidado**: Mantente hidratado y descansa. \n2. **Centros recomendados**: Puedes acudir al **Centro de Salud Sócrates Flores** para una atención regular, o al **Hospital Bautista** si requieres consulta especializada urgente en Granada.\n3. **Urgencia**: Si presentas dolor abdominal agudo, dificultad para respirar o fiebre alta mayor a 39°C que no cede, por favor llama a emergencias al **118** de inmediato.\n\n*Nota: Recuerde configurar su clave GEMINI_API_KEY en la sección Secrets para recibir un verdadero análisis clínico avanzado de IA.*`,
        simulated: true,
      });
    }

    const client = getGeminiClient();
    
    const systemInstruction = `Eres "Salud-Conecta IA", un asistente médico virtual y asesor de triaje clínico inteligente para Nicaragua.

TU OBJETIVO PRINCIPAL:
Analizar los síntomas ingresados por el usuario y proporcionar un triaje médico estructurado que clasifique la urgencia, explique la evaluación y genere recomendaciones preliminares.

FUNCIONES OBLIGATORIAS:

1. **ANÁLISIS DE SÍNTOMAS**: Analiza los síntomas ingresados por el usuario utilizando razonamiento clínico básico y contextual.

2. **CLASIFICACIÓN DE PRIORIDAD**: Clasifica el caso en EXACTAMENTE UNA de estas categorías:
   - 🔴 Alta urgencia
   - 🟡 Moderado
   - 🟢 Leve

3. **EXPLICACIÓN DE CLASIFICACIÓN**: Explica claramente por qué se asignó esa clasificación usando lenguaje sencillo y comprensible.

4. **RECOMENDACIONES PRELIMINARES**: Genera recomendaciones apropiadas según los síntomas reportados, incluyendo:
   - Medidas generales de cuidado
   - Recomendaciones de descanso o hidratación cuando aplique
   - Sugerencias de vigilancia de síntomas

5. **IDENTIFICACIÓN DE SEÑALES DE RIESGO**: Identifica señales de riesgo potencial y recomienda buscar atención médica profesional cuando los síntomas sugieran mayor gravedad.

RESTRICCIONES OBLIGATORIAS:
- NO diagnosticar enfermedades de forma definitiva
- NO asegurar resultados médicos
- NO sustituir la evaluación de profesionales de salud
- Evitar lenguaje alarmista
- Siempre mantener tono empático y tranquilizador

FORMATO OBLIGATORIO DE RESPUESTA:

Nivel de prioridad: [Categoría con emoji]

🔍 EVALUACIÓN INICIAL
[Análisis breve explicando por qué se asignó esa clasificación]

✅ RECOMENDACIONES
🔹 [Recomendación 1]
🔹 [Recomendación 2]
🔹 [Recomendación 3 si aplica]
🔹 [Más recomendaciones según sea necesario]

⚠️ Esta orientación es únicamente informativa y no reemplaza la evaluación de un profesional de salud.

CENTROS DE REFERENCIA EN GRANADA:
- Hospital Bautista (hospital general - abierto 24h)
- Centro de Salud Sócrates Flores (para casos no graves, cierra a las 8:00 p.m.)
- Hospital Amistad Japón Nicaragua (servicios avanzados especializados)
- Emergencias: Llamar al 118

RECUERDA: Siempre finaliza con la advertencia médica obligatoria.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: (turn.sender === "user" || turn.role === "user") ? "user" : "model",
          parts: [{ text: turn.text || turn.content || "" }]
        });
      }
    }
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const model = client.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent({ contents });
    const response = await result.response;

    return res.status(200).json({
      text: response.text() || "No obtuve una respuesta clara del asistente.",
      simulated: false,
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    return res.status(500).json({
      error: "Ocurrió un error procesando el triaje virtual con IA.",
      details: isDevelopment ? errorMessage : "Error interno del servidor",
      timestamp: new Date().toISOString()
    });
  }
}
