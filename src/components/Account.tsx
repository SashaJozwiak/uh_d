import { TonConnectButton, useTonConnectUI, type ConnectedWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/user';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

import { useAuth } from "react-oidc-context";

export const Account = () => {
    const [tonConnectUI] = useTonConnectUI();
    const { loginWithTon, saveSolanaAddress, airdropBalance, presaleBalance, loading } = useAuthStore(state => state);
    //const saveSolanaAddress = useAuthStore(state => state.saveSolanaAddress);
    const nonceRef = useRef<string | null>(null);

    const auth = useAuth();

    const handleLogout = () => {
        sessionStorage.clear();
        //localStorage.removeItem('token');
        //reset();
        window.location.href = 'https://www.youhold.online/';
    };

    // 1️⃣ Получаем nonce при монтировании
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

    // 2️⃣ Ловим подключение и proof
    const handleStatusChange = useCallback(
        async (wallet: ConnectedWallet | null) => {
            if (!wallet) return;

            const tonProofItem = wallet.connectItems?.tonProof;
            if (!tonProofItem || !('proof' in tonProofItem)) return;

            const { proof } = tonProofItem;
            const { account } = wallet;

            const token = auth.user?.id_token;
            if (!token) {
                console.error('OIDC token missing');
                return;
            }

            await loginWithTon(account, proof, token);

            // refresh nonce
            try {
                const res = await fetch(
                    'https://new.fitton.online/api/uhsusers/auth/getnonce'
                );
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
        [loginWithTon, tonConnectUI, auth] // ✅ ВАЖНО
    );

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange(handleStatusChange);
        return () => unsubscribe();
    }, [handleStatusChange, tonConnectUI]);

    const { publicKey, connected } = useWallet();

    useEffect(() => {
        if (!connected || !publicKey) return;

        const solAddress = publicKey.toBase58();
        console.log('Solana connected:', solAddress);

        const token = auth.user?.id_token;
        if (!token) {
            console.error('OIDC token missing');
            return;
        }

        saveSolanaAddress(solAddress, token)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected, publicKey]);

    console.log('balances: ', airdropBalance, presaleBalance)

    return (
        <>
            <button
                style={{ position: 'absolute', right: '0', top: '0', padding: '0.3rem', color: 'white', backgroundColor: 'rgb(30, 41, 59)', borderTop: 'none' }}
                onClick={handleLogout}
            >Logout</button>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>

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
                    marginTop: 'auto', // вот оно!
                    marginBottom: 0,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    Total: {loading ? 'loading...' : (
                        (presaleBalance ?? 0) + (airdropBalance ?? 0)
                    ).toLocaleString('en', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })} UHLD
                </p>
            </div>

            <div style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'rgb(44, 62, 80)',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 12px 30px'
            }}>
                <h2 style={{ marginTop: '0' }}>TON</h2>
                <div style={{ margin: 'auto auto 1.5rem auto', display: 'flex', justifyContent: 'center' }}><TonConnectButton />
                </div>
                <h2>Solana</h2>
                <WalletMultiButton />
            </div>



            {/* <div style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'rgb(44, 62, 80)',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 12px 30px'
            }}>
                <h2>Solana</h2>
                <WalletMultiButton />
            </div> */}
        </div>
        </>
    );
};
