#!/usr/bin/env node

/**
 * Script para probar el IDL y ver exactamente qué está fallando
 */

const anchor = require("@coral-xyz/anchor");
const { Connection, PublicKey, Keypair } = require("@solana/web3.js");
const idlJson = require("./src/idl/prediction_market.json");

const PROGRAM_ID = new PublicKey("9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka");
const RPC_ENDPOINT = "https://api.devnet.solana.com";

async function testIDL() {
  console.log("\n🧪 Testing IDL Loading...\n");
  
  try {
    // 1. Verificar estructura del IDL
    console.log("1️⃣ IDL Structure:");
    console.log("   - version:", idlJson.version);
    console.log("   - name:", idlJson.name);
    console.log("   - instructions:", idlJson.instructions?.length);
    console.log("   - accounts:", idlJson.accounts?.length);
    console.log("   - types:", idlJson.types?.length);
    console.log("");
    
    // 2. Verificar accounts
    console.log("2️⃣ Accounts:");
    idlJson.accounts?.forEach((acc, i) => {
      console.log(`   [${i}] ${acc.name}`);
      console.log(`       - has discriminator: ${!!acc.discriminator}`);
      console.log(`       - has type: ${!!acc.type}`);
      console.log(`       - has type.kind: ${acc.type?.kind}`);
      console.log(`       - has type.fields: ${!!acc.type?.fields}`);
      console.log(`       - fields count: ${acc.type?.fields?.length}`);
    });
    console.log("");
    
    // 3. Crear conexión y wallet dummy
    console.log("3️⃣ Creating connection...");
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const dummyWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    };
    
    const provider = new anchor.AnchorProvider(
      connection,
      dummyWallet,
      { commitment: "confirmed" }
    );
    
    console.log("   ✅ Connection created");
    console.log("");
    
    // 4. Intentar crear el Program
    console.log("4️⃣ Creating Program...");
    console.log("   Program ID:", PROGRAM_ID.toBase58());
    
    const program = new anchor.Program(
      idlJson,
      PROGRAM_ID,
      provider
    );
    
    console.log("   ✅ Program created successfully!");
    console.log("   Program ID:", program.programId.toBase58());
    console.log("");
    
    // 5. Verificar métodos disponibles
    console.log("5️⃣ Available methods:");
    if (program.methods) {
      const methods = Object.keys(program.methods);
      methods.forEach(m => console.log(`   - ${m}`));
    } else {
      console.log("   ⚠️  No methods found");
    }
    console.log("");
    
    console.log("✅ ALL TESTS PASSED!");
    console.log("\nThe IDL is valid and the Program can be created.\n");
    
  } catch (error) {
    console.error("\n❌ ERROR:");
    console.error(error);
    console.error("\n📍 Error stack:");
    console.error(error.stack);
    console.log("");
    process.exit(1);
  }
}

testIDL();

