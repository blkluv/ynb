# 🚀 DEPLOY PRISMAFI EN 2 MINUTOS

## ✅ **PASO 1: Abre el archivo listo**

Este archivo YA está creado en tu proyecto:

```
PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs
```

**Ábrelo** y **copia TODO el contenido** (Ctrl+A, Ctrl+C)

---

## ✅ **PASO 2: Ve a Solana Playground**

Abre en tu navegador:

```
https://beta.solpg.io/
```

---

## ✅ **PASO 3: Crea un nuevo proyecto Anchor**

1. Click en **"Create a new project"**
2. Selecciona **"Anchor (Rust)"**
3. Dale el nombre: **PrismaFi**
4. Click **"Create"**

---

## ✅ **PASO 4: Pega el código**

1. En el explorador de archivos de la izquierda, busca:

   ```
   src/lib.rs
   ```

2. **Borra TODO** el contenido que viene por defecto

3. **Pega** el código que copiaste (Ctrl+V)

4. **Guarda** (Ctrl+S)

---

## ✅ **PASO 5: Build**

En la barra superior, click en el botón:

```
🔨 Build
```

Espera ~30 segundos. Verás:

```
✅ Build successful
```

---

## ✅ **PASO 6: Deploy**

1. Asegúrate que estés en **Devnet**:

   - Abajo a la derecha verás: `Devnet` o `Mainnet`
   - Si dice `Mainnet`, cámbialo a `Devnet`

2. Click en el botón:

   ```
   🚀 Deploy
   ```

3. Espera ~20 segundos

4. Verás un mensaje:
   ```
   ✅ Deployment successful
   Program ID: AbCd1234...
   ```

---

## ✅ **PASO 7: Copia el Program ID**

En la consola inferior verás algo como:

```
Program Id: 8kX9Y2zW3vB4nC5mD6eF7gH8iJ9kL0
```

**CÓPIALO** (selecciona y Ctrl+C)

---

## ✅ **PASO 8: Descarga el IDL**

1. En el explorador de archivos, busca:

   ```
   target/idl/prediction_market.json
   ```

2. Click derecho → **Download**

3. Mueve el archivo descargado a:
   ```
   C:\Users\edgar\cypherpunk hackathon2025\src\idl\
   ```

---

## ✅ **PASO 9: Actualiza el frontend**

Abre el archivo:

```
src/lib/solana-integration.ts
```

Busca la línea ~7:

```typescript
export const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')
```

Reemplaza `TU_PROGRAM_ID_AQUI` con el Program ID que copiaste.

**Guarda** (Ctrl+S)

---

## 🎉 **¡LISTO! Ahora puedes probar tu app**

```bash
npm run dev
```

Abre: http://localhost:3000

**Conecta tu wallet Phantom y crea tu primer market!** 🎯

---

## 📊 **Verificar que funcionó**

En Solana Explorer:

```
https://explorer.solana.com/address/TU_PROGRAM_ID?cluster=devnet
```

(Reemplaza `TU_PROGRAM_ID` con el ID que copiaste)

Deberías ver:

- ✅ Program deployed
- ✅ On Devnet
- ✅ Executable: Yes

---

## 🆘 **Si algo falla**

Avísame de inmediato con el mensaje de error exacto.


