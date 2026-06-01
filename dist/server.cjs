var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_generative_ai = require("@google/generative-ai");
import_dotenv.default.config();
var PORT = 3e3;
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("\u26A0\uFE0F Warning: GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new import_generative_ai.GoogleGenerativeAI(apiKey || "");
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
        console.log("Using simulated response (unconfigured API key).");
        return res.json({
          text: `Nivel de prioridad: \u{1F7E1} Moderado

\u{1F50D} EVALUACI\xD3N INICIAL
Los s\xEDntomas reportados ("${message}") indican una situaci\xF3n que requiere vigilancia activa. No se detectan signos de emergencia inmediata, pero es fundamental seguir las pautas de cuidado para evitar que el cuadro progrese.

\u2705 RECOMENDACIONES
\u{1F539} Mantener reposo absoluto y evitar esfuerzos f\xEDsicos.
\u{1F539} Hidrataci\xF3n constante con l\xEDquidos claros o suero oral.
\u{1F539} Monitorear la temperatura cada 4 horas.
\u{1F539} Si los s\xEDntomas persisten o empeoran tras 24 horas, acuda a su centro de salud.

\u26A0\uFE0F Advertencia: Esta orientaci\xF3n es \xFAnicamente informativa y no reemplaza la evaluaci\xF3n de un profesional de salud.`,
          simulated: true
        });
      }
      const client = getGeminiClient();
      const systemInstruction = `Eres "Salud-Conecta IA", un asistente m\xE9dico virtual y asesor de triaje cl\xEDnico inteligente para Nicaragua.
      
      Tu objetivo es analizar s\xEDntomas y priorizar la urgencia:
      1. Clasifica el riesgo: \u{1F534} Alta urgencia, \u{1F7E1} Moderado, \u{1F7E2} Leve.
      2. Explica brevemente la evaluaci\xF3n sin alarmismos.
      3. Da recomendaciones claras (reposo, hidrataci\xF3n, etc.) usando el diamante azul \u{1F539}.
      4. Menciona centros en Granada: Hospital Bautista, Centro de Salud S\xF3crates Flores o Hospital Amistad Jap\xF3n Nicaragua.
      5. Emergencias extremas: Llamar al 118.

      REGLAS DE FORMATO OBLIGATORIO:
      Nivel de prioridad: [Emoji] [Categor\xEDa]

      \u{1F50D} EVALUACI\xD3N INICIAL
      [An\xE1lisis breve]

      \u2705 RECOMENDACIONES
      \u{1F539} [Punto 1]
      \u{1F539} [Punto 2]

      \u26A0\uFE0F Advertencia: Esta orientaci\xF3n es \xFAnicamente informativa y no reemplaza la evaluaci\xF3n de un profesional de salud.`;
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.sender === "user" || turn.role === "user" ? "user" : "model",
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
        systemInstruction
      });
      const result = await model.generateContent({
        contents,
        generationConfig: { temperature: 0.75 }
      });
      const responseAI = await result.response;
      const responseText = responseAI.text();
      return res.json({
        text: responseText || "No obtuve una respuesta clara del asistente.",
        simulated: false
      });
    } catch (error) {
      console.error("Gemini Error:", error);
      return res.status(500).json({
        error: "Ocurri\xF3 un error procesando el triaje virtual con IA.",
        details: error?.message || ""
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Server Middleware...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build of client from /dist...");
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    app.use(import_express.default.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Salud-Conecta IA Server running at http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
