# 🚀 DEPLOY EN CHROME/FIREFOX (1 minuto)

## ❌ **PROBLEMA IDENTIFICADO**

**Brave browser** + **Solana Playground** = Problemas de compatibilidad

Brave Shields bloquea funcionalidad necesaria para el build.

---

## ✅ **SOLUCIÓN INMEDIATA**

### **Usa Chrome o Firefox:**

1. **Abre Chrome o Firefox** (no Brave)

2. **Ve a:** https://beta.solpg.io/

3. **Crea proyecto:**

   - "Create new project"
   - Tipo: **Anchor (Rust)**
   - Nombre: **PrismaFi**

4. **Copia código:**

   - Abre: `PRISMAFI_SIMPLE_PLAYGROUND.rs` (en tu PC)
   - Ctrl+A, Ctrl+C

5. **Pega en Playground:**

   - Abre `src/lib.rs`
   - Borra todo
   - Ctrl+V
   - Ctrl+S (guardar)

6. **Build:**

   - Click **Build** 🔨
   - Espera 30-60 segundos
   - Debería funcionar ✅

7. **Deploy:**
   - Verifica que estés en **Devnet** (abajo a la derecha)
   - Click **Deploy** 🚀
   - Copia el **Program ID**

---

## 📦 **DESPUÉS DEL DEPLOY**

### **1. Descarga IDL:**

- En Playground: `target/idl/prediction_market.json`
- Click derecho → Download
- Muévelo a: `C:\Users\edgar\cypherpunk hackathon2025\src\idl\`

### **2. Actualiza frontend:**

```bash
# Abre este archivo:
src/lib/solana-integration.ts

# Línea 7: Reemplaza con tu Program ID
export const PROGRAM_ID = new PublicKey("TU_PROGRAM_ID_AQUI");

# Guarda
```

### **3. Prueba:**

```bash
npm run dev
```

---

## 💡 **¿POR QUÉ BRAVE NO FUNCIONA?**

Brave bloquea:

- WebAssembly workers
- WASM compilation
- Ciertas APIs web necesarias para Solana Playground

**Solución:** Usa Chrome/Firefox para Playground, luego vuelve a Brave para el resto.

---

## 🆘 **SI AÚN FALLA EN CHROME/FIREFOX**

Si el build falla también en Chrome/Firefox, entonces el problema ES de Playground (no tu código ni tu browser).

En ese caso:

1. **Espera 30 minutos** - Playground puede tener problemas temporales
2. O **avísame** - Te ayudo a configurar el entorno local completo

---

**¡Prueba esto ahora! Chrome/Firefox debería funcionar.** 🚀
