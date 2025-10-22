# 📦 Solana Smart Contract Integration

## Archivos

### `programId.ts` ✅

- **Program ID:** `6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7`
- **Network:** Devnet
- **Status:** Configurado y listo

### `idl.ts` ✅

- **Contrato:** Complejo (11 instrucciones)
- **Funcionalidades:**

  - ✅ initialize
  - ✅ createMarket
  - ✅ submitEvidence
  - ✅ placePrediction
  - ✅ voteOnEligibility
  - ✅ reportContent
  - ✅ emergencyPauseMarket
  - ✅ verifyHumanIdentity
  - ✅ createMetaPrediction
  - ✅ resolveMarketWithOracle
  - ✅ updateReputation

- **Características Avanzadas:**
  - 🔐 Verificación humana (ProofOfHumanity, BrightID, Gitcoin Passport)
  - 🔗 Integración con Oracles (Chainlink)
  - 📊 Meta-predictions (predicciones sobre predicciones)
  - ⭐ Sistema de reputación
  - 🛡️ Moderación comunitaria
  - 📋 Sistema de evidencias científicas

### `idl-complex.ts` ✅

- Copia de seguridad del IDL completo
- Mantiene la versión completa por si necesitas referenciarla

### `contract.ts` ⚠️

- **Estado:** Parcialmente compatible
- **Nota:** Los métodos actuales (`createMarket`, `placeBet`, `resolveMarket`, `claimWinnings`) están diseñados para el contrato simple
- **Recomendación:** Necesita actualización para soportar el contrato complejo completo

## 🔄 Próximos Pasos

### Opción A: Usar Contrato Complejo (Recomendado) ⭐

Ya configurado con el IDL actual.

**Para usar:**

```typescript
import { useContract } from '@/hooks/useContract'

const { markets, fetchMarkets } = useContract()
```

**Limitación actual:**

- Los hooks actuales solo soportan las funciones básicas del contrato simple
- Necesitas crear hooks adicionales para las funciones avanzadas

### Opción B: Desplegar Contrato Simple

Si prefieres empezar con algo más sencillo:

1. Ve a: `prediction-market-contract/programs/prediction_market/src/lib.rs`
2. Copia el código a Solana Playground
3. Deploy
4. Actualiza `programId.ts` con el nuevo Program ID
5. Genera el IDL simple y reemplaza en `idl.ts`

## 📚 Documentación

- **GUIA_SOLANA_PLAYGROUND_DEPLOY.md** - Cómo deployar
- **CONECTAR_FRONTEND_GUIA.md** - Cómo conectar frontend
- **RESUMEN_RAPIDO_DEPLOY.md** - Referencia rápida












