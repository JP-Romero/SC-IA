import { useCallback } from "react";
import { ViewType } from "./useNavigationHistory";

interface BackButtonState {
  canGoBack: boolean;
  onBack: () => void;
}

/**
 * Hook simplificado para usar en componentes que necesitan un botón "Atrás".
 * Encapsula la lógica de navegación hacia atrás.
 *
 * @param navigationApi - API del hook useNavigationHistory
 * @returns { canGoBack, onBack } - Estado y función para el botón
 */
export function useBackButton(navigationApi: {
  goBack: () => void;
  canGoBack: () => boolean;
}): BackButtonState {
  const onBack = useCallback(() => {
    navigationApi.goBack();
  }, [navigationApi]);

  const canGoBack = navigationApi.canGoBack();

  return {
    canGoBack,
    onBack,
  };
}
