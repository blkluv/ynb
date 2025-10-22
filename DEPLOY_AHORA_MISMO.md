# 🚀 DEPLOY AHORA MISMO - INSTRUCCIONES DEFINITIVAS

## ⚡ **MÉTODO 1: DEPLOYMENT AUTOMÁTICO** (RECOMENDADO)

Este código ya está listo para funcionar en Playground SIN cambios.

### **PASOS:**

1. **Abre:** `PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs`
2. **Selecciona TODO:** Ctrl+A
3. **Copia:** Ctrl+C
4. **Ve a:** https://beta.solpg.io/
5. **Crea proyecto nuevo:**

   - Click "Create a new project"
   - Selecciona **"Anchor (Rust)"**
   - Nombre: **PrismaFi**
   - Click "Create"

6. **Pega el código:**

   - Abre `src/lib.rs`
   - **Borra TODO** lo que hay
   - **Pega** el código (Ctrl+V)
   - **Guarda** (Ctrl+S)

7. **Build:**

   - Click en el botón **"Build"** 🔨
   - Espera ~30-60 segundos
   - **Deberías ver:** ✅ Build successful

8. **Deploy:**
   - Verifica que estés en **Devnet** (abajo a la derecha)
   - Click en el botón **"Deploy"** 🚀
   - Espera ~20 segundos
   - **Copia el Program ID** que aparece en la consola

---

## 🔧 **MÉTODO 2: SI EL BUILD FALLA**

Si ves un error relacionado con Program ID, sigue estos pasos:

### **OPCIÓN A: Actualizar manualmente**

1. En Playground, abre el archivo **`Anchor.toml`**
2. Busca esta línea:
   ```toml
   [programs.localnet]
   prediction_market = "AbCd1234ExampleXyZ5678"
   ```
3. **Copia el Program ID** (el que está entre comillas)
4. Abre `src/lib.rs`
5. Ve a la **línea 11** y reemplaza:
   ```rust
   declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
   ```
   Por:
   ```rust
   declare_id!("TU_PROGRAM_ID_DE_ANCHOR_TOML");
   ```
6. **Guarda** (Ctrl+S)
7. **Build** de nuevo

### **OPCIÓN B: Usar comando terminal**

En la terminal de Playground (abajo), ejecuta:

```bash
solana address -k target/deploy/prediction_market-keypair.json
```

Copia el Program ID que aparece y úsalo en el paso 5 de la Opción A.

---

## 📋 **CHECKLIST RÁPIDO**

- [ ] Código copiado de `PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs`
- [ ] Proyecto creado en Playground (tipo: Anchor)
- [ ] Código pegado en `src/lib.rs`
- [ ] Guardado (Ctrl+S)
- [ ] Build exitoso ✅
- [ ] Verificado que estoy en Devnet
- [ ] Deploy exitoso ✅
- [ ] Program ID copiado

---

## 🎯 **DESPUÉS DEL DEPLOY**

Una vez que tengas el Program ID:

1. **Descarga el IDL:**

   - En Playground: `target/idl/prediction_market.json`
   - Click derecho → Download
   - Muévelo a: `C:\Users\edgar\cypherpunk hackathon2025\src\idl\`

2. **Actualiza el frontend:**

   - Abre: `src/lib/solana-integration.ts`
   - Línea 7: Reemplaza con tu Program ID
   - Guarda

3. **Prueba el frontend:**
   ```bash
   npm run dev
   ```

---

## 🆘 **ERRORES COMUNES Y SOLUCIONES**

### ❌ Error: "Program ID mismatch"

**Solución:** Usa el MÉTODO 2 arriba (Opción A o B)

### ❌ Error: "Insufficient funds"

**Solución:** Ve a https://faucet.solana.com/ y pide 2 SOL en Devnet

### ❌ Error: "feature init-if-needed not enabled"

**Solución:** Verifica que el proyecto sea tipo **Anchor** (no Native)

### ❌ Error: "dependency version mismatch"

**Solución:**

- En Playground, abre `Cargo.toml` (del programa)
- Verifica que `anchor-lang = "0.30.0"` (o la versión que Playground use)
- Si es diferente, cámbialo y Build de nuevo

---

## 💡 **TIPS**

- Si Playground se congela, **refresca la página** (F5)
- El **primer Build** siempre toma más tiempo (~1 minuto)
- Builds subsecuentes son más rápidos (~20 segundos)
- Si algo falla, **lee el error completo** antes de reintentar

---

## 📞 **AYUDA**

Si después de esto aún tienes problemas:

1. **Toma un screenshot** del error completo
2. **Copia el texto** del error de la terminal
3. **Pégalo aquí** y te ayudo inmediatamente

---

**¿Listo? ¡Empieza con el MÉTODO 1 ahora mismo!** 🚀


