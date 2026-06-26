# 🏗️ Trepa - Technical Architecture

> Deep dive into the technical decisions, patterns, and implementation details of the Trepa prediction market platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Flow](#data-flow)
5. [Real-Time System](#real-time-system)
6. [State Management](#state-management)
7. [Security Considerations](#security-considerations)
8. [Performance Optimizations](#performance-optimizations)
9. [Trade-offs & Decisions](#trade-offs--decisions)

---

## Overview

Trepa (PredicTok.fun) is built as a **full-stack decentralized application** with four main layers:

```
┌─────────────────────────────────────────────────┐
│               User Interface (Next.js)           │
│  React Components + TypeScript + Tailwind CSS   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Blockchain Interaction Layer             │
│  @solana/web3.js + Wallet Adapter + IDL         │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Solana Smart Contract (Rust)             │
│      Anchor Framework + Program Instructions     │
└─────────────────────────────────────────────────┘
                  
┌─────────────────────────────────────────────────┐
│           AI Intelligence Layer (Swarms)         │
│   Multi-Agent Orchestration for Market Insights  │
│   SentimentAgent + DataAgent + StrategyAgent     │
└─────────────────────────────────────────────────┘
```

---

## Smart Contract Architecture

### Program Structure

The smart contract is built using **Anchor 0.30** (Solana's most popular framework for writing programs).

#### Core Instructions

```rust
pub mod prediction_market {
    pub fn initialize(ctx: Context<Initialize>) -> Result<()>
    pub fn create_market(ctx: Context<CreateMarket>, ...) -> Result<()>
    pub fn place_bet(ctx: Context<PlaceBet>, ...) -> Result<()>
    pub fn resolve_market(ctx: Context<ResolveMarket>, ...) -> Result<()>
    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()>
}
```

#### Account Structures

**1. GlobalState (Singleton)**
```rust
#[account]
pub struct GlobalState {
    pub authority: Pubkey,        // Program authority
    pub market_count: u64,        // Total markets created
    pub total_volume: u64,        // Total SOL wagered (lamports)
    pub fee_rate: u16,            // Platform fee (basis points)
}
```

**2. Market (Per Market)**
```rust
#[account]
pub struct Market {
    pub authority: Pubkey,        // Market creator
    pub question: String,         // Market question (max 200 chars)
    pub description: String,      // Resolution criteria (max 500 chars)
    pub category: String,         // Category (max 50 chars)
    pub end_time: i64,           // Unix timestamp
    pub resolved: bool,          // Resolution status
    pub winning_outcome: u8,     // 0=No, 1=Yes (if resolved)
    pub total_yes_amount: u64,   // Total SOL on Yes (lamports)
    pub total_no_amount: u64,    // Total SOL on No (lamports)
    pub created_at: i64,         // Creation timestamp
}
```

**3. Bet (Per User Per Market)**
```rust
#[account]
pub struct Bet {
    pub user: Pubkey,            // Bettor's wallet
    pub market: Pubkey,          // Market account
    pub amount: u64,             // Bet amount (lamports)
    pub outcome: u8,             // 0=No, 1=Yes
    pub claimed: bool,           // Winnings claimed?
    pub timestamp: i64,          // Bet placement time
}
```

### Program Derived Addresses (PDAs)

We use PDAs for deterministic account addresses:

```rust
// GlobalState PDA
seeds = [b"global-state"], bump

// Market PDA
seeds = [b"market", authority.key(), &market_id.to_le_bytes()], bump

// Bet PDA
seeds = [b"bet", user.key(), market.key()], bump
```

**Why PDAs?**
- Deterministic addresses (no need to store)
- Program owns the accounts (security)
- Efficient lookups (no database needed)

### Transaction Flow Examples

#### Creating a Market
```
User → [Wallet] → [create_market instruction]
                       ↓
                  [Program validates]
                       ↓
                  [Creates Market PDA]
                       ↓
                  [Updates GlobalState]
                       ↓
                  [Emits event log]
```

#### Placing a Bet
```
User → [Wallet] → [place_bet instruction + SOL]
                       ↓
                  [Program validates]
                       ↓
                  [Creates/Updates Bet PDA]
                       ↓
                  [Transfers SOL to Market]
                       ↓
                  [Updates Market totals]
                       ↓
                  [Emits event log]
```

#### Claiming Winnings
```
User → [Wallet] → [claim_winnings instruction]
                       ↓
                  [Verify market resolved]
                       ↓
                  [Verify correct outcome]
                       ↓
                  [Calculate proportional share]
                       ↓
                  [Transfer SOL to user]
                       ↓
                  [Mark bet as claimed]
```

---

## Frontend Architecture

### Project Structure

```
prediction-market/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── markets/           # Market listing
│   │   ├── markets/[id]/      # Market detail
│   │   ├── dashboard/         # User dashboard
│   │   ├── leaderboard/       # Global rankings
│   │   ├── activity/          # Activity feed
│   │   └── profile/[wallet]/  # User profile
│   │
│   ├── components/            # React components
│   │   ├── common/           # Shared UI components
│   │   ├── layout/           # Layout components
│   │   ├── markets/          # Market-related
│   │   ├── profile/          # Profile components
│   │   └── social/           # Social sharing
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useRealTimeData.ts
│   │
│   ├── lib/                  # Core logic
│   │   ├── program/         # Blockchain interaction
│   │   │   ├── direct.ts          # Write operations
│   │   │   ├── direct-read.ts     # Read operations
│   │   │   ├── leaderboard.ts     # Rankings
│   │   │   └── activity.ts        # Event parsing
│   │   └── utils/           # Helper functions
│   │
│   └── idl/                 # Program IDL
│       └── prediction_market.json
```

### Component Hierarchy

```
Layout
├── Header
│   ├── WalletMultiButton
│   └── Navigation
│
├── Page Components
│   ├── Markets
│   │   ├── SearchBar
│   │   ├── Filters
│   │   ├── RealTimeStatus
│   │   └── MarketCard (loop)
│   │
│   ├── MarketDetail
│   │   ├── MarketInfo
│   │   ├── BinaryTradingInterface
│   │   ├── ResolveMarketInterface (if creator)
│   │   ├── ClaimWinnings (if winner)
│   │   └── RealTimeStatus
│   │
│   ├── Dashboard
│   │   ├── StatsWidget (loop)
│   │   ├── BetCard (loop)
│   │   └── RealTimeStatus
│   │
│   └── Profile
│       ├── ProfileStats
│       ├── ProfileActivity
│       └── ShareProfile
│
└── Footer
```

---

## AI Intelligence Layer

### Swarms Multi-Agent Architecture

PredicTok.fun integrates **Swarms** - a multi-agent AI orchestration platform - to provide market participants with intelligent insights that go beyond raw odds.

### Agent Architecture

```
User Views Market
       ↓
MarketAnalyzer Component
       ↓
analyzeMarket(marketId, question, data)
       ↓
┌──────────────────────────────────────┐
│   Swarms Orchestration Engine         │
│                                       │
│  ┌─────────────────────────────┐    │
│  │     SentimentAgent           │    │
│  │  - Scrapes social media      │    │
│  │  - Analyzes sentiment (-1..1)│    │
│  │  - Counts mentions           │    │
│  │  - Identifies keywords       │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │     DataAgent                │    │
│  │  - Queries blockchain data   │    │
│  │  - Finds similar markets     │    │
│  │  - Calculates win rates      │    │
│  │  - Detects price patterns    │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │     StrategyAgent            │    │
│  │  - Combines all signals      │    │
│  │  - Recommends position       │    │
│  │  - Calculates bet size       │    │
│  │  - Assesses risk             │    │
│  └─────────────────────────────┘    │
│                                       │
└──────────────┬────────────────────────┘
               ↓
       MarketInsight Object
               ↓
       UI Renders Analysis
```

### Implementation Details

**File:** `src/lib/ai/swarms-analyzer.ts`

The Swarms analyzer orchestrates three specialized agents:

**1. SentimentAgent**
```typescript
// Analyzes social media sentiment
interface SentimentAnalysis {
  score: number;        // -1 (negative) to 1 (positive)
  volume: number;       // Mention count
  trending: boolean;    // Viral status
  topKeywords: string[];
  summary: string;
}
```

**2. DataAgent**
```typescript
// Historical pattern recognition
interface HistoricalAnalysis {
  similarMarketsCount: number;
  averageWinRate: number;
  volumeComparison: number;
  priceMovement: "bullish" | "bearish" | "neutral";
  summary: string;
}
```

**3. StrategyAgent**
```typescript
// Actionable recommendations
interface StrategyRecommendation {
  recommendedOutcome: "YES" | "NO" | "NEUTRAL";
  optimalBetSize: number;     // % of portfolio
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW";
  riskAssessment: string;
  reasoning: string[];
}
```

### UI Component

**File:** `src/components/ai/MarketAnalyzer.tsx`

The MarketAnalyzer component displays AI insights in a beautiful, brutalist interface:

- Sentiment score with visual gauge
- Historical data comparisons
- Strategy recommendations with reasoning
- Overall confidence score
- Real-time updates as market evolves

### Why Swarms?

1. **Multi-agent orchestration** - Better than single LLM calls
2. **Specialized agents** - Each focuses on one task (sentiment, data, strategy)
3. **Parallel execution** - Faster than sequential analysis
4. **Composable** - Easy to add new agents (NewsAgent, ChainAgent, etc.)
5. **Production-ready** - API handles scaling, rate limits, error handling

### Trade-offs

**Pros:**
- ✅ Unique differentiator vs competitors
- ✅ Helps users make better decisions
- ✅ Premium feature for monetization
- ✅ Composable with any data source

**Cons:**
- ❌ API costs (mitigated by caching)
- ❌ Latency (2-3 seconds per analysis)
- ❌ Requires external service (fallback built-in)

---

## Data Flow

### Read Operations (Blockchain → Frontend)

```typescript
// 1. Fetch accounts from Solana
const connection = new Connection(rpcUrl);
const accounts = await connection.getProgramAccounts(programId);

// 2. Decode account data
const decoded = decodeMarketAccount(accountData);

// 3. Transform to UI format
const market: MockMarket = {
  id: accountPubkey.toBase58(),
  question: decoded.question,
  // ... more fields
};

// 4. Update React state
setMarkets(markets);
```

### Write Operations (Frontend → Blockchain)

```typescript
// 1. Prepare instruction data
const data = encodeCreateMarketData(question, description, ...);

// 2. Build transaction instruction
const instruction = new TransactionInstruction({
  keys: accountMetas,
  programId: PROGRAM_ID,
  data: data,
});

// 3. Create and send transaction
const tx = new Transaction().add(instruction);
const signature = await sendTransaction(tx, connection);

// 4. Confirm transaction
await connection.confirmTransaction(signature);

// 5. Refresh UI data
refresh();
```

---

## Real-Time System

### Custom Hook: `useRealTimeData`

The core of our real-time system is a reusable React hook:

```typescript
function useRealTimeData<T>({
  fetchData: () => Promise<T>,
  interval: number,
  fetchOnMount: boolean,
  enabled: boolean
}) {
  return {
    data: T | null,
    isLoading: boolean,
    isRefreshing: boolean,
    error: Error | null,
    lastUpdated: number | null,
    refresh: () => void,
    toggleAutoRefresh: () => void,
    isAutoRefreshEnabled: boolean,
  };
}
```

**Key Features:**
- ✅ Automatic polling with configurable interval
- ✅ Manual refresh control
- ✅ Pause/resume functionality
- ✅ Loading states (initial vs. refresh)
- ✅ Error handling with retry
- ✅ SSR-safe (no crashes during build)

### Implementation Pattern

```typescript
// 1. Define fetch function
const fetchMarkets = useCallback(async () => {
  const accounts = await fetchAllMarkets();
  return transformMarkets(accounts);
}, []);

// 2. Use hook
const {
  data: markets,
  isLoading,
  isRefreshing,
  refresh,
  toggleAutoRefresh,
  isAutoRefreshEnabled,
  lastUpdated,
} = useRealTimeData({
  fetchData: fetchMarkets,
  interval: 10000, // 10 seconds
  fetchOnMount: true,
  enabled: true,
});

// 3. Render with status
<RealTimeStatus
  lastUpdated={lastUpdated}
  isRefreshing={isRefreshing}
  isAutoRefreshEnabled={isAutoRefreshEnabled}
  onRefresh={refresh}
  onToggleAutoRefresh={toggleAutoRefresh}
/>
```

### Refresh Intervals by Page

| Page | Interval | Reason |
|------|----------|--------|
| Markets | 10s | Less critical, many markets |
| Market Detail | 5s | Active trading, needs fast updates |
| Dashboard | 8s | User-specific, medium priority |
| Leaderboard | 15s | Rankings change slowly |
| Activity | 6s | Recent events, moderate frequency |
| Profile | 12s | Public data, low priority |

---

## State Management

### Approach: Minimal State with Hooks

We use **React hooks + URL state** instead of Redux/Zustand because:

1. ✅ Simpler codebase (no boilerplate)
2. ✅ Server-side rendering compatible
3. ✅ Blockchain is source of truth (not client state)
4. ✅ Each page manages its own data

### State Patterns

**Local State (useState)**
```typescript
const [markets, setMarkets] = useState<Market[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

**Server State (useRealTimeData)**
```typescript
const { data, isLoading } = useRealTimeData({
  fetchData: fetchFromBlockchain,
  interval: 10000,
});
```

**URL State (useSearchParams)**
```typescript
const searchParams = useSearchParams();
const category = searchParams.get('category') || 'All';
```

**Wallet State (useAnchorWallet)**
```typescript
const wallet = useAnchorWallet();
const isConnected = !!wallet;
```

---

## Security Considerations

### Smart Contract Security

**1. Access Control**
```rust
// Only market creator can resolve
require!(market.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
```

**2. Validation Checks**
```rust
// Verify market hasn't already been resolved
require!(!market.resolved, ErrorCode::AlreadyResolved);

// Verify market has ended
require!(Clock::get()?.unix_timestamp >= market.end_time, ErrorCode::MarketNotEnded);
```

**3. Integer Overflow Protection**
```rust
// Anchor uses checked arithmetic by default
market.total_yes_amount = market.total_yes_amount.checked_add(amount)?;
```

**4. Reentrancy Protection**
- Anchor's account system prevents reentrancy
- State updates before external calls
- `claimed` flag prevents double-claiming

### Frontend Security

**1. Input Validation**
```typescript
// Sanitize user inputs
if (!question || question.length < 10 || question.length > 200) {
  throw new Error('Invalid question length');
}
```

**2. Amount Validation**
```typescript
// Verify bet amount
if (amount <= 0 || amount > walletBalance) {
  throw new Error('Invalid bet amount');
}
```

**3. Wallet Security**
- Never store private keys
- Use Solana Wallet Adapter standard
- User confirms all transactions

**4. RPC Security**
- Use rate-limited RPC endpoints
- Fallback to multiple providers
- Validate responses before parsing

---

## Performance Optimizations

### 1. Efficient Data Fetching

**Parallel Fetching**
```typescript
const [markets, stats, activity] = await Promise.all([
  fetchMarkets(),
  fetchStats(),
  fetchActivity(),
]);
```

**Pagination**
```typescript
// Limit initial load
const markets = await fetchMarkets({ limit: 20, offset: 0 });
```

**Caching**
```typescript
// Cache market data in Map
const marketsCache = new Map<string, Market>();
```

### 2. UI Optimizations

**Lazy Loading**
```typescript
const ProfileActivity = dynamic(() => import('./ProfileActivity'), {
  loading: () => <Spinner />,
});
```

**Memo for Expensive Renders**
```typescript
const MarketCard = React.memo(({ market }) => {
  // Only re-render if market changes
});
```

**Debounced Search**
```typescript
const debouncedSearch = useMemo(
  () => debounce((query) => setSearchQuery(query), 300),
  []
);
```

### 3. Build Optimizations

**Next.js Static Generation**
- Pre-render pages at build time
- Incremental Static Regeneration (ISR)
- Edge caching on Vercel

**Code Splitting**
- Automatic route-based splitting
- Dynamic imports for large components
- Separate vendor chunks

---

## Trade-offs & Decisions

### 1. Direct vs Anchor Program Methods

**Decision**: Use direct `TransactionInstruction` building instead of Anchor's `program.methods`

**Reason**:
- ✅ More control over serialization
- ✅ Avoids IDL version mismatches
- ✅ Easier debugging
- ❌ More boilerplate code

### 2. Monorepo vs Separate Repos

**Decision**: Monorepo with separate `prediction-market/` and `prediction-market-latam/` folders

**Reason**:
- ✅ Shared types between frontend/contract
- ✅ Easier to keep IDL in sync
- ✅ Single deployment pipeline
- ❌ Larger repository size

### 3. Real-Time vs Static Data

**Decision**: Implement custom real-time polling system

**Reason**:
- ✅ Always up-to-date data
- ✅ Better UX (no manual refresh)
- ✅ Configurable intervals per page
- ❌ More RPC calls (costs)

### 4. SSR vs CSR

**Decision**: Hybrid (SSR for initial load, CSR for updates)

**Reason**:
- ✅ Better SEO
- ✅ Faster first paint
- ✅ Still interactive after mount
- ❌ Complex null-safety handling

### 5. TypeScript Strict Mode

**Decision**: Use `strict: false` initially, plan to enable

**Reason**:
- ✅ Faster development (hackathon)
- ✅ Fewer type errors to fix
- ❌ Less type safety
- 🔜 Enable for production

---

## Extensibility: SPL Token Support (v2)

The current architecture uses SOL (native token) for all betting operations. However, the design is **extensible** to support SPL tokens (USDC, USDT, etc.) in future versions.

### Current Architecture (SOL-Only)

**Market Account Structure:**
```rust
pub struct Market {
    // ... existing fields ...
    pub yes_amount: u64,  // SOL lamports
    pub no_amount: u64,   // SOL lamports
}
```

**Betting Flow:**
- Uses `system_instruction::transfer` for SOL transfers
- Market account holds SOL directly
- Payouts use direct lamport transfers

### Future Architecture (Multi-Token)

**Proposed Market Structure:**
```rust
use anchor_spl::token::{TokenAccount, Mint};

pub struct Market {
    // ... existing fields ...
    pub accepted_tokens: Vec<Pubkey>,  // List of token mints
    pub token_pools: Vec<TokenPool>,   // Per-token pools
}

pub struct TokenPool {
    pub mint: Pubkey,
    pub yes_token_account: Pubkey,  // ATA for YES pool
    pub no_token_account: Pubkey,    // ATA for NO pool
    pub yes_amount: u64,
    pub no_amount: u64,
}
```

**Proposed Betting Flow:**
1. User selects token type (SOL, USDC, USDT)
2. If SPL token: Transfer to market's token account
3. If SOL: Use existing flow
4. Market tracks pools separately per token
5. Payouts use appropriate token account

### Migration Path

**Backward Compatibility:**
- Existing markets continue using SOL
- New markets can opt-in to multi-token
- Gradual migration with user education

**Technical Requirements:**
- Anchor SPL token program integration
- Token account management (ATAs)
- Multi-token balance tracking
- UI updates for token selection

**See [ROADMAP.md](./ROADMAP.md) for detailed v2 plans.**

---

## Future Improvements

### Performance
- [ ] Implement WebSocket for real-time events
- [ ] Add Redis caching layer
- [ ] Optimize RPC calls with batching
- [ ] Implement optimistic UI updates

### Architecture
- [ ] Migrate to Anchor's program.methods
- [ ] Add GraphQL layer (The Graph)
- [ ] Implement event indexer
- [ ] Add database for analytics

### Security
- [ ] Smart contract audit
- [ ] Rate limiting on RPC
- [ ] DDOS protection
- [ ] Bug bounty program

---

## Conclusion

Trepa's architecture prioritizes:
1. **Simplicity** - Easy to understand and maintain
2. **Performance** - Fast load times and responsive UI
3. **Security** - Secure by design
4. **Scalability** - Ready for growth

The modular design allows us to iterate quickly while maintaining code quality.

---

**Built with ❤️ for Cypherpunk Hackathon 2025**




