# Binary vs Scalar Markets - UX/UI Design Guide

## 📋 Overview

Este documento explica el diseño UX/UI implementado para soportar **dos tipos de mercados** sin confundir a los usuarios:

1. **🎯 Binary Markets** (YES/NO) - Para accountability social en LATAM
2. **📊 Scalar Markets** (Numéricos) - Para métricas oficiales y pronósticos precisos

---

## 🎨 Componentes Creados

### 1. **MarketTypeSelector** (`/components/markets/MarketTypeSelector.tsx`)

**Propósito:** Selector visual educativo para elegir el tipo de mercado al crear uno nuevo.

**Características:**
- ✅ Diseño side-by-side con cards grandes y claros
- ✅ Íconos visuales (🎯 vs 📊)
- ✅ Ejemplos reales para cada tipo
- ✅ Pros claramente marcados
- ✅ Info box explicando cuándo usar cada uno

**UX Principles:**
```
Binary: "Si binary bets son coin flips..."
Scalar: "...trepa es darts (precisión)"
```

---

### 2. **BinaryMarketForm** (`/components/markets/BinaryMarketForm.tsx`)

**Propósito:** Formulario simplificado para mercados YES/NO.

**Campos:**
- Question (debe terminar en `?`)
- Resolution Criteria (fuente de verificación)
- Category
- End Date/Time

**UX Focus:**
- Labels claros: "Resolution Criteria" en vez de "Description"
- Tip box: explica la importancia de especificar fuentes
- Validación: min 50 caracteres en criterios de resolución

---

### 3. **ScalarMarketForm** (`/components/markets/ScalarMarketForm.tsx`)

**Propósito:** Formulario detallado para mercados numéricos con checklist de especificación.

**Campos Adicionales:**
- Min/Max Value (rango numérico)
- Unit (%, USD, etc.)
- Data Source (nombre oficial)
- Data Source URL (opcional)
- Resolution Details (timestamp, timezone, rounding)

**UX Focus:**
- **Visual range preview** (slider gradiente)
- **⚠️ Scalar Checklist** visible:
  - Source + URL
  - Timestamp + timezone
  - Revision window
  - Rounding rules
  - Fallback si delayed
- Warning color scheme (yellow) para requirements
- Min 100 caracteres en resolution details

---

### 4. **MarketCard** (`/components/markets/MarketCard.tsx`)

**Propósito:** Card unificada que muestra ambos tipos de manera diferenciada.

**Binary Display:**
```
┌──────────────────────┐
│ 🎯 Binary - Sports   │
│ ⚽ Will Argentina... │
│ ┌────────┬────────┐  │
│ │ YES    │ NO     │  │
│ │ 67%    │ 33%    │  │
│ └────────┴────────┘  │
│ [Trade Now →]        │
└──────────────────────┘
```

**Scalar Display:**
```
┌──────────────────────┐
│ 📊 Scalar - Economics│
│ 📊 Argentina CPI...  │
│ ┌────────────────┐   │
│ │ RANGE          │   │
│ │ [====●====]    │   │
│ │ 0% ←→ 50%      │   │
│ │ INDEC source   │   │
│ └────────────────┘   │
│ [Predict Now →]      │
└──────────────────────┘
```

**Diferenciación Visual:**
- Binary: Purple/Pink gradient buttons
- Scalar: Blue/Cyan gradient buttons
- Badge con ícono: 🎯 vs 📊
- Scalar muestra range con gradiente visual
- Scalar muestra data source debajo del range

---

### 5. **BinaryTradingInterface** (`/components/markets/BinaryTradingInterface.tsx`)

**Propósito:** Interface de trading simple para YES/NO.

**Flow:**
1. User selecciona YES o NO (cards grandes con odds)
2. Ingresa amount en SOL
3. Ve potential winnings calculado automáticamente
4. Click "Place YES/NO Bet"

**Visual:**
- YES: Green card (border on select)
- NO: Red card (border on select)
- Odds displayed prominently: `67%`
- Price per share: `67¢ per share`

---

### 6. **ScalarTradingInterface** (`/components/markets/ScalarTradingInterface.tsx`)

**Propósito:** Interface de predicción numérica con visualización de rango.

**Flow:**
1. User ve range visual (min → max)
2. Ingresa su predicción numérica
3. Ve la posición de su predicción en el range (línea blanca)
4. Ingresa stake amount
5. Ve max payout (10x si exacto)
6. Click "Submit Prediction"

**Educational Elements:**
- 💡 Info box: "How Scalar Payouts Work"
  - Closer = more earnings
  - Exact match = 10x
  - Error reduces payout
  - Too far = lose stake
- Data source displayed claramente
- Max payout calculated en tiempo real

---

### 7. **Market Detail Page** (`/app/markets/[id]/page.tsx`)

**Propósito:** Página de detalle que adapta su UI según market type.

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back to Markets                   │
│                                      │
│ [Demo Mode Banner]                  │
│                                      │
│ ┌─────────────────┬────────────────┐│
│ │ Market Info     │ Trading Panel  ││
│ │ - Header        │ ┌────────────┐ ││
│ │ - Description   │ │ Binary OR  │ ││
│ │ - Stats         │ │ Scalar     │ ││
│ │ - Activity Feed │ │ Interface  │ ││
│ └─────────────────┴─────────────────┘│
└─────────────────────────────────────┘
```

**Smart Rendering:**
```typescript
{market.marketType === 'binary' ? (
  <BinaryTradingInterface market={market} />
) : (
  <ScalarTradingInterface market={market} />
)}
```

---

## 🎯 Design Philosophy

### Binary Markets (80% use cases)
**Target:** Público general LATAM
**Goal:** Presión social y accountability
**UX:** Simple, viral, claro

```
Question: "¿Milei cumplirá déficit cero 2025?"
Action: Click YES or NO → Done
Outcome: Cumplió / No cumplió (headline)
```

### Scalar Markets (20% use cases)
**Target:** Analysts, researchers, power users
**Goal:** Precisión y calibración
**UX:** Detallado, técnico, educativo

```
Question: "Inflación Argentina - Marzo 2025"
Action: Input numeric prediction → See range position
Outcome: Pagado por cercanía al valor real
```

---

## 📊 Market Filters (Updated)

**Filtros en `/markets`:**
1. **Search** (texto libre)
2. **Category** (Crypto, Politics, Economics, etc.)
3. **Status** (All, Active, Resolved)
4. **Type** ← **NUEVO**
   - All Types
   - 🎯 Binary (YES/NO)
   - 📊 Scalar (Numeric)

---

## 🎨 Color System

```css
/* Binary Markets */
Purple/Pink gradient: from-purple-600 to-pink-600
Green (YES): bg-green-500/10 border-green-500/20
Red (NO): bg-red-500/10 border-red-500/20

/* Scalar Markets */
Blue/Cyan gradient: from-blue-600 to-cyan-600
Range gradient: from-blue-500 via-purple-500 to-pink-500

/* Status Colors */
Active: green-500
Resolved: blue-500
Expired: yellow-500
```

---

## 📱 Responsive Behavior

- **Desktop:** 2-column layout (form + preview side-by-side)
- **Tablet:** Stacked layout, preview below
- **Mobile:** Full width, preview toggle

---

## ✅ User Validation

### Binary Form Validation
- Question: min 10 chars, must end with `?`
- Resolution Criteria: min 50 chars
- Category: required
- End Date: must be future

### Scalar Form Validation
- Question: min 10 chars
- Min/Max: required, max > min
- Unit: required (%, USD, etc.)
- Data Source: required
- Resolution Details: min 100 chars (forces detailed spec)
- Category: required
- End Date: must be future

---

## 🚀 Mock Data Examples

```typescript
// Binary Market
{
  id: '1',
  marketType: 'binary',
  question: 'Will Bitcoin reach $100,000 by end of 2025?',
  ...
}

// Scalar Market
{
  id: '3',
  marketType: 'scalar',
  question: 'Argentina monthly inflation (INDEC) - March 2025',
  minValue: 0,
  maxValue: 50,
  unit: '%',
  dataSource: 'INDEC - Instituto Nacional...',
  resolvedValue: undefined, // or 12.5 when resolved
  ...
}
```

---

## 🎯 Key UX Wins

1. **Clear Mental Model:** Users immediately see difference between binary/scalar
2. **Educational:** Info boxes explain how each type works
3. **Visual Distinction:** Color coding (purple vs blue) consistent across app
4. **Progressive Disclosure:** Binary simple, Scalar shows checklist
5. **No Confusion:** Market cards show type badge clearly
6. **Appropriate CTAs:** "Trade Now" vs "Predict Now"
7. **Payout Education:** Binary shows multiplier, Scalar explains accuracy curve

---

## 💡 Future Enhancements

- [ ] Add categorical markets (A/B/C/D)
- [ ] Parlay builder for combined predictions
- [ ] Leaderboard by accuracy (MAE/RMSE) for scalars
- [ ] Historical prediction charts
- [ ] Calibration score per user
- [ ] Oracle integration status indicator
- [ ] Dispute flow UI

---

## 📝 Testing Checklist

- [ ] Create binary market → verify form flow
- [ ] Create scalar market → verify checklist appears
- [ ] Browse markets → filter by type works
- [ ] View binary market detail → YES/NO interface shows
- [ ] View scalar market detail → numeric input shows
- [ ] Place binary bet → odds update
- [ ] Place scalar prediction → range visual updates
- [ ] Mobile responsive on all pages

---

**Documentación creada:** $(date)
**Componentes:** 7 nuevos + 2 actualizados
**Sin errores de linter:** ✅

---

## 🎓 Para el Hackathon Demo

**Elevator Pitch:**
> "No apostás arriba/abajo. Binary para promesas (¿cumplió?), Scalar para métricas (¿cuánto?). Mismo backend, UX diferenciada según use case."

**Show Flow:**
1. Mostrar selector side-by-side (educativo)
2. Crear binary market (rápido, simple)
3. Crear scalar market (detallado, con checklist visible)
4. Filtrar por tipo en /markets
5. Abrir market de cada tipo → mostrar trading UI diferenciado
6. Highlight: "Binary = presión social viral, Scalar = analysts/data"

