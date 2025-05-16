"use client";

import { Axios } from "@/services/Axios";
import Cookies from "js-cookie";
import { decryptJwtPayload } from "./getJwtBody";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const MINT_ADDRESS = "HNoswF8sxpBarQPAgAA6RviN7gD4GQswqbCuz8wM8tsf";
export const getSolanaAddress = async () => {
  const token = Cookies.get("token");
  console.log("token", token);
  const decoded = decryptJwtPayload(token);
  console.log("decoded", decoded);

  // @ts-ignore
  if (window?.solana && window.solana.isPhantom) {
    try {
      // @ts-ignore
      const resp = await window.solana.connect(); // prompts user to connect wallet
      const publicKey = resp.publicKey.toString(); // get public key as string

      await Axios.put(`/users/${decoded.UserInfo.id}`, {
        wallet_address: publicKey,
      });

      console.log("Connected wallet address:", publicKey);

      return publicKey;
    } catch (err) {
      console.error("User rejected the connection or an error occurred", err);
    }
  } else {
    console.warn("Phantom wallet not found. Please install it.");
  }
};

export const getTokenAccounts = async (walletPublicKey: string) => {
  console.log("walletPublicKey", walletPublicKey);
  const pubKey = new PublicKey(walletPublicKey);
  console.log("pubKey", pubKey);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  console.log("tokenAccounts", tokenAccounts);

  return tokenAccounts.value; // an array of token accounts
};
