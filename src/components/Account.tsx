import { TonConnectButton, useTonConnectUI, type ConnectedWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/user';
//import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from "react-oidc-context";

import type { WalletName } from '@solana/wallet-adapter-base';

// ✅ Хук для мобильного подключения Solana Phantom
const useSolanaMobileConnect = () => {
    const { select } = useWallet();

    const connectPhantomMobile = useCallback(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Deep link Phantom для мобильного
            window.location.href = 'https://phantom.app/ul/browse/mainnet-beta';
        } else {
            // Десктоп: стандартный выбор кошелька
            select('Phantom' as WalletName);
        }
    }, [select]);

    return { connectPhantomMobile };
};

export const Account = () => {
    const [tonConnectUI] = useTonConnectUI();
    const { loginWithTon, saveSolanaAddress, airdropBalance, presaleBalance, loading } = useAuthStore(state => state);
    const nonceRef = useRef<string | null>(null);

    const auth = useAuth();

    // TON nonce
    useEffect(() => {
        const getNonce = async () => {
            try {
                const res = await fetch('https://new.fitton.online/api/uhsusers/auth/getnonce');
                const data: { tonProof: string } = await res.json();
                nonceRef.current = data.tonProof;

                tonConnectUI.setConnectRequestParameters({
                    state: 'ready',
                    value: { tonProof: data.tonProof },
                });
                console.log('Nonce ready:', data.tonProof);
            } catch (e) {
                console.error('Failed to get nonce', e);
            }
        };
        getNonce();
    }, [tonConnectUI]);

    // TON proof handler
    const handleStatusChange = useCallback(
        async (wallet: ConnectedWallet | null) => {
            if (!wallet) return;

            const tonProofItem = wallet.connectItems?.tonProof;
            if (!tonProofItem || !('proof' in tonProofItem)) return;

            const { proof } = tonProofItem;
            const { account } = wallet;

            const token = auth.user?.id_token;
            if (!token) return console.error('OIDC token missing');

            await loginWithTon(account, proof, token);

            // refresh nonce
            try {
                const res = await fetch('https://new.fitton.online/api/uhsusers/auth/getnonce');
                const data: { tonProof: string } = await res.json();

                nonceRef.current = data.tonProof;
                tonConnectUI.setConnectRequestParameters({
                    state: 'ready',
                    value: { tonProof: data.tonProof },
                });
            } catch (e) {
                console.error('Failed to refresh nonce', e);
            }
        },
        [loginWithTon, tonConnectUI, auth]
    );

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange(handleStatusChange);
        return () => unsubscribe();
    }, [handleStatusChange, tonConnectUI]);

    // Solana connection
    const { publicKey, connected } = useWallet();
    const { connectPhantomMobile } = useSolanaMobileConnect();

    useEffect(() => {
        if (!connected || !publicKey) return;

        const solAddress = publicKey.toBase58();
        const token = auth.user?.id_token;
        if (!token) return console.error('OIDC token missing');

        saveSolanaAddress(solAddress, token);
    }, [connected, publicKey, saveSolanaAddress, auth.user?.id_token]);

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Баланс */}
            <div style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'rgb(44, 62, 80)',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 12px 30px',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <h2 style={{ marginBottom: '1rem' }}>Balance</h2>
                <p style={{ margin: '0 auto' }}>Presale: {loading ? 'loading...' : (<span style={{ fontWeight: 'bold' }}>{presaleBalance?.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} UHLD</span>)}</p>
                <p style={{ margin: '0.3rem auto' }}>Airdrop: {loading ? 'loading...' : (<span style={{ fontWeight: 'bold' }}>{airdropBalance?.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} UHLD</span>)}</p>
                <p style={{
                    marginTop: 'auto',
                    marginBottom: 0,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    Total: {loading ? 'loading...' : ((presaleBalance ?? 0) + (airdropBalance ?? 0)).toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} UHLD
                </p>
            </div>

            {/* Подключения */}
            <div style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'rgb(44, 62, 80)',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 12px 30px'
            }}>
                <h2 style={{ marginTop: '0' }}>TON</h2>
                <div style={{ margin: 'auto auto 1.5rem auto', display: 'flex', justifyContent: 'center' }}>
                    <TonConnectButton />
                </div>
                <h2>Solana</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={connectPhantomMobile}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            background: '#8a2be2',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Connect Phantom
                    </button>
                </div>
            </div>
        </div>
    );
};
