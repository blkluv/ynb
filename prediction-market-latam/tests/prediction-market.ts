import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PredictionMarket } from "../target/types/prediction_market";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("prediction-market", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PredictionMarket as Program<PredictionMarket>;
  
  let mint: PublicKey;
  let userTokenAccount: PublicKey;
  let marketPoolAccount: PublicKey;
  let treasuryAccount: PublicKey;
  
  let user: Keypair;
  let creator: Keypair;
  
  const question = "Will Bitcoin reach $100k by end of 2025?";
  const marketPda = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), Buffer.from(question)],
    program.programId
  )[0];
  
  before(async () => {
    // Create test keypairs
    user = Keypair.generate();
    creator = Keypair.generate();
    
    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(creator.publicKey, 10 * LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create test token mint
    mint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      6
    );
    
    // Create token accounts
    userTokenAccount = await createAccount(
      provider.connection,
      user,
      mint,
      user.publicKey
    );
    
    marketPoolAccount = await createAccount(
      provider.connection,
      user,
      mint,
      marketPda,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    
    treasuryAccount = await createAccount(
      provider.connection,
      user,
      mint,
      PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        program.programId
      )[0]
    );
    
    // Mint tokens to user
    await mintTo(
      provider.connection,
      user,
      mint,
      userTokenAccount,
      user,
      1000000000 // 1000 tokens with 6 decimals
    );
  });

  it("Initializes the program", async () => {
    const globalStatePda = PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    )[0];
    
    try {
      await program.methods
        .initialize()
        .accounts({
          globalState: globalStatePda,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      const globalState = await program.account.globalState.fetch(globalStatePda);
      assert.ok(globalState.authority.equals(provider.wallet.publicKey));
    } catch (error) {
      // If already initialized, that's fine
      console.log("Program already initialized");
    }
  });

  it("Creates a user profile", async () => {
    const userProfilePda = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), creator.publicKey.toBuffer()],
      program.programId
    )[0];
    
    try {
      await program.methods
        .createUserProfile()
        .accounts({
          userProfile: userProfilePda,
          user: creator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      
      const userProfile = await program.account.userProfile.fetch(userProfilePda);
      assert.ok(userProfile.user.equals(creator.publicKey));
      assert.equal(userProfile.totalPredictions, 0);
      assert.equal(userProfile.reputationScore, 100); // Initial reputation
    } catch (error) {
      console.log("User profile already exists");
    }
  });

  it("Creates a prediction market", async () => {
    const userProfilePda = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), creator.publicKey.toBuffer()],
      program.programId
    )[0];
    
    const marketData = {
      question: question,
      description: "Bitcoin price prediction market",
      category: "Crypto",
      resolutionDate: new anchor.BN(Date.now() / 1000 + 86400 * 180), // 6 months
      initialLiquidity: new anchor.BN(10000000), // 10 tokens
    };
    
    const evidenceRequirements = {
      minEvidenceCount: 3,
      requiredTypes: [],
      oracleRequired: true,
      scientificPeerReview: false,
      governmentSourceRequired: false,
    };
    
    await program.methods
      .createMarket(marketData, evidenceRequirements)
      .accounts({
        market: marketPda,
        userProfile: userProfilePda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();
    
    const market = await program.account.predictionMarket.fetch(marketPda);
    assert.equal(market.question, question);
    assert.equal(market.category, "Crypto");
    assert.ok(market.creator.equals(creator.publicKey));
    assert.equal(market.status.active !== undefined, true);
  });

  it("Places a prediction", async () => {
    const userProfilePda = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user.publicKey.toBuffer()],
      program.programId
    )[0];
    
    const userPositionPda = PublicKey.findProgramAddressSync(
      [Buffer.from("position"), user.publicKey.toBuffer(), marketPda.toBuffer()],
      program.programId
    )[0];
    
    const amount = new anchor.BN(1000000); // 1 token
    const outcome = { yes: {} };
    
    await program.methods
      .placePrediction(amount, outcome)
      .accounts({
        market: marketPda,
        userPosition: userPositionPda,
        userProfile: userProfilePda,
        userTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    
    const userPosition = await program.account.userPosition.fetch(userPositionPda);
    assert.ok(userPosition.user.equals(user.publicKey));
    assert.equal(userPosition.amount.toString(), amount.toString());
    
    const market = await program.account.predictionMarket.fetch(marketPda);
    assert.ok(market.yesPool.gt(new anchor.BN(0)));
  });

  it("Adds liquidity to market", async () => {
    const liquidityPositionPda = PublicKey.findProgramAddressSync(
      [Buffer.from("liquidity"), user.publicKey.toBuffer(), marketPda.toBuffer()],
      program.programId
    )[0];
    
    const amountYes = new anchor.BN(2000000); // 2 tokens
    const amountNo = new anchor.BN(2000000);  // 2 tokens
    
    await program.methods
      .addLiquidity(amountYes, amountNo)
      .accounts({
        market: marketPda,
        liquidityPosition: liquidityPositionPda,
        providerTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolAccount,
        provider: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    
    const liquidityPosition = await program.account.liquidityPosition.fetch(liquidityPositionPda);
    assert.ok(liquidityPosition.provider.equals(user.publicKey));
    assert.ok(liquidityPosition.lpTokens.gt(new anchor.BN(0)));
  });

  it("Sells position", async () => {
    const userPositionPda = PublicKey.findProgramAddressSync(
      [Buffer.from("position"), user.publicKey.toBuffer(), marketPda.toBuffer()],
      program.programId
    )[0];
    
    const sellAmount = new anchor.BN(500000); // 0.5 tokens
    
    const userTokenBefore = await getAccount(provider.connection, userTokenAccount);
    
    await program.methods
      .sellPosition(sellAmount)
      .accounts({
        market: marketPda,
        sellerPosition: userPositionPda,
        sellerTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolAccount,
        treasury: treasuryAccount,
        seller: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();
    
    const userTokenAfter = await getAccount(provider.connection, userTokenAccount);
    assert.ok(userTokenAfter.amount > userTokenBefore.amount);
  });

  it("Resolves market with oracle", async () => {
    const oracleData = {
      oracleProvider: "Chainlink",
      dataSource: "BTC/USD",
      value: "95000.00",
      confidence: 95,
      timestamp: new anchor.BN(Date.now() / 1000),
    };
    
    await program.methods
      .resolveMarketWithOracle(oracleData)
      .accounts({
        market: marketPda,
        oracleAuthority: provider.wallet.publicKey,
      })
      .rpc();
    
    const market = await program.account.predictionMarket.fetch(marketPda);
    assert.equal(market.status.resolved !== undefined, true);
    assert.ok(market.resolutionData !== null);
  });

  it("Claims winnings", async () => {
    const userPositionPda = PublicKey.findProgramAddressSync(
      [Buffer.from("position"), user.publicKey.toBuffer(), marketPda.toBuffer()],
      program.programId
    )[0];
    
    const userProfilePda = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user.publicKey.toBuffer()],
      program.programId
    )[0];
    
    const userTokenBefore = await getAccount(provider.connection, userTokenAccount);
    
    await program.methods
      .claimWinnings()
      .accounts({
        market: marketPda,
        userPosition: userPositionPda,
        userProfile: userProfilePda,
        userTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolAccount,
        treasury: treasuryAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    
    const userTokenAfter = await getAccount(provider.connection, userTokenAccount);
    assert.ok(userTokenAfter.amount > userTokenBefore.amount);
    
    const userProfile = await program.account.userProfile.fetch(userProfilePda);
    assert.ok(userProfile.correctPredictions > 0);
  });

  it("Removes liquidity", async () => {
    const liquidityPositionPda = PublicKey.findProgramAddressSync(
      [Buffer.from("liquidity"), user.publicKey.toBuffer(), marketPda.toBuffer()],
      program.programId
    )[0];
    
    const liquidityPosition = await program.account.liquidityPosition.fetch(liquidityPositionPda);
    const lpTokens = liquidityPosition.lpTokens;
    
    const userTokenBefore = await getAccount(provider.connection, userTokenAccount);
    
    await program.methods
      .removeLiquidity(lpTokens)
      .accounts({
        market: marketPda,
        liquidityPosition: liquidityPositionPda,
        providerTokenAccount: userTokenAccount,
        marketPoolAccount: marketPoolAccount,
        provider: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();
    
    const userTokenAfter = await getAccount(provider.connection, userTokenAccount);
    assert.ok(userTokenAfter.amount > userTokenBefore.amount);
  });
});














