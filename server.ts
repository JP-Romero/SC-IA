import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const PORT = 3000;

// Initialize Gemini client on the server
let aiClient: GoogleGenerativeAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenerativeAI(apiKey || "");
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API router setup - Triage / Chat IA endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check if API key is mock/missing, if so return a helpful simulated medic response to preserve experience
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
        console.log("Using simulated response (unconfigured API key).");
        return res.json({
          text: `Nivel de prioridad: 🟡 Moderado\n\n🔍 EVALUACIÓN INICIAL\nLos síntomas reportados ("${message}") indican una situación que requiere vigilancia activa. No se detectan signos de emergencia inmediata, pero es fundamental seguir las pautas de cuidado para evitar que el cuadro progrese.\n\n✅ RECOMENDACIONES\n🔹 Mantener reposo absoluto y evitar esfuerzos físicos.\n🔹 Hidratación constante con líquidos claros o suero oral.\n🔹 Monitorear la temperatura cada 4 horas.\n🔹 Si los síntomas persisten o empeoran tras 24 horas, acuda a su centro de salud.\n\n⚠️ Advertencia: Esta orientación es únicamente informativa y no reemplaza la evaluación de un profesional de salud.`,
          simulated: true,
        });
      }

      const client = getGeminiClient();

      const systemInstruction = `Eres "Salud-Conecta IA", un asistente médico virtual y asesor de triaje clínico inteligente para Nicaragua.
      
      Tu objetivo es analizar síntomas y priorizar la urgencia:
      1. Clasifica el riesgo: 🔴 Alta urgencia, 🟡 Moderado, 🟢 Leve.
      2. Explica brevemente la evaluación sin alarmismos.
      3. Da recomendaciones claras (reposo, hidratación, etc.) usando el diamante azul 🔹.
      4. Menciona centros en Granada: Hospital Bautista, Centro de Salud Sócrates Flores o Hospital Amistad Japón Nicaragua.
      5. Emergencias extremas: Llamar al 118.

      REGLAS DE FORMATO OBLIGATORIO:
      Nivel de prioridad: [Emoji] [Categoría]

      🔍 EVALUACIÓN INICIAL
      [Análisis breve]

      ✅ RECOMENDACIONES
      🔹 [Punto 1]
      🔹 [Punto 2]

      ⚠️ Advertencia: Esta orientación es únicamente informativa y no reemplaza la evaluación de un profesional de salud.`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: (turn.sender === "user" || turn.role === "user") ? "user" : "model",
            parts: [{ text: turn.text || turn.content || "" }]
          });
        }
      }
      
      // Add current message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const model = client.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent({
        contents: contents,
        generationConfig: { temperature: 0.75 }
      });

      const responseAI = await result.response;
      const responseText = responseAI.text();

      return res.json({
        text: responseText || "No obtuve una respuesta clara del asistente.",
        simulated: false,
      });

    } catch (error: any) {
      console.error("Gemini Error:", error);
      return res.status(500).json({
        error: "Ocurrió un error procesando el triaje virtual con IA.",
        details: error?.message || ""
      });
    }
  });

  // Hot module reloading and client asset serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Server Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build of client from /dist...");
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Salud-Conecta IA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
