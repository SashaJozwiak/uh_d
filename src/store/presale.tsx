import { create } from 'zustand';

type SaveTransactionParams = {
    blockchain: 'TON' | 'SOLANA';
    walletAddress: string | null;
    currency: 'USDT' | 'UHS';
    amount: number; // или string если хранишь большие nano значения
    txHash: string;
    token: string | null;
};

interface Purchase {
    id: number;
    blockchain: string;
    currency_symbol: string;
    amount: string;        // NUMERIC приходит строкой
    tx_hash: string | null;
    created_at: string;
}

type PresaleState = {
    count: number;
    totalBuyers: number;
    myTotalPurchased: string;
    myPurchases: Purchase[];

    loading: boolean;
    error: string | null;
    success: boolean;
    saveTxSolana: (token: string, amount: number) => Promise<void>;
    getAll: (token: string) => Promise<void>;
    saveTransaction: (params: SaveTransactionParams) => Promise<void>;
};


export const usePresale = create<PresaleState>((set) => ({
    count: 0,
    totalBuyers: 0,
    myTotalPurchased: "0",
    myPurchases: [],

    loading: false,
    error: null,
    success: false,

    saveTxSolana: async (token, amount) => {
        set({ loading: true, error: null, success: false });

        try {
            //const token = localStorage.getItem("token"); // или как у тебя хранится
            const response = await fetch("https://api.youhold.online/tx/saveTxSolana", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // <--- обязательно
                },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();

            if (!response.ok) {
                set({ error: data.error || "Failed to create transaction", loading: false });
                return;
            }

            console.log("Created Solana transaction:", data.transactionId);

            set({ success: true, loading: false });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error("saveTxSolana error:", err);
            set({ error: errorMessage || "Failed to create transaction", loading: false });
        }
    },


    getAll: async (token) => {
        set({ loading: true, error: null, success: false });

        try {
            //const token = localStorage.getItem('token');

            const response = await fetch(
                `https://api.youhold.online/user/getpresale`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to fetch presale data');
            }

            const data = await response.json();

            console.log('data presale: ', data)

            set({
                count: data.totalPresaleSold * 100,
                totalBuyers: data.totalBuyers,
                myTotalPurchased: data.myTotalPurchased,
                myPurchases: data.myPurchases,
                loading: false,
                success: true,
            });

        } catch (err) {
            console.error('getPresale error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            set({
                loading: false,
                error: errorMessage,
                success: false,
            });
        }
    },

    saveTransaction: async ({
        blockchain,
        walletAddress,
        currency,
        amount,
        txHash,
        token
    }) => {
        try {
            set({ loading: true, error: null, success: false });

            console.log('presale handler: ', blockchain, walletAddress, currency, amount, txHash, token);

            //const token = localStorage.getItem('token'); // если JWT

            const response = await fetch('https://api.youhold.online/tx/saveTx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // если authMiddleware через JWT
                },
                credentials: 'include', // если cookie auth
                body: JSON.stringify({
                    blockchain,
                    walletAddress,
                    currency,
                    amount,
                    txHash
                })
            });

            const data = await response.json();

            console.log('presaleData: ', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save transaction');
            }

            set({
                loading: false,
                success: true
            });

            return data;

        } catch (err) {
            console.error('saveTransaction error:', err);

            const errorMessage = err instanceof Error ? err.message : 'Unknown error';

            set({
                loading: false,
                error: errorMessage
            });

            throw err;
        }
    },

    getCount: () => {
        console.log('get count')
        set({ count: 121000 })
    },
}))
