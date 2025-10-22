# PrismaFi Prediction Market SDK

TypeScript SDK para interactuar con los smart contracts de PrismaFi Prediction Markets en Solana.

## Instalación

```bash
npm install @prismafi/prediction-market-sdk
# o
yarn add @prismafi/prediction-market-sdk
```

## Uso Básico

```typescript
import { Connection, PublicKey } from "@solana/web3.js";
import { PredictionMarketSDK } from "@prismafi/prediction-market-sdk";

// Conectar al cluster de Solana
const connection = new Connection("https://api.devnet.solana.com");

// Inicializar el SDK con tu wallet
const sdk = new PredictionMarketSDK(connection, wallet);

// Crear un mercado
const marketData = {
  question: "Will Bitcoin reach $100k by end of 2025?",
  description: "Bitcoin price prediction market",
  category: "Crypto",
  resolutionDate: Date.now() / 1000 + 86400 * 180, // 6 months
  initialLiquidity: 10_000_000, // 10 tokens (assuming 6 decimals)
};

const evidenceRequirements = {
  minEvidenceCount: 3,
  requiredTypes: [],
  oracleRequired: true,
  scientificPeerReview: false,
  governmentSourceRequired: false,
};

const txSignature = await sdk.createMarket(
  wallet.publicKey,
  marketData,
  evidenceRequirements
);

console.log("Market created:", txSignature);
```

## Funcionalidades

### 1. Crear Mercados

```typescript
const tx = await sdk.createMarket(
  creatorPublicKey,
  marketData,
  evidenceRequirements
);
```

### 2. Colocar Predicciones

```typescript
const tx = await sdk.placePrediction(
  userPublicKey,
  marketPublicKey,
  1_000_000, // 1 token
  { yes: {} }, // or { no: {} }
  userTokenAccount
);
```

### 3. Vender Posición

```typescript
const tx = await sdk.sellPosition(
  sellerPublicKey,
  marketPublicKey,
  500_000, // 0.5 tokens
  sellerTokenAccount
);
```

### 4. Agregar Liquidez

```typescript
const tx = await sdk.addLiquidity(
  providerPublicKey,
  marketPublicKey,
  2_000_000, // 2 tokens YES
  2_000_000, // 2 tokens NO
  providerTokenAccount
);
```

### 5. Remover Liquidez

```typescript
const tx = await sdk.removeLiquidity(
  providerPublicKey,
  marketPublicKey,
  lpTokens,
  providerTokenAccount
);
```

### 6. Reclamar Ganancias

```typescript
const tx = await sdk.claimWinnings(
  userPublicKey,
  marketPublicKey,
  userTokenAccount
);
```

### 7. Resolver Mercado con Oráculo

```typescript
const oracleData = {
  oracleProvider: "Chainlink",
  dataSource: "BTC/USD",
  value: "95000.00",
  confidence: 95,
  timestamp: Date.now() / 1000,
};

const tx = await sdk.resolveMarketWithOracle(
  marketPublicKey,
  oracleAuthorityPublicKey,
  oracleData
);
```

## Queries

### Obtener información de un mercado

```typescript
const [marketPda] = sdk.findMarketPda("Your question here");
const market = await sdk.getMarket(marketPda);

console.log("Question:", market.question);
console.log("YES Pool:", market.yesPool.toString());
console.log("NO Pool:", market.noPool.toString());
console.log("Status:", market.status);
```

### Obtener perfil de usuario

```typescript
const [userProfilePda] = sdk.findUserProfilePda(userPublicKey);
const profile = await sdk.getUserProfile(userProfilePda);

console.log("Reputation:", profile.reputationScore);
console.log("Total Predictions:", profile.totalPredictions);
console.log("Accuracy Rate:", profile.accuracyRate, "%");
```

### Obtener posición del usuario

```typescript
const [userPositionPda] = sdk.findUserPositionPda(userPublicKey, marketPublicKey);
const position = await sdk.getUserPosition(userPositionPda);

console.log("Amount:", position.amount.toString());
console.log("Outcome:", position.outcome);
console.log("Entry Price:", position.entryPrice);
```

### Listar todos los mercados

```typescript
const markets = await sdk.getAllMarkets();

markets.forEach(market => {
  console.log(market.account.question);
  console.log("Category:", market.account.category);
  console.log("Status:", market.account.status);
});
```

### Filtrar mercados por categoría

```typescript
const cryptoMarkets = await sdk.getMarketsByCategory("Crypto");
```

### Obtener posiciones de un usuario

```typescript
const positions = await sdk.getUserPositions(userPublicKey);

positions.forEach(position => {
  console.log("Market:", position.account.market.toBase58());
  console.log("Amount:", position.account.amount.toString());
});
```

## Utilidades

### Calcular precio actual

```typescript
const market = await sdk.getMarket(marketPda);
const yesPrice = sdk.calculatePrice(market, "yes");
const noPrice = sdk.calculatePrice(market, "no");

console.log("YES Price:", yesPrice.toFixed(2), "%");
console.log("NO Price:", noPrice.toFixed(2), "%");
```

### Calcular payout potencial

```typescript
const potentialPayout = sdk.calculatePotentialPayout(
  market,
  1_000_000, // 1 token
  "yes"
);

console.log("If you win, you'll receive:", potentialPayout / 1_000_000, "tokens");
```

### Calcular APY para proveedores de liquidez

```typescript
const liquidityPosition = await sdk.getLiquidityPosition(liquidityPositionPda);
const daysHeld = 30;
const apy = sdk.calculateAPY(liquidityPosition, daysHeld);

console.log("Current APY:", apy.toFixed(2), "%");
```

## Helpers de PDA

El SDK incluye helpers para encontrar Program Derived Addresses (PDAs):

```typescript
// Market PDA
const [marketPda, marketBump] = sdk.findMarketPda("Your question");

// User Profile PDA
const [userProfilePda, profileBump] = sdk.findUserProfilePda(userPublicKey);

// User Position PDA
const [positionPda, positionBump] = sdk.findUserPositionPda(userPublicKey, marketPda);

// Liquidity Position PDA
const [liquidityPda, liquidityBump] = sdk.findLiquidityPositionPda(providerPublicKey, marketPda);

// Market Pool PDA
const [poolPda, poolBump] = sdk.findMarketPoolPda(marketPda);

// Treasury PDA
const [treasuryPda, treasuryBump] = sdk.findTreasuryPda();
```

## Tipos

El SDK exporta todos los tipos definidos en el programa Anchor:

```typescript
import type {
  PredictionMarket,
  UserProfile,
  UserPosition,
  LiquidityPosition,
  MarketStatus,
  Outcome,
  ResolutionData,
  OracleData,
  EvidenceRequirements,
} from "@prismafi/prediction-market-sdk";
```

## Ejemplo Completo: Frontend React

```typescript
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PredictionMarketSDK } from "@prismafi/prediction-market-sdk";
import { useEffect, useState } from "react";

function MarketCard({ question }: { question: string }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(false);

  const sdk = new PredictionMarketSDK(connection, wallet);

  useEffect(() => {
    const fetchMarket = async () => {
      const [marketPda] = sdk.findMarketPda(question);
      const marketData = await sdk.getMarket(marketPda);
      setMarket(marketData);
    };
    fetchMarket();
  }, [question]);

  const handleBuyYes = async () => {
    if (!wallet.publicKey) return;
    
    setLoading(true);
    try {
      const [marketPda] = sdk.findMarketPda(question);
      const userTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        wallet.publicKey
      );
      
      const tx = await sdk.placePrediction(
        wallet.publicKey,
        marketPda,
        1_000_000, // 1 token
        { yes: {} },
        userTokenAccount
      );
      
      console.log("Transaction:", tx);
      alert("Prediction placed successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to place prediction");
    } finally {
      setLoading(false);
    }
  };

  if (!market) return <div>Loading...</div>;

  const yesPrice = sdk.calculatePrice(market, "yes");
  const noPrice = sdk.calculatePrice(market, "no");

  return (
    <div className="market-card">
      <h3>{market.question}</h3>
      <div className="prices">
        <div>YES: {yesPrice.toFixed(1)}%</div>
        <div>NO: {noPrice.toFixed(1)}%</div>
      </div>
      <button onClick={handleBuyYes} disabled={loading}>
        {loading ? "Processing..." : "Buy YES"}
      </button>
    </div>
  );
}
```

## Errores Comunes

### `InsufficientFunds`
El usuario no tiene suficientes tokens en su cuenta.

### `InsufficientReputation`
El usuario no tiene suficiente reputación para crear o participar en este mercado.

### `MarketNotActive`
El mercado no está activo (pausado o resuelto).

### `SlippageExceeded`
El deslizamiento excedió el 2% de protección al vender posición.

### `PositionNotWinning`
Intentaste reclamar ganancias pero tu posición no ganó.

## Soporte

Para reportar bugs o solicitar features:
- GitHub Issues: https://github.com/prismafi/prediction-market/issues
- Discord: https://discord.gg/prismafi
- Twitter: @PrismaFi

## Licencia

MIT





























