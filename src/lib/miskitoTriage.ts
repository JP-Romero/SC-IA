// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR DE TRIAJE EN IDIOMA MISKITO (OPTIMIZADO)
// ═══════════════════════════════════════════════════════════════════════════════
// Este motor se activa EXCLUSIVAMENTE cuando language === 'mi' (Miskito).
// Ha sido optimizado con pre-cálculo y caché de palabras normalizadas para
// que la búsqueda sea O(n) y responda instantáneamente en la app.
// ═══════════════════════════════════════════════════════════════════════════════

import { MISKITO_TRIAGE_DATABASE, MiskitoTriageRecord } from "../data/miskitoTriageDatabase";
import { UserProfile } from "../types";

/**
 * Normaliza un string removiendo acentos y convirtiendo a minúsculas.
 */
function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Stop words extendidas en Miskito y español/inglés mezclado.
 */
const MISKITO_STOP_WORDS = new Set([
  // Miskito
  "yang", "man", "witin", "yawan", "nani", "ba", "ra", "wal",
  "wina", "kata", "sa", "kan", "kum", "kumi", "baha", "naha",
  "brisna", "brisa", "brisma", "brin", "daukisna", "daukisa",
  "lukisna", "lukisa", "takisa", "sna", "sma",
  "pali", "tara", "sampi", "pain", "saura", "ailal",
  "bara", "kaka", "dukiara", "baku", "sin", "kli",
  // Español
  "tengo", "me", "duele", "siento", "estoy", "muy", "mucho",
  "que", "con", "por", "para", "una", "los", "las", "el", "la",
  // Inglés
  "have", "feel", "lot", "very", "the", "and", "with"
]);

// ─── CACHÉ DE PRE-PROCESAMIENTO PARA OPTIMIZACIÓN O(n) ───
interface PreProcessedRecord extends MiskitoTriageRecord {
  normSymptoms: string[];
  normKeywords: string[];
  symptomWordsList: string[];
}

let cachedDatabase: PreProcessedRecord[] | null = null;

function getOptimizedDatabase(): PreProcessedRecord[] {
  if (!cachedDatabase) {
    cachedDatabase = MISKITO_TRIAGE_DATABASE.map(record => ({
      ...record,
      normSymptoms: record.symptoms.map(normalize),
      normKeywords: record.keywords.map(normalize),
      symptomWordsList: record.symptoms.flatMap(s => 
        normalize(s).split(/\W+/).filter(w => w.length > 2)
      )
    }));
  }
  return cachedDatabase;
}

/**
 * Motor principal de triaje en Miskito (Ultra rápido)
 */
export function getMiskitoTriageResponse(query: string, userProfile: UserProfile): string {
  const normalizedQuery = normalize(query);
  let words = normalizedQuery
    .split(/\W+/)
    .filter(w => w.length > 2 && !MISKITO_STOP_WORDS.has(w));

  // Fallback si todas las palabras eran stop-words
  if (words.length === 0) {
    words = normalizedQuery.split(/\W+/).filter(w => w.length > 3);
  }

  const database = getOptimizedDatabase();
  let bestMatch: PreProcessedRecord | null = null;
  let maxScore = 0;

  // Búsqueda lineal O(n) sobre base pre-calculada
  for (let i = 0; i < database.length; i++) {
    const record = database[i];
    let score = 0;

    // 1. Match Exacto de Síntoma (15 pts)
    for (let j = 0; j < record.normSymptoms.length; j++) {
      if (normalizedQuery.includes(record.normSymptoms[j])) {
        score += 15;
      }
    }

    // 2. Match de Palabras Clave
    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      
      // Keywords directos
      for (let k = 0; k < record.normKeywords.length; k++) {
        const normKey = record.normKeywords[k];
        if (normKey === word) {
          score += 8; // Match exacto de keyword
        } else if (normKey.includes(word) || word.includes(normKey)) {
          score += 3; // Substring
        }
      }

      // Palabras sueltas dentro de los síntomas
      for (let sw = 0; sw < record.symptomWordsList.length; sw++) {
        const symptomWord = record.symptomWordsList[sw];
        if (symptomWord === word) {
          score += 5; // Palabra clave dentro del síntoma
        } else if (symptomWord.includes(word) || word.includes(symptomWord)) {
          score += 2;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = record;
    }
  }

  // Threshold: mínimo 4 puntos para considerarse un match real
  if (!bestMatch || maxScore < 4) {
    return formatNoMatchResponse(query);
  }

  return formatMatchedResponse(bestMatch);
}

/**
 * Formateo de respuesta positiva
 */
function formatMatchedResponse(record: MiskitoTriageRecord): string {
  let severityEmoji = "🟢 Sampi";
  let severityText = "Rutina — duktur ra waia sip sa taim brisma kaka";
  if (record.severity === "emergencia") {
    severityEmoji = "🔴 Emergencia tara";
    severityText = "IMPLIK duktur ra waia sa — taim swiaia apia";
  } else if (record.severity === "urgencia") {
    severityEmoji = "🟡 Urgencia";
    severityText = "Duktur ra implik waia sa — yu kumi ra";
  }

  let response = `Prioridad nivel: ${severityEmoji}\n`;
  response += `${severityText}\n\n`;

  response += `🔍 EVALUACIÓN PAS (Kaikanka Pas)\n`;
  response += `Siknis kaikanka ba **${record.symptoms[0]}** wal prukisa. `;
  response += `Naha siknis nani lakara sip sa: ${record.possibleCauses.join(", ")}.\n\n`;

  response += `✅ REKOMENDASHON NANI (Nahki daukaia)\n`;
  response += record.recommendations.map(r => `🔹 ${r}`).join("\n") + "\n";

  if (record.warningSigns.length > 0) {
    response += `\n⚠️ ALART SEÑAL NANI (Kaiki kaia sa)\n`;
    response += record.warningSigns.map(w => `🚨 ${w}`).join("\n") + "\n";
  }

  response += `\n⚠️ Naha ba informeshan baman sa — duktur evaluación ba remplais munras.\n\n`;

  response += `SIKNIS WATLA NANI GRANADA RA:\n`;
  response += `🏥 Hospital Bautista (hospital general — 24h kan)\n`;
  response += `🏥 Centro de Salud Sócrates Flores (siknis sampi nani dukiara — 8:00 p.m. kat)\n`;
  response += `🏥 Hospital Amistad Japón Nicaragua (siknis tara nani dukiara)\n`;
  response += `📞 Emergencia: 128 ra aisas`;

  return response;
}

/**
 * Formateo de respuesta sin resultados
 */
function formatNoMatchResponse(query: string): string {
  return `Prioridad nivel: 🟡 Urgencia sampi\n\n` +
    `🔍 EVALUACIÓN PAS (Kaikanka Pas)\n` +
    `Man siknis "${query}" ba yang base de datos ra sakaia sip apia. ` +
    `Bankra, siknis kum sin nu takras ba pain kaiki kaia sa.\n\n` +
    `✅ REKOMENDASHON NANI (Nahki daukaia)\n` +
    `🔹 Li ailal dis bara ayan pali mangkaia.\n` +
    `🔹 Kaiks — wina urwanka tara takisa kaka, pasa sakaia trabil kaka, prukanka tara kaka.\n` +
    `🔹 Siknis ba kli kli tara takisa kaka, implik duktur ra waia sa.\n` +
    `🔹 Man siknis ba Miskito ra aisas — yang pain kaikaia trai muni.\n\n` +
    `⚠️ Naha ba informeshan baman sa — duktur evaluación ba remplais munras.\n\n` +
    `SIKNIS WATLA NANI GRANADA RA:\n` +
    `🏥 Hospital Bautista (hospital general — 24h kan)\n` +
    `🏥 Centro de Salud Sócrates Flores (siknis sampi nani dukiara — 8:00 p.m. kat)\n` +
    `🏥 Hospital Amistad Japón Nicaragua (siknis tara nani dukiara)\n` +
    `📞 Emergencia: 128 ra aisas`;
}
