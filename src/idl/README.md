# 📄 IDL Directory

## ¿Qué va aquí?

Después de deployar tu smart contract en Solana Playground, descarga el archivo IDL y colócalo aquí:

```
src/idl/prediction_market.json
```

## ¿Cómo obtener el IDL?

### **Desde Solana Playground:**

1. Después de hacer **Build** y **Deploy**
2. En el explorador de archivos (izquierda), navega a:
   ```
   target/idl/prediction_market.json
   ```
3. Click derecho → **Download**
4. Mueve el archivo descargado a este directorio

### **Desde build local (si usas Anchor CLI):**

```bash
cd prediction-market-contract
anchor build
cp target/idl/prediction_market.json ../src/idl/
```

## ¿Para qué sirve el IDL?

El IDL (Interface Definition Language) es un archivo JSON que describe:

- Todas las funciones del smart contract
- Los parámetros que aceptan
- Las cuentas que necesitan
- Los eventos que emiten

Tu frontend TypeScript lo usa para:

- ✅ Generar tipos automáticamente
- ✅ Construir transacciones correctamente
- ✅ Interactuar con el contrato de forma segura

## ¿El IDL ya está aquí?

Si este directorio está vacío (solo ves este README), entonces **todavía no has deployado**.

Sigue las instrucciones en:

```
DEPLOY_EN_2_MINUTOS.md
```

¡Estarás deployado en menos de 5 minutos! 🚀


