import React from "react";
import { ArrowLeft } from "lucide-react";
import { useBackButton } from "../hooks/useBackButton";

interface BackButtonProps {
  navigationApi: {
    goBack: () => void;
    canGoBack: () => boolean;
  };
  /** Texto alternativo para el botón (por defecto: "Atrás") */
  label?: string;
  /** Clase CSS personalizada */
  className?: string;
  /** Mostrar solo el icono (sin texto) */
  iconOnly?: boolean;
  /** Callback adicional después de navegar hacia atrás */
  onBackCallback?: () => void;
}

/**
 * Componente reutilizable para el botón "Atrás".
 * Navega a la vista anterior o muestra el fallback si no hay historial.
 *
 * Previene que el usuario:
 * - Salga de la aplicación
 * - Vaya a una página en blanco
 * - Cierre la pestaña inesperadamente
 */
export function BackButton({
  navigationApi,
  label = "Atrás",
  className = "",
  iconOnly = false,
  onBackCallback,
}: BackButtonProps) {
  const { canGoBack, onBack } = useBackButton(navigationApi);

  const handleClick = () => {
    onBack();
    onBackCallback?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canGoBack}
      aria-label={label}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-200
        ${
          canGoBack
            ? "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
            : "text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed"
        }
        ${className}
      `}
      type="button"
    >
      <ArrowLeft className="w-5 h-5" />
      {!iconOnly && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

export default BackButton;
