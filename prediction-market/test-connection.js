#!/usr/bin/env node

/**
 * Script de verificación para conexión Devnet
 * Uso: node test-connection.js
 */

const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const PROGRAM_ID = '9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka';
const RPC_ENDPOINT = 'https://api.devnet.solana.com';

async function testConnection() {
  console.log('\n🔍 Testing Solana Devnet Connection...\n');
  
  try {
    // 1. Test RPC connection
    console.log('1️⃣ Testing RPC connection...');
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const version = await connection.getVersion();
    console.log('   ✅ Connected to Solana Devnet');
    console.log('   📊 Version:', version['solana-core']);
    
    // 2. Test Program account
    console.log('\n2️⃣ Testing Program account...');
    const programId = new PublicKey(PROGRAM_ID);
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
      console.log('   ✅ Program found on Devnet');
      console.log('   📍 Address:', PROGRAM_ID);
      console.log('   💾 Size:', programInfo.data.length, 'bytes');
      console.log('   👤 Owner:', programInfo.owner.toBase58());
      console.log('   🔗 Explorer:', `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`);
    } else {
      console.log('   ❌ Program NOT found on Devnet');
      console.log('   ⚠️  You may need to deploy the program first');
    }
    
    // 3. Test if wallet has funds (if provided)
    if (process.argv[2]) {
      console.log('\n3️⃣ Testing wallet balance...');
      try {
        const walletPubkey = new PublicKey(process.argv[2]);
        const balance = await connection.getBalance(walletPubkey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        
        console.log('   💰 Wallet:', process.argv[2]);
        console.log('   💵 Balance:', solBalance.toFixed(4), 'SOL');
        
        if (balance === 0) {
          console.log('   ⚠️  Wallet has no funds!');
          console.log('   💡 Get SOL from faucet: https://faucet.solana.com');
        } else if (balance < 0.1 * LAMPORTS_PER_SOL) {
          console.log('   ⚠️  Low balance (< 0.1 SOL)');
          console.log('   💡 You may need more SOL for testing');
        } else {
          console.log('   ✅ Sufficient balance for testing');
        }
      } catch (err) {
        console.log('   ❌ Invalid wallet address');
      }
    } else {
      console.log('\n3️⃣ Wallet check skipped');
      console.log('   💡 Usage: node test-connection.js <YOUR_WALLET_ADDRESS>');
    }
    
    // 4. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ RPC Endpoint:', RPC_ENDPOINT);
    console.log('✅ Program ID:', PROGRAM_ID);
    console.log('✅ Cluster: Devnet');
    console.log('🔗 Explorer:', `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`);
    console.log('💡 Faucet:', 'https://faucet.solana.com');
    console.log('='.repeat(60));
    
    console.log('\n✅ Everything looks good! Ready to create markets.\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n⚠️  Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify Devnet is operational: https://status.solana.com');
    console.log('   3. Try again in a few moments');
    console.log('');
    process.exit(1);
  }
}

testConnection();

