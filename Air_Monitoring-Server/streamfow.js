// STREAMFLOW CUSTOMIZABLE TIME PERIODS EXAMPLE
// This example demonstrates how to set up a governance token distribution
// for early contributors that runs from June 1, 2025 to June 1, 2026

const {
  getStreamflowClient,
  BN,
  Partner,
  CreateStreamConstraints,
  StreamClient,
  TimeUnit,
} = require("@streamflow/stream");

//

const streamFlow = require("@streamflow/stream");

// console.log("streamFlow", streamFlow.PARTNERS_SCHEMA);
// const { PublicKey, Keypair, Connection } = require("@solana/web3.js");

const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} = require("@solana/web3.js");

const User = require("./model/User");

async function createGovernanceTokenDistribution() {
  // Initialize connection to Solana
  //   const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Your wallet (treasury wallet with tokens)
  const senderWallet = Keypair.fromSecretKey(
    Uint8Array.from(
      "247,248,220,8,196,113,85,115,87,38,55,75,22,192,196,236,175,86,139,200,12,248,16,172,122,136,35,163,137,67,124,78,91,91,212,76,140,68,96,126,195,118,237,176,9,4,33,167,96,238,213,119,145,223,65,223,31,103,221,90,174,80,25,217".split(
        ","
      )
    )
  );

  // console.log("partner", Partner);
  // Initialize Streamflow client
  // const client = getStreamflowClient({
  //   cluster: "devnet",
  // });

  console.log("streamFlow", streamFlow);

  // Initialize Streamflow client (devnet program ID)
  const client = new StreamClient(
    connection,
    "C2vHgFEA5h7QLzQj1Z6EYpKm5qS6tqEv8Nf3KoDR1D4A",
    { logLevel: "info" }
  );

  // Governance token mint address
  const breezoTokenMint = new PublicKey(
    "HNoswF8sxpBarQPAgAA6RviN7gD4GQswqbCuz8wM8tsf"
  );

  // Set specific start and end times
  const startDate = new Date("May 17, 2025 00:00:00 GMT");
  const endDate = new Date("May 17, 2026 00:00:00 GMT");

  // Convert to UNIX timestamps (seconds)
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  // Calculate distribution duration in seconds
  const distributionDuration = endTimestamp - startTimestamp;

  // Define early contributors and their allocations
  // const contributors = [
  //   {
  //     wallet: "Contributor1_Wallet_Address",
  //     tokenAmount: new BN("5000000000000"), // 5,000 tokens (assuming 6 decimals)
  //     name: "Core Developer 1",
  //   },
  //   {
  //     wallet: "Contributor2_Wallet_Address",
  //     tokenAmount: new BN("3000000000000"), // 3,000 tokens
  //     name: "Product Manager",
  //   },
  //   {
  //     wallet: "Contributor3_Wallet_Address",
  //     tokenAmount: new BN("2000000000000"), // 2,000 tokens
  //     name: "Community Lead",
  //   },
  // ];

  // Create a stream for each contributor
  const contributors = await User.find();

  console.log("contributors", contributors);

  for (const contributor of contributors) {
    // Calculate release rate per second
    // Tokens will flow continuously and evenly throughout the year
    // const tokensPerPeriod = contributor.tokenAmount.div(
    //   new BN(distributionDuration)
    // );

    const tokensPerPeriod = contributor.points / distributionDuration;

    console.log("tokensPerPeriod", tokensPerPeriod);

    const streamParams = {
      sender: senderWallet.publicKey.toBase58(),
      recipient: contributor.wallet,
      mint: breezoTokenMint.toBase58(),
      start: startTimestamp,
      amount: contributor.tokenAmount,
      period: 60 * 60 * 24, // 1 day period.
      cliff: 0, // No cliff
      cliffAmount: new BN(0),
      amountPerPeriod: tokensPerPeriod,
      name: `Breezo Token - ${contributor.name}`,
      canTopup: false, // Cannot add more tokens later
      cancelableBySender: true, // Protocol can cancel if needed
      cancelableByRecipient: false, // Contributor cannot cancel
      transferableBySender: false,
      transferableByRecipient: false,
      automaticWithdrawal: true, // Enable automatic withdrawals
      withdrawalFrequency: 60 * 60 * 24, // Withdraw once per day
    };

    // Create the stream
    try {
      const stream = await client.create(streamParams);
      console.log("stream", stream);

      console.log(`Created stream for ${contributor.name}:`, stream.id);
    } catch (error) {
      ``;
      console.error(`Failed to create stream for ${contributor.name}:`, error);
    }
  }
}

// Execute the distribution setup
createGovernanceTokenDistribution().catch(console.error);

// import { StreamflowClient, TimeUnit } from "@streamflow/stream";
// import {
//   Connection,
//   Keypair,
//   PublicKey,
//   LAMPORTS_PER_SOL,
// } from "@solana/web3.js";

// // Initialize connection and wallet
// const connection = new Connection("https://api.devnet.solana.com");
// const sender = Keypair.generate(); // Replace with your actual keypair

// // Initialize Streamflow client (devnet program ID)
// const client = new StreamflowClient(
//   connection,
//   "C2vHgFEA5h7QLzQj1Z6EYpKm5qS6tqEv8Nf3KoDR1D4A",
//   { logLevel: "info" }
// );

// async function createStream() {
//   // Stream parameters
//   const streamParams = {
//     recipient: new PublicKey("RecipientWalletAddressHere"), // Replace with recipient address
//     token: {
//       name: "USDC",
//       symbol: "USDC",
//       decimals: 6,
//       mint: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), // USDC Devnet
//     },
//     native: {
//       amount: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL for transaction fees
//       forward: true,
//     },
//     amount: "1000000", // 1 USDC (6 decimals)
//     period: 1, // 1 interval between releases
//     cliff: 0, // No cliff
//     start: Math.floor(Date.now() / 1000) + 60, // Starts in 1 minute
//     releaseFrequency: {
//       timeUnit: TimeUnit.Day,
//       frequency: 1, // Every 1 day
//     },
//     cancelableBySender: true,
//     cancelableByRecipient: false,
//     transferableBySender: true,
//     transferableByRecipient: false,
//   };

//   // Create the stream
//   const { txId } = await client.create(
//     sender, // Payer keypair
//     "SOL", // Environment (SOL for Solana)
//     streamParams
//   );

//   console.log(`Stream created successfully: ${txId}`);
// }

// createStream().catch(console.error);
