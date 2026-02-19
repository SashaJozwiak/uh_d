import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    createTransferCheckedInstruction,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";

const RPC = "https://mainnet.helius-rpc.com/?api-key=b5c8b691-9727-44e3-9d46-93658edd5a77";
const connection = new Connection(RPC);

const USDT_MINT = new PublicKey(
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
);

export const useSolanaTransfer = (recipientAddress: string) => {
    const { publicKey, sendTransaction } = useWallet();

    const sendUSDT = useCallback(
        async (amount: number): Promise<string> => {
            if (!publicKey) throw new Error("Wallet not connected");

            const recipient = new PublicKey(recipientAddress);

            const fromTokenAccount = await getAssociatedTokenAddress(
                USDT_MINT,
                publicKey
            );

            const toTokenAccount = await getAssociatedTokenAddress(
                USDT_MINT,
                recipient
            );

            const decimals = 6;
            const amountInSmallestUnit = BigInt(
                Math.floor(amount * 10 ** decimals)
            );

            const transaction = new Transaction().add(
                createTransferCheckedInstruction(
                    fromTokenAccount,
                    USDT_MINT,
                    toTokenAccount,
                    publicKey,
                    amountInSmallestUnit,
                    decimals,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            const signature = await sendTransaction(transaction, connection);

            return signature;
        },
        [publicKey, sendTransaction, recipientAddress]
    );

    return { sendUSDT };
};
