# 🎯 Prediction Market Examples (English)

## 🚀 Quick Start

1. **Start Server:**
```bash
cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market
npm run dev
```

2. **Open Browser:**
```
http://localhost:3000/create-market
```

3. **Connect Phantom Wallet** (make sure you're on Devnet)

---

## 📝 Example 1: Argentina Politics (Milei)

### Fill the form with:

```
Question:
Will Milei achieve zero deficit in Argentina by end of 2025?

Description (Resolution Criteria):
This market will resolve to YES if the Ministry of Economy of Argentina 
reports a fiscal deficit equal to or less than 0% for the calendar year 2025.

Official source: Monthly reports from the Ministry of Economy published at 
https://www.argentina.gob.ar/economia

The reference will be taken from the January 2026 report that consolidates 
data from 2025.

Category:
Politics

End Date:
2025-12-31

End Time:
23:59
```

---

## 📝 Example 2: Mexico Infrastructure (AMLO)

```
Question:
Will AMLO deliver the Dos Bocas refinery operational before end of 2025?

Description (Resolution Criteria):
This market will resolve to YES if PEMEX (Petróleos Mexicanos) officially 
announces that the Dos Bocas refinery is operational and processing crude oil 
before December 31, 2025.

Official source: PEMEX press releases and official government announcements 
at https://www.gob.mx/pemex

The refinery must be actively processing crude oil, not just inaugurated or 
in testing phase.

Category:
Infrastructure

End Date:
2025-12-31

End Time:
23:59
```

---

## 📝 Example 3: El Salvador Housing (Bukele)

```
Question:
Will Bukele build 20,000 housing units in 2025 as promised?

Description (Resolution Criteria):
This market will resolve to YES if the government of El Salvador reports 
completion and delivery of at least 20,000 housing units during calendar 
year 2025.

Official source: Ministry of Housing and Urban Development reports and 
official government press releases at https://www.presidencia.gob.sv

Housing units must be completed and delivered to families, not just under 
construction.

Category:
Social

End Date:
2025-12-31

End Time:
23:59
```

---

## 📝 Example 4: Colombia Education (Petro)

```
Question:
Will Petro execute more than 80% of education budget in 2025?

Description (Resolution Criteria):
This market will resolve to YES if the Ministry of Education of Colombia 
reports budget execution greater than 80% of the allocated education budget 
for fiscal year 2025.

Official source: Ministry of Education budget reports published at 
https://www.mineducacion.gov.co

Reference will be taken from the final budget execution report published 
in early 2026.

Category:
Education

End Date:
2025-12-31

End Time:
23:59
```

---

## 📝 Example 5: Regional Justice (Odebrecht)

```
Question:
Will there be an official investigation into Odebrecht case before June 2026?

Description (Resolution Criteria):
This market will resolve to YES if any Attorney General office in Latin 
America announces a formal criminal investigation into the Odebrecht 
corruption case before June 30, 2026.

Official sources: Attorney General press releases and official judicial 
announcements from any LATAM country.

The investigation must be officially announced and active, not closed or 
preliminary inquiries.

Category:
Justice

End Date:
2026-06-30

End Time:
23:59
```

---

## 📝 Example 6: Crypto/Tech - Bitcoin Adoption

```
Question:
Will Bitcoin reach $100,000 USD before end of 2025?

Description (Resolution Criteria):
This market will resolve to YES if Bitcoin (BTC) reaches or exceeds 
$100,000 USD on any major exchange (Coinbase, Binance, or Kraken) 
before December 31, 2025, 23:59 UTC.

Official source: CoinGecko or CoinMarketCap price data.

The price must be reached at least once during the specified period, 
even if it later drops.

Category:
Crypto

End Date:
2025-12-31

End Time:
23:59
```

---

## 📝 Example 7: Climate/Environmental

```
Question:
Will Amazon deforestation decrease by 30% in 2025 vs 2024?

Description (Resolution Criteria):
This market will resolve to YES if the National Institute for Space Research 
(INPE) of Brazil reports that Amazon rainforest deforestation decreased by 
30% or more in calendar year 2025 compared to 2024.

Official source: PRODES system data from INPE published at 
http://www.obt.inpe.br/OBT/assuntos/programas/amazonia/prodes

Reference will be the annual deforestation report typically published in 
the first quarter of 2026.

Category:
Environment

End Date:
2026-03-31

End Time:
23:59
```

---

## 🎯 Tips for Good Markets

### ✅ DO's:
- **Clear question** - Can be answered with YES or NO
- **Specific criteria** - Name exact sources and dates
- **Verifiable** - Use official government or institutional sources
- **Realistic timeframe** - Give enough time for verification
- **Objective** - Avoid subjective interpretations

### ❌ DON'Ts:
- Subjective questions ("Will X be popular?")
- No clear resolution source
- Too short timeframe (< 1 month)
- Illegal activities
- Questions with undefined terms

---

## 🔍 After Creating Your Market

1. **Copy the Transaction Signature** from the success message
2. **Verify on Solana Explorer:**
   ```
   https://explorer.solana.com/?cluster=devnet
   ```
3. **Paste your transaction signature**
4. **Check:**
   - ✅ Status: Success
   - ✅ Program: prediction_market
   - ✅ Instruction: create_market
   - ✅ Market account created

---

## 💰 Transaction Details

```
Creation Fee: ~0.1 SOL (Devnet)
Includes: 
  - Rent for market account
  - Transaction fees
  - Platform fee
```

---

## 🐛 Common Errors

### "Question too long"
- Maximum: 200 characters
- **Solution:** Make question shorter, put details in Description

### "Invalid end time"
- End date must be in the future
- **Solution:** Pick a date at least 1 day in the future

### "Insufficient funds"
- Need at least 0.1 SOL in wallet
- **Solution:** Get SOL from faucet: https://faucet.solana.com

### "User rejected transaction"
- You cancelled in Phantom
- **Solution:** Try again and approve

---

## 📊 Program Info

```
Program ID: 9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka
Network: Devnet
RPC: https://api.devnet.solana.com
Explorer: https://explorer.solana.com/?cluster=devnet
```

---

## 🚀 Ready to Create!

**Open your browser:**
```
http://localhost:3000/create-market
```

**Fill the form** with any example above and click **"Create Market"**!

---

*PrismaFi: Accountability Markets for LATAM* 🎯

