import { create } from 'zustand';
//import { useTonConnectUI } from '@tonconnect/ui-react';
//import { useAuth } from "react-oidc-context";

//import { useTonConnectUI } from '@tonconnect/ui-react';
//import { useAuth } from "react-oidc-context";
import type { TonAccount, TonProof, /* BackendUser, */ /* AssetCurrency, */ /* UserAsset, */ /* ClaimType, */ AuthState } from './types';

const formatAmount = (value: string | null, decimals: number): number => {
    if (!value) return 0;

    const n = Number(value);
    if (!Number.isFinite(n)) return 0;

    return Number((n / 10 ** decimals).toFixed(2));
};

export const useAuthStore = create<AuthState>((set) => ({
    userData: null,
    presaleBalance: 0,
    airdropBalance: 0,
    UHS: 0,
    USDT: 0,
    assets: null,
    id: null,
    mail: null,
    loading: true,
    tonLoading: false,
    tokenTon: localStorage.getItem('token'),
    tonAddress: null,
    solAddress: null,

    claim: async (type, token) => {
        if (!token) return;

        set({ loading: true })

        try {
            const res = await fetch(
                'https://api.youhold.online/user/claim',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ type }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Claim failed ${res.status}: ${text}`);
            }

            const data = await res.json();

            console.log('claim result:', data);

            // 🔥 обновляем airdrop баланс
            set({ airdropBalance: Number(data.newAirdropBalance) });

            // 🔥 локально обнуляем то, что заclaimили
            if (type === 'uhs') {
                set({ UHS: 0 });
            }

            if (type === 'usdt') {
                set({ USDT: 0 });
            }

            if (type === 'assets') {
                set({ assets: [] });
            }

        } catch (err) {
            console.error('claim error', err);
        } finally {
            set({ loading: false })
        }
    },

    getBalances: async (token) => {
        if (!token) return;

        set({ loading: true })

        try {
            const res = await fetch('https://api.youhold.online/user/getbalance', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const balance = await res.json();
            console.log('balance:', balance);
            const uhsBal = formatAmount(balance.balances.UHS, 9);
            const usdtBal = formatAmount(balance.balances.USDT, 6);
            set({ UHS: uhsBal, USDT: usdtBal, assets: balance.assets })
        } catch (err) {
            console.error('getbalance failed', err);
        } finally {
            set({ loading: false })
        }
    },

    saveSolanaAddress: async (address: string, token: string) => {
        try {
            const res = await fetch('https://api.youhold.online/user/savesol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sol_address: address }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Save SOL failed ${res.status}: ${text}`);
            }

            const resSolAddres = await res.json()

            console.log('soladdress: ', resSolAddres)

            set({ solAddress: address });
        } catch (e) {
            console.error('Save SOL address error', e);
        }
    },

    getNonce: async () => {
        console.log('start');
        //const [tonConnectUI] = useTonConnectUI();

        //tonConnectUI.setConnectRequestParameters({ state: 'loading' });

        try {
            const response = await fetch(`${import.meta.env.VITE_SECRET_HOST}uhsusers/auth/getnonce`);
            const result = await response.json();
            console.log('getNonce: ', result);

            /* if (result.tonProof) {
                tonConnectUI.setConnectRequestParameters({
                    state: 'ready',
                    value: { tonProof: result.tonProof }
                });
                //setOnchange(true);
            } else {
                tonConnectUI.setConnectRequestParameters(null);
            } */

        } catch (error) {
            console.error('Error fetching nonce:', error);
        }
    },

    loginWithTon: async (account: TonAccount, proof: TonProof, token) => {
        console.log('TON auth payload:', { account, proof });

        try {
            const res = await fetch(
                'https://new.fitton.online/api/uhsusers/auth',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ account, proof }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Auth failed ${res.status}: ${text}`);
            }

            const data = await res.json();
            console.log('TON auth success:', data);

            localStorage.setItem('token', data.token);

            const saveRes = await fetch(
                'https://api.youhold.online/user/saveton',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ton_address: account.address,
                    }),
                }
            );

            if (!saveRes.ok) {
                const text = await saveRes.text();
                throw new Error(`Save TON address failed ${saveRes.status}: ${text}`);
            }


            const saveResData = await saveRes.json();
            console.log('saveres data: ', saveResData);

            set({
                //userData: data.user,                  // ✅ добавлено
                //mail: data.user?.email ?? null,       // ✅ если есть email
                tokenTon: data.token,
                tonAddress: saveResData.ton_address,
                loading: false,
            });
        } catch (e) {
            console.error('TON auth error', e);
            set({ loading: false });
        }
    },

    init: async (token) => {
        if (!token) return;

        set({ loading: true });

        try {
            // ✅ Получаем пользователя и баланс
            const res = await fetch('https://api.youhold.online/user/my', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            console.log('user/me data:', data);

            set({
                id: data.id,
                userData: data.data,
                mail: data.email,
                presaleBalance: Number(data.balances.presale),
                airdropBalance: Number(data.balances.airdrop),
                loading: false,
            });
        } catch (e) {
            console.error('init failed', e);
            set({ userData: null, loading: false, mail: null });
        }
    },


    reset: () => set({ userData: null, loading: false, mail: null }),
}));
