# 🧪 Guía de Pruebas - Trepa Prediction Market

## ✅ Setup Completado

### Smart Contract

- **Program ID**: `5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8`
- **Network**: Solana Devnet
- **Status**: ✅ Desplegado y funcionando

### Frontend

- **URL Local**: http://localhost:3000
- **Framework**: Next.js 14.2.11
- **Status**: ✅ Servidor activo

---

## 🚀 Cómo Probar el Create Market

### 1. Preparación de Wallet

1. **Instala Phantom o Solflare**

   - [Phantom](https://phantom.app/)
   - [Solflare](https://solflare.com/)

2. **Cambia a Devnet**

   - Abre tu wallet
   - Ve a Settings → Developer Settings
   - Selecciona **Devnet** como red activa

3. **Obtén SOL de Devnet**

   ```bash
   # Opción 1: Desde la terminal
   solana airdrop 2 <TU_WALLET_ADDRESS> --url devnet

   # Opción 2: Web Faucet
   # https://faucet.solana.com/
   ```

### 2. Crear tu Primer Market

1. **Abre el navegador**

   - Ve a: http://localhost:3000

2. **Conecta tu Wallet**

   - Click en "Select Wallet"
   - Elige Phantom o Solflare
   - Aprueba la conexión

3. **Navega a Create Market**

   - Click en "Create Market" en el menú

4. **Llena el formulario**

   ```
   Market Question: "Will Bitcoin reach $100k by December 2025?"
   Description: "This market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange by December 31, 2025 23:59:59 UTC."
   Resolution Date: 2025-12-31
   Category: Crypto
   ```

5. **Submit**

   - Click en "🚀 Create Market on Solana"
   - Aprueba la transacción en tu wallet
   - Espera la confirmación (~5-10 segundos)

6. **Verifica**
   - Click en el link de Solana Explorer que aparece
   - Confirma que tu transacción fue exitosa

---

## 🧪 Flujo de Prueba Completo

### Test Case 1: Crear Market

```
✅ Wallet conectada a Devnet
✅ Balance suficiente (>0.01 SOL)
✅ Formulario completado
✅ Transacción aprobada
✅ Market creado exitosamente
✅ Link de Explorer funciona
```

### Test Case 2: Validaciones

Prueba estos casos para verificar las validaciones:

1. **Question vacía** → Error
2. **Question > 200 caracteres** → Error
3. **Description vacía** → Error
4. **Fecha en el pasado** → Error
5. **Category vacía** → Error

### Test Case 3: Manejo de Errores

1. **Wallet desconectada** → Muestra mensaje de error
2. **SOL insuficiente** → Falla la transacción
3. **Usuario rechaza transacción** → Muestra error y permite reintentar

---

## 📊 Monitoreo

### Ver transacciones en Solana Explorer

```
https://explorer.solana.com/address/5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8?cluster=devnet
```

### Ver logs del servidor

La terminal donde ejecutaste `npm run dev` mostrará:

- Requests HTTP
- Errores de compilación
- Hot reload notifications

### Consola del navegador (F12)

Verás:

- Signature de transacciones exitosas
- Errores detallados si algo falla
- Estado de conexión de wallet

---

## 🐛 Troubleshooting

### Error: "Insufficient funds"

**Solución**: Solicita más SOL del faucet

```bash
solana airdrop 1 <TU_WALLET> --url devnet
```

### Error: "Transaction simulation failed"

**Posibles causas**:

1. Program ID incorrecto → Verifica `programId.ts`
2. RPC endpoint caído → Cambia a otro endpoint
3. Accounts incorrectos → Revisa los PDAs

### Error: "User rejected the request"

**Solución**: El usuario canceló. Simplemente intenta de nuevo.

### Página no carga

**Solución**:

1. Verifica que el servidor esté corriendo: `netstat -ano | findstr :3000`
2. Reinicia el servidor: `cd prediction-market && npm run dev`

---

## 🎯 Checklist de Testing

- [ ] Wallet conectada a Devnet
- [ ] Servidor frontend corriendo
- [ ] Smart contract desplegado y verificado
- [ ] Puedo crear un market exitosamente
- [ ] Veo mi transacción en Solana Explorer
- [ ] Las validaciones funcionan correctamente
- [ ] Los mensajes de error son claros
- [ ] El formulario se resetea después de crear un market

---

## 📝 Notas Importantes

1. **Devnet es inestable**: A veces los RPC endpoints fallan. Es normal.
2. **Los faucets tienen límites**: Solo puedes pedir SOL cada X minutos.
3. **Las transacciones cuestan ~0.00001 SOL**: Muy barato para testing.
4. **Los datos de Devnet se resetean**: No son permanentes.

---

## 🔗 Links Útiles

- **Solana Explorer (Devnet)**: https://explorer.solana.com/?cluster=devnet
- **Solana Status**: https://status.solana.com/
- **Devnet Faucet**: https://faucet.solana.com/
- **Phantom Wallet**: https://phantom.app/
- **Solflare Wallet**: https://solflare.com/

---

## 💡 Próximos Features a Probar

Una vez que Create Market esté 100% funcional:

1. **Place Bet** → Apostar SOL en un mercado
2. **Resolve Market** → El creador resuelve el resultado
3. **Claim Winnings** → Los ganadores reclaman sus premios
4. **View Markets** → Lista de todos los mercados activos

Estos features ya están implementados en el smart contract y solo necesitan UI.



