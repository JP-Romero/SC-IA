import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { UserProfile } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import { ShieldCheck, Download } from "lucide-react";

interface EmergencyQRProps {
  user: UserProfile;
  healthConditions?: string[];
}

/**
 * Componente de Código QR de Emergencia optimizado para legibilidad universal.
 * Utiliza nivel de corrección 'H' y formato SVG para máxima compatibilidad.
 */
export const EmergencyQR: React.FC<EmergencyQRProps> = ({ user, healthConditions = [] }) => {
  const { t } = useLanguage();

  // Estructuramos la información vital de forma compacta para no saturar el QR
  const emergencyData = JSON.stringify({
    n: user.name,
    b: "O+", // Ejemplo de tipo de sangre
    c: healthConditions.join(", "),
    e: "128", // Número de emergencia local
    v: new Date().toISOString().split('T')[0] // Fecha de validación para el disclaimer de 24h
  });

  const downloadQR = () => {
    const svg = document.getElementById("emergency-qr-code");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx?.drawImage(img, 0, 0, 512, 512);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-Emergencia-${user.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="bg-white p-4 rounded-2xl shadow-inner mb-4">
        <QRCodeSVG
          id="emergency-qr-code"
          value={emergencyData}
          size={220}
          level="H" // Nivel de corrección alto para máxima legibilidad
          includeMargin={true}
          imageSettings={{
            src: "/app-logo-v1.jpg",
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{t("authorizedOnly")}</span>
        </div>
        <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">
          {t("qrDisclaimer")}
        </p>
        
        <button 
          onClick={downloadQR}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          {t("download")} QR
        </button>
      </div>
    </div>
  );
};