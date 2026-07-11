# 📱 Guía de Implementación: Manejo del Botón "Atrás"

## 📋 Resumen

Esta implementación proporciona un sistema robusto de historial de navegación para tu aplicación React SPA que **previene que el usuario salga de la app** cuando:
- Presiona el botón atrás del navegador
- No hay historial disponible (deep link)
- Intenta navegar fuera del dominio

---

## 🎯 Características

✅ **Historial persistente** en `sessionStorage`  
✅ **Fallback automático** a vista por defecto (home) si historial vacío  
✅ **Manejo de popstate** (botón atrás del navegador)  
✅ **Limpieza de historial** en logout  
✅ **TypeScript** completamente tipado  
✅ **Botón reutilizable** con estados visuales  

---

## 🔧 Archivos Creados

```
src/
├── hooks/
│   ├── useNavigationHistory.ts    # Hook principal de historial
│   └── useBackButton.ts           # Hook para botón "Atrás"
└── components/
    └── BackButton.tsx             # Componente del botón
```

---

## 💡 Cómo Usar

### Opción 1: Botón "Atrás" en UI (Recomendado)

Importa el componente `BackButton` en cualquier vista que necesite el botón:

```tsx
import { BackButton } from "../components/BackButton";

export function HomeView({ onNavigate, navigationApi }) {
  return (
    <div>
      {/* Botón "Atrás" con icono y texto */}
      <BackButton 
        navigationApi={navigationApi}
        label="Volver"
      />
      
      {/* O solo el icono */}
      <BackButton 
        navigationApi={navigationApi}
        iconOnly={true}
      />
      
      {/* Con callback personalizado */}
      <BackButton 
        navigationApi={navigationApi}
        onBackCallback={() => console.log("Navegando hacia atrás...")}
      />
    </div>
  );
}
```

### Opción 2: Usar Hook Directamente

Para control más fino, usa `useBackButton` directamente:

```tsx
import { useBackButton } from "../hooks/useBackButton";

export function ConsultaView({ navigationApi }) {
  const { canGoBack, onBack } = useBackButton(navigationApi);
  
  return (
    <button 
      onClick={onBack}
      disabled={!canGoBack}
    >
      ← Atrás
    </button>
  );
}
```

### Opción 3: Hook Principal (Control Total)

Para casos avanzados, usa directamente `useNavigationHistory`:

```tsx
import { useNavigationHistory } from "../hooks/useNavigationHistory";

export function CustomComponent() {
  const navigation = useNavigationHistory(
    currentView,
    setCurrentView,
    "home" // fallback
  );
  
  return (
    <>
      {navigation.canGoBack() && (
        <button onClick={navigation.goBack}>Atrás</button>
      )}
      
      <p>Historial: {navigation.getHistoryLength()} vistas</p>
    </>
  );
}
```

---

## 📍 Integración en App.tsx

El hook ya está integrado en `App.tsx`:

```tsx
// En la declaración del estado
const navigationHistory = useNavigationHistory(
  currentView as ViewType,
  (view) => setCurrentView(view),
  "home"
);

// En logout
const handleLogout = async () => {
  // ...
  navigationHistory.clearHistory(); // ← Limpia el historial
  setCurrentView("login");
};
```

---

## 🎮 API del Hook

```ts
useNavigationHistory(currentView, onNavigate, fallbackView) → {
  goBack: () => void;           // Ir a vista anterior
  navigate: (view) => void;     // Navegar a vista específica
  canGoBack: () => boolean;     // ¿Puede ir atrás?
  getHistoryLength: () => number; // Longitud del historial
  clearHistory: () => void;     // Limpiar historial
}
```

---

## 🛡️ Cómo Previene Que Salgas de la App

### Escenario 1: Deep Link (URL directa)

```
Usuario accede a: https://app.example.com/consulta
↓
Historia vacía (window.history.length ≤ 1)
↓
Si intenta "Atrás" → goBack() detecta historial vacío
↓
Redirige a fallback ("home") EN LUGAR DE salir de la app
```

### Escenario 2: Botón Atrás del Navegador

```
Usuario en vista "consulta"
↓
Presiona botón atrás del navegador
↓
Hook maneja evento popstate
↓
Navega a vista anterior EN LA APP (no sale del dominio)
```

### Escenario 3: Sin Historial Disponible

```
El botón "Atrás" se deshabilita visualmente
↓
canGoBack() retorna false
↓
Botón no es clickeable (disabled=true)
```

---

## 📝 Ejemplo Completo: Componente con BackButton

```tsx
import React from "react";
import { BackButton } from "../components/BackButton";

interface PerfilViewProps {
  navigationApi: {
    goBack: () => void;
    canGoBack: () => boolean;
  };
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export function PerfilView({
  navigationApi,
  user,
  onUpdateUser,
}: PerfilViewProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header con botón atrás */}
      <header className="flex items-center justify-between p-4 border-b">
        <BackButton 
          navigationApi={navigationApi}
          label="Volver al Home"
        />
        <h1 className="text-xl font-bold">Mi Perfil</h1>
        <div className="w-8" /> {/* Spacer para simetría */}
      </header>

      {/* Contenido */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          <img 
            src={user.avatarUrl} 
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-slate-600">{user.email}</p>
        </div>
      </main>
    </div>
  );
}
```

---

## 🔍 Debugger: Cómo Ver el Historial

```ts
// En la consola del navegador
sessionStorage.getItem("app_navigation_history")

// Salida ejemplo:
{
  "stack": ["login", "home", "consulta", "perfil"],
  "currentIndex": 3
}
```

---

## ⚠️ Casos Edge Case Manejados

| Caso | Comportamiento |
|------|---|
| **Deep link sin historial** | Fallback a "home" |
| **Popstate en primer item** | No navega, previene salida |
| **sessionStorage no disponible** | Usa memoria en runtime |
| **Logout** | Historial se limpia automáticamente |
| **Navegador cierra pestaña** | sessionStorage se destruye (esperado) |

---

## 🚀 Próximos Pasos

Para mejorar aún más:

1. **Guardas de navegación** - Confirmar antes de navegar si hay cambios sin guardar
2. **Analytics** - Registrar flujo de navegación del usuario
3. **Persistencia cross-tab** - Sincronizar historial entre pestañas
4. **Animations** - Animar transiciones según dirección (forward/back)

---

## 📚 Referencias

- [useNavigationHistory.ts](../hooks/useNavigationHistory.ts) - Implementación principal
- [BackButton.tsx](../components/BackButton.tsx) - Componente reutilizable
- [App.tsx](../App.tsx) - Integración en la app
