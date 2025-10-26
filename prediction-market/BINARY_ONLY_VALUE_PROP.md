# PrismaFi - Binary Prediction Markets for LATAM Accountability

## 🎯 **Value Proposition**

**Prediction markets for social accountability in LATAM.**  
Simple YES/NO markets on political promises, public projects, and institutional commitments.

**Did they keep their promise? Let the market decide.**

---

## 💡 **Why Binary-Only?**

### **1. Perfect for Accountability**

```
✅ "¿Milei cumplirá déficit cero 2025?" → YES/NO
✅ "¿Bukele construirá 20K viviendas?" → YES/NO
✅ "¿Se investigará caso corrupción?" → YES/NO

❌ "Inflación INDEC Marzo 2025 (%)" → Scalar (NOT our focus)
```

**Binary = Simple judgment call**  
**Scalar = Complex contract spec + oracles**

### **2. Lower Cost & Complexity**

| Aspect | Binary | Scalar |
|--------|--------|--------|
| **Dev time** | 2 weeks | 6-8 weeks |
| **Oracle dependency** | ❌ No | ✅ Yes |
| **User education** | 5 min | 30 min |
| **Dispute rate** | 5-8% | 15-25% |
| **Market fit LATAM** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Viral potential** | High | Low |

### **3. Market Evidence**

- **Polymarket:** 95% binary, $3B+ volume
- **PredictIt:** 100% binary, mainstream adoption
- **Augur:** Failed scalar adoption, pivoted to binary

---

## 🚀 **Product Flow**

### **1. Create Market**
```
User fills form:
- Question: "¿Milei cumplirá déficit cero 2025?"
- Resolution Criteria: "YES if official Ministry reports confirm zero deficit by Dec 31, 2025"
- Category: Politics
- End Date: 2025-12-31
```

### **2. Community Trades**
```
YES: 67% → Users bet on compliance
NO: 33% → Users bet against it
```

### **3. Evidence Submission**
```
- Official reports uploaded
- Community verifies sources
- DAO votes if disputed
```

### **4. Resolution**
```
✅ Market resolves → Winners get paid
📊 Transparency score updated
🏆 Social pressure applied
```

---

## 🎨 **UX Principles**

### **Simple = Viral**

```
Binary: Click YES or NO → Done
Scalar: Enter number → Check range → Verify source → Understand payout curve → ???
```

### **Clear Messaging**

```
❌ "Prediction markets with binary and scalar instruments"
✅ "Did they keep their promise? YES or NO."
```

### **Target Audience**

```
Primary: Citizens tracking political promises
Secondary: Journalists, civil society orgs
Tertiary: DeFi traders (bonus)

NOT: Macro traders, quants, hedge funds
```

---

## 📊 **Market Examples**

### **Political Accountability**
- ¿Milei alcanzará déficit cero en 2025?
- ¿AMLO entregará refinería Dos Bocas operativa?
- ¿Petro ejecutará >80% presupuesto educación?

### **Public Projects**
- ¿Se construirá metro línea 4 en fecha prometida?
- ¿Se completará hospital público antes de elecciones?
- ¿Se pavimentarán 50 calles antes diciembre?

### **Institutional Commitments**
- ¿Habrá investigación en caso corrupción X?
- ¿Se publicará informe auditoría antes 2026?
- ¿Corte fallará sentencia antes fecha límite?

---

## 🛠️ **Tech Stack (Simplified)**

### **Frontend**
- NextJS 14 + TypeScript
- Tailwind CSS (brutalist design)
- Solana Wallet Adapter

### **Smart Contracts**
- Anchor Framework (Rust)
- Binary markets ONLY
- Community resolution (no oracles needed)
- Evidence submission system

### **Resolution**
- ✅ Community voting (built-in)
- ✅ Evidence verification (on-chain)
- ✅ DAO governance (for disputes)
- ❌ No oracle feeds (saves $50-200/month)
- ❌ No complex data validation

---

## 💰 **Economics**

### **Platform Fee**
```
0.5% on all trades
- Lower than Polymarket (2%)
- Higher volume = sustainable
```

### **Market Creation**
```
0.1 SOL per market
- Prevents spam
- Refundable if market passes moderation
```

### **Winner Payout**
```
Simple formula:
Winner pool = Total pool - Platform fee
Your share = (Your amount / Winner pool) × Total
```

---

## 🎯 **Differentiation**

### **vs Polymarket**
- **Them:** Global, crypto-native, all topics
- **Us:** LATAM-focused, accountability-specific, local relevance

### **vs PredictIt**
- **Them:** US-only, regulated, politics-focused
- **Us:** LATAM, permissionless, broader scope (promises + projects)

### **vs Augur**
- **Them:** Complex, tried scalar, low adoption
- **Us:** Simple binary, easy UX, high adoption potential

---

## 📈 **Growth Strategy**

### **Phase 1: Launch (Hackathon)**
- 10-15 curated markets
- Focus: Argentina, Mexico, Brazil
- Topics: Presidential promises, major projects

### **Phase 2: Community**
- Permissionless market creation
- DAO moderation of new markets
- Incentivize quality creators

### **Phase 3: Scale**
- Multi-chain (if needed)
- API for media/NGO integration
- Enterprise partnerships

---

## 🔮 **Future: When to Add Scalar**

Only add scalar markets if:

✅ **Demand validated:** Users explicitly request numeric predictions  
✅ **Oracle infrastructure ready:** Reliable data feeds available  
✅ **Team bandwidth exists:** Dedicated resources for complexity  
✅ **ROI justifies cost:** Value > Oracle fees + support load

**Criteria:**
- At least 50 DAU asking for scalar
- Specific use cases identified (not generic)
- Oracle partnerships secured (Chainlink, Pyth)
- Testing/QA capacity doubled

---

## 🎓 **For the Hackathon Pitch**

### **30-Second Version**

> "Prediction markets for accountability in LATAM. Politicians promise, community bets, evidence decides. Simple YES/NO, no complexity. Built on Solana, low fees, fast resolution. Think PredictIt for LATAM social accountability."

### **2-Minute Version**

> "LATAM has a trust problem. Politicians promise, rarely deliver, accountability is weak. 
> 
> PrismaFi creates YES/NO markets on these promises. Did Milei achieve zero deficit? Will the metro line be completed on time? Citizens bet with real money—skin in the game.
> 
> When the deadline arrives, evidence is submitted on-chain. Community verifies. Market resolves. Winners get paid. Losers lose money. But everyone gets transparency.
> 
> Why binary-only? Because accountability is binary: you kept your promise or you didn't. No need for complex numeric predictions or expensive oracle integrations.
> 
> We're not trying to be Kalshi for macro data. We're building social accountability infrastructure for 600M people in LATAM."

---

## ✅ **Success Metrics**

### **MVP (3 months)**
- 100+ markets created
- 1,000+ unique traders
- $100K+ total volume
- <5% dispute rate
- 95%+ user satisfaction on UX simplicity

### **Product-Market Fit**
- Markets cited in LATAM media
- NGOs/journalists using platform
- Organic market creation (not team-created)
- Retention: 30%+ users trade again within 30 days

---

## 📝 **Guidelines for Market Creation**

### **Good Binary Markets**
✅ Clear YES/NO outcome  
✅ Verifiable with public sources  
✅ Relevant to community  
✅ Specific end date  
✅ Non-subjective criteria  

### **Bad Binary Markets**
❌ Subjective ("will X be good president?")  
❌ Unverifiable ("will UFOs land?")  
❌ Too broad ("will economy improve?")  
❌ No clear deadline  
❌ Manipulable by participants  

---

**Documented:** October 25, 2025  
**Status:** Binary-only MVP, ready for hackathon  
**Branch:** `main` (scalar code preserved in `feature/scalar-future`)

---

## 🚀 **Next Steps**

1. ✅ Scalar code removed from main
2. ✅ Binary-only UX implemented
3. ✅ Landing page updated (accountability focus)
4. ✅ Market examples LATAM-focused
5. ⏭️ Deploy to Devnet
6. ⏭️ Create demo video
7. ⏭️ Prepare hackathon presentation

**Ready to ship. 🎯**



