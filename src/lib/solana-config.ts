import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// ✅ Tu programa desplegado en Devnet
export const PROGRAM_ID = new PublicKey("6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7");

// ✅ Conexión a Devnet
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// ✅ (Opcional) dirección del wallet local o Phantom
export const DEFAULT_WALLET = "TuPublicKeyAquí"; // puedes dejarlo vacío si usas Phantom
