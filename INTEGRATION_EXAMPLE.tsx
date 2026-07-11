/**
 * EJEMPLO DE INTEGRACIÓN: BackButton en PerfilView
 * 
 * Este archivo muestra cómo integrar el componente BackButton
 * en uno de tus componentes existentes.
 * 
 * NOTA: Este es un EJEMPLO. Copiar solo las partes relevantes
 * a tu archivo src/components/PerfilView.tsx
 */

import React from "react";
import { BackButton } from "./BackButton";

// Tipo de la API de navegación (viene de App.tsx)
type NavigationApi = {
  goBack: () => void;
  canGoBack: () => boolean;
  navigate: (view: string) => void;
  getHistoryLength: () => number;
  clearHistory: () => void;
};

interface PerfilViewExampleProps {
  user: any;
  navigationApi: NavigationApi; // ← Nueva prop
  onUpdateUser: (user: any) => void;
  isPremium: boolean;
  onLogout: () => void;
}

/**
 * Ejemplo de cómo usar BackButton en un componente
 */
export function PerfilViewExample({
  user,
  navigationApi, // ← Agregado
  onUpdateUser,
  isPremium,
  onLogout,
}: PerfilViewExampleProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* 
        OPCIÓN 1: Botón en header con texto
        Mostrar botón solo si hay historial disponible
      */}
      <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-40">
        <BackButton
          navigationApi={navigationApi}
          label="← Volver"
          className="hover:bg-slate-100 dark:hover:bg-slate-900"
        />
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Mi Perfil
        </h1>
        <div className="w-12" /> {/* Spacer para alineación */}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Sección de Avatar */}
          <div className="flex flex-col items-center">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-brand-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-brand-600 bg-gradient-to-br from-brand-600 to-brand-700">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
          </div>

          {/* Información personal */}
          <section className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Ciudad
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {user.city || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  País
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {user.country || "No especificado"}
                </p>
              </div>
            </div>
          </section>

          {/* Estado Premium */}
          {isPremium && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Usuario Premium
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Acceso a todas las funcionalidades
                </p>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onLogout}
              className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>

      {/* 
        OPCIÓN 2: Botón flotante en la esquina
        
        Si quieres un botón flotante en lugar del header:
        
        <div className="fixed bottom-6 right-6 z-40">
          <BackButton
            navigationApi={navigationApi}
            iconOnly={true}
            className="bg-brand-600 text-white p-3 rounded-full shadow-lg hover:bg-brand-700"
          />
        </div>
      */}
    </div>
  );
}

/**
 * INSTRUCCIONES PARA INTEGRAR EN TU PerfilView.tsx:
 * 
 * 1. Importar BackButton:
 *    ```tsx
 *    import { BackButton } from "./BackButton";
 *    ```
 * 
 * 2. Agregar prop navigationApi a la interfaz:
 *    ```tsx
 *    interface PerfilViewProps {
 *      // ... props existentes ...
 *      navigationApi: {
 *        goBack: () => void;
 *        canGoBack: () => boolean;
 *        navigate: (view: string) => void;
 *        getHistoryLength: () => number;
 *        clearHistory: () => void;
 *      };
 *    }
 *    ```
 * 
 * 3. Actualizar firma de la función:
 *    ```tsx
 *    export function PerfilView({
 *      user,
 *      navigationApi, // ← Agregar aquí
 *      onUpdateUser,
 *      isPremium,
 *      onLogout,
 *      onGoBack, // ← Puedes mantener esta prop también
 *    }: PerfilViewProps) {
 *    ```
 * 
 * 4. Reemplazar el botón "Atrás" existente:
 *    - Buscar: <button onClick={() => onGoBack()}>...</button>
 *    - Reemplazar con:
 *      ```tsx
 *      <BackButton navigationApi={navigationApi} label="← Volver" />
 *      ```
 * 
 * 5. En App.tsx, pasar navigationApi al componente:
 *    ```tsx
 *    <PerfilView
 *      user={localUser}
 *      navigationApi={navigationHistory} // ← Agregar
 *      isPremium={isPremium}
 *      onUpdateUser={handleUpdateUser}
 *      // ... otras props ...
 *    />
 *    ```
 */
