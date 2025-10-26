/**
 * PrismaFi - Solana Smart Contract Integration
 *
 * This module provides TypeScript wrappers for all smart contract functions.
 * Replace PROGRAM_ID with your deployed contract ID from Solana Playground.
 */

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { Program, AnchorProvider, web3, BN, Idl } from '@project-serum/anchor'
import { sha256 } from 'js-sha256'

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * 🚨 REPLACE THIS WITH YOUR DEPLOYED PROGRAM ID FROM SOLANA PLAYGROUND
 */
export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111')

/**
 * Solana RPC endpoint (Devnet)
 */
export const RPC_ENDPOINT = 'https://api.devnet.solana.com'

/**
 * Connection instance
 */
export const connection = new Connection(RPC_ENDPOINT, 'confirmed')

// ============================================================================
// TYPES
// ============================================================================

export interface Market {
  authority: PublicKey
  question: string
  description: string
  category: string
  endTime: BN
  totalYesAmount: BN
  totalNoAmount: BN
  resolved: boolean
  winningOutcome: boolean | null
  createdAt: BN
  bump: number
}

export interface UserPosition {
  user: PublicKey
  market: PublicKey
  outcome: boolean // true = YES, false = NO
  amount: BN
  claimed: boolean
  bump: number
}

export interface CreateMarketParams {
  question: string
  description: string
  endTime: number // Unix timestamp in seconds
  category: string
}

export interface PlaceBetParams {
  marketPubkey: PublicKey
  outcome: boolean // true = YES, false = NO
  amount: number // Amount in SOL (will convert to lamports)
}

// ============================================================================
// PDA DERIVATION FUNCTIONS
// ============================================================================

/**
 * Derive Market PDA
 * Seeds: ["market", authority, sha256(question)]
 */
export function deriveMarketPDA(
  authority: PublicKey,
  question: string
): [PublicKey, number] {
  const questionHash = Buffer.from(sha256(question), 'hex')

  return PublicKey.findProgramAddressSync(
    [Buffer.from('market'), authority.toBuffer(), questionHash],
    PROGRAM_ID
  )
}

/**
 * Derive Position PDA
 * Seeds: ["position", market, user]
 */
export function derivePositionPDA(
  marketPubkey: PublicKey,
  userPubkey: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('position'), marketPubkey.toBuffer(), userPubkey.toBuffer()],
    PROGRAM_ID
  )
}

/**
 * Derive Vault PDA
 * Seeds: ["vault", market]
 */
export function deriveVaultPDA(marketPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), marketPubkey.toBuffer()],
    PROGRAM_ID
  )
}

// ============================================================================
// SMART CONTRACT FUNCTIONS
// ============================================================================

/**
 * 1. CREATE MARKET
 *
 * Creates a new prediction market
 *
 * @param provider - Anchor provider (from wallet)
 * @param params - Market parameters
 * @returns Market public key
 */
export async function createMarket(
  provider: AnchorProvider,
  params: CreateMarketParams
): Promise<PublicKey> {
  try {
    const { question, description, endTime, category } = params

    // Validations
    if (question.length > 200) throw new Error('Question too long (max 200)')
    if (description.length > 1000)
      throw new Error('Description too long (max 1000)')
    if (category.length > 50) throw new Error('Category too long (max 50)')
    if (endTime <= Date.now() / 1000)
      throw new Error('End time must be in future')

    // Derive PDAs
    const authority = provider.wallet.publicKey
    const [marketPDA] = deriveMarketPDA(authority, question)

    // Load program (you'll need to import your IDL)
    // const program = new Program(IDL as Idl, PROGRAM_ID, provider);

    // Build instruction manually for now
    const instruction = await buildCreateMarketInstruction(
      authority,
      marketPDA,
      question,
      description,
      endTime,
      category
    )

    // Send transaction
    const tx = new Transaction().add(instruction)
    const signature = await provider.sendAndConfirm(tx)

    console.log('✅ Market created:', signature)
    console.log('📍 Market PDA:', marketPDA.toString())

    return marketPDA
  } catch (error) {
    console.error('❌ Create market failed:', error)
    throw error
  }
}

/**
 * 2. PLACE BET
 *
 * Place a bet on YES or NO outcome
 *
 * @param provider - Anchor provider
 * @param params - Bet parameters
 * @returns Transaction signature
 */
export async function placeBet(
  provider: AnchorProvider,
  params: PlaceBetParams
): Promise<string> {
  try {
    const { marketPubkey, outcome, amount } = params

    // Validations
    if (amount <= 0) throw new Error('Amount must be positive')

    const user = provider.wallet.publicKey
    const amountLamports = amount * LAMPORTS_PER_SOL

    // Derive PDAs
    const [positionPDA] = derivePositionPDA(marketPubkey, user)
    const [vaultPDA] = deriveVaultPDA(marketPubkey)

    // Build instruction
    const instruction = await buildPlaceBetInstruction(
      marketPubkey,
      positionPDA,
      vaultPDA,
      user,
      outcome,
      amountLamports
    )

    // Send transaction
    const tx = new Transaction().add(instruction)
    const signature = await provider.sendAndConfirm(tx)

    console.log('✅ Bet placed:', signature)
    console.log(`💰 Amount: ${amount} SOL on ${outcome ? 'YES' : 'NO'}`)

    return signature
  } catch (error) {
    console.error('❌ Place bet failed:', error)
    throw error
  }
}

/**
 * 3. RESOLVE MARKET
 *
 * Resolve market outcome (authority only)
 *
 * @param provider - Anchor provider
 * @param marketPubkey - Market to resolve
 * @param winningOutcome - true = YES won, false = NO won
 * @returns Transaction signature
 */
export async function resolveMarket(
  provider: AnchorProvider,
  marketPubkey: PublicKey,
  winningOutcome: boolean
): Promise<string> {
  try {
    const authority = provider.wallet.publicKey

    // Build instruction
    const instruction = await buildResolveMarketInstruction(
      marketPubkey,
      authority,
      winningOutcome
    )

    // Send transaction
    const tx = new Transaction().add(instruction)
    const signature = await provider.sendAndConfirm(tx)

    console.log('✅ Market resolved:', signature)
    console.log(`🏆 Winner: ${winningOutcome ? 'YES' : 'NO'}`)

    return signature
  } catch (error) {
    console.error('❌ Resolve market failed:', error)
    throw error
  }
}

/**
 * 4. CLAIM WINNINGS
 *
 * Claim winnings from resolved market
 *
 * @param provider - Anchor provider
 * @param marketPubkey - Resolved market
 * @returns Transaction signature and amount won
 */
export async function claimWinnings(
  provider: AnchorProvider,
  marketPubkey: PublicKey
): Promise<{ signature: string; amount: number }> {
  try {
    const user = provider.wallet.publicKey

    // Derive PDAs
    const [positionPDA] = derivePositionPDA(marketPubkey, user)
    const [vaultPDA] = deriveVaultPDA(marketPubkey)

    // Fetch position to calculate expected winnings
    const position = await fetchPosition(positionPDA)
    const market = await fetchMarket(marketPubkey)

    if (!market.resolved) throw new Error('Market not resolved yet')
    if (position.claimed) throw new Error('Already claimed')
    if (position.outcome !== market.winningOutcome) {
      throw new Error('This is a losing position')
    }

    // Calculate winnings
    const totalPool = market.totalYesAmount.add(market.totalNoAmount)
    const winningTotal = market.winningOutcome
      ? market.totalYesAmount
      : market.totalNoAmount

    const winnings = position.amount.mul(totalPool).div(winningTotal)

    // Build instruction
    const instruction = await buildClaimWinningsInstruction(
      marketPubkey,
      positionPDA,
      vaultPDA,
      user
    )

    // Send transaction
    const tx = new Transaction().add(instruction)
    const signature = await provider.sendAndConfirm(tx)

    const winningsSOL = winnings.toNumber() / LAMPORTS_PER_SOL

    console.log('✅ Winnings claimed:', signature)
    console.log(`💰 Amount: ${winningsSOL.toFixed(4)} SOL`)

    return {
      signature,
      amount: winningsSOL,
    }
  } catch (error) {
    console.error('❌ Claim winnings failed:', error)
    throw error
  }
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Fetch market account data
 */
export async function fetchMarket(marketPubkey: PublicKey): Promise<Market> {
  try {
    const accountInfo = await connection.getAccountInfo(marketPubkey)
    if (!accountInfo) throw new Error('Market not found')

    // Deserialize account data (you'll need to use Anchor's deserializer)
    // For now, placeholder:
    throw new Error('Implement deserialization with your IDL')
  } catch (error) {
    console.error('❌ Fetch market failed:', error)
    throw error
  }
}

/**
 * Fetch user position account data
 */
export async function fetchPosition(
  positionPubkey: PublicKey
): Promise<UserPosition> {
  try {
    const accountInfo = await connection.getAccountInfo(positionPubkey)
    if (!accountInfo) throw new Error('Position not found')

    // Deserialize account data
    throw new Error('Implement deserialization with your IDL')
  } catch (error) {
    console.error('❌ Fetch position failed:', error)
    throw error
  }
}

/**
 * Fetch all markets created by an authority
 */
export async function fetchMarketsByAuthority(
  authority: PublicKey
): Promise<Market[]> {
  try {
    // Use getProgramAccounts with memcmp filter
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: authority.toBase58(),
          },
        },
      ],
    })

    // Deserialize all accounts
    throw new Error('Implement deserialization with your IDL')
  } catch (error) {
    console.error('❌ Fetch markets failed:', error)
    throw error
  }
}

// ============================================================================
// INSTRUCTION BUILDERS (TEMPORARY - USE ANCHOR PROGRAM INSTEAD)
// ============================================================================

/**
 * These are placeholder functions.
 * After deploying, use the generated IDL with @project-serum/anchor
 * to automatically generate these instructions.
 *
 * Example:
 * ```typescript
 * const program = new Program(IDL, PROGRAM_ID, provider);
 * await program.methods
 *   .createMarket(question, description, new BN(endTime), category)
 *   .accounts({ market: marketPDA, authority, systemProgram: SystemProgram.programId })
 *   .rpc();
 * ```
 */

async function buildCreateMarketInstruction(
  ...args: any[]
): Promise<TransactionInstruction> {
  throw new Error('Use Anchor Program.methods.createMarket() instead')
}

async function buildPlaceBetInstruction(
  ...args: any[]
): Promise<TransactionInstruction> {
  throw new Error('Use Anchor Program.methods.placeBet() instead')
}

async function buildResolveMarketInstruction(
  ...args: any[]
): Promise<TransactionInstruction> {
  throw new Error('Use Anchor Program.methods.resolveMarket() instead')
}

async function buildClaimWinningsInstruction(
  ...args: any[]
): Promise<TransactionInstruction> {
  throw new Error('Use Anchor Program.methods.claimWinnings() instead')
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return sol * LAMPORTS_PER_SOL
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL
}

/**
 * Format SOL amount for display
 */
export function formatSOL(lamports: number | BN): string {
  const amount = typeof lamports === 'number' ? lamports : lamports.toNumber()

  return (amount / LAMPORTS_PER_SOL).toFixed(4) + ' SOL'
}

/**
 * Get Solana Explorer link
 */
export function getExplorerLink(
  addressOrSignature: string,
  type: 'address' | 'tx' = 'address',
  cluster: 'devnet' | 'mainnet-beta' = 'devnet'
): string {
  const base = 'https://explorer.solana.com'
  const path = type === 'address' ? 'address' : 'tx'
  return `${base}/${path}/${addressOrSignature}?cluster=${cluster}`
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example: Complete market lifecycle
 *
 * ```typescript
 * // 1. Create market
 * const marketPDA = await createMarket(provider, {
 *   question: "Will Argentina dollarize by Dec 2025?",
 *   description: "Resolves YES if...",
 *   endTime: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
 *   category: "Politics"
 * });
 *
 * // 2. Place bets
 * await placeBet(provider, {
 *   marketPubkey: marketPDA,
 *   outcome: true, // YES
 *   amount: 1.5 // SOL
 * });
 *
 * // 3. Resolve market (after end time)
 * await resolveMarket(provider, marketPDA, true); // YES wins
 *
 * // 4. Claim winnings
 * const { amount } = await claimWinnings(provider, marketPDA);
 * console.log(`Won ${amount} SOL!`);
 * ```
 */


