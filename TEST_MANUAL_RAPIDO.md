# ✅ Test Manual Rápido - PrismaFi

## 🎯 **Objetivo**

Verificar que todas las funcionalidades funcionan antes del pitch.

---

## 📝 **Checklist de Testing (10 minutos)**

### **1. Servidor Local** ✅

```bash
npm run dev
```

- Abrir http://localhost:3000
- Verificar que carga sin errores en consola

---

### **2. Landing Page** ✅

**Qué verificar:**

- [ ] Hero section visible
- [ ] Estadísticas muestran números
- [ ] Trending markets se renderizan (3 markets)
- [ ] Botones "Connect Wallet" y "Start Trading" visibles
- [ ] Responsive en mobile (F12 → toggle device)

**Cómo probar:**

1. Refresh página
2. Scroll down
3. Click en "View All Markets" → redirect a `/markets`

---

### **3. Wallet Connection** ✅

**Qué verificar:**

- [ ] Click en "Connect Wallet" abre modal Privy
- [ ] Seleccionar wallet (Phantom/Solflare)
- [ ] Modal se cierra
- [ ] Address aparece en navbar
- [ ] Botón cambia a wallet address truncada

**Cómo probar:**

1. Click "Connect Wallet"
2. En Privy modal, seleccionar "Phantom"
3. Confirmar en extensión Phantom
4. Verificar que navbar muestra address

**⚠️ Nota:** Si no tienes Phantom instalado, la demo mostrará "Connect Wallet" pero no podrás completar el flujo de trade.

---

### **4. Markets Listing** ✅

**Qué verificar:**

- [ ] `/markets` muestra lista de mercados
- [ ] Cada market card tiene:
  - Título
  - Category badge
  - Probabilidades
  - Volume
  - Participants
- [ ] Click en market → redirect a `/market/[id]`

**Cómo probar:**

1. Navegar a http://localhost:3000/markets
2. Verificar que se ven 3 markets default
3. Click en primer market

---

### **5. Trading Flow** ✅

**Qué verificar:**

- [ ] Market page carga con detalles
- [ ] TradingPanel visible a la derecha
- [ ] OrderBook muestra bids/asks
- [ ] TradeHistory está vacía (primera vez)
- [ ] Positions está vacío (primera vez)

**Cómo probar (CON wallet conectada):**

1. En market page, seleccionar "Yes"
2. Ingresar amount: "10"
3. Verificar que "Estimated Shares" se calcula
4. Click "Buy 15.38 Shares" (o el número que salga)
5. **Esperar 2-3 segundos** (simula transacción blockchain)
6. Verificar toast notification:
   - "Confirming transaction..." → loading
   - "✅ Transaction Confirmed!" → success
   - Link "View on Solana Explorer" visible
7. Verificar que se actualizó:
   - Position aparece en "Your Positions"
   - Trade aparece en "Trade History"
   - Probability del market cambió ligeramente

**Cómo probar (SIN wallet - simulación):**

1. Click "Connect Wallet to Trade"
2. Modal Privy se abre (puedes cerrar)
3. Botón dice "Connect Wallet to Trade"

---

### **6. Market Creation** ✅

**Qué verificar:**

- [ ] `/create-market` carga form
- [ ] Todos los campos editables
- [ ] Puede agregar/remover options
- [ ] Botón "Create Market" habilitado cuando form válido

**Cómo probar (CON wallet conectada):**

1. Navegar a http://localhost:3000/create-market
2. Llenar:
   - Question: "Will it rain tomorrow?"
   - Description: "Market resolves YES if it rains in NYC"
   - Category: Weather
   - Resolution Date: (seleccionar fecha futura)
   - Resolution Source: "https://weather.com"
   - Outcome Type: Binary (default Yes/No)
3. Click "Create Market"
4. **Esperar 2-3 segundos**
5. Verificar toast notification:
   - "Creating market..." → loading
   - "🎉 Market Created Successfully!" → success
   - Question mostrada
   - Link to Explorer
6. Auto-redirect a `/market/4` (nuevo market)
7. Verificar que market aparece en `/markets`

---

### **7. LocalStorage Persistence** ✅

**Qué verificar:**

- [ ] Refresh página no pierde data
- [ ] Markets creados persisten
- [ ] Trades persisten
- [ ] Positions persisten

**Cómo probar:**

1. Después de crear market y hacer trade
2. Presionar F5 (refresh)
3. Navegar a `/markets` → market creado sigue ahí
4. Navegar a market → position y trades siguen ahí
5. F12 → Application → Local Storage → `localhost:3000`
6. Verificar keys:
   - `prismafy_markets`
   - `prismafy_trades`
   - `prismafy_positions`

---

### **8. Toast Notifications** ✅

**Qué verificar:**

- [ ] Loading toast aparece
- [ ] Success/Error toast reemplaza loading
- [ ] Toasts tienen estilo dark
- [ ] Links en toasts funcionan (abren new tab)
- [ ] Toasts se auto-dismiss después de 6seg

**Cómo probar:**

1. Ejecutar cualquier trade o market creation
2. Observar secuencia de toasts
3. Click en "View on Solana Explorer"
4. Nueva pestaña se abre en https://explorer.solana.com
5. (La tx no existirá, pero el link funciona)

---

### **9. Explorer Links** ✅

**Qué verificar:**

- [ ] Trade success toast tiene link
- [ ] Market creation toast tiene link
- [ ] Links tienen formato: `https://explorer.solana.com/tx/{signature}?cluster=devnet`
- [ ] Signature es 88 caracteres alfanuméricos

**Cómo probar:**

1. Después de trade, copiar link del toast
2. Pegar en notepad
3. Verificar formato:
   ```
   https://explorer.solana.com/tx/3Zm7F8kP9gBJLx5HqRn2Vc4WtYdKs6Xp1NhQfEc8rZb...?cluster=devnet
   ```
4. Signature debe ser 88 caracteres (sin guiones, solo base58)

---

### **10. Mobile Responsive** ✅

**Qué verificar:**

- [ ] Landing page se ve bien en móvil
- [ ] Markets page muestra cards en columna
- [ ] Market page: trading panel abajo (no al lado)
- [ ] Navbar colapsa a hamburger menu

**Cómo probar:**

1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Seleccionar "iPhone 12 Pro"
3. Navegar por todas las páginas
4. Verificar que nada se corta o se ve mal

---

## 🐛 **Errores Comunes y Soluciones**

### **Error: "useWallets was called outside the PrivyProvider"**

**Solución:** Esto es normal durante build, pero no afecta el funcionamiento. Puedes ignorarlo.

### **Error: Wallet no conecta**

**Solución:**

1. Verificar que Phantom está instalado
2. Refresh página
3. Asegurarte que Phantom está en "Devnet" o "Mainnet" (no importa cuál)

### **Error: Toast no aparece**

**Solución:**

1. Abrir DevTools (F12) → Console
2. Buscar errores de React
3. Verificar que `react-hot-toast` está instalado: `npm list react-hot-toast`

### **Error: localStorage no persiste**

**Solución:**

1. Verificar que no estás en modo incógnito
2. F12 → Application → Clear site data → Solo desmarcar "Local Storage"
3. Refresh

---

## ✅ **Test Exitoso = Demo Ready**

Si pasaste todos los checks, tu demo está lista para:

- Presentación en hackathon
- Video de demostración
- Deploy a producción (Vercel)

---

## 🚀 **Comandos Útiles**

```bash
# Dev server
npm run dev

# Build (verifica errores)
npm run build

# Start production build
npm start

# Limpiar cache de Next.js
rm -rf .next

# Reinstalar dependencias (si algo falla)
rm -rf node_modules
npm install --legacy-peer-deps
```

---

## 📊 **Métricas de Performance**

Para el pitch, puedes mencionar:

- **Build time:** < 30 segundos
- **First load JS:** 128 KB
- **Time to Interactive:** < 2 segundos
- **Transaction simulation:** 1.5-3 segundos (realista)
- **LocalStorage:** < 100 KB de data

---

## 🎬 **Listo para Grabar Video Demo**

Si necesitas grabar un video:

1. Usa OBS Studio o Loom
2. Graba en 1080p
3. Duración: 2 minutos máximo
4. Script:
   - 0:00-0:15 → Landing page
   - 0:15-0:30 → Connect wallet
   - 0:30-1:00 → Execute trade
   - 1:00-1:30 → Create market
   - 1:30-2:00 → Show features (persistence, toasts, explorer links)

---

**¡Todo listo! 🎉**






