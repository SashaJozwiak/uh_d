import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
/* import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; */
import { useState, useMemo, useEffect } from 'react';

import type { CSSProperties } from 'react';
import { usePresale } from '../store/presale';
//import { useAuthStore } from '../store/user';

import { useAuth } from "react-oidc-context";
import { getJettonSendTransactionRequest } from '../utils/jettonTransfer';
import { useSolanaTransfer } from '../utils/useSolanaTransfer';

//import { useAuth } from "react-oidc-context";

import s from './presale.module.css'
import { useWallet } from '@solana/wallet-adapter-react';
import { useNav } from '../store/nav';
//import { useTonConnectUI } from '@tonconnect/ui-react';


const RECIPIENT_ADDRESS = 'UQCErfaAo0Hv2UWW8oWYb3LllMjLZGmVtV_yu3SJwolV95tD'

const TOTAL_TOKENS = 3_000_000;
const TOKEN_PRICE = 0.01;

export const Presale = () => {
    // временно — потом придёт с backend
    //const [soldTokens, /* setSoldTokens */] = useState(120_000);
    const { count, myPurchases, saveTxSolana, saveTransaction, getAll } = usePresale(state => state);
    const remaining = TOTAL_TOKENS - count;
    const progressPercent = ((count / TOTAL_TOKENS) * 100).toFixed(2);

    const [amountUsd, setAmountUsd] = useState('');
    //const [currency, setCurrency] = useState('USDT');
    const [chain, setChain] = useState<'TON' | 'SOLANA'>('TON');
    const { sendUSDT } = useSolanaTransfer("ChSPsvjQLw9UsiZzUL3QznwYmtQNta7o7cDkngpjkAoL");
    //const { sendUSDT } = useSolanaTransfer("Bm1aRcNioRhxZnzPXN4xg9kDaR4nisue9a9vZHHRGWc9");

    const { connected: solConnected } = useWallet();
    const [tonConnectUI] = useTonConnectUI();
    const { setSidebar } = useNav(state => state)

    const isTonConnected = tonConnectUI.connected;
    const isSolConnected = solConnected;

    const isWalletConnected =
        chain === 'TON'
            ? isTonConnected
            : isSolConnected;

    //const { tonAddress } = useAuthStore(state => state)
    const tonAddress = useTonAddress(false); // всегда актуальный адрес


    const auth = useAuth();
    //const [tonConnectUI] = useTonConnectUI();

    const tokensToReceive = useMemo(() => {
        const usd = Number(amountUsd);
        if (!usd || usd <= 0) return 0;
        return (usd / TOKEN_PRICE).toFixed(0);
    }, [amountUsd]);

    const buy = async (chain: 'TON' | 'SOLANA', amount: string) => {
        console.log('chain, amount: ', chain, amount)
        //saveTransaction

        const token = auth.user?.id_token;
        const fAmount = Number(amount);

        if (chain === 'TON') {
            const walletAddress = tonAddress;
            const txHash = '0x1234567890abcdef'; //mock data

            if (!token) {
                console.error('OIDC token missing');
                return;
            }



            await saveTransaction({ blockchain: chain, walletAddress, currency: 'USDT', amount: fAmount, txHash, token });

            console.log('for transaction: ', amount, RECIPIENT_ADDRESS, tonAddress)

            const transaction = await getJettonSendTransactionRequest(amount, RECIPIENT_ADDRESS, tonAddress);

            console.log('transaction: ', transaction)

            tonConnectUI.sendTransaction(transaction)
                .then(() => {
                    //setError(null);
                    //onClose();
                    console.log('transaction then')
                })
                .catch((e: unknown) => {
                    if (e instanceof Error) {
                        console.log("Transaction failed: ", e.message)
                    } else {
                        console.log("Transaction failed: ", String(e))
                    }
                });
        }

        if (chain === 'SOLANA') {
            if (!token) {
                console.error('OIDC token missing');
                return;
            }

            try {

                const saveResult = await saveTxSolana(token, fAmount);
                console.log('saveResult save solana transction: ', saveResult)
                //if (!saveResult?.success) return;
                //const transaction = await getJettonSendTransactionRequest(amount, RECIPIENT_ADDRESS, tonAddress);
                const signature = await sendUSDT(fAmount);
                console.log("Solana tx signature:", signature);

            } catch (e) {
                if (e instanceof Error) {
                    console.error("Solana transaction failed:", e.message);
                } else {
                    console.error("Solana transaction failed:", String(e));
                }
            }



        }


    }

    useEffect(() => {
        //if (count === 0) {
        const token = auth.user?.id_token;
        if (token) {
            getAll(token);
        } else {
            console.log('error token!!!!!')
        }

        //}
    }, [auth.user?.id_token, count, getAll])

    console.log('walletAddress: ', tonAddress)

    return (
        <div style={container}>
            <h1 style={{ marginBottom: '1rem' }}>UHLD Presale</h1>

            <p>
                Get <b>UHLD</b> tokens before public launch.
                <br />
                <b>0.01 USDT</b> per token
            </p>

            {/* Whitepaper */}
            <a
                href="https://www.youhold.online/whitepaper"
                target="_blank"
                rel="noreferrer"
                style={whitepaper}
            >

                &nbsp;<span style={{ color: 'lightgray', textDecoration: 'underline', cursor: 'pointer' }}>Read about the token price growth mechanism in the&nbsp;Whitepaper</span>
            </a>

            {/* Progress */}
            <div style={card}>
                <div style={progressHeader}>
                    <span>Sold: {count.toLocaleString()} UHLD</span>
                    <span>{progressPercent}%</span>
                </div>

                <div style={progressBar}>
                    <div
                        style={{
                            ...progressFill,
                            width: `${+progressPercent < 2 ? 2 : ((count / TOTAL_TOKENS) * 100).toFixed(2)}%`,
                        }}
                    />
                </div>

                <div style={progressFooter}>
                    <span>Available: {remaining.toLocaleString()} UHLD</span>
                    <span>Total: {TOTAL_TOKENS.toLocaleString()} UHLD</span>
                </div>
            </div>

            {/* Buy section */}
            <div style={card}>
                <h2>Get tokens</h2>

                <label>{`Amount (min 10 USDT)`}</label>
                <input
                    type="number"
                    placeholder="USDT"
                    value={amountUsd}
                    onChange={(e) => setAmountUsd(e.target.value)}
                    style={input}
                />

                <p>
                    You will receive: <b>{tokensToReceive} UHLD</b>
                </p>

                {/* Chain */}
                <div style={row}>
                    <button
                        style={chain === 'TON' ? activeBtn : btn}
                        onClick={() => setChain('TON')}
                    >
                        TON Wallet <br />
                    </button>
                    <button
                        style={chain === 'SOLANA' ? activeBtn : btn}
                        onClick={() => setChain('SOLANA')}
                    >
                        Solana Wallet Desktop <br /><span style={{ fontSize: '0.7rem' }}>(Tested: Binance wallet, Bybit wallet)</span> 
                    </button>
                </div>

                {/* Wallet connect */}
                <div style={{ margin: '1rem auto', display: 'flex', justifyContent: 'center' }}>
                    {/* {chain === 'TON' ? <TonConnectButton /> : <WalletMultiButton />} */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!isWalletConnected) {
                                setSidebar('account');
                                return;
                            }
                            buy(chain, amountUsd)
                        }}
                        style={{
                            padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #7fd05a, #5aa63b)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, .3)',
                            color: '#fff',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginTop: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {isWalletConnected ? 'Get' : 'Connect wallet'}</button>
                </div>


                {/* <p style={{ fontSize: 12, opacity: 0.7 }}>
                    After payment, tokens will be allocated to your account.
                </p> */}
            </div>

            <div style={card}>
                <h2>Your history</h2>
                {myPurchases.length === 0 ? <span style={{ fontStyle: 'italic' }}>No transactions</span> : (
                    <div className={s.historywrapper}>
                        <table className={s.historytable}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Blockchain</th>
                                    <th>Currency</th>
                                    <th>Amount</th>
                                    <th>Tx</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPurchases.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </td>
                                        <td>{tx.blockchain}</td>
                                        <td>{tx.currency_symbol}</td>
                                        <td>{Number(tx.amount).toLocaleString()}</td>
                                        <td className={s.hash}>
                                            {tx.tx_hash?.slice(0, 6)}...
                                            {tx.tx_hash?.slice(-4)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile cards */}
                        <div className={s.historymobile}>
                            {myPurchases.map((tx) => (
                                <div key={tx.id} className={s.historycard}>
                                    <div><strong>Date:</strong> {new Date(tx.created_at).toLocaleDateString()}</div>
                                    <div><strong>Blockchain:</strong> {tx.blockchain}</div>
                                    <div><strong>Currency:</strong> {tx.currency_symbol}</div>
                                    <div><strong>Amount:</strong> {Number(tx.amount).toLocaleString()}</div>
                                    <div><strong>Tx:</strong> {tx.tx_hash?.slice(0, 10)}...</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </div >
    );
};

/* styles */
const container = {
    maxWidth: 720,
    margin: '0 auto',
    //padding: '2rem',
};

const card = {
    border: '1px solid rgba(255,255,255,.15)',
    borderRadius: 8,
    padding: '1.5rem',
    marginTop: '1.5rem',
    background: 'rgb(44, 62, 80)',
    boxShadow: '0 12px 30px rgba(0,0,0,.25)'
};

const progressHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
};

const progressBar = {
    height: 12,
    background: '#222',
    borderRadius: 6,
    overflow: 'hidden',
};

const progressFill = {
    height: '100%',
    background: 'linear-gradient(90deg,#6ae3a1,#3ba776)',
};

const progressFooter = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 12,
    opacity: 0.8,
};

const row = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem',
};

const btn = {
    padding: '0.5rem 1rem',
    borderRadius: 6,
    //border: '1px solid gray',
    background: 'transparent',
    cursor: 'pointer',
    /* borderWidth: '1px',
    borderStyle: 'solid', */
    //borderColor: '#ccc',
    color: '#ccc'
};

const activeBtn = {
    ...btn,
    background: 'rgb(30, 41, 59)',
    borderColor: '#fcfcfc',
    color: '#ccc',
};

const input = {
    display: 'block',
    margin: '0 auto',
    width: '7rem',
    padding: '0.6rem',
    marginTop: 6,
    borderRadius: 6,
    border: '1px solid gray',
};

const whitepaper: CSSProperties = {
    display: 'block',
    //marginTop: '2rem',
    alignItems: 'stretch',
    textAlign: 'center',
    opacity: 0.8,
    fontSize: '0.8rem',
    color: 'lightgray',
    //alignContent: 'left',
};
