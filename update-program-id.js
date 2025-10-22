#!/usr/bin/env node

/**
 * Script para actualizar el Program ID del smart contract en el frontend
 * 
 * Uso:
 *   node update-program-id.js <PROGRAM_ID>
 * 
 * Ejemplo:
 *   node update-program-id.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
 */

const fs = require('fs');
const path = require('path');

// Obtener Program ID del argumento
const programId = process.argv[2];

if (!programId) {
  console.error('❌ Error: Program ID requerido');
  console.log('');
  console.log('Uso: node update-program-id.js <PROGRAM_ID>');
  console.log('');
  console.log('Ejemplo:');
  console.log('  node update-program-id.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
  process.exit(1);
}

// Validar formato del Program ID (base58, ~44 caracteres)
if (programId.length < 32 || programId.length > 44) {
  console.error('❌ Error: Program ID inválido (debe tener 32-44 caracteres)');
  process.exit(1);
}

console.log('🚀 Actualizando Program ID en el frontend...');
console.log('');

// Rutas de archivos
const programIdPath = path.join(__dirname, 'prediction-market', 'src', 'lib', 'solana', 'programId.ts');

// Leer archivo actual
let content;
try {
  content = fs.readFileSync(programIdPath, 'utf8');
} catch (error) {
  console.error('❌ Error al leer programId.ts:', error.message);
  process.exit(1);
}

// Reemplazar Program ID
const regex = /export const PROGRAM_ID = new PublicKey\(['"]([^'"]+)['"]\)/;
const match = content.match(regex);

if (!match) {
  console.error('❌ Error: No se encontró PROGRAM_ID en programId.ts');
  process.exit(1);
}

const oldProgramId = match[1];
const newContent = content.replace(regex, `export const PROGRAM_ID = new PublicKey('${programId}')`);

// Escribir archivo actualizado
try {
  fs.writeFileSync(programIdPath, newContent, 'utf8');
} catch (error) {
  console.error('❌ Error al escribir programId.ts:', error.message);
  process.exit(1);
}

console.log('✅ Program ID actualizado exitosamente');
console.log('');
console.log('📄 Archivo: prediction-market/src/lib/solana/programId.ts');
console.log(`   Antes: ${oldProgramId}`);
console.log(`   Ahora: ${programId}`);
console.log('');
console.log('🎯 Próximos pasos:');
console.log('   1. Actualiza el IDL en prediction-market/src/lib/solana/idl.ts');
console.log('   2. Ejecuta: cd prediction-market && npm run dev');
console.log('   3. Prueba crear un mercado en http://localhost:3000');
console.log('   4. Si funciona: git add -A && git commit -m "feat: Connect to Devnet" && git push');
console.log('');
console.log('✅ Listo para probar! 🚀');

