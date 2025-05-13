const {
  Connection,
  Keypair,
  clusterApiUrl,
  sendAndConfirmTransaction,
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
const payer = Keypair.generate(); // Replace with your own Keypair if needed

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Airdrop SOL for fees
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    2e9 // 2 SOL
  );
  await connection.confirmTransaction(airdropSignature);

  // Create new token mint
  const mint = await createMint(
    connection,
    payer, // Payer
    payer.publicKey, // Mint authority
    null, // Freeze authority
    9 // Decimals (like 9 decimals for SPL tokens)
  );

  console.log("Mint Address:", mint.toBase58());

  // Get token account for payer (associated token account)
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("Token Account:", tokenAccount.address.toBase58());

  // Mint tokens to that account
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    1000000000 // Amount in smallest unit (i.e., 1 token = 10^9)
  );

  console.log("Minted 1 token (10^9 units) to the account!");
}

main().catch(console.error);
