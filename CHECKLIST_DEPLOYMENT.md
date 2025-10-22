# ✅ CHECKLIST DE DEPLOYMENT - PRISMAFI

## 📋 Marca cada paso cuando lo completes

### **FASE 1: PREPARACIÓN (ya está lista ✅)**

- [x] Smart contract corregido y probado
- [x] Código listo en `PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs`
- [x] Dependencias instaladas (`install-solana-deps.bat`)
- [x] Directorio `src/idl/` creado
- [x] Frontend con componentes React listos

---

### **FASE 2: DEPLOYMENT (~2 minutos)**

- [ ] **Paso 1:** Abrir `PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs`
- [ ] **Paso 2:** Copiar TODO el código (Ctrl+A, Ctrl+C)
- [ ] **Paso 3:** Ir a https://beta.solpg.io/
- [ ] **Paso 4:** Crear proyecto "PrismaFi" (Anchor/Rust)
- [ ] **Paso 5:** Pegar código en `src/lib.rs`
- [ ] **Paso 6:** Guardar (Ctrl+S)
- [ ] **Paso 7:** Click en botón **Build** 🔨
  - Esperar ~30 segundos
  - Verificar: ✅ Build successful
- [ ] **Paso 8:** Verificar que estás en **Devnet** (abajo a la derecha)
- [ ] **Paso 9:** Click en botón **Deploy** 🚀
  - Esperar ~20 segundos
  - Verificar: ✅ Deployment successful

---

### **FASE 3: CONFIGURACIÓN (~1 minuto)**

- [ ] **Paso 10:** Copiar el Program ID de la consola

  ```
  Program Id: ___________________________________________
  ```

  _(Escríbelo arriba para no perderlo)_

- [ ] **Paso 11:** Descargar IDL

  - En Playground: `target/idl/prediction_market.json`
  - Click derecho → Download

- [ ] **Paso 12:** Mover IDL descargado a:

  ```
  C:\Users\edgar\cypherpunk hackathon2025\src\idl\prediction_market.json
  ```

- [ ] **Paso 13:** Actualizar Program ID en frontend
  - Abrir: `src/lib/solana-integration.ts`
  - Línea ~7: Reemplazar `"TU_PROGRAM_ID_AQUI"` con el ID del Paso 10
  - Guardar (Ctrl+S)

---

### **FASE 4: TESTING (~5 minutos)**

- [ ] **Paso 14:** Iniciar frontend

  ```bash
  npm run dev
  ```

- [ ] **Paso 15:** Abrir http://localhost:3000

- [ ] **Paso 16:** Conectar wallet Phantom

  - Asegúrate de estar en **Devnet**
  - Si no tienes SOL en Devnet, usa https://faucet.solana.com/

- [ ] **Paso 17:** Crear primer market

  - Ir a "Create Market"
  - Llenar formulario:
    - Question: "¿Bitcoin llegará a $100k en 2025?"
    - Description: "Market de prueba para hackathon"
    - Category: "Crypto"
    - End Time: (cualquier fecha futura)
  - Click "Create Market"
  - Firmar transacción

- [ ] **Paso 18:** Verificar market creado

  - Debe aparecer en la lista de markets
  - Si no aparece, refrescar página

- [ ] **Paso 19:** Hacer primera apuesta

  - Click en el market creado
  - Seleccionar YES o NO
  - Amount: 0.01 SOL (mínimo)
  - Click "Place Bet"
  - Firmar transacción

- [ ] **Paso 20:** Verificar apuesta registrada
  - Debe actualizar el total de YES/NO
  - Tu posición debe aparecer

---

### **FASE 5: VERIFICACIÓN BLOCKCHAIN**

- [ ] **Paso 21:** Ver contrato en Solana Explorer

  ```
  https://explorer.solana.com/address/[TU_PROGRAM_ID]?cluster=devnet
  ```

  - Reemplazar `[TU_PROGRAM_ID]` con el ID del Paso 10
  - Verificar: ✅ Program deployed
  - Verificar: ✅ Executable: Yes

- [ ] **Paso 22:** Ver transacciones
  - En el explorer, click en "Transactions"
  - Debe haber al menos 2:
    1. CreateMarket
    2. PlaceBet

---

### **FASE 6: DEMO PARA HACKATHON**

- [ ] **Paso 23:** Crear 2-3 markets de demostración
      Ejemplos:

  - "¿ETH Merge antes de Junio 2025?"
  - "¿Más de 1M de usuarios en Solana DeFi?"
  - "¿Nueva stablecoin en top 10?"

- [ ] **Paso 24:** Hacer apuestas de prueba

  - Al menos 1 apuesta en cada market
  - Usar diferentes montos

- [ ] **Paso 25:** Screenshots y evidencia

  - Captura de pantalla del frontend funcionando
  - Captura del Solana Explorer con el Program ID
  - Captura de transacciones exitosas

- [ ] **Paso 26:** Grabar video demo (opcional)
  - 1-2 minutos
  - Mostrar: Crear market → Apostar → Ver resultados
  - Usar OBS Studio o cualquier screen recorder

---

### **FASE 7: DOCUMENTACIÓN FINAL**

- [ ] **Paso 27:** Actualizar README.md con:

  - Program ID en Devnet
  - Link al Solana Explorer
  - Screenshots del funcionamiento

- [ ] **Paso 28:** Crear DEMO.md con:

  - Cómo probar la app
  - Markets de ejemplo creados
  - Links a transacciones de prueba

- [ ] **Paso 29:** Actualizar pitch deck con:
  - ✅ "Deployed on Solana Devnet"
  - ✅ Program ID visible
  - ✅ Screenshots de funcionalidad real

---

## 🎉 **¡DEPLOYMENT COMPLETO!**

Cuando tengas TODOS los checkboxes marcados, estarás **100% listo** para el hackathon.

---

## 🆘 **Problemas comunes**

### ❌ "Build failed" en Playground

**Solución:** Verifica que pegaste TODO el código, incluyendo las primeras y últimas líneas.

### ❌ "Insufficient funds" al deployar

**Solución:** Pide SOL de Devnet en https://faucet.solana.com/

### ❌ "Transaction failed" al crear market

**Solución:**

1. Verifica que el Program ID esté actualizado en `solana-integration.ts`
2. Verifica que el IDL esté en `src/idl/prediction_market.json`
3. Recarga la página y reconecta wallet

### ❌ Wallet no conecta

**Solución:**

1. Instala Phantom wallet
2. Cambia la red a Devnet en Phantom
3. Refresca la página

---

## 📞 **Siguiente paso si hay error**

Si algún paso falla, avísame con:

1. ✅ Número de paso donde falló
2. ✅ Mensaje de error exacto
3. ✅ Screenshot del error

¡Vamos a arreglarlo juntos! 💪


