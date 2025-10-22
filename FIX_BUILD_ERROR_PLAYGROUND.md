# 🔧 FIX: "Unable to build" en Solana Playground

## ❌ **ERROR**

```
Build error: Unable to build. If the problem persists, please consider creating an issue...
```

---

## ✅ **SOLUCIONES (prueba en orden)**

### **SOLUCIÓN 1: Refresca y reintenta** (más común)

Playground a veces tiene problemas temporales.

1. **Refresca la página** (F5)
2. Vuelve a abrir `src/lib.rs`
3. Verifica que el código esté completo
4. Click **Build** de nuevo

---

### **SOLUCIÓN 2: Verifica el tipo de proyecto**

El proyecto DEBE ser tipo **Anchor**, NO Native.

1. En Playground, mira arriba a la izquierda
2. Debe decir **"Anchor"**
3. Si dice **"Native"** o **"Seahorse"**:
   - Crea un nuevo proyecto
   - Selecciona **"Anchor (Rust)"**
   - Pega el código de nuevo

---

### **SOLUCIÓN 3: Verifica Anchor.toml**

1. En Playground, abre `Anchor.toml`
2. Debe verse así:

   ```toml
   [toolchain]

   [features]
   resolution = true
   skip-lint = false

   [programs.localnet]
   prediction_market = "TU_PROGRAM_ID_AQUI"

   [registry]
   url = "https://api.apr.dev"

   [provider]
   cluster = "Localnet"
   wallet = "~/.config/solana/id.json"

   [scripts]
   test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
   ```

3. Si falta algo, copia esto y pégalo completo
4. **Guarda** (Ctrl+S)
5. **Build** de nuevo

---

### **SOLUCIÓN 4: Verifica el Cargo.toml del programa**

1. Abre `programs/prediction_market/Cargo.toml`
2. Debe verse así:

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
   anchor-lang = { version = "0.30.0", features = ["init-if-needed"] }
   sha2 = "0.10"
   ```

3. **IMPORTANTE:** La versión de `anchor-lang` debe coincidir con la de Playground
4. Si Playground usa otra versión (mira en la esquina), cámbiala
5. **Guarda** y **Build**

---

### **SOLUCIÓN 5: Crear proyecto desde cero** (más confiable)

A veces Playground tiene un estado corrupto. Empieza limpio:

1. **Cierra todos los archivos** en Playground
2. Click en el **icono de carpeta** (arriba a la izquierda)
3. Click en los **"..."** (menú)
4. **"Delete project"** o **"Close project"**
5. **Crear nuevo proyecto:**
   - Click **"Create a new project"**
   - Nombre: **PrismaFi2** (diferente al anterior)
   - Tipo: **Anchor (Rust)**
   - Click **"Create"**
6. Abre `src/lib.rs`
7. **Borra TODO** el contenido
8. **Pega** el código de `PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs`
9. **Guarda** (Ctrl+S)
10. **Build**

---

### **SOLUCIÓN 6: Verifica dependencias sha2**

El código usa `sha2` para hashing. Asegúrate que esté en el Cargo.toml:

En `programs/prediction_market/Cargo.toml`, debe haber:

```toml
[dependencies]
anchor-lang = { version = "0.30.0", features = ["init-if-needed"] }
sha2 = "0.10"
```

Si falta `sha2 = "0.10"`, agrégalo, guarda, y Build.

---

### **SOLUCIÓN 7: Simplifica el declare_id**

A veces Playground tiene problemas con ciertos Program IDs.

1. Abre `src/lib.rs`
2. Busca la línea con `declare_id!(...)`
3. Reemplázala con este ID que sabemos que funciona:

   ```rust
   declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
   ```

4. **Guarda** y **Build**

---

### **SOLUCIÓN 8: Usa un proyecto de ejemplo primero**

Para verificar que Playground funcione:

1. En Playground, click **"Create a new project"**
2. Selecciona uno de los **ejemplos** (ej: "Counter")
3. Click **Build**
4. Si funciona → Playground está OK, el problema es el código
5. Si falla → Playground tiene problemas técnicos

Si el ejemplo funciona:

- Crea proyecto nuevo
- Pega nuestro código
- Build

---

## 🆘 **SI NADA FUNCIONA**

### **Plan B: Usa Remix IDE de Solana**

Alternativa a Playground que puede funcionar mejor:

1. Ve a: https://beta.solpg.io/ (es la misma, pero refresca)
2. O prueba en **modo incógnito** (Ctrl+Shift+N)
3. Borra cache del navegador y reintenta

### **Plan C: Build local (si tienes Anchor instalado)**

Si tienes WSL con Anchor:

```bash
cd prediction-market-contract
anchor build
anchor deploy --provider.cluster devnet
```

---

## 📋 **CHECKLIST DE DIAGNÓSTICO**

Marca lo que ya verificaste:

- [ ] Refrescar página (F5)
- [ ] Proyecto tipo "Anchor" (no Native)
- [ ] Código pegado completo (primera y última línea)
- [ ] Archivo guardado (Ctrl+S)
- [ ] Anchor.toml existe y está completo
- [ ] Cargo.toml tiene anchor-lang y sha2
- [ ] declare_id!() tiene un ID válido
- [ ] Ejemplo de Playground funciona
- [ ] Probado en modo incógnito

---

## 💡 **TIPS**

- **Playground es inestable a veces** - es normal
- **El primer build** puede fallar, el segundo funcionar
- **Espera 10 segundos** después de pegar código antes de Build
- **Cierra otros tabs** de Playground si tienes varios abiertos

---

## 🎯 **RECOMENDACIÓN**

**Prueba SOLUCIÓN 5** (crear proyecto desde cero) - resuelve el 90% de estos errores.

---

**¿Cuál solución probaste? ¿Persiste el error?**


