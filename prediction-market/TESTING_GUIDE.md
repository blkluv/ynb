# 🧪 Guía de Testing End-to-End

**Fecha:** 2025-10-25  
**Status:** En progreso

---

## ✅ Pre-requisitos

- [x] Smart contract deployado: `9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka`
- [x] Frontend integrado y corriendo en `http://localhost:3000`
- [ ] Wallet con SOL en Devnet (min 0.5 SOL)

---

## 🚀 Setup Rápido

```bash
# 1. Verificar balance
solana balance --url devnet

# 2. Si necesitas SOL
solana airdrop 2 --url devnet

# 3. Verificar que el frontend esté corriendo
# Abre: http://localhost:3000
```

---

## 📝 Test Cases

### Test 1: Connect Wallet ✅
**Objetivo:** Verificar que la wallet se conecta correctamente

**Pasos:**
1. Abre http://localhost:3000
2. Click en el botón de wallet (arriba derecha)
3. Selecciona tu wallet (Phantom/Solflare)
4. Aprueba la conexión

**Resultado esperado:**
- ✅ Wallet address visible en el header
- ✅ Balance de SOL mostrado
- ✅ "DEMO MODE" banner desaparece

---

### Test 2: Create Market ✅
**Objetivo:** Crear un mercado on-chain

**Pasos:**
1. Click "Create Market" en el navbar
2. Llena el formulario:
   ```
   Question: ¿Bitcoin superará $100,000 USD en 2025?
   Description: This market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange (Binance, Coinbase, Kraken) before December 31, 2025 23:59:59 UTC. Price must be sustained for at least 1 hour. Resolution will be based on CoinGecko data.
   Category: Crypto
   End Date: [30 días en el futuro]
   End Time: 23:59
   ```
3. Click "Show Preview" (opcional)
4. Click "Create Market"
5. Aprueba en wallet (~0.01-0.03 SOL)

**Resultado esperado:**
- ✅ Transaction signature en alert
- ✅ Link a Solana Explorer funciona
- ✅ Redirect a `/markets/{marketPubkey}`
- ✅ Market muestra detalles correctos

**Verificación on-chain:**
```bash
# Ver transaction en explorer
https://explorer.solana.com/tx/{SIGNATURE}?cluster=devnet

# O verificar con CLI
solana transaction {SIGNATURE} --url devnet
```

---

### Test 3: View Markets List ✅
**Objetivo:** Ver todos los mercados on-chain

**Pasos:**
1. Click "Markets" en el navbar
2. Espera 2-3 segundos (loading)
3. Verifica que aparezca tu mercado

**Resultado esperado:**
- ✅ Tu mercado aparece en la lista
- ✅ Muestra question correcta
- ✅ Muestra "0.00 SOL" en ambos pools
- ✅ Status: "🟢 Active"
- ✅ Category badge visible

**Debug:**
- Si no aparece: F12 → Console → buscar errores
- Si muestra mock data: Es normal, verifica que wallet esté conectada

---

### Test 4: View Market Detail ✅
**Objetivo:** Ver detalles de un mercado específico

**Pasos:**
1. Desde Markets list, click en tu mercado
2. Espera que cargue (loading spinner)
3. Revisa toda la información

**Resultado esperado:**
- ✅ Question visible
- ✅ Description completa
- ✅ Resolution criteria clara
- ✅ Volume: 0.0 SOL
- ✅ Creator: tu address (primeros 4 chars)
- ✅ End date visible
- ✅ Status badge correcto
- ✅ Trading interface visible a la derecha

---

### Test 5: Place Bet - YES ✅
**Objetivo:** Apostar en YES

**Pasos:**
1. En market detail, sidebar derecha
2. Click en el botón "YES" (verde)
3. Ingresa: `0.1` SOL
4. Verifica "Potential Winnings" preview
5. Click "Place YES Bet"
6. Aprueba en wallet (~0.1 SOL + fees)

**Resultado esperado:**
- ✅ Transaction signature en alert
- ✅ Link a explorer funciona
- ✅ Success message verde aparece
- ✅ Página se refresca automáticamente (3 seg)
- ✅ Pool YES ahora muestra ~0.1 SOL
- ✅ Odds cambian: YES > 50%

**Verificación:**
```bash
# Ver transaction
https://explorer.solana.com/tx/{SIGNATURE}?cluster=devnet
```

---

### Test 6: Place Bet - NO ✅
**Objetivo:** Apostar en NO (idealmente con otra wallet)

**Pasos:**
1. Cambia a otra wallet (o usa la misma)
2. Navega al mismo mercado
3. Click en "NO" (rojo)
4. Ingresa: `0.05` SOL
5. Click "Place NO Bet"
6. Aprueba en wallet

**Resultado esperado:**
- ✅ Transaction exitosa
- ✅ Pool NO muestra ~0.05 SOL
- ✅ Pool YES sigue en ~0.1 SOL
- ✅ Total volume: ~0.15 SOL
- ✅ Odds: YES ~67%, NO ~33%

---

### Test 7: Odds Calculation ✅
**Objetivo:** Verificar que los odds se calculan correctamente

**Después de los bets anteriores:**
```
YES pool: 0.1 SOL
NO pool: 0.05 SOL
Total: 0.15 SOL

Expected odds:
YES: (0.1 / 0.15) = 66.67%
NO: (0.05 / 0.15) = 33.33%
```

**Resultado esperado:**
- ✅ YES muestra ~67%
- ✅ NO muestra ~33%
- ✅ Total suma 100%

---

### Test 8: Resolution (Authority Only) ✅
**Objetivo:** Resolver el mercado

**NOTA:** Este test solo funciona si:
- Eres el creador del mercado
- El mercado ya expiró (end_time < now)

**Para testing rápido, crea un mercado con end_time muy cercano:**
- End Date: Hoy
- End Time: 5 minutos en el futuro

**Pasos:**
1. Espera a que expire
2. Como creator, ve al market detail
3. Verás "🎯 Resolve Market (Authority Only)"
4. Click en "YES WINS" o "NO WINS"
5. Click "Confirm and Resolve Market"
6. Aprueba en wallet

**Resultado esperado:**
- ✅ Transaction exitosa
- ✅ Alert con signature
- ✅ Market ahora muestra "✓ Resolved"
- ✅ Winning outcome visible
- ✅ Trading interface deshabilitada
- ✅ "Market Closed" banner

**Verificación:**
```bash
https://explorer.solana.com/tx/{SIGNATURE}?cluster=devnet
```

---

## 📊 Test Matrix

| Test | Status | Transaction | Notas |
|------|--------|-------------|-------|
| Connect Wallet | [ ] | N/A | |
| Create Market | [ ] | [ ] | |
| View Markets | [ ] | N/A | |
| View Detail | [ ] | N/A | |
| Bet YES | [ ] | [ ] | |
| Bet NO | [ ] | [ ] | |
| Odds Update | [ ] | N/A | |
| Resolution | [ ] | [ ] | Solo si expiró |

---

## 🐛 Troubleshooting Común

### Error: "Insufficient funds"
```bash
# Solicita más SOL
solana airdrop 2 --url devnet

# Verifica balance
solana balance --url devnet
```

### Error: "Transaction simulation failed"
**Posibles causas:**
1. Mercado ya expiró (para bets)
2. Mercado no expiró (para resolution)
3. No eres el authority (para resolution)
4. Bet amount < 0.01 SOL

**Solución:**
- Abre DevTools (F12) → Console
- Busca el error específico
- Verifica los parámetros

### Market no aparece en lista
**Causa:** La confirmación de la transaction puede tardar 1-2 segundos

**Solución:**
- Espera 3 segundos
- Refresca la página (F5)
- Si sigue sin aparecer, verifica la transaction en Explorer

### "Market not found" error
**Causa:** El PublicKey del market no es válido

**Solución:**
- Copia el market address desde el alert después de crear
- O búscalo en la lista de markets

### Frontend muestra mock data
**Causa:** Wallet no conectada O no hay markets on-chain

**Solución:**
- Conecta wallet
- Si ya está conectada, es normal si no has creado markets
- Mock data es el fallback intencional

---

## 🎬 Grabación para Video Demo

### Setup
```bash
# 1. Prepara OBS o Loom
# 2. Configura resolución: 1920x1080
# 3. Frame rate: 30 fps
# 4. Audio: micrófono claro
```

### Script del Video (3-5 min)

**[0:00-0:30] Intro**
```
"Hola, soy [nombre] y les presento Trepa - 
Accountability Markets for LATAM.

En LATAM faltan mecanismos para hacer accountable
a políticos y figuras públicas por sus promesas.

Trepa usa prediction markets on-chain para crear
transparencia e incentivos económicos."
```

**[0:30-1:00] Tech Stack**
```
"Construido con:
- Solana + Anchor framework
- Next.js + TypeScript
- 4 instrucciones on-chain: create, bet, resolve
- Deployado en Devnet"

[Mostrar código en pantalla brevemente]
```

**[1:00-3:00] Demo en Vivo**
```
1. "Conectemos la wallet..." [10 seg]
2. "Creamos un mercado sobre una promesa política..." [30 seg]
3. "La transaction se confirma en Solana..." [10 seg]
4. "Ahora cualquiera puede apostar YES o NO..." [30 seg]
5. "Los odds se actualizan en tiempo real..." [10 seg]
6. "Cuando expira, el creador resuelve el resultado..." [30 seg]
```

**[3:00-3:30] Value Prop**
```
"Por qué esto importa:
- Transparencia total (todo on-chain)
- Sin intermediarios (permissionless)
- Incentivos económicos (skin in the game)
- Costos mínimos (Solana es barato y rápido)"
```

**[3:30-4:00] Roadmap**
```
"Próximos pasos:
- Deploy a Mainnet
- Mobile app (Solana Mobile Stack)
- Chainlink para auto-resolution
- DAO governance

Link al repo: [github]
Demo en Devnet: [link]
Contáctenme: [twitter/email]"
```

### Tips de Edición
- Agrega subtítulos (español e inglés)
- Background music sutil
- Zoom en partes clave
- Transiciones suaves
- Call-to-action al final

---

## 📈 Métricas de Éxito

**Para considerar el testing exitoso:**
- [ ] 3+ markets creados
- [ ] 5+ bets colocados
- [ ] 1+ market resuelto
- [ ] 0 errores críticos
- [ ] Todas las transactions confirmadas
- [ ] Video demo grabado

---

## 🔗 Links Útiles

- **Frontend local**: http://localhost:3000
- **Program Explorer**: https://explorer.solana.com/address/9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka?cluster=devnet
- **Solana Devnet Explorer**: https://explorer.solana.com/?cluster=devnet
- **Documentación completa**: `INTEGRATION_COMPLETE.md`

---

## ✅ Sign-off

Una vez completado el testing, marca aquí:

```
Testing completado por: _______________
Fecha: _______________
Bugs encontrados: _______________
Video demo grabado: [ ] Sí [ ] No
```

---

**¡Buena suerte con el testing y el hackathon!** 🚀


