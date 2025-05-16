const {
  Connection,
  Keypair,
  clusterApiUrl,
  sendAndConfirmTransaction,
  PublicKey,
} = require("@solana/web3.js");

const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} = require("@solana/spl-token");

const bs58 = require("bs58");
const fs = require("fs");

// Load or create a wallet
// const payer = Keypair.generate(); // Replace with your own Keypair if needed
const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    247, 248, 220, 8, 196, 113, 85, 115, 87, 38, 55, 75, 22, 192, 196, 236, 175,
    86, 139, 200, 12, 248, 16, 172, 122, 136, 35, 163, 137, 67, 124, 78, 91, 91,
    212, 76, 140, 68, 96, 126, 195, 118, 237, 176, 9, 4, 33, 167, 96, 238, 213,
    119, 145, 223, 65, 223, 31, 103, 221, 90, 174, 80, 25, 217,
  ])
);

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Airdrop SOL for fees
  // const airdropSignature = await connection.requestAirdrop(
  //   payer.publicKey,
  //   2e9 // 2 SOL
  // );

  // await connection.confirmTransaction(airdropSignature);

  // Create new token mint
  const mint = await createMint(
    connection,
    payer, // Payer
    payer.publicKey, // Mint authority
    null, // Freeze authority
    0 // Decimals (like 9 decimals for SPL tokens)
  );

  // const mint = new PublicKey("4XmpSAhJkm9ZxEDcg8t9wgp3uvsNSLcJPKc7xK4TxF1p");
  // const mint = "4XmpSAhJkm9ZxEDcg8t9wgp3uvsNSLcJPKc7xK4TxF1p";
  console.log("Mint Address:", mint.toBase58());

  // Get token account for payer (associated token account)
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("Token Account:", tokenAccount);

  // Mint tokens to that account
  await mintTo(
    connection,
    payer, // fee payer // signer
    mint, //mint pubkey
    tokenAccount.address,
    payer, //min to
    1000000000 * 10 ** 9 // Amount in smallest unit (i.e., 1 token = 10^9)
  );

  console.log("Minted 1 token (10^9 units) to the account!");
}

main().catch(console.error);

// import * as fs from "fs";
// import { Keypair } from "@solana/web3.js";

// const secret = Uint8Array.from([
//   204, 155, 53, 190, 28, 101, 70, 50, 230, 144, 65, 216, 234, 174, 90, 6, 102,
//   108, 236, 192, 80, 229, 252, 30, 219, 185, 159, 246, 56, 131, 0, 229, 224, 72,
//   202, 241, 61, 33, 114, 14, 251, 177, 0, 21, 228, 254, 194, 86, 104, 29, 182,
//   54, 63, 80, 250, 64, 107, 113, 65, 226, 174, 233, 238, 25,
// ]);
// const keypair = Keypair.fromSecretKey(secret);

// console.log("Public Key:", keypair.publicKey.toBase58());
