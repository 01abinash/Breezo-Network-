const { StreamflowSolana } = require("@streamflow/stream");
const { ICluster } = require("@streamflow/common");
const { Keypair, PublicKey } = require("@solana/web3.js");
const BN = require("bn.js");

async function createTokenVesting() {
  // Initialize StreamClient with devnet
  const clusterUrl = "https://api.devnet.solana.com";
  const cluster = ICluster.Devnet;

  const streamClient = new StreamflowSolana.SolanaStreamClient({
    clusterUrl,
    cluster,
  });

  // Your wallet (sender)
  const senderWallet = Keypair.fromSecretKey(
    Uint8Array.from(
      "247,248,220,8,196,113,85,115,87,38,55,75,22,192,196,236,175,86,139,200,12,248,16,172,122,136,35,163,137,67,124,78,91,91,212,76,140,68,96,126,195,118,237,176,9,4,33,167,96,238,213,119,145,223,65,223,31,103,221,90,174,80,25,217".split(
        ","
      )
    )
  );

  // Token mint address on devnet
  const tokenMint = new PublicKey(
    "HNoswF8sxpBarQPAgAA6RviN7gD4GQswqbCuz8wM8tsf"
  );

  // Define vesting parameters
  const startDate = new Date("June 1, 2025 00:00:00 GMT");
  const endDate = new Date("June 1, 2026 00:00:00 GMT");

  // Convert to UNIX timestamps (seconds)
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  // Calculate duration in seconds
  const vestingDuration = endTimestamp - startTimestamp;

  // Example recipient
  const recipient = "G6WhkSpQvygDhmBGWaGV2HPTMWLjLq2TyPJCEAwEYJxQ";

  // Total amount to vest (e.g., 5000 tokens with 6 decimals)
  const tokenAmount = new BN("5000000000"); // Assuming 9 decimals

  // Calculate release rate per period
  const period = 60; // 60 seconds per period
  const totalPeriods = Math.ceil(vestingDuration / period);
  const amountPerPeriod = tokenAmount.div(new BN(totalPeriods));

  try {
    // Following the Streamflow SDK's expected structure from your code snippet

    // First parameter: data object containing stream configuration
    const streamData = {
      recipient: recipient,
      tokenId: tokenMint.toString(), // Use tokenId instead of mint
      start: startTimestamp,
      amount: tokenAmount, // Use amount instead of depositedAmount
      period: period,
      cliff: 0,
      cliffAmount: new BN(0),
      amountPerPeriod: amountPerPeriod,
      name: "Token Vesting Stream",
      canTopup: false,
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: false,
      transferableByRecipient: false,
      automaticWithdrawal: true,
      withdrawalFrequency: 60 * 60 * 24, // Daily withdrawals
    };

    // Second parameter: extParams object containing isNative and sender
    const extParams = {
      isNative: false, // false for SPL tokens, true for SOL
      sender: senderWallet, // Pass the actual KeyPair
    };

    console.log("Creating stream with parameters:", {
      streamData,
      extParams: { ...extParams, sender: "KeyPair object" }, // Don't log the full KeyPair
    });

    // Create vesting stream with the two parameters
    const stream = await streamClient.create(streamData, extParams);

    console.log("Vesting stream created successfully:", stream.metadataId);
    return stream;
  } catch (error) {
    console.error("Error creating vesting stream:", error);
    throw error;
  }
}

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import { getStreamflowProgram } from "@streamflow/stream";

export async function stopTokenVesting({
  connection,
  wallet,
  vestingId,
}: {
  connection: Connection,
  wallet: Wallet,
  vestingId: string,
}) {
  const provider = new AnchorProvider(connection, wallet, {});
  const program = await getStreamflowProgram(provider);

  const vestingPublicKey = new PublicKey(vestingId);

  // Fetch the vesting account info
  const vestingAccount = await program.account.vesting.fetch(vestingPublicKey);

  if (!vestingAccount) {
    throw new Error("Vesting account not found.");
  }

  // Check if wallet is the funder
  if (!vestingAccount.funder.equals(wallet.publicKey)) {
    throw new Error("Only the funder can cancel this vesting.");
  }

  try {
    const tx = await program.methods
      .cancel()
      .accounts({
        vesting: vestingPublicKey,
        funder: wallet.publicKey,
        // other required accounts like recipientTokenAccount, vaultTokenAccount, etc.
      })
      .rpc();

    console.log("Vesting cancelled. Transaction signature:", tx);
    return tx;
  } catch (err) {
    console.error("Failed to cancel vesting:", err);
    throw err;
  }
}

// Execute the vesting setup
createTokenVesting().catch(console.error);
