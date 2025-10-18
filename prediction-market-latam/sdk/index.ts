import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { Program, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import type { PredictionMarket } from "../target/types/prediction_market";
import idl from "../target/idl/prediction_market.json";

export class PredictionMarketSDK {
  private program: Program<PredictionMarket>;
  private connection: Connection;
  private provider: AnchorProvider;

  constructor(
    connection: Connection,
    wallet: any,
    programId?: PublicKey
  ) {
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    
    const pid = programId || new PublicKey(idl.metadata.address);
    this.program = new Program(idl as any, pid, this.provider);
  }

  // ============ PDA Helpers ============
  
  findMarketPda(question: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("market"), Buffer.from(question)],
      this.program.programId
    );
  }

  findUserProfilePda(user: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user.toBuffer()],
      this.program.programId
    );
  }

  findUserPositionPda(user: PublicKey, market: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("position"), user.toBuffer(), market.toBuffer()],
      this.program.programId
    );
  }

  findLiquidityPositionPda(provider: PublicKey, market: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("liquidity"), provider.toBuffer(), market.toBuffer()],
      this.program.programId
    );
  }

  findMarketPoolPda(market: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("market_pool"), market.toBuffer()],
      this.program.programId
    );
  }

  findTreasuryPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      this.program.programId
    );
  }

  // ============ Instructions ============

  async createMarket(
    creator: PublicKey,
    marketData: {
      question: string;
      description: string;
      category: string;
      resolutionDate: number;
      initialLiquidity: number;
    },
    evidenceRequirements: {
      minEvidenceCount: number;
      requiredTypes: any[];
      oracleRequired: boolean;
      scientificPeerReview: boolean;
      governmentSourceRequired: boolean;
    }
  ): Promise<string> {
    const [marketPda] = this.findMarketPda(marketData.question);
    const [userProfilePda] = this.findUserProfilePda(creator);

    const tx = await this.program.methods
      .createMarket(
        {
          question: marketData.question,
          description: marketData.description,
          category: marketData.category,
          resolutionDate: new BN(marketData.resolutionDate),
          initialLiquidity: new BN(marketData.initialLiquidity),
        },
        evidenceRequirements
      )
      .accounts({
        market: marketPda,
        userProfile: userProfilePda,
        creator: creator,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async placePrediction(
    user: PublicKey,
    market: PublicKey,
    amount: number,
    outcome: { yes: {} } | { no: {} },
    userTokenAccount: PublicKey
  ): Promise<string> {
    const [userPositionPda] = this.findUserPositionPda(user, market);
    const [userProfilePda] = this.findUserProfilePda(user);
    const [marketPoolPda] = this.findMarketPoolPda(market);

    const tx = await this.program.methods
      .placePrediction(new BN(amount), outcome)
      .accounts({
        market: market,
        userPosition: userPositionPda,
        userProfile: userProfilePda,
        userTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolPda,
        user: user,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async sellPosition(
    seller: PublicKey,
    market: PublicKey,
    amount: number,
    sellerTokenAccount: PublicKey
  ): Promise<string> {
    const [sellerPositionPda] = this.findUserPositionPda(seller, market);
    const [marketPoolPda] = this.findMarketPoolPda(market);
    const [treasuryPda] = this.findTreasuryPda();

    const tx = await this.program.methods
      .sellPosition(new BN(amount))
      .accounts({
        market: market,
        sellerPosition: sellerPositionPda,
        sellerTokenAccount: sellerTokenAccount,
        marketPoolAccount: marketPoolPda,
        treasury: treasuryPda,
        seller: seller,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  }

  async addLiquidity(
    provider: PublicKey,
    market: PublicKey,
    amountYes: number,
    amountNo: number,
    providerTokenAccount: PublicKey
  ): Promise<string> {
    const [liquidityPositionPda] = this.findLiquidityPositionPda(provider, market);
    const [marketPoolPda] = this.findMarketPoolPda(market);

    const tx = await this.program.methods
      .addLiquidity(new BN(amountYes), new BN(amountNo))
      .accounts({
        market: market,
        liquidityPosition: liquidityPositionPda,
        providerTokenAccount: providerTokenAccount,
        marketPoolAccount: marketPoolPda,
        provider: provider,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async removeLiquidity(
    provider: PublicKey,
    market: PublicKey,
    lpTokens: number,
    providerTokenAccount: PublicKey
  ): Promise<string> {
    const [liquidityPositionPda] = this.findLiquidityPositionPda(provider, market);
    const [marketPoolPda] = this.findMarketPoolPda(market);

    const tx = await this.program.methods
      .removeLiquidity(new BN(lpTokens))
      .accounts({
        market: market,
        liquidityPosition: liquidityPositionPda,
        providerTokenAccount: providerTokenAccount,
        marketPoolAccount: marketPoolPda,
        provider: provider,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  }

  async claimWinnings(
    user: PublicKey,
    market: PublicKey,
    userTokenAccount: PublicKey
  ): Promise<string> {
    const [userPositionPda] = this.findUserPositionPda(user, market);
    const [userProfilePda] = this.findUserProfilePda(user);
    const [marketPoolPda] = this.findMarketPoolPda(market);
    const [treasuryPda] = this.findTreasuryPda();

    const tx = await this.program.methods
      .claimWinnings()
      .accounts({
        market: market,
        userPosition: userPositionPda,
        userProfile: userProfilePda,
        userTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolPda,
        treasury: treasuryPda,
        user: user,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async resolveMarketWithOracle(
    market: PublicKey,
    oracleAuthority: PublicKey,
    oracleData: {
      oracleProvider: string;
      dataSource: string;
      value: string;
      confidence: number;
      timestamp: number;
    }
  ): Promise<string> {
    const tx = await this.program.methods
      .resolveMarketWithOracle({
        oracleProvider: oracleData.oracleProvider,
        dataSource: oracleData.dataSource,
        value: oracleData.value,
        confidence: oracleData.confidence,
        timestamp: new BN(oracleData.timestamp),
      })
      .accounts({
        market: market,
        oracleAuthority: oracleAuthority,
      })
      .rpc();

    return tx;
  }

  // ============ Queries ============

  async getMarket(marketPda: PublicKey) {
    return await this.program.account.predictionMarket.fetch(marketPda);
  }

  async getUserProfile(userProfilePda: PublicKey) {
    return await this.program.account.userProfile.fetch(userProfilePda);
  }

  async getUserPosition(userPositionPda: PublicKey) {
    return await this.program.account.userPosition.fetch(userPositionPda);
  }

  async getLiquidityPosition(liquidityPositionPda: PublicKey) {
    return await this.program.account.liquidityPosition.fetch(liquidityPositionPda);
  }

  async getAllMarkets() {
    return await this.program.account.predictionMarket.all();
  }

  async getMarketsByCategory(category: string) {
    const markets = await this.getAllMarkets();
    return markets.filter(m => m.account.category === category);
  }

  async getUserPositions(user: PublicKey) {
    const positions = await this.program.account.userPosition.all([
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: user.toBase58(),
        },
      },
    ]);
    return positions;
  }

  // ============ Utilities ============

  calculatePrice(market: any, outcome: "yes" | "no"): number {
    const pool = outcome === "yes" ? market.yesPool : market.noPool;
    return (pool.toNumber() / market.totalPool.toNumber()) * 100;
  }

  calculatePotentialPayout(
    market: any,
    amount: number,
    outcome: "yes" | "no"
  ): number {
    const winningPool = outcome === "yes" ? market.yesPool.toNumber() : market.noPool.toNumber();
    const losingPool = market.totalPool.toNumber() - winningPool;
    
    // Share of losing pool
    const share = (amount / winningPool) * losingPool;
    
    // Total payout (original + share)
    const grossPayout = amount + share;
    
    // Apply 0.5% fee
    const netPayout = grossPayout * 0.995;
    
    return netPayout;
  }

  calculateAPY(liquidityPosition: any, daysHeld: number): number {
    const totalValue = liquidityPosition.amountYes.toNumber() + liquidityPosition.amountNo.toNumber();
    const feesEarned = liquidityPosition.feesEarned.toNumber();
    
    const dailyReturn = feesEarned / totalValue / daysHeld;
    const apy = (Math.pow(1 + dailyReturn, 365) - 1) * 100;
    
    return apy;
  }
}

// Export types
export * from "../target/types/prediction_market";








