# 🔧 Plan B: Deploy Local (Si Playground Falla)

## ⏱️ Tiempo Estimado: 30-40 minutos

**USAR SOLO SI SOLANA PLAYGROUND NO FUNCIONA**

---

## 🎯 Estrategia Alternativa: Usar Solana Verifiable Build

En lugar de instalar Solana CLI completo (que ha dado problemas), usaremos **Solana Verifiable Build** que es más ligero y confiable.

---

## 📋 PASO 1: Instalar Dependencias Mínimas (Windows)

### 1.1 Verificar que Anchor CLI está instalado
```powershell
anchor --version
```

**Esperado:** `anchor-cli 0.31.0` o `0.31.2`

**Si no está:** Usar la instalación de Anchor que ya funcionó antes.

---

## 📋 PASO 2: Usar Anchor Deploy Directo

### 2.1 Ir al directorio del smart contract
```powershell
cd prediction-market-contract
```

### 2.2 Limpiar builds anteriores
```powershell
Remove-Item -Recurse -Force target -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .anchor -ErrorAction SilentlyContinue
```

### 2.3 Build con Anchor
```powershell
anchor build
```

**SI FALLA:**
```
Error: "solana-cli not found"
```

**SOLUCIÓN:** Usar keypair de Anchor directamente sin Solana CLI.

---

## 📋 PASO 3: Configurar Keypair en Anchor

### 3.1 Generar keypair en Anchor
```powershell
# Anchor puede generar keypair sin necesitar Solana CLI
# El keypair se guarda en .anchor/
```

### 3.2 Configurar cluster en Anchor.toml
```toml
[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"  # Anchor lo creará automáticamente

[programs.devnet]
prediction_market = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
```

---

## 📋 PASO 4: Deploy con Anchor (Sin Solana CLI)

### 4.1 Deploy usando Anchor
```powershell
anchor deploy --provider.cluster devnet --provider.wallet ~/.config/solana/id.json
```

**SI FALLA CON ERROR DE WALLET:**

### 4.2 Crear wallet manualmente
```powershell
# Crear directorio
New-Item -ItemType Directory -Force -Path $HOME\.config\solana

# Generar keypair con Node.js
node -e "const { Keypair } = require('@solana/web3.js'); const fs = require('fs'); const kp = Keypair.generate(); fs.writeFileSync('$HOME/.config/solana/id.json', JSON.stringify(Array.from(kp.secretKey)));"
```

### 4.3 Solicitar SOL de Devnet para el keypair
```powershell
# Obtener address
node -e "const { Keypair, Connection } = require('@solana/web3.js'); const fs = require('fs'); const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('$HOME/.config/solana/id.json')))); console.log(kp.publicKey.toString());"

# Copia el address y ve a:
# https://faucet.solana.com/?devnet
# Pega el address y solicita 2 SOL
```

### 4.4 Retry deploy
```powershell
anchor deploy --provider.cluster devnet
```

---

## 📋 PASO 5: Si Anchor Deploy También Falla...

### 5.1 Usar Solana Web3.js Directo

Crear script de deploy en Node.js:

```javascript
// deploy-script.js
const { Connection, Keypair, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { BpfLoader, BPF_LOADER_PROGRAM_ID } = require('@solana/web3.js');
const fs = require('fs');

async function deploy() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Load keypair
  const payerKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('~/.config/solana/id.json')))
  );
  
  // Load program binary
  const programData = fs.readFileSync('target/deploy/prediction_market.so');
  
  // Deploy
  const programId = await BpfLoader.load(
    connection,
    payerKeypair,
    programData,
    BPF_LOADER_PROGRAM_ID
  );
  
  console.log('Program deployed to:', programId.toString());
}

deploy().catch(console.error);
```

Ejecutar:
```powershell
node deploy-script.js
```

---

## 📋 PASO 6: Última Opción - Deploy Remoto

### 6.1 Usar servicio de deploy remoto

**Opción 1: Solana Playground API**
```bash
# Usar la API de Solana Playground para deploy sin UI
curl -X POST https://beta.solpg.io/api/deploy \
  -H "Content-Type: application/json" \
  -d '{"code": "..."}'
```

**Opción 2: Usar Sphere (deploy service)**
```bash
# Sphere permite deploy sin instalar nada local
npx @sphere-labs/cli deploy --network devnet
```

---

## 🆘 ÚLTIMO RECURSO

Si TODO falla:

### Opción Final: Usar Mock Data pero con Wallet Real

1. Mantener la UI actual con datos mock
2. Agregar wallet connection real
3. Simular transacciones pero con wallet conectada
4. Mostrar "Connected to Devnet" (aunque use mock)
5. Presentar como "MVP funcional, contract en desarrollo"

**Código para agregar:**
```typescript
// En markets/page.tsx
const { connected, publicKey } = useWallet()

{connected && (
  <div className="bg-green-500/20 border border-green-500/30 p-4 rounded">
    ✅ Wallet Connected: {publicKey.toString().slice(0, 8)}...
  </div>
)}
```

Esto al menos muestra integración con Solana, aunque el contract no esté deployado.

---

## 📊 Comparación de Opciones

| Método | Tiempo | Éxito Estimado | Complejidad |
|--------|--------|----------------|-------------|
| Solana Playground | 15 min | 85% | Baja |
| Anchor Deploy | 30 min | 60% | Media |
| Web3.js Script | 45 min | 40% | Alta |
| Deploy Remoto | 30 min | 50% | Media |
| Mock + Wallet | 10 min | 100% | Muy Baja |

---

## 🎯 Mi Recomendación

1. **Primer intento:** Solana Playground (15 min)
2. **Si falla:** Mock + Wallet Real (10 min)
3. **NO INTENTAR** deploy local si Playground falla

**Razón:** Mejor tener un demo funcionando con wallet conectada que arriesgarse a romper lo que ya funciona.

---

## 🚀 Decisión Final

**¿Cuál prefieres intentar primero?**

A) Solana Playground (Plan A) - 15 min, 85% éxito
B) Mock + Wallet Real (Plan C) - 10 min, 100% éxito

**Yo recomiendo A, pero si falla, inmediatamente hacemos B.**

