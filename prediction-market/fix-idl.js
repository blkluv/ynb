#!/usr/bin/env node

/**
 * Script para arreglar el IDL: copiar types a accounts
 */

const fs = require('fs');
const path = require('path');

const idlPath = path.join(__dirname, 'src/idl/prediction_market.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

console.log('🔧 Fixing IDL...\n');

// Copiar type information de types a accounts
idl.accounts = idl.accounts.map(account => {
  const typeInfo = idl.types.find(t => t.name === account.name);
  if (typeInfo) {
    console.log(`✅ Adding type to account: ${account.name}`);
    return {
      ...account,
      type: typeInfo.type
    };
  }
  console.log(`⚠️  No type found for account: ${account.name}`);
  return account;
});

// Guardar IDL arreglado
fs.writeFileSync(idlPath, JSON.stringify(idl, null, 2));

console.log('\n✅ IDL fixed and saved!');
console.log('📄 File:', idlPath);

