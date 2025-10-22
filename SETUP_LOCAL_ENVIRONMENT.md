# 🔧 CONFIGURACIÓN ENTORNO LOCAL - PASO A PASO

## ✅ **YA TIENES:**

- WSL instalado
- Anchor CLI 0.31.0
- Rust instalado

## 🎯 **VAMOS A INSTALAR:**

- Solana CLI
- Configurar Devnet
- Crear wallet
- Airdrop SOL de prueba
- Deploy tu contrato

---

## 📋 **PASO 1: Instalar Solana CLI** (2 minutos)

```bash
# En WSL, ejecuta:
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

Después de la instalación, ejecuta:

```bash
# Agregar Solana al PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Para que sea permanente, agrega al ~/.bashrc:
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Verifica:

```bash
solana --version
# Debe mostrar: solana-cli 1.18.0 (o similar)
```

---

## 📋 **PASO 2: Configurar Devnet** (30 segundos)

```bash
# Configurar para usar Devnet
solana config set --url https://api.devnet.solana.com

# Verificar
solana config get
```

Debe mostrar:

```
RPC URL: https://api.devnet.solana.com
```

---

## 📋 **PASO 3: Crear/Verificar Wallet** (1 minuto)

```bash
# Verificar si ya tienes wallet
ls ~/.config/solana/id.json

# Si NO existe, crear uno nuevo:
solana-keygen new --outfile ~/.config/solana/id.json

# Ver tu dirección pública
solana address
```

**Guarda esta dirección** - es tu wallet address.

---

## 📋 **PASO 4: Airdrop SOL de prueba** (30 segundos)

```bash
# Solicitar 2 SOL de prueba
solana airdrop 2

# Verificar balance
solana balance
```

Debe mostrar: `2 SOL` (aprox)

Si el airdrop falla por rate limit:

```bash
# Intenta con menos:
solana airdrop 1

# O usa el faucet web:
# https://faucet.solana.com/
# Pega tu wallet address y solicita SOL
```

---

## 📋 **PASO 5: Build del Contrato** (1-2 minutos)

```bash
# Navegar al directorio
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-contract"

# Build
anchor build
```

**Espera 1-2 minutos** - El primer build siempre toma más tiempo.

Deberías ver:

```
✅ Build successful
```

---

## 📋 **PASO 6: Deploy a Devnet** (30 segundos)

```bash
# Deploy
anchor deploy --provider.cluster devnet
```

**¡Importante!** Al terminar verás algo como:

```
Program Id: AbCd1234...XyZ5678
```

**COPIA ESE PROGRAM ID** - Lo necesitarás para el frontend.

---

## 📋 **PASO 7: Copiar IDL al Frontend** (Automático)

El script lo hace por ti:

```bash
# Copiar IDL
cp target/idl/prediction_market.json ../src/idl/prediction_market.json
```

---

## 📋 **PASO 8: Actualizar Program ID en Frontend** (Manual)

1. Abre (en Windows): `src/lib/solana-integration.ts`
2. Línea 7, reemplaza con tu Program ID:
   ```typescript
   export const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')
   ```
3. Guarda (Ctrl+S)

---

## 📋 **PASO 9: Probar Frontend** (1 minuto)

```bash
# En PowerShell (Windows), desde el directorio raíz:
npm run dev
```

Abre: http://localhost:3000

---

## ✅ **CHECKLIST**

- [ ] Solana CLI instalado (`solana --version`)
- [ ] Configurado Devnet (`solana config get`)
- [ ] Wallet creado (`solana address`)
- [ ] SOL recibido (`solana balance` >= 1 SOL)
- [ ] Build exitoso (`anchor build`)
- [ ] Deploy exitoso (Program ID copiado)
- [ ] IDL copiado a `src/idl/`
- [ ] Program ID actualizado en `solana-integration.ts`
- [ ] Frontend corriendo (`npm run dev`)

---

## 🆘 **PROBLEMAS COMUNES**

### Error: "solana: command not found"

**Solución:** PATH no configurado correctamente

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
source ~/.bashrc
```

### Error: "Insufficient funds"

**Solución:** Airdrop falló, intenta:

```bash
solana airdrop 1
# O usa: https://faucet.solana.com/
```

### Error: "anchor: command not found" en WSL

**Solución:** Anchor puede estar instalado vía cargo:

```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.0 anchor-cli
```

### Error al Build: "version mismatch"

**Solución:** Ya está arreglado (actualicé Anchor.toml y Cargo.toml a 0.31.0)

---

## 🎉 **SIGUIENTE PASO**

Una vez deployado, continúa con:

- Crear tu primer market
- Hacer apuestas de prueba
- Preparar demo para hackathon

---

**¿Listo? Vamos paso a paso.** 🚀
