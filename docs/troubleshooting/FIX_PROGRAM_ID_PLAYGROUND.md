# 🔧 FIX: Program ID en Solana Playground

## ❌ **PROBLEMA COMÚN**

Cuando pegas el código en Playground y das **Build**, ves un error relacionado con Program ID.

---

## ✅ **SOLUCIÓN EN 3 PASOS**

### **PASO 1: Obtener el Program ID correcto**

En Solana Playground, después de crear tu proyecto:

1. Mira en el **explorador de archivos** (panel izquierdo)
2. Busca el archivo: `Anchor.toml`
3. Ábrelo
4. Encontrarás una línea como:
   ```toml
   [programs.localnet]
   prediction_market = "AbCd1234...XyZ5678"
   ```
5. **Copia ese Program ID** (el que está entre comillas)

**O MÉTODO ALTERNATIVO:**

1. En la terminal de Playground, ejecuta:
   ```bash
   solana address -k target/deploy/prediction_market-keypair.json
   ```
2. Copia el Program ID que aparece

---

### **PASO 2: Actualizar el código**

1. Abre `src/lib.rs` en Playground
2. Busca la línea 9-11:
   ```rust
   // TODO: Reemplaza este Program ID...
   declare_id!("11111111111111111111111111111111");
   ```
3. **Reemplaza** `11111111111111111111111111111111` con el Program ID que copiaste:
   ```rust
   declare_id!("AbCd1234...XyZ5678");  // ← Tu Program ID aquí
   ```
4. **Guarda** (Ctrl+S)

---

### **PASO 3: Build de nuevo**

1. Click en el botón **Build** 🔨
2. Espera ~30 segundos
3. Deberías ver:
   ```
   ✅ Build successful
   ```

---

## 🎯 **MÉTODO MÁS FÁCIL: Dejar que Playground lo genere**

Si no quieres buscar el Program ID manualmente:

1. **Borra la línea** `declare_id!("11111111111111111111111111111111");`
2. En su lugar, escribe:
   ```rust
   declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
   ```
   _(Este es un placeholder válido que Playground aceptará)_
3. Después del **primer Build exitoso**, Playground actualizará automáticamente este ID con el correcto

---

## 🆘 **SI AÚN FALLA**

Si después de cambiar el Program ID **todavía falla el Build**:

1. **Copia el error completo** de la terminal de Playground
2. **Pégamelo aquí**
3. Te ayudo a identificar el problema exacto

Los errores más comunes son:

- ❌ **"Program ID mismatch"** → Usa esta guía
- ❌ **"feature not enabled"** → Verifica que el proyecto sea tipo **Anchor** (no Native)
- ❌ **"dependency error"** → Puede haber un problema con las versiones de Anchor en Playground

---

## 📝 **RESUMEN VISUAL**

```
┌─────────────────────────────────────┐
│  1. Crear proyecto en Playground   │
│     → Se auto-genera Program ID    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Copiar Program ID               │
│     De: Anchor.toml                 │
│     O: solana address -k ...        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Pegar en declare_id!()          │
│     Línea 11 en src/lib.rs          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Build exitoso ✅                │
└─────────────────────────────────────┘
```

---

## 🚀 **SIGUIENTE PASO**

Una vez que el Build funcione:

- Continúa con el **PASO 6** de `DEPLOY_EN_2_MINUTOS.md` (Deploy)
- O sigue el `CHECKLIST_DEPLOYMENT.md` paso 8

---

**¿El error persiste? Pégame el mensaje completo y lo resolvemos juntos.** 💪


