/**
 * Smart Contract Integration
 *
 * Este archivo contiene todos los métodos para interactuar con el smart contract
 * de Prediction Markets deployado en Solana.
 */

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { AnchorProvider, Program, BN, web3 } from '@coral-xyz/anchor'
import { IDL } from './idl'
import { PROGRAM_ID, getCurrentRpcEndpoint } from './programId'

// ============================================================================
// Types
// ============================================================================

export interface Market {
  publicKey: PublicKey
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
  publicKey: PublicKey
  user: PublicKey
  market: PublicKey
  outcome: boolean
  amount: BN
  claimed: boolean
  bump: number
}

// ============================================================================
// Program Setup
// ============================================================================

/**
 * Obtiene el Program instance para interactuar con el smart contract
 */
export function getProgram(wallet: any): Program {
  const connection = new Connection(getCurrentRpcEndpoint(), 'confirmed')
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })
  return new Program(IDL as any, provider)
}

// ============================================================================
// PDA Helpers (Program Derived Addresses)
// ============================================================================

/**
 * Deriva la dirección del Market PDA
 * NOTA: La pregunta debe ser CORTA (<30 chars) para evitar "Max seed length exceeded"
 */
export async function getMarketPDA(
  authority: PublicKey,
  question: string
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('market'), authority.toBuffer(), Buffer.from(question)],
    PROGRAM_ID
  )
}

/**
 * Deriva la dirección del Market Vault PDA
 */
export async function getMarketVaultPDA(
  marketPubkey: PublicKey
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), marketPubkey.toBuffer()],
    PROGRAM_ID
  )
}

/**
 * Deriva la dirección de la User Position PDA
 */
export async function getUserPositionPDA(
  marketPubkey: PublicKey,
  userPubkey: PublicKey
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('position'), marketPubkey.toBuffer(), userPubkey.toBuffer()],
    PROGRAM_ID
  )
}

// ============================================================================
// Contract Methods
// ============================================================================

/**
 * Crea un nuevo prediction market
 *
 * @param wallet - Wallet adapter instance
 * @param question - Pregunta del mercado (max 200 caracteres)
 * @param description - Descripción (max 1000 caracteres)
 * @param endTime - Timestamp Unix de finalización
 * @param category - Categoría (max 50 caracteres)
 * @returns Transaction signature
 */
export async function createMarket(
  wallet: any,
  question: string,
  description: string,
  endTime: number,
  category: string
): Promise<string> {
  // VALIDACIÓN: La pregunta debe ser corta para evitar "Max seed length exceeded"
  if (question.length > 30) {
    throw new Error(
      'Question must be 30 characters or less (Solana PDA seed limit)'
    )
  }

  const program = getProgram(wallet)
  const authority = wallet.publicKey

  const [marketPDA] = await getMarketPDA(authority, question)

  const tx = await program.methods
    .createMarket(question, description, new BN(endTime), category)
    .accounts({
      market: marketPDA,
      authority: authority,
      systemProgram: SystemProgram.programId,
    })
    .rpc()

  return tx
}

/**
 * Coloca una apuesta en un mercado
 *
 * @param wallet - Wallet adapter instance
 * @param marketPubkey - Public key del mercado
 * @param outcome - true = YES, false = NO
 * @param amountSOL - Cantidad en SOL (se convertirá a lamports)
 * @returns Transaction signature
 */
export async function placeBet(
  wallet: any,
  marketPubkey: PublicKey,
  outcome: boolean,
  amountSOL: number
): Promise<string> {
  const program = getProgram(wallet)
  const userPubkey = wallet.publicKey

  const [positionPDA] = await getUserPositionPDA(marketPubkey, userPubkey)
  const [vaultPDA] = await getMarketVaultPDA(marketPubkey)

  const amountLamports = new BN(amountSOL * LAMPORTS_PER_SOL)

  const tx = await program.methods
    .placeBet(outcome, amountLamports)
    .accounts({
      market: marketPubkey,
      position: positionPDA,
      marketVault: vaultPDA,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()

  return tx
}

/**
 * Resuelve un mercado (solo el creador puede hacerlo)
 *
 * @param wallet - Wallet adapter instance
 * @param marketPubkey - Public key del mercado
 * @param winningOutcome - true = YES ganó, false = NO ganó
 * @returns Transaction signature
 */
export async function resolveMarket(
  wallet: any,
  marketPubkey: PublicKey,
  winningOutcome: boolean
): Promise<string> {
  const program = getProgram(wallet)
  const authority = wallet.publicKey

  const tx = await program.methods
    .resolveMarket(winningOutcome)
    .accounts({
      market: marketPubkey,
      authority: authority,
    })
    .rpc()

  return tx
}

/**
 * Reclama las ganancias después de que el mercado se resolvió
 *
 * @param wallet - Wallet adapter instance
 * @param marketPubkey - Public key del mercado
 * @returns Transaction signature
 */
export async function claimWinnings(
  wallet: any,
  marketPubkey: PublicKey
): Promise<string> {
  const program = getProgram(wallet)
  const userPubkey = wallet.publicKey

  const [positionPDA] = await getUserPositionPDA(marketPubkey, userPubkey)
  const [vaultPDA] = await getMarketVaultPDA(marketPubkey)

  const tx = await program.methods
    .claimWinnings()
    .accounts({
      market: marketPubkey,
      position: positionPDA,
      marketVault: vaultPDA,
      user: userPubkey,
    })
    .rpc()

  return tx
}

// ============================================================================
// Query Methods (Fetch Data)
// ============================================================================

/**
 * Obtiene la información de un mercado
 */
export async function fetchMarket(
  wallet: any,
  marketPubkey: PublicKey
): Promise<Market | null> {
  try {
    const program = getProgram(wallet)
    // @ts-ignore
    const marketAccount = await program.account.market.fetch(marketPubkey)

    return {
      publicKey: marketPubkey,
      authority: marketAccount.authority,
      question: marketAccount.question,
      description: marketAccount.description,
      category: marketAccount.category,
      endTime: marketAccount.endTime,
      totalYesAmount: marketAccount.totalYesAmount,
      totalNoAmount: marketAccount.totalNoAmount,
      resolved: marketAccount.resolved,
      winningOutcome: marketAccount.winningOutcome,
      createdAt: marketAccount.createdAt,
      bump: marketAccount.bump,
    }
  } catch (error) {
    console.error('Error fetching market:', error)
    return null
  }
}

/**
 * Obtiene todos los mercados del programa
 */
export async function fetchAllMarkets(wallet: any): Promise<Market[]> {
  try {
    const program = getProgram(wallet)
    // @ts-ignore
    const markets = await program.account.market.all()

    return markets.map((m: any) => ({
      publicKey: m.publicKey,
      authority: m.account.authority,
      question: m.account.question,
      description: m.account.description,
      category: m.account.category,
      endTime: m.account.endTime,
      totalYesAmount: m.account.totalYesAmount,
      totalNoAmount: m.account.totalNoAmount,
      resolved: m.account.resolved,
      winningOutcome: m.account.winningOutcome,
      createdAt: m.account.createdAt,
      bump: m.account.bump,
    }))
  } catch (error) {
    console.error('Error fetching all markets:', error)
    return []
  }
}

/**
 * Obtiene la posición de un usuario en un mercado
 */
export async function fetchUserPosition(
  wallet: any,
  marketPubkey: PublicKey,
  userPubkey: PublicKey
): Promise<UserPosition | null> {
  try {
    const program = getProgram(wallet)
    const [positionPDA] = await getUserPositionPDA(marketPubkey, userPubkey)

    // @ts-ignore
    const positionAccount = await program.account.userPosition.fetch(
      positionPDA
    )

    return {
      publicKey: positionPDA,
      user: positionAccount.user,
      market: positionAccount.market,
      outcome: positionAccount.outcome,
      amount: positionAccount.amount,
      claimed: positionAccount.claimed,
      bump: positionAccount.bump,
    }
  } catch (error) {
    // Position might not exist yet
    return null
  }
}

/**
 * Obtiene todas las posiciones de un usuario
 */
export async function fetchUserPositions(
  wallet: any,
  userPubkey: PublicKey
): Promise<UserPosition[]> {
  try {
    const program = getProgram(wallet)
    // @ts-ignore
    const positions = await program.account.userPosition.all([
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: userPubkey.toBase58(),
        },
      },
    ])

    return positions.map((p: any) => ({
      publicKey: p.publicKey,
      user: p.account.user,
      market: p.account.market,
      outcome: p.account.outcome,
      amount: p.account.amount,
      claimed: p.account.claimed,
      bump: p.account.bump,
    }))
  } catch (error) {
    console.error('Error fetching user positions:', error)
    return []
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convierte lamports a SOL
 */
export function lamportsToSOL(lamports: BN | number): number {
  return typeof lamports === 'number'
    ? lamports / LAMPORTS_PER_SOL
    : lamports.toNumber() / LAMPORTS_PER_SOL
}

/**
 * Convierte SOL a lamports
 */
export function solToLamports(sol: number): BN {
  return new BN(sol * LAMPORTS_PER_SOL)
}

/**
 * Calcula el precio implícito de YES basado en el total apostado
 */
export function calculateYesPrice(totalYes: BN, totalNo: BN): number {
  const yes = totalYes.toNumber()
  const no = totalNo.toNumber()
  const total = yes + no

  if (total === 0) return 0.5 // Precio inicial 50/50

  return yes / total
}

/**
 * Formatea un timestamp Unix a string legible
 */
export function formatTimestamp(timestamp: BN): string {
  return new Date(timestamp.toNumber() * 1000).toLocaleString()
}

/**
 * Verifica si un mercado ha expirado
 */
export function isMarketExpired(endTime: BN): boolean {
  return endTime.toNumber() < Date.now() / 1000
}
