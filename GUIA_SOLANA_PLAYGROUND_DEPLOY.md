# 🎯 Guía Completa: Deploy con Solana Playground

## PASO 1: Abrir Solana Playground (2 min)

1. Ve a: **https://beta.solpg.io/**
2. Click en "New Project" (arriba izquierda)
3. Nombre: `prediction_market`
4. Framework: **Anchor**

---

## PASO 2: Copiar el Código (3 min)

### 2.1 Ubicación del Archivo Local
Tu smart contract está aquí:
```
📁 prediction-market-contract/programs/prediction_market/src/lib.rs
```

### 2.2 Copiar a Playground
1. Abre `lib.rs` local (392 líneas)
2. **Selecciona TODO el contenido** (Ctrl+A)
3. **Copia** (Ctrl+C)
4. En Solana Playground, busca el archivo `src/lib.rs`
5. **Borra** el contenido por defecto
6. **Pega** tu código (Ctrl+V)
7. **Guarda** (Ctrl+S)

---

## PASO 3: Actualizar Cargo.toml en Playground (2 min)

En Playground, abre `Cargo.toml` y **reemplaza** con esto:

```toml
[package]
name = "prediction_market"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "prediction_market"

[dependencies]
anchor-lang = "0.30.1"
anchor-spl = "0.30.1"
```

**Guarda el archivo.**

---

## PASO 4: Build y Deploy (5 min)

### 4.1 Build
1. Click en el botón **"Build"** (arriba a la derecha, ícono de martillo 🔨)
2. Espera 1-2 minutos (verás logs en la consola inferior)
3. Deberías ver: ✅ `Build successful`

### 4.2 Deploy
1. Click en **"Deploy"** (ícono de cohete 🚀, junto a Build)
2. Solana Playground te preguntará si quieres deployar a **Devnet** → Click "Yes"
3. Espera 30-60 segundos
4. Verás un mensaje como:

```
Deploy successful!
Program ID: 7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA
```

**COPIA ESE PROGRAM ID** (lo necesitarás en el siguiente paso)

---

## PASO 5: Descargar el IDL (1 min)

1. En Playground, click en "IDL" (tab superior)
2. Click en el botón de descarga (o copia todo el contenido)
3. Guarda el archivo como `prediction_market.json`

**O bien, el IDL aparecerá automáticamente en el panel derecho después del build exitoso.**

---

## ✅ Checklist de Deploy Exitoso

- [ ] Build exitoso sin errores
- [ ] Deploy ejecutado en Devnet
- [ ] Program ID copiado (ej: `7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA`)
- [ ] IDL descargado/copiado

---

## 🔗 Siguiente Paso

Ahora ve a **PASO 6** en la guía principal para conectar el frontend.

---

## 🆘 Troubleshooting

### Error: "Out of SOL"
**Solución:** Solana Playground te da SOL automáticamente en Devnet. Si no, usa:
- https://faucet.solana.com/
- Pide 2 SOL para tu wallet de Playground

### Error: "Build failed"
**Solución:**
1. Verifica que copiaste **TODO** el contenido de `lib.rs` (392 líneas)
2. Verifica que `Cargo.toml` está correcto (arriba)
3. Revisa la consola de Playground para errores específicos

### Error: "Deploy failed"
**Solución:**
1. Asegúrate de tener SOL en tu wallet de Playground
2. Intenta hacer Build nuevamente antes de Deploy
3. Espera 30 segundos y reintenta

---

## 📝 Notas Importantes

- **Playground usa tu wallet del navegador** (Phantom, Solflare, etc.)
- **Devnet es gratis** - no gastas SOL real
- **El Program ID es único** - guárdalo bien
- **Puedes re-deployar** cuantas veces quieras (mismo Program ID)

---

## 🎯 Una vez tengas el Program ID

Pasa al siguiente archivo: `CONECTAR_FRONTEND_GUIA.md`

