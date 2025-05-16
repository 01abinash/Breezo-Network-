// const { Connection } = require("@solana/web3.js");
const {
  clusterApiUrl,
  PublicKey,
  Keypair,
  Connection,
} = require("@solana/web3.js");

const {
  getOrCreateAssociatedTokenAccount,
  transfer,
} = require("@solana/spl-token");
const User = require("../model/User");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// Replace with your mint's address (PublicKey)
const mint = new PublicKey(process.env.MINT_ADDRESS);

const ownerKey = process.env.MINT_OWNER;
// Replace with the secret key of the wallet that owns tokens
const mint_owner_keypair = Uint8Array.from(ownerKey?.split(","));

const fromWallet = Keypair.fromSecretKey(mint_owner_keypair);

const EXCHANGE_RATE = 10;
const transferToken = async (req, res) => {
  try {
    const { wallet_address, id: userId } = req.userInfo;

    console.log("req.userInfo", req.userInfo);

    const { points } = req.body;
    if (points < EXCHANGE_RATE) {
      return res
        .status(400)
        .json({ message: "Points should be greater than " + EXCHANGE_RATE });
    }
    const affordable_tokens = Math.floor(points / EXCHANGE_RATE);
    const pointsDeducted = affordable_tokens * EXCHANGE_RATE;

    const destinationWallet = new PublicKey(wallet_address);

    // console.log("fromWallet", fromWallet.publicKey.toBase58());
    // console.log("destinationWallet", destinationWallet.toBase58());

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      destinationWallet
    );

    // console.log(
    //   "fromTokenAccount.address",
    //   fromTokenAccount.address.toBase58()
    // );
    // console.log("toTokenAccount.address", toTokenAccount.address.toBase58());

    const transferRes = await transfer(
      connection,
      fromWallet, // payer and authority
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey, // owner of the fromTokenAccount
      affordable_tokens // amount (in base units, depending on decimals)
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.points -= pointsDeducted;
    await user.save();

    return res.json({
      success: true,
      message: "Successfully transfered tokens at the rate " + EXCHANGE_RATE,
      data: { transactionId: transferRes },
    });
  } catch (err) {
    console.error("err", err);

    return res.json({
      success: false,
      message: "INTERNAL SERVER ERR.",
      data: err,
    });
  }
};

module.exports = {
  transferToken,
};
