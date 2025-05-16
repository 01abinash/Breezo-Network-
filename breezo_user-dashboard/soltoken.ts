import * as fs from "fs";
import { Keypair } from "@solana/web3.js";

const secret = Uint8Array.from(
  JSON.parse(fs.readFileSync("/path/to/id.json", "utf8"))
);
const keypair = Keypair.fromSecretKey(secret);

console.log("Public Key:", keypair.publicKey.toBase58());
