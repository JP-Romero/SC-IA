# 🛡️ Cómo Se Previene Que El Usuario Salga de la App

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                  USUARIO EN LA APLICACIÓN                    │
│                   Ej: Vista "Consulta"                       │
└──────────────┬──────────────────────────────────────────────┘
               │
         ┌─────▼─────────────────────────────────────┐
         │                                             │
    ┌────┴────┐                               ┌───────┴────┐
    │ OPCIÓN 1: │                               │ OPCIÓN 2:  │
    │ Presiona  │                               │ Hace click │
    │ Botón     │                               │ en "Atrás" │
    │ Atrás del │                               │ (UI)       │
    │ Navegador │                               │            │
    └────┬────┘                               └───────┬────┘
         │                                            │
         │                                            │
    ┌────▼──────────────────────────────────────────▼────┐
    │  useNavigationHistory Hook                          │
    │  - Mantiene stack: ["home", "consulta"]            │
    │  - currentIndex: 1                                  │
    │  - sessionStorage: app_navigation_history          │
    └────┬─────────────────────────────────────────────┘
         │
         │
    ┌────▼────────────────────────────────────────────┐
    │ ¿canGoBack()? (currentIndex > 0)                │
    └────┬───────────────────────────┬────────────────┘
         │                           │
      SI│                           │NO
        │                           │
    ┌───▼────────────────────┐  ┌──▼──────────────────┐
    │ goBack()               │  │ Redirige a fallback │
    │ - currentIndex--       │  │ (home)              │
    │ - Navega a "home"      │  │ - Previene salida   │
    │ - Actualiza popstate   │  │ de la app           │
    └───┬────────────────────┘  └──┬──────────────────┘
        │                          │
        │                          │
    ┌───▴──────────────────────────▴────────────┐
    │ Usuario permanece en la aplicación ✓      │
    │ No sale del dominio                       │
    │ No va a página en blanco                  │
    │ No cierra la pestaña                      │
    └──────────────────────────────────────────┘
```

---

## 🎯 Mecanismos de Protección

### 1️⃣ **Deep Link Protection** (URL directa)

```typescript
// Usuario accede directamente a: /consulta
// Historia vacía: window.history.length ≤ 1

const goBack = useCallback(() => {
  const current = historyStackRef.current;

  // ❌ NO puede ir atrás (currentIndex === 0)
  if (current.currentIndex > 0) {
    // Ir atrás
  } else {
    // ✅ FALLBACK: redirige a home
    onNavigate(fallbackView); // "home"
  }
}, [fallbackView, onNavigate]);
```

**Resultado**: Usuario va a `/home` en lugar de salir de la app.

---

### 2️⃣ **Native Browser Back Button** (evento popstate)

```typescript
// Escucha el evento popstate (botón atrás del navegador)
useEffect(() => {
  const handlePopState = (event: PopStateEvent) => {
    const view = event.state?.view as ViewType | undefined;
    if (view) {
      // ✅ Navega DENTRO de la app usando React state
      onNavigate(view); // Actualiza currentView
    }
  };

  window.addEventListener("popstate", handlePopState);
  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, [onNavigate]);
```

**Resultado**: El botón atrás navega dentro de la app, no sale del dominio.

---

### 3️⃣ **History Stack in sessionStorage**

```json
{
  "stack": ["login", "home", "consulta", "premium"],
  "currentIndex": 3
}
```

- Se guarda después de cada navegación
- Persiste mientras la pestaña está abierta
- Se limpia automáticamente al cerrar la pestaña
- Se vacía en logout

---

### 4️⃣ **Button UI State** (Visual Feedback)

```tsx
<BackButton navigationApi={navigationApi} />
// Internamente:
const canGoBack = navigationApi.canGoBack(); // false si índice === 0

// Renderiza así:
<button
  disabled={!canGoBack}  // ← Deshabilitado si no hay historial
  className={`
    ${canGoBack
      ? "cursor-pointer hover:bg-slate-100"
      : "opacity-50 cursor-not-allowed" // Visualmente deshabilitado
    }`}
>
  ← Atrás
</button>
```

**Resultado**: Usuario sabe visualmente cuándo puede ir atrás.

---

## 📍 Flujos Específicos

### Flujo A: Usuario entra por Deep Link (URL directa)

```
1. Usuario accede: https://app.com/consulta
2. navigationHistory inicializa con ["consulta"]
3. Usuario hace clic en "Atrás"
4. canGoBack() retorna FALSE (currentIndex === 0)
5. Botón está DESHABILITADO visualmente
6. Si intenta forzar: fallback a "home"

✅ RESULTADO: Permanece en la app
```

### Flujo B: Usuario navega con el historial lleno

```
1. Usuario: home → consulta → buscar
2. Stack: ["home", "consulta", "buscar"], index: 2
3. Usuario hace clic en "Atrás"
4. canGoBack() retorna TRUE
5. goBack() decrementa index: 2 → 1
6. Navega a "consulta"
7. Stack actualizado en sessionStorage

✅ RESULTADO: Navega correctamente
```

### Flujo C: Usuario presiona botón atrás del navegador

```
1. Usuario en: "premium" (navegación normal)
2. Presiona botón atrás del navegador
3. Se dispara evento popstate
4. handlePopState obtiene la vista anterior
5. onNavigate(previousView) actualiza React state
6. App re-renderiza con la vista anterior

✅ RESULTADO: Navega dentro de la app, no sale
```

### Flujo D: Usuario hace logout

```
1. Usuario hace clic en "Cerrar Sesión"
2. handleLogout() se ejecuta
3. navigationHistory.clearHistory() se ejecuta
4. Stack se resetea a: ["home"], index: 0
5. setCurrentView("login")
6. sessionStorage se actualiza

✅ RESULTADO: Historial limpio para próxima sesión
```

---

## 🔒 Casos de Seguridad Cubiertos

| Escenario | Antes (Sin solución) | Después (Con solución) |
|---|---|---|
| **Deep link sin historial** | Navega fuera o página blanca | Fallback a home |
| **Botón atrás en primer item** | Sale de la app | Se queda en home |
| **Botón atrás del navegador** | Comportamiento impredecible | Navega dentro de app |
| **Logout** | Historial persiste | Se limpia automáticamente |
| **Cierre de pestaña** | sessionStorage se destruye (normal) | Nueva sesión inicia limpia |
| **Multiple popstate events** | Pérdida de sincronización | Se maneja correctamente |

---

## 🧪 Testing: Cómo Verificar que Funciona

### Test 1: Deep Link Protection

```bash
1. Abre: https://app.com/consulta (copia/pega la URL directo)
2. Haz clic en "Atrás"
3. ✅ Debe ir a /home, NO salir de la app
```

### Test 2: Browser Back Button

```bash
1. Navega: home → consulta → buscar
2. Presiona botón atrás del navegador (← flecha)
3. ✅ Debe ir a consulta, NO a página anterior
```

### Test 3: History Stack Debug

```bash
// En consola del navegador:
JSON.parse(sessionStorage.getItem("app_navigation_history"))

// Salida esperada:
{
  "stack": ["home", "consulta", "buscar"],
  "currentIndex": 2
}
```

### Test 4: Logout Cleanup

```bash
1. Navega: home → consulta → premium
2. Hace logout
3. Verifica sessionStorage:
   ✅ Debe estar limpio o tener ["home"]
```

### Test 5: Button States

```bash
1. Accede a deep link: /premium
2. Botón "Atrás" debe estar DESHABILITADO
3. Navega a otra vista
4. Botón "Atrás" debe estar HABILITADO
```

---

## 📈 Arquitectura de Estado

```
App Component
├── currentView: "consulta"
├── navigationHistory (hook)
│   ├── stack: ["home", "consulta"]
│   ├── currentIndex: 1
│   ├── sessionStorage: saved state
│   └── popstate listener: event handler
│
└── setCurrentView callback
    └── Triggers re-render
        └── Updates navigationHistory hook
```

---

## 🚨 Limitaciones y Edge Cases

### ❌ No cubre:

- **Navegación fuera del app** (links con `target="_blank"`)
  - Solución: Usar `<a href="...">` sin target o `preventDefault`
- **Cierre de pestaña** (evento `beforeunload`)
  - Solución: `window.addEventListener("beforeunload", ...)`
- **Back button en Android** (diferente a navegador)
  - Solución: Usar capacitor/cordova para apps nativas

### ✅ Si implementas guardas adicionales:

```tsx
// Confirmar antes de navegar si hay cambios sin guardar
const handleGoBack = async () => {
  if (hasUnsavedChanges) {
    const confirm = await showConfirmDialog("¿Descartar cambios?");
    if (!confirm) return;
  }
  navigationHistory.goBack();
};
```

---

## 📚 Archivos Relacionados

- [useNavigationHistory.ts](../src/hooks/useNavigationHistory.ts) - Lógica principal
- [BackButton.tsx](../src/components/BackButton.tsx) - Componente UI
- [App.tsx](../src/App.tsx) - Integración
- [NAVIGATION_HISTORY_GUIDE.md](../NAVIGATION_HISTORY_GUIDE.md) - Guía de uso
