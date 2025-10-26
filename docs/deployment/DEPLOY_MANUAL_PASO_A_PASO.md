# 🚀 DEPLOY MANUAL - PASO A PASO

## ⚡ **EJECUTA ESTOS COMANDOS EN ORDEN**

Copia y pega cada bloque en tu terminal. **Espera** a que termine cada uno antes del siguiente.

---

## 📋 **PASO 1: Abrir WSL** (5 segundos)

En PowerShell, ejecuta:

```bash
wsl
```

Deberías ver el prompt de Linux (algo como `user@PC:~$`)

---

## 📋 **PASO 2: Instalar Solana CLI** (1-2 minutos)

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

**Espera** a que termine. Verás mensajes de descarga e instalación.

Al terminar, ejecuta:

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
```

**Verifica** que funcione:

```bash
solana --version
```

Debe mostrar: `solana-cli 1.18.0` (o similar)

✅ Si ves la versión → Continúa al PASO 3
❌ Si dice "command not found" → Avísame

---

## 📋 **PASO 3: Configurar Devnet** (10 segundos)

```bash
solana config set --url https://api.devnet.solana.com
```

Debe mostrar: `Config File: /home/.../.config/solana/cli/config.yml`

**Verifica:**

```bash
solana config get
```

Debe mostrar: `RPC URL: https://api.devnet.solana.com`

---

## 📋 **PASO 4: Crear Wallet** (30 segundos)

```bash
solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase
```

Cuando pregunte "Overwrite file?", escribe: `y` y Enter

**Ver tu wallet address:**

```bash
solana address
```

**COPIA** este address (lo necesitarás para airdrop)

---

## 📋 **PASO 5: Airdrop SOL** (30 segundos)

```bash
solana airdrop 2
```

**Espera** ~5 segundos, luego verifica:

```bash
solana balance
```

Debe mostrar: `2 SOL` (aprox)

❌ **Si el airdrop falla:**

- Intenta: `solana airdrop 1`
- O usa: https://faucet.solana.com/ (pega tu wallet address)

---

## 📋 **PASO 6: Navegar al proyecto** (5 segundos)

```bash
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-contract"
```

**Verifica** que estés en el directorio correcto:

```bash
pwd
ls Anchor.toml
```

Debe mostrar: `Anchor.toml`

---

## 📋 **PASO 7: Build del contrato** (1-3 minutos) ⏰

Este es el paso MÁS LENTO. Sé paciente.

```bash
anchor build
```

**Verás muchas líneas** de "Compiling..."

**Espera** hasta que termine. Al final debe decir:

```
✅ Build successful
```

O algo similar.

❌ **Si falla:**

- Copia el error COMPLETO
- Avísame para ayudarte

---

## 📋 **PASO 8: Deploy a Devnet** (30-60 segundos)

```bash
anchor deploy --provider.cluster devnet
```

**MUY IMPORTANTE:** Al final verás algo como:

```
Program Id: AbCd1234ExampleXyZ5678
```

**COPIA ESE PROGRAM ID** - Lo necesitarás en el siguiente paso.

---

## 📋 **PASO 9: Copiar IDL** (5 segundos)

```bash
mkdir -p "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/idl"
cp target/idl/prediction_market.json "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/idl/prediction_market.json"
```

**Verifica:**

```bash
ls "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/idl/prediction_market.json"
```

Debe mostrar la ruta del archivo.

---

## 📋 **PASO 10: Salir de WSL** (5 segundos)

```bash
exit
```

Vuelves a PowerShell (Windows).

---

## 📋 **PASO 11: Actualizar Program ID en Frontend** (30 segundos)

En PowerShell (Windows):

```bash
# Abre el archivo:
code src\lib\solana-integration.ts
```

**Busca la línea ~7:**

```typescript
export const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')
```

**Reemplaza** `TU_PROGRAM_ID_AQUI` con el Program ID que copiaste en el PASO 8.

**Guarda** (Ctrl+S)

---

## 📋 **PASO 12: Correr el frontend** (30 segundos)

En PowerShell:

```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

---

## 🎉 **¡LISTO!**

Ahora puedes:

1. **Conectar** tu Phantom wallet (en Devnet)
2. **Crear** tu primer market
3. **Hacer** apuestas
4. **Probar** todo el flujo

---

## 📊 **Verificar en Solana Explorer:**

```
https://explorer.solana.com/address/TU_PROGRAM_ID?cluster=devnet
```

(Reemplaza TU_PROGRAM_ID con el tuyo)

Deberías ver:

- ✅ Program deployed
- ✅ Executable: Yes
- ✅ On Devnet

---

## 🆘 **SI TIENES PROBLEMAS EN ALGÚN PASO:**

**DETENTE** y avísame:

- ¿En qué paso estás?
- ¿Qué error ves?
- Copia el error completo

¡Te ayudo a resolverlo! 💪

---

**¿Listo para empezar? Empieza con el PASO 1.** 🚀
