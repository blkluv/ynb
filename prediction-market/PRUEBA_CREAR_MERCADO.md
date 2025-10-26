# 🧪 Guía de Prueba: Crear Mercado de Predicción

## ✅ Pre-requisitos

- [x] Servidor dev corriendo en `http://localhost:3000`
- [ ] Phantom wallet instalado
- [ ] Phantom configurado en **Devnet**
- [ ] SOL en Devnet (mín. 0.5 SOL)

---

## 🦊 Configurar Phantom en Devnet

### Paso 1: Cambiar a Devnet
```
1. Abre Phantom
2. Click en Settings (⚙️)
3. Scroll hasta "Developer Settings"
4. Click en "Change Network"
5. Selecciona "Devnet"
```

### Paso 2: Obtener SOL en Devnet
```bash
# Opción 1: Faucet Web
https://faucet.solana.com

# Opción 2: CLI (si tienes Solana instalado)
solana airdrop 2 <TU_WALLET_ADDRESS> --url devnet
```

---

## 🎯 Crear tu Primer Mercado

### 1. Navega a Create Market
```
http://localhost:3000/create-market
```

### 2. Conecta Wallet
- Click en "Connect Wallet" (top-right)
- Autoriza la conexión en Phantom
- Verifica que muestre tu balance en SOL

### 3. Llena el Formulario

**Ejemplo de Mercado LATAM:**

```
Question:
¿Milei alcanzará déficit cero en 2025?

Description (Resolution Criteria):
Este mercado se resolverá como YES si el Ministerio de Economía de Argentina reporta déficit fiscal igual o menor a 0% para el año calendario 2025. 

Fuente oficial: Informes mensuales del Ministerio de Economía publicados en https://www.argentina.gob.ar/economia

Se tomará como referencia el informe del mes de Enero 2026 que consolida los datos del año 2025.

Category:
Social

End Date:
2025-12-31

End Time:
23:59
```

### 4. Preview y Submit
- Click en "Show Preview" para ver cómo se verá tu mercado
- Revisa que todo esté correcto
- Click en "Create Market"

### 5. Aprobar Transacción
- Phantom abrirá popup
- Verifica el costo (~0.1 SOL)
- Click "Approve"

### 6. Confirmar Creación
```
Espera confirmación (~10-20 segundos en Devnet)

Si es exitoso, verás:
✅ Market created successfully!
✅ Transaction: [signature]
✅ Market ID: [public key]
```

---

## 🔍 Verificar en Solana Explorer

### Copiar Transaction Signature
Cuando aparezca el mensaje de éxito, copia el transaction signature.

### Abrir Explorer
```
https://explorer.solana.com/?cluster=devnet
```

### Buscar tu Transacción
1. Pega el signature en la barra de búsqueda
2. Verás los detalles de la transacción:
   - ✅ Program Invocation (create_market)
   - ✅ Account created (tu nuevo market)
   - ✅ SOL transferido

### Verificar el Market Account
```
En la transacción, busca la dirección del "Market" account
Click en ella
Verás los datos almacenados:
  - authority: [tu wallet]
  - question: "¿Milei alcanzará déficit cero en 2025?"
  - description: [tu criteria]
  - end_time: [timestamp]
  - yes_amount: 0
  - no_amount: 0
  - resolved: false
```

---

## 🎯 Ejemplos de Mercados para Hackathon

### 1. Política Argentina
```
Question: ¿Milei alcanzará déficit cero en 2025?
Category: Politics
End: 2025-12-31
```

### 2. Infraestructura México
```
Question: ¿AMLO entregará la refinería Dos Bocas operativa antes de fin de año?
Category: Infrastructure
End: 2025-12-31
```

### 3. Vivienda El Salvador
```
Question: ¿Bukele construirá las 20,000 viviendas prometidas para 2025?
Category: Social
End: 2025-12-31
```

### 4. Educación Colombia
```
Question: ¿Petro ejecutará más del 80% del presupuesto de educación en 2025?
Category: Education
End: 2025-12-31
```

### 5. Justicia Regional
```
Question: ¿Habrá investigación oficial del caso Odebrecht antes de junio 2026?
Category: Justice
End: 2026-06-30
```

---

## 🐛 Troubleshooting

### Error: "Insufficient funds"
**Solución:**
```bash
# Consigue más SOL del faucet
solana airdrop 2 <TU_ADDRESS> --url devnet
```

### Error: "User rejected transaction"
**Solución:**
- Phantom bloqueó la firma
- Intenta de nuevo
- Verifica que Phantom esté desbloqueado

### Error: "Network error"
**Solución:**
- Verifica conexión a internet
- Confirma que estés en Devnet
- Prueba refrescar la página

### Error: "Question too long"
**Solución:**
- Max 200 caracteres en question
- Acorta tu pregunta
- Detalles van en Description

### Error: "Invalid end time"
**Solución:**
- End date debe ser futuro
- Verifica fecha y hora
- Asegúrate de que sea después de ahora

---

## ✅ Checklist de Éxito

Después de crear el mercado:

- [ ] Transaction confirmada (verde en Explorer)
- [ ] Market account creado
- [ ] Question y description correctos
- [ ] end_time es futuro
- [ ] yes_amount = 0, no_amount = 0
- [ ] resolved = false
- [ ] authority = tu wallet

---

## 🎥 Next: Probar Trading

Después de crear el mercado, prueba:

1. **Navegar al mercado**: `/markets/[market-id]`
2. **Place bet YES**: Apuesta 0.1 SOL en YES
3. **Ver odds actualizar**: YES y NO percentages cambian
4. **Verificar en Explorer**: Ver la transacción place_bet

---

## 📊 Datos para Demo

Para el hackathon, crea 5-10 mercados variados:

```
✅ 2-3 política (Milei, AMLO, Bukele)
✅ 1-2 infraestructura (obras públicas)
✅ 1-2 social (vivienda, educación)
✅ 1 justicia/anticorrupción
✅ 1 economía (metas fiscales)
```

---

## 🚀 Ready para el Hackathon!

Cuando tengas 5+ mercados creados y probados:

1. ✅ Screenshot de cada mercado
2. ✅ Nota los transaction signatures
3. ✅ Prepara el pitch con mercados reales
4. ✅ Prueba el flow completo (create → trade → resolve)

---

**Status: READY TO TEST 🎯**

*PrismaFi: Accountability Markets for LATAM*

