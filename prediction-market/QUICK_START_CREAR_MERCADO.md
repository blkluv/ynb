# 🚀 Quick Start: Crear Mercado de Predicción

## ⚡ En 3 Pasos

### 1️⃣ Inicia el Servidor

**Opción A - Script automático:**
```bash
cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market
bash START.sh
```

**Opción B - Manual:**
```bash
cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market
npm run dev
```

⏳ **Espera ver:** `✓ Ready in 2s`

---

### 2️⃣ Verifica el Servidor

```bash
# En otra terminal, corre:
bash check-server.sh
```

Deberías ver algo como:
```
✅ Servidor corriendo en: http://localhost:3000
```

O puede ser puerto `3001` o `3002` si el 3000 está ocupado. **Usa el puerto que te muestre.**

---

### 3️⃣ Abre tu Navegador

**Directo a crear mercado:**
```
http://localhost:3000/create-market
```

(Reemplaza `3000` con el puerto que te mostró el script)

---

## 🦊 Configurar Phantom Wallet

### Paso 1: Instalar
- Descarga: https://phantom.app
- Crea una wallet nueva
- **Guarda tu seed phrase!**

### Paso 2: Cambiar a Devnet
```
1. Abre Phantom
2. Click Settings (⚙️)
3. Developer Settings
4. Change Network → Devnet
```

### Paso 3: Conseguir SOL
```
1. Copia tu wallet address (click en el nombre arriba)
2. Ve a: https://faucet.solana.com
3. Pega tu address
4. Request 2 SOL
5. Espera 10 segundos
```

---

## 📝 Crear tu Primer Mercado

### Ejemplo: Mercado Político LATAM

```
Question:
¿Milei alcanzará déficit cero en 2025?

Description (Resolution Criteria):
Este mercado se resolverá como YES si el Ministerio de Economía 
de Argentina reporta déficit fiscal igual o menor a 0% para el 
año calendario 2025.

Fuente oficial: Informes mensuales del Ministerio de Economía 
publicados en https://www.argentina.gob.ar/economia

Se tomará como referencia el informe de Enero 2026 que consolida 
los datos del año 2025.

Category:
Social

End Date:
2025-12-31

End Time:
23:59
```

### Flujo:
1. ✅ Llena el formulario
2. ✅ Click "Show Preview"
3. ✅ Click "Create Market"
4. ✅ Aprueba en Phantom (~0.1 SOL)
5. ⏳ Espera 10-20 segundos
6. 🎉 ¡Mercado creado!

---

## 🔍 Verificar en Solana Explorer

Cuando veas el mensaje de éxito:
```
✅ Market created successfully!
Transaction: xyz123...
Market ID: abc456...
```

1. **Copia el Transaction signature**
2. **Abre:** https://explorer.solana.com/?cluster=devnet
3. **Pega** el signature
4. **Verás:**
   - ✅ Program: prediction_market
   - ✅ Instruction: create_market
   - ✅ Status: Success

---

## 🎯 5 Mercados para Demo

Después del primero, crea estos:

```
1. 🇦🇷 ¿Milei alcanzará déficit cero en 2025?
2. 🇲🇽 ¿AMLO entregará la refinería Dos Bocas operativa?
3. 🇸🇻 ¿Bukele construirá 20,000 viviendas prometidas?
4. 🇨🇴 ¿Petro ejecutará >80% presupuesto educación?
5. ⚖️  ¿Habrá investigación caso Odebrecht antes junio 2026?
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Insufficient funds"
```bash
# Consigue más SOL del faucet
https://faucet.solana.com
```

### ❌ Error: "User rejected transaction"
- Phantom bloqueó la firma
- Desbloquea Phantom
- Intenta de nuevo

### ❌ Error: "Network error"
- Verifica que Phantom esté en **Devnet**
- Refresca la página
- Verifica tu internet

### ❌ Error: "Question too long"
- Máximo 200 caracteres en Question
- Pon detalles en Description

### ❌ Puerto 3000 ocupado
- El servidor usará 3001 o 3002 automáticamente
- Verifica con: `bash check-server.sh`
- Usa el puerto que te muestre

### ❌ "GET /create-market 404"
- Espera a que compile (5-10 segundos)
- Refresca la página
- Verifica que el servidor esté corriendo

---

## 📊 Info del Smart Contract

```
Program ID: 9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka
Network: Devnet
Explorer: https://explorer.solana.com/address/9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka?cluster=devnet
```

---

## ✅ Checklist Pre-Demo

- [ ] Servidor corriendo (puerto 3000/3001)
- [ ] Phantom instalado y en Devnet
- [ ] SOL en wallet (mín. 0.5 SOL)
- [ ] 5+ mercados creados
- [ ] Todos los mercados verificados en Explorer
- [ ] Screenshots guardados
- [ ] Transaction signatures anotados

---

## 🚀 Estás Listo!

**Ahora ve y crea mercados! 🎯**

```bash
# 1. Inicia servidor
bash START.sh

# 2. Abre navegador
# http://localhost:3000/create-market

# 3. Conecta wallet → Crea mercado → Profit! 💰
```

---

**Documentación completa:**
- `PRUEBA_CREAR_MERCADO.md` - Guía detallada
- `START_HERE_BINARY_ONLY.md` - Value prop y estrategia

**Scripts útiles:**
- `START.sh` - Inicia servidor
- `check-server.sh` - Verifica puerto
- `test-connection.js` - Verifica Devnet

---

*PrismaFi: Accountability Markets for LATAM* 🎯

