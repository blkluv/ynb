# 🔐 Guía Completa: Interacción con Wallet en Devnet

## 📋 Requisitos Previos

- ✅ Phantom Wallet instalado (https://phantom.app)
- ✅ Navegador Chrome, Firefox o Brave
- ✅ Tu app corriendo en localhost:3000 o Vercel

---

## PASO 1: Configurar Phantom para Devnet

### Método A: Desde el Menú Principal

1. Abre Phantom
2. Click en el **globo 🌐** (esquina superior derecha)
3. Selecciona **"Devnet"**
4. ✅ Verás "Devnet" en la parte superior

### Método B: Desde Settings

1. Abre Phantom
2. Click en **⚙️ Settings** (abajo izquierda)
3. Click en **"Developer Settings"**
4. Cambia **Network** → **"Devnet"**

**⚠️ IMPORTANTE:** Asegúrate de estar en Devnet, NO en Mainnet

---

## PASO 2: Obtener SOL de Devnet (Gratis)

### Opción 1: Solana Faucet (Oficial)

```
https://faucet.solana.com
```

**Pasos:**

1. Copia tu dirección de Phantom (click en tu nombre → "Copy Address")
2. Pega en el faucet
3. Click "Airdrop 2 SOL"
4. Espera 10-30 segundos
5. Verifica en Phantom

**Límites:**

- 2 SOL por request
- ~5 SOL por día

### Opción 2: QuickNode Faucet (Más rápido)

```
https://faucet.quicknode.com/solana/devnet
```

- Sin límites
- Más rápido
- 1-5 SOL por request

### Opción 3: Desde Solana Explorer

```
https://explorer.solana.com/?cluster=devnet
```

1. Busca tu dirección
2. Click en "Request Airdrop"
3. Selecciona cantidad (1-5 SOL)

---

## PASO 3: Conectar Wallet a tu App

### A. Usando la App Real

#### En Localhost:

```bash
# Si no está corriendo, inicia el servidor:
.\START_PRISMAFI_SERVER.bat
```

Abre: http://localhost:3000

#### En Vercel:

https://prismafi-prediction-market.vercel.app

### B. Conectar:

1. Click en **"Connect Wallet"** (esquina superior derecha)
2. Modal de Solana Wallet Adapter se abre
3. Selecciona **"Phantom"**
4. Popup de Phantom aparece
5. Click **"Connect"** en Phantom
6. ✅ Conectado (verás tu address en el botón)

### C. Verificar Conexión:

```
Antes:  [Connect Wallet]
Después: [8G7d...Kp2M]  ✅
```

---

## PASO 4: Usar el Test Interactivo

### Abrir Test Tool:

```bash
# Abre el archivo test-devnet-connection.html
```

O manualmente: `prediction-market/test-devnet-connection.html`

### Funciones del Test:

1. **🦊 Connect Phantom Wallet**

   - Conecta tu wallet
   - Muestra tu address y balance

2. **🔍 Check Program Deployed**

   - Verifica si el smart contract está en Devnet
   - Muestra info del programa

3. **🚀 Test Transaction**

   - Envía una mini transacción de prueba (0.001 SOL)
   - Confirma que todo funciona

4. **🌐 View in Explorer**
   - Abre Solana Explorer con tu address

---

## PASO 5: Probar Funcionalidades de la App

### A. Ver Markets (No requiere transacción)

```
http://localhost:3000/markets
```

- Lista de markets de demo
- Filtros por categoría
- Búsqueda

### B. Create Market (Requiere transacción)

```
http://localhost:3000/create-market
```

**Wallet gate activo:**

- Si NO conectado → Mensaje "Connect your wallet"
- Si conectado → Muestra formulario

**Pasos:**

1. Conecta wallet
2. Llena el formulario:
   ```
   Question: ¿Bitcoin superará $100k en 2025?
   Description: Precio según CoinGecko al 31/12/2025
   Category: Crypto
   End Date: 31/12/2025
   ```
3. Click **"Create Market"**
4. **Phantom popup aparece**
5. Revisa la transacción:
   - Network fee: ~0.000005 SOL
   - Account rent: ~0.002 SOL
   - Total: ~0.002005 SOL
6. Click **"Approve"**
7. Espera confirmación (5-15 segundos)
8. ✅ **Market creado**

### C. Portfolio (Muestra tus posiciones)

```
http://localhost:3000/portfolio
```

- Requiere wallet conectada
- Muestra stats
- Muestra posiciones activas (mock data)

### D. Activity (Feed de transacciones)

```
http://localhost:3000/activity
```

- No requiere wallet
- Muestra transacciones recientes (mock data)

---

## PASO 6: Verificar Transacciones

### En Phantom:

1. Click en **Activity** (icono de reloj 🕐)
2. Verás todas tus transacciones
3. Click en una para ver detalles
4. Click **"View on Explorer"**

### En Solana Explorer:

```
https://explorer.solana.com/?cluster=devnet
```

1. Pega tu wallet address en búsqueda
2. Tab **"Transactions"**
3. Verás todas tus transacciones
4. Click en cualquier signature para detalles

**Info útil en Explorer:**

- Transaction signature
- Block confirmations
- Program instructions
- Accounts involved
- Logs
- Token balances

---

## 📊 Costos Típicos en Devnet

| Operación          | Costo Aprox.     | Descripción          |
| ------------------ | ---------------- | -------------------- |
| **Create Market**  | 0.002-0.005 SOL  | Crear nuevo mercado  |
| **Place Bet**      | 0.0001-0.001 SOL | Hacer una apuesta    |
| **Claim Winnings** | 0.0001-0.001 SOL | Reclamar ganancias   |
| **Transfer SOL**   | 0.000005 SOL     | Transferencia simple |

**⚠️ Nota:** En Mainnet estos costos son REALES

---

## 🛠️ Troubleshooting

### ❌ "Wallet not found"

**Solución:**

1. Instala Phantom: https://phantom.app
2. Reinicia el navegador
3. Refresh la página

### ❌ "Insufficient funds"

**Solución:**

1. Verifica que estás en Devnet
2. Ve a faucet.solana.com
3. Solicita SOL
4. Espera 30 segundos
5. Intenta de nuevo

### ❌ "Transaction simulation failed"

**Causas comunes:**

- No hay suficiente SOL
- Program no deployado en Devnet
- RPC saturado

**Solución:**

1. Verifica balance (mínimo 0.1 SOL)
2. Verifica que Phantom está en Devnet
3. Intenta de nuevo en 1 minuto

### ❌ "User rejected the request"

**Causa:** Cancelaste en Phantom

**Solución:** Intenta de nuevo y click "Approve"

### ❌ Connection issues

**Solución:**

```javascript
// Refresh la página
// O desconecta y reconecta:
```

1. Click en tu address en Phantom
2. Click **"Disconnect"**
3. Reconecta desde la app

---

## 🔍 Verificar Program Deployment

### Método 1: Explorer (Más fácil)

```
https://explorer.solana.com/address/6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7?cluster=devnet
```

**Si está deployado verás:**

- ✅ Account Type: "Program"
- ✅ Executable: Yes
- ✅ Data Length: XXX bytes
- ✅ Owner: BPFLoaderUpgradeable...

**Si NO está deployado:**

- ❌ "Account Not Found"

### Método 2: Test Interactivo

1. Abre `test-devnet-connection.html`
2. Connect wallet
3. Click **"Check Program Deployed"**
4. Verás resultado instantáneo

### Método 3: RPC Call

```bash
curl https://api.devnet.solana.com \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getAccountInfo",
    "params":[
      "6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7",
      {"encoding":"jsonParsed"}
    ]
  }'
```

---

## 🎯 Checklist de Verificación

```
Pre-requisitos:
[ ] Phantom instalado
[ ] Phantom en Devnet mode
[ ] Al menos 0.1 SOL en Devnet

Conexión:
[ ] Wallet conectada a la app
[ ] Balance visible en Phantom
[ ] Address visible en app

Funcionalidad:
[ ] Markets page carga
[ ] Create Market form accesible
[ ] Portfolio muestra stats
[ ] Activity feed funciona

Transacciones:
[ ] Test transaction exitosa
[ ] Transacción visible en Phantom
[ ] Transacción visible en Explorer
[ ] Balance actualizado
```

---

## 📚 Recursos Útiles

| Recurso              | URL                                         |
| -------------------- | ------------------------------------------- |
| **Phantom**          | https://phantom.app                         |
| **Solana Faucet**    | https://faucet.solana.com                   |
| **QuickNode Faucet** | https://faucet.quicknode.com/solana/devnet  |
| **Solana Explorer**  | https://explorer.solana.com/?cluster=devnet |
| **Solana Status**    | https://status.solana.com                   |
| **RPC Devnet**       | https://api.devnet.solana.com               |

---

## 💡 Tips Pro

1. **Siempre verifica el network:**

   - Devnet = Testing (SOL gratis)
   - Mainnet = Producción (SOL real con $$)

2. **Usa Devnet primero:**

   - Prueba TODAS las funcionalidades
   - Antes de ir a Mainnet

3. **Guarda tus signatures:**

   - Para debugging
   - Para demostración

4. **Monitorea tu balance:**

   - Faucet cuando baje de 0.1 SOL

5. **Usa el test tool:**
   - Rápida verificación
   - Debugging sencillo

---

## 🚀 Próximos Pasos

Una vez que todo funcione en Devnet:

1. ✅ **Deploy a Mainnet:**

   - Actualiza `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
   - Actualiza RPC endpoint
   - Re-deploy smart contract a Mainnet

2. ✅ **Producción:**

   - Usa RPC provider pagado (Helius, QuickNode)
   - Configura monitoring
   - Implementa error handling robusto

3. ✅ **Lanzamiento:**
   - Anuncia en redes sociales
   - Share el link de Vercel
   - Recolecta feedback

---

**¿Listo para probar?** 🎉

1. Abre `test-devnet-connection.html`
2. Conecta Phantom
3. Verifica todo funcione
4. ¡Empieza a interactuar!









