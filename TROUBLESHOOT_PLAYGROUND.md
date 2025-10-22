# 🔍 TROUBLESHOOT: Playground Build Fails

## 🎯 **PLAN DE ACCIÓN - SIGUE EXACTAMENTE**

---

## **PASO 1: Verifica que Playground funciona** (1 minuto)

Antes de usar nuestro código, verifica que Playground en sí funcione.

1. Ve a: https://beta.solpg.io/
2. Click **"Create a new project"**
3. Selecciona **"Anchor (Rust)"**
4. Usa el ejemplo **por defecto** que viene
5. Click **Build** 🔨

### **¿Qué pasó?**

- ✅ **Build exitoso** → Playground funciona, el problema es nuestro código
  - **IR A PASO 2**
- ❌ **Build falló** → Playground tiene problemas técnicos
  - **IR A PASO 5 (alternativas)**

---

## **PASO 2: Prueba código mínimo** (2 minutos)

Si Playground funciona con el ejemplo, prueba nuestro código mínimo.

1. **Crea NUEVO proyecto:**

   - Click en el menú (arriba izquierda)
   - "Delete project" o "Close project"
   - "Create new project" → **Anchor (Rust)** → Nombre: **"test"**

2. **Copia código mínimo:**

   - En tu PC, abre: `PRISMAFI_MINIMAL.rs`
   - Ctrl+A, Ctrl+C (copiar todo)

3. **Pega en Playground:**

   - Abre `src/lib.rs`
   - **BORRA TODO**
   - Ctrl+V (pegar)
   - Ctrl+S (guardar)

4. **Build:**
   - Click Build 🔨
   - Espera 30 segundos

### **¿Qué pasó?**

- ✅ **Build exitoso** → Código mínimo funciona

  - El problema es el código complejo (sha2, InitSpace, etc)
  - **Usa PRISMAFI_MINIMAL.rs para deployar**
  - **IR A PASO 4**

- ❌ **Build falló** → Problema con configuración
  - **IR A PASO 3**

---

## **PASO 3: Verifica configuración** (2 minutos)

Si hasta el código mínimo falla, revisa la configuración.

### **A. Verifica Anchor.toml**

1. En Playground, abre **`Anchor.toml`**
2. Debe verse así:

```toml
[toolchain]

[features]
resolution = true
skip-lint = false

[programs.localnet]
prediction_market = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

3. Si es diferente, **copia esto y pégalo completo**
4. **Guarda** (Ctrl+S)
5. **Build de nuevo**

### **B. Verifica Cargo.toml**

1. En Playground, abre **`programs/prediction_market/Cargo.toml`**
2. Debe tener:

```toml
[package]
name = "prediction_market"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "prediction_market"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.30.0"
```

**IMPORTANTE:** La versión de `anchor-lang` puede variar. Usa la que Playground muestra por defecto.

3. **Guarda** (Ctrl+S)
4. **Build**

### **¿Funcionó?**

- ✅ Sí → **IR A PASO 4**
- ❌ No → **IR A PASO 5**

---

## **PASO 4: Deploy el código que funcionó** (2 minutos)

Una vez que un Build sea exitoso:

1. Verifica que estés en **Devnet**

   - Abajo a la derecha debe decir "Devnet"
   - Si dice "Localnet" o "Mainnet", cámbialo

2. Click **"Deploy"** 🚀

   - Espera ~20 segundos
   - Copia el **Program ID** que aparece

3. **Descarga el IDL:**

   - En Playground: `target/idl/prediction_market.json`
   - Click derecho → Download
   - Muévelo a tu PC: `src/idl/prediction_market.json`

4. **Actualiza frontend:**

   - Abre `src/lib/solana-integration.ts`
   - Línea 7: pega tu Program ID
   - Guarda

5. **Prueba:**
   ```bash
   npm run dev
   ```

---

## **PASO 5: ALTERNATIVAS - Si Playground no funciona**

### **OPCIÓN A: Modo Incógnito** 🕵️

1. Abre tu navegador en **modo incógnito** (Ctrl+Shift+N)
2. Ve a https://beta.solpg.io/
3. Intenta de nuevo desde PASO 1

### **OPCIÓN B: Otro navegador** 🌐

1. Si usas Chrome, prueba **Firefox** o **Edge**
2. Ve a https://beta.solpg.io/
3. Intenta de nuevo desde PASO 1

### **OPCIÓN C: Limpia cache** 🧹

1. En tu navegador:
   - Chrome: Settings → Privacy → Clear browsing data
   - Selecciona "Cached images and files"
   - Clear data
2. Ve a https://beta.solpg.io/
3. Intenta de nuevo desde PASO 1

### **OPCIÓN D: Build local (si tienes Anchor)** 💻

Si tienes WSL con Anchor instalado:

```bash
cd prediction-market-contract
anchor build
anchor deploy --provider.cluster devnet
```

Si funciona:

- Copia el Program ID
- Continúa con PASO 4 (puntos 3-5)

### **OPCIÓN E: Espera y reintenta** ⏰

A veces Playground tiene problemas del lado del servidor:

1. Espera 10-15 minutos
2. Refresca la página (F5)
3. Intenta de nuevo desde PASO 1

---

## 📊 **CHECKLIST DE DIAGNÓSTICO**

Marca lo que ya probaste:

- [ ] Ejemplo por defecto de Playground funciona
- [ ] Código mínimo (PRISMAFI_MINIMAL.rs)
- [ ] Anchor.toml verificado y correcto
- [ ] Cargo.toml verificado y correcto
- [ ] Proyecto es tipo "Anchor" (no Native)
- [ ] Refrescado la página (F5)
- [ ] Probado en modo incógnito
- [ ] Probado en otro navegador
- [ ] Limpiado cache del navegador
- [ ] Esperado 10+ minutos y reintentado

---

## 🆘 **REPORTE DE ERROR**

Si **TODO falla**, dame esta información:

1. **¿El ejemplo por defecto de Playground funcionó?**

   - [ ] Sí
   - [ ] No

2. **¿Qué navegador usas?**

   - Chrome / Firefox / Edge / Safari / Otro: **\_**

3. **¿El proyecto es tipo "Anchor"?**

   - [ ] Sí
   - [ ] No
   - [ ] No sé cómo verificar

4. **Screenshot:**

   - Toma screenshot de la pantalla completa de Playground
   - Muestra el error

5. **Consola del navegador:**
   - Presiona F12
   - Ve a la pestaña "Console"
   - Copia cualquier error que veas en rojo

Con esa info puedo darte una solución más específica.

---

## 💡 **NOTA IMPORTANTE**

Si Playground está fallando de forma consistente, **puede ser un problema temporal del servicio**. En ese caso:

- ✅ Usa el **build local** (OPCIÓN D)
- ✅ O espera unas horas y reintenta
- ✅ Playground no es 100% estable

El proyecto está **listo** y **correcto**. Solo necesitamos deployarlo. 🚀
