import { Doctor, Pharmacy, HealthCenter, UserProfile, Appointment } from "../types";

export const DEFAULT_USER: UserProfile = {
  name: "Kenneth",
  email: "kenneth@gmail.com",
  city: "Granada",
  country: "Nicaragua",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256", // Stylish profile portrait
  healthConditions: ["Alergia al polen", "Presión arterial normal", "Tipo de sangre O+"]
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    doctorName: "Dra. Laura Martínez",
    specialty: "Cardiología",
    date: "2026-06-05",
    time: "10:30 AM",
    status: "Confirmada"
  },
  {
    id: "app-2",
    doctorName: "Dr. Carlos Gómez",
    specialty: "Dermatología",
    date: "2026-06-12",
    time: "3:15 PM",
    status: "Pendiente"
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dra. Laura Martínez",
    specialty: "Cardiología",
    rating: 4.9,
    experience: 8,
    status: "Disponible",
    distance: "A 800 m",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-2",
    name: "Dr. Carlos Gómez",
    specialty: "Dermatología",
    rating: 4.8,
    experience: 6,
    status: "Disponible",
    distance: "A 1.2 km",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-3",
    name: "Dra. Ana Ruiz",
    specialty: "Pediatría",
    rating: 4.9,
    experience: 10,
    status: "Disponible",
    distance: "A 1.5 km",
    photoUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-4",
    name: "Dra. Sofia Navarro",
    specialty: "Ginecología",
    rating: 4.7,
    experience: 12,
    status: "Disponible",
    distance: "A 2.1 km",
    photoUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-5",
    name: "Dr. Mateo Torres",
    specialty: "Traumatología",
    rating: 4.6,
    experience: 5,
    status: "Disponible",
    distance: "A 3.0 km",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "doc-6",
    name: "Dra. Valeria Castro",
    specialty: "Medicina General",
    rating: 4.9,
    experience: 14,
    status: "Disponible",
    distance: "A 900 m",
    photoUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200"
  }
];

// ═══════════════════════════════════════════════════════════════════
// BASE DE DATOS COMPLETA DE MEDICAMENTOS DISPONIBLES EN NICARAGUA
// Basada en la Lista Básica de Medicamentos Esenciales (LBME) del MINSA
// ═══════════════════════════════════════════════════════════════════

export const ALL_MEDICATIONS: string[] = [
  // ── Analgésicos y Antipiréticos ──
  "Paracetamol 500 mg",
  "Paracetamol 120 mg/5 ml Jarabe",
  "Paracetamol 100 mg Gotas pediátricas",
  "Aspirina 100 mg",
  "Aspirina 500 mg",
  "Dipirona 500 mg",
  "Tramadol 50 mg",
  "Ketorolaco 10 mg",
  "Ketorolaco 30 mg inyectable",

  // ── Antiinflamatorios No Esteroideos (AINEs) ──
  "Ibuprofeno 400 mg",
  "Ibuprofeno 200 mg",
  "Ibuprofeno 100 mg/5 ml Suspensión",
  "Diclofenaco 50 mg",
  "Diclofenaco 75 mg inyectable",
  "Diclofenaco Gel tópico 1%",
  "Naproxeno 250 mg",
  "Naproxeno 550 mg",
  "Meloxicam 15 mg",
  "Piroxicam 20 mg",
  "Indometacina 25 mg",

  // ── Antibióticos ──
  "Amoxicilina 500 mg",
  "Amoxicilina 250 mg/5 ml Suspensión",
  "Amoxicilina + Ácido Clavulánico 875/125 mg",
  "Azitromicina 500 mg",
  "Azitromicina 200 mg/5 ml Suspensión",
  "Ciprofloxacina 500 mg",
  "Levofloxacina 500 mg",
  "Metronidazol 500 mg",
  "Metronidazol 250 mg/5 ml Suspensión",
  "Cefalexina 500 mg",
  "Ceftriaxona 1 g inyectable",
  "Doxiciclina 100 mg",
  "Trimetoprim/Sulfametoxazol 160/800 mg",
  "Trimetoprim/Sulfametoxazol Suspensión",
  "Eritromicina 500 mg",
  "Clindamicina 300 mg",
  "Penicilina Benzatínica 1.2 MUI inyectable",
  "Gentamicina 80 mg inyectable",
  "Nitrofurantoína 100 mg",

  // ── Antifúngicos ──
  "Fluconazol 150 mg",
  "Clotrimazol Crema 1%",
  "Clotrimazol Óvulos 500 mg",
  "Nistatina 100,000 UI/ml Suspensión oral",
  "Ketoconazol 200 mg",
  "Ketoconazol Shampoo 2%",
  "Terbinafina 250 mg",

  // ── Antiparasitarios ──
  "Albendazol 400 mg",
  "Albendazol 200 mg/5 ml Suspensión",
  "Mebendazol 100 mg",
  "Quinfamida 100 mg",
  "Metronidazol 250 mg (antiparasitario)",
  "Ivermectina 6 mg",

  // ── Antialérgicos y Antihistamínicos ──
  "Loratadina 10 mg",
  "Loratadina 5 mg/5 ml Jarabe",
  "Cetirizina 10 mg",
  "Clorfeniramina 4 mg",
  "Difenhidramina 25 mg",
  "Desloratadina 5 mg",
  "Fexofenadina 120 mg",
  "Fexofenadina 180 mg",

  // ── Sistema Digestivo ──
  "Omeprazol 20 mg",
  "Omeprazol 40 mg",
  "Pantoprazol 40 mg",
  "Ranitidina 150 mg",
  "Loperamida 2 mg",
  "Sales de Rehidratación Oral (SRO)",
  "Metoclopramida 10 mg",
  "Domperidona 10 mg",
  "Simeticona 80 mg",
  "Simeticona Gotas pediátricas",
  "Hidróxido de Aluminio/Magnesio Suspensión",
  "Bismuto Subsalicilato 262 mg",
  "Sucralfato 1 g",
  "Lactulosa 10 g/15 ml Jarabe",
  "Senósidos A+B 8.6 mg",

  // ── Sistema Respiratorio ──
  "Salbutamol Inhalador 100 mcg",
  "Salbutamol 2 mg/5 ml Jarabe",
  "Ambroxol 30 mg",
  "Ambroxol 15 mg/5 ml Jarabe",
  "Bromhexina 8 mg",
  "Dextrometorfano 15 mg/5 ml Jarabe",
  "Guaifenesina 100 mg/5 ml Jarabe",
  "Beclometasona Inhalador 250 mcg",
  "Budesonida Inhalador 200 mcg",
  "Fluticasona Spray Nasal 50 mcg",
  "Oximetazolina Spray Nasal 0.05%",
  "Pseudoefedrina 60 mg",

  // ── Sistema Cardiovascular ──
  "Losartán 50 mg",
  "Losartán 100 mg",
  "Enalapril 10 mg",
  "Enalapril 20 mg",
  "Amlodipina 5 mg",
  "Amlodipina 10 mg",
  "Atenolol 50 mg",
  "Propranolol 40 mg",
  "Hidroclorotiazida 25 mg",
  "Furosemida 40 mg",
  "Espironolactona 25 mg",
  "Atorvastatina 20 mg",
  "Atorvastatina 40 mg",
  "Simvastatina 20 mg",
  "Clopidogrel 75 mg",
  "Ácido Acetilsalicílico 81 mg (cardioprotector)",
  "Nifedipina 30 mg Retard",
  "Verapamilo 80 mg",
  "Digoxina 0.25 mg",

  // ── Diabetes y Metabolismo ──
  "Metformina 500 mg",
  "Metformina 850 mg",
  "Metformina 1000 mg",
  "Glibenclamida 5 mg",
  "Insulina NPH 100 UI/ml",
  "Insulina Rápida 100 UI/ml",
  "Levotiroxina 50 mcg",
  "Levotiroxina 100 mcg",

  // ── Sistema Nervioso y Psiquiatría ──
  "Diazepam 5 mg",
  "Diazepam 10 mg",
  "Clonazepam 0.5 mg",
  "Clonazepam 2 mg",
  "Carbamazepina 200 mg",
  "Fenitoína 100 mg",
  "Ácido Valproico 250 mg",
  "Amitriptilina 25 mg",
  "Fluoxetina 20 mg",
  "Sertralina 50 mg",
  "Haloperidol 5 mg",
  "Clorpromazina 100 mg",
  "Gabapentina 300 mg",

  // ── Vitaminas y Suplementos ──
  "Ácido Fólico 5 mg",
  "Ácido Fólico 1 mg",
  "Sulfato Ferroso 300 mg",
  "Sulfato Ferroso + Ácido Fólico",
  "Complejo B Tabletas",
  "Vitamina C 500 mg",
  "Vitamina D3 1000 UI",
  "Vitamina E 400 UI",
  "Calcio 600 mg + Vitamina D",
  "Multivitamínico Pediátrico Gotas",
  "Zinc 20 mg",

  // ── Dermatología y Uso Tópico ──
  "Hidrocortisona Crema 1%",
  "Betametasona Crema 0.05%",
  "Bacitracina + Neomicina Ungüento",
  "Mupirocina Crema 2%",
  "Ácido Fusídico Crema 2%",
  "Permetrina Loción 5%",
  "Calamina Loción",
  "Protector Solar SPF 50",
  "Vaselina pura",
  "Óxido de Zinc Pasta",

  // ── Oftalmología ──
  "Ciprofloxacina Gotas Oftálmicas 0.3%",
  "Tobramicina Gotas Oftálmicas 0.3%",
  "Lágrimas Artificiales",
  "Nafazolina Gotas Oftálmicas",
  "Dexametasona Gotas Oftálmicas 0.1%",

  // ── Anticonceptivos y Salud Reproductiva ──
  "Levonorgestrel + Etinilestradiol (Ciclo 21)",
  "Levonorgestrel 0.75 mg (Emergencia)",
  "Medroxiprogesterona 150 mg inyectable",
  "Misoprostol 200 mcg",

  // ── Corticosteroides Sistémicos ──
  "Prednisona 5 mg",
  "Prednisona 20 mg",
  "Prednisolona 5 mg/5 ml Jarabe",
  "Dexametasona 4 mg",
  "Dexametasona 8 mg inyectable",

  // ── Antigripales y OTC ──
  "Antigripal (Paracetamol+Clorfeniramina+Fenilefrina)",
  "Descongestionante Nasal Spray",
  "Pastillas para la garganta (Benzocaína)",
  "Electrolitos Orales Saborizados",

  // ── Otros Medicamentos Esenciales ──
  "Warfarina 5 mg",
  "Alopurinol 300 mg",
  "Colchicina 0.5 mg",
  "Ranitidina 300 mg",
  "Metildopa 250 mg",
  "Nifedipina 10 mg",
  "Ergotamina + Cafeína",
  "Sumatriptán 50 mg",
  "Bencilpenicilina Procaínica 800,000 UI inyectable"
];

// ═══════════════════════════════════════════════════════════════════
// Utilidad para asignar medicamentos aleatorios a cada farmacia
// Usa un seed basado en el ID para que sea determinístico
// ═══════════════════════════════════════════════════════════════════
function seededShuffle(array: string[], seed: number): string[] {
  const shuffled = [...array];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomMeds(pharmacyIndex: number, minCount: number, maxCount: number): string[] {
  const seed = (pharmacyIndex + 1) * 31337;
  const shuffled = seededShuffle(ALL_MEDICATIONS, seed);
  const s = ((pharmacyIndex + 1) * 7919) % 2147483647;
  const count = minCount + (s % (maxCount - minCount + 1));
  return shuffled.slice(0, count);
}

// ═══════════════════════════════════════════════════════════════════
// FARMACIAS REALES DE GRANADA, NICARAGUA
// Datos obtenidos de Google Maps y directorios locales
// ═══════════════════════════════════════════════════════════════════

export const PHARMACIES: Pharmacy[] = [
  {
    id: "pharm-1",
    name: "Farmacia Carcache",
    address: "Bo. La Merced, Calle El Comercio No. 209",
    distance: "A 350 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(0, 25, 40)
  },
  {
    id: "pharm-2",
    name: "Farmacia La Merced",
    address: "Mercado Municipal, 2 c. al Oeste",
    distance: "A 500 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(1, 20, 35)
  },
  {
    id: "pharm-3",
    name: "Farmacia Granada",
    address: "Iglesia La Merced, 1 c. al Oeste, Calle Real Xalteva",
    distance: "A 650 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(2, 30, 45)
  },
  {
    id: "pharm-4",
    name: "Farmacia Praga - Inmaculada",
    address: "Calle La Inmaculada, Granada",
    distance: "A 800 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(3, 35, 50)
  },
  {
    id: "pharm-5",
    name: "Farmacia Praga - Central",
    address: "C. Real Xalteva, Granada",
    distance: "A 900 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(4, 35, 50)
  },
  {
    id: "pharm-6",
    name: "Farmacia Ntra. Sra. de Guadalupe",
    address: "Calle La Libertad, Funeraria Bustamante 1½ c. al Este",
    distance: "A 1.1 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(5, 20, 35)
  },
  {
    id: "pharm-7",
    name: "Farmacia Bengoechea",
    address: "Puente Los Dardanelos, 1 c. al Sur, frente a Datiza",
    distance: "A 1.3 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(6, 25, 40)
  },
  {
    id: "pharm-8",
    name: "Farmacia Los Ángeles",
    address: "Calle Santa Lucía, Puente Dardanelos, 20 vrs. al Este",
    distance: "A 1.4 km",
    status: "Poco stock",
    openNow: true,
    medsAvailable: getRandomMeds(7, 15, 25)
  },
  {
    id: "pharm-9",
    name: "Farmacia San Jorge",
    address: "Shell Palmira, 1 c. al Este, 25 vrs. al Norte",
    distance: "A 1.6 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(8, 25, 40)
  },
  {
    id: "pharm-10",
    name: "Farmacia La Asunción",
    address: "De la Alcaldía, 4 c. al Este, Granada",
    distance: "A 1.8 km",
    status: "Disponible",
    openNow: false,
    closingTime: "Cierra a las 8:00 p.m.",
    medsAvailable: getRandomMeds(9, 20, 35)
  },
  {
    id: "pharm-11",
    name: "Farmacia Value Granada",
    address: "Calle Atravesada, frente donde fue Cine Karawala",
    distance: "A 700 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(10, 40, 55)
  },
  {
    id: "pharm-12",
    name: "Farmaplus Granada",
    address: "Bartolomé #1, Policía 2 c. al Norte",
    distance: "A 1.0 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(11, 35, 50)
  },
  {
    id: "pharm-13",
    name: "Farmacia Del Pueblo",
    address: "Centro de Granada, Nicaragua",
    distance: "A 1.2 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(12, 20, 30)
  },
  {
    id: "pharm-14",
    name: "Farmacia Génesis",
    address: "Granada Centro, Nicaragua",
    distance: "A 1.5 km",
    status: "Poco stock",
    openNow: true,
    medsAvailable: getRandomMeds(13, 15, 25)
  },
  {
    id: "pharm-15",
    name: "Farmacia San Francisco",
    address: "Barrio San Francisco, Granada",
    distance: "A 1.7 km",
    status: "Disponible",
    openNow: false,
    closingTime: "Cierra a las 7:00 p.m.",
    medsAvailable: getRandomMeds(14, 20, 35)
  },
  {
    id: "pharm-16",
    name: "Farmacia Bíblica",
    address: "Calle El Caimito, Parque Central 3½ c. al Lago",
    distance: "A 600 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(15, 20, 30)
  },
  {
    id: "pharm-17",
    name: "Farmacia El Socorro",
    address: "Calle El Arsenal, costado Sur Iglesia San Francisco",
    distance: "A 1.9 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(16, 25, 40)
  },
  {
    id: "pharm-18",
    name: "Farmacia Saba",
    address: "C. Real Xalteva, Granada",
    distance: "A 950 m",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(17, 30, 45)
  },
  {
    id: "pharm-19",
    name: "Farmacia Divina Misericordia",
    address: "Granada Centro, Nicaragua",
    distance: "A 2.0 km",
    status: "Disponible",
    openNow: false,
    closingTime: "Cierra a las 9:00 p.m.",
    medsAvailable: getRandomMeds(18, 25, 40)
  },
  {
    id: "pharm-20",
    name: "Farmacia Abi",
    address: "Camino al Tabacal, 30 vrs. al Norte Iglesia San José",
    distance: "A 2.3 km",
    status: "Poco stock",
    openNow: true,
    medsAvailable: getRandomMeds(19, 10, 20)
  },
  {
    id: "pharm-21",
    name: "Farmacia Adriana",
    address: "Costado Norte del Cementerio, Granada",
    distance: "A 2.5 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(20, 20, 35)
  },
  {
    id: "pharm-22",
    name: "Farmacia Chepe Bravo",
    address: "Bo. El Domingazo, 3½ c. al Norte Parroquia Ermita del Socorro",
    distance: "A 2.8 km",
    status: "Disponible",
    openNow: false,
    closingTime: "Cierra a las 6:00 p.m.",
    medsAvailable: getRandomMeds(21, 15, 25)
  },
  {
    id: "pharm-23",
    name: "Farmacia Farma Todo",
    address: "Bo. La Otra Banda, del Bombero 1 c. al Norte, ½ c. al Oeste",
    distance: "A 3.0 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(22, 30, 45)
  },
  {
    id: "pharm-24",
    name: "Farmacia Lo Nuestro",
    address: "Calle Miguel Ángel Ortez, Granada",
    distance: "A 2.1 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(23, 20, 35)
  },
  {
    id: "pharm-25",
    name: "Farmacia El Rosario",
    address: "Calle Centroamérica, Granada",
    distance: "A 1.4 km",
    status: "Disponible",
    openNow: true,
    medsAvailable: getRandomMeds(24, 25, 40)
  },
  {
    id: "pharm-26",
    name: "Farmacia Espíritu Santo",
    address: "Carretera NIC-39, Granada",
    distance: "A 3.5 km",
    status: "Poco stock",
    openNow: true,
    medsAvailable: getRandomMeds(25, 15, 25)
  }
];

export const HEALTH_CENTERS: HealthCenter[] = [
  {
    id: "hc-1",
    name: "Hospital Bautista",
    type: "Hospital general",
    schedule: "Abierto 24h",
    distance: "1.2 km",
    durationMin: 4,
    lat: 30, // Y coordinate % on customized visual map
    lng: 58  // X coordinate %
  },
  {
    id: "hc-2",
    name: "Centro de Salud Sócrates Flores",
    type: "Centro de salud",
    schedule: "Abierto · Cierra a las 8:00 p.m.",
    distance: "2.1 km",
    durationMin: 6,
    lat: 50,
    lng: 32
  },
  {
    id: "hc-3",
    name: "Hospital Amistad Japón Nicaragua",
    type: "Hospital especializado",
    schedule: "Abierto 24h",
    distance: "3.6 km",
    durationMin: 8,
    lat: 42,
    lng: 78
  },
  {
    id: "hc-4",
    name: "Clínica San Francisco",
    type: "Clínica privada",
    schedule: "Abierto · Cierra a las 6:00 p.m.",
    distance: "4.0 km",
    durationMin: 12,
    lat: 68,
    lng: 24
  },
  {
    id: "hc-5",
    name: "Centro de Salud Granada Sur",
    type: "Centro de salud",
    schedule: "Abierto 24h",
    distance: "4.5 km",
    durationMin: 10,
    lat: 82,
    lng: 52
  }
];
