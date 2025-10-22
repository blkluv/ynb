# 🔐 Variables de Entorno - PrismaFi

## Archivo: `.env.local`

Crea este archivo en la raíz de `prediction-market/` con el siguiente contenido:

```env
# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Program ID - ACTUALIZA ESTO DESPUÉS DEL DEPLOYMENT
# Obtén el Program ID después de hacer deploy en Solana Playground
NEXT_PUBLIC_PROGRAM_ID=7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA
```

## ⚠️ IMPORTANTE

Después de hacer el deployment en Solana Playground:

1. Copia tu nuevo Program ID
2. Actualiza `NEXT_PUBLIC_PROGRAM_ID` con tu ID real
3. Guarda el archivo
4. Reinicia el servidor: `npm run dev`

## Configuración para Mainnet

Cuando estés listo para producción, cambia a:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=TU_PROGRAM_ID_EN_MAINNET
```

## RPC Endpoints Recomendados

### Devnet (Gratis)
- https://api.devnet.solana.com

### Mainnet (Para producción)
- **Helius** (Recomendado): https://helius.dev
  ```
  NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.helius.xyz/?api-key=TU_API_KEY
  ```

- **QuickNode**: https://quicknode.com
  ```
  NEXT_PUBLIC_RPC_ENDPOINT=https://your-endpoint.solana-mainnet.quiknode.pro/TU_TOKEN/
  ```

- **Alchemy**: https://alchemy.com
  ```
  NEXT_PUBLIC_RPC_ENDPOINT=https://solana-mainnet.g.alchemy.com/v2/TU_API_KEY
  ```

## Verificación

Para verificar que las variables están cargadas correctamente:

```bash
npm run dev
```

En la consola del navegador (F12), ejecuta:
```javascript
console.log(process.env.NEXT_PUBLIC_SOLANA_NETWORK)
console.log(process.env.NEXT_PUBLIC_PROGRAM_ID)
```

Deberías ver los valores configurados.





