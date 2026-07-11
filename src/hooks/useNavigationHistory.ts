import { useEffect, useCallback, useRef } from "react";

export type ViewType = "login" | "register" | "home" | "consulta" | "buscar" | "premium" | "perfil" | "admin";

interface NavigationState {
  stack: ViewType[];
  currentIndex: number;
}

const HISTORY_STORAGE_KEY = "app_navigation_history";
const DEFAULT_FALLBACK_VIEW: ViewType = "home";

/**
 * Hook que gestiona el historial de navegación de la aplicación.
 * Mantiene un stack de vistas visitadas y proporciona métodos para navegar.
 *
 * Características:
 * - Persiste el historial en sessionStorage
 * - Maneja el evento popstate (botón atrás del navegador)
 * - Fallback automático a vista por defecto si el historial está vacío
 * - Previene "salir" de la aplicación
 *
 * @param currentView - Vista actual
 * @param onNavigate - Callback para cambiar de vista
 * @param fallbackView - Vista a mostrar si el historial está vacío (default: "home")
 */
export function useNavigationHistory(
  currentView: ViewType,
  onNavigate: (view: ViewType) => void,
  fallbackView: ViewType = DEFAULT_FALLBACK_VIEW
) {
  const historyStackRef = useRef<NavigationState>({
    stack: [fallbackView],
    currentIndex: 0,
  });

  // Inicializar el historial desde sessionStorage o desde cero
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory) as NavigationState;
        // Validar que sea un historial válido
        if (Array.isArray(parsed.stack) && parsed.stack.length > 0) {
          historyStackRef.current = parsed;
          return;
        }
      }
    } catch (error) {
      console.warn("[Navigation History] Error al cargar historial:", error);
    }

    // Si no hay historial guardado o es inválido, inicializar con la vista actual
    historyStackRef.current = {
      stack: [currentView || fallbackView],
      currentIndex: 0,
    };
  }, [currentView, fallbackView]);

  // Guardar el historial en sessionStorage cuando cambie
  const saveHistory = useCallback((newState: NavigationState) => {
    try {
      sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn("[Navigation History] Error al guardar historial:", error);
    }
  }, []);

  // Actualizar el historial cuando cambia currentView
  useEffect(() => {
    const current = historyStackRef.current;

    // Si la vista actual es diferente a la del tope del stack, agregar nueva entrada
    if (current.stack[current.currentIndex] !== currentView) {
      // Si estábamos navegando hacia atrás, no agregar al historial
      if (current.currentIndex < current.stack.length - 1) {
        // Remover las entradas "futuras" si existían (después de un goBack)
        current.stack = current.stack.slice(0, current.currentIndex + 1);
      }

      // Agregar la nueva vista
      current.stack.push(currentView);
      current.currentIndex = current.stack.length - 1;
      saveHistory(current);
    }
  }, [currentView, saveHistory]);

  /**
   * Navega hacia atrás en el historial.
   * Si no hay historial disponible (deep link), redirige al fallback.
   */
  const goBack = useCallback(() => {
    const current = historyStackRef.current;

    // Validar si podemos ir hacia atrás (más de 1 entrada en el stack)
    if (current.currentIndex > 0) {
      current.currentIndex--;
      const previousView = current.stack[current.currentIndex];
      saveHistory(current);
      onNavigate(previousView);

      // Actualizar el historial del navegador
      window.history.pushState({ view: previousView }, "", window.location.href);
    } else {
      // Si no hay historial (deep link), ir al fallback
      console.log("[Navigation History] Historial vacío, redirigiendo a:", fallbackView);
      onNavigate(fallbackView);
      current.currentIndex = 0;
      current.stack = [fallbackView];
      saveHistory(current);
    }
  }, [onNavigate, fallbackView, saveHistory]);

  /**
   * Navega a una vista específica y la añade al historial.
   */
  const navigate = useCallback(
    (view: ViewType) => {
      if (view !== currentView) {
        onNavigate(view);
      }
    },
    [currentView, onNavigate]
  );

  /**
   * Obtiene si es posible ir hacia atrás.
   */
  const canGoBack = useCallback(() => {
    return historyStackRef.current.currentIndex > 0;
  }, []);

  /**
   * Obtiene el tamaño del stack del historial.
   */
  const getHistoryLength = useCallback(() => {
    return historyStackRef.current.stack.length;
  }, []);

  /**
   * Limpia el historial (útil para logout o reset)
   */
  const clearHistory = useCallback(() => {
    historyStackRef.current = {
      stack: [fallbackView],
      currentIndex: 0,
    };
    saveHistory(historyStackRef.current);
  }, [fallbackView, saveHistory]);

  // Manejar el evento popstate (botón atrás del navegador)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const view = event.state?.view as ViewType | undefined;
      if (view) {
        onNavigate(view);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onNavigate]);

  return {
    goBack,
    navigate,
    canGoBack,
    getHistoryLength,
    clearHistory,
  };
}
