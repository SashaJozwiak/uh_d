import { /* TonConnectButton, */ useTonWallet } from '@tonconnect/ui-react';
import { useEffect/* , useMemo */ } from 'react';
import { useNav } from '../store/nav';
import { useAuthStore } from '../store/user';

import type { ClaimType } from '../store/types';

import { useAuth } from "react-oidc-context";
import React from 'react';

const UHLD_PRICE = 0.01; // 1 UHLD = $0.01
const UHS_DECIMALS = 1e9;
const USDT_DECIMALS = 1e6;

// курсы
const UHS_TO_UHLD = 1;     // 1 UHS = 1 UHLD
const USDT_TO_UHLD = 100; // 1 USDT = 100 UHLD

export const Airdrop = () => {
    const wallet = useTonWallet();
    const token = useAuth().user?.id_token;
    //const token = auth.user?.id_token;

    const setSideBar = useNav(state => state.setSidebar)
    const { getBalances, claim, UHS, USDT, assets, loading } = useAuthStore(state => state)

    const assetsStats = React.useMemo(() => {
        if (!assets || assets.length === 0) return null;

        let totalNanoUHS = 0;
        let totalMicroUSDT = 0;

        for (const a of assets) {
            if (a.currency === 'UHS') {
                totalNanoUHS += Number(a.amount);
            }

            if (a.currency === 'USDT') {
                totalMicroUSDT += Number(a.amount);
            }
        }

        // → human values
        const totalUHS = totalNanoUHS / UHS_DECIMALS;
        const totalUSDT = totalMicroUSDT / USDT_DECIMALS;

        // → UHLD
        const uhldFromUHS = totalUHS * UHS_TO_UHLD;
        const uhldFromUSDT = totalUSDT * USDT_TO_UHLD;

        const totalUHLD = uhldFromUHS + uhldFromUSDT;
        const bonus = totalUHLD * 0.07;
        const totalWithBonus = totalUHLD + bonus;

        return {
            count: assets.length,

            totalUHS,
            totalUSDT,

            uhldFromUHS,
            uhldFromUSDT,

            totalUHLD,
            bonus,
            totalWithBonus
        };
    }, [assets]);

    const claimBtn = async (type: ClaimType) => {
        if (token) {
            await claim(type, token)
        }
    }


    // mock данные (потом backend)
    /* const balances = useMemo(() => {
        if (!wallet) return null;

        return {
            usdt: 120,
            uhs: 3400,
            assets: 3,
        };
    }, [wallet]); */

    const toUHLD = (usd: number, currency: string) => currency === 'usdt' ? Math.floor(usd / UHLD_PRICE) : (usd);

    /*  const convert = (type: string) => {
         console.log('Convert', type);
     }; */

    useEffect(() => {

        if (!token) return;
        getBalances(token)

    }, [getBalances, token]);

    //console.log('bal: ', USDT)

    return (
        <>
            <h1 style={{ marginBottom: '1rem' }}>Airdrop for
                <a style={{ textDecoration: 'underline', color: '#7fd05a', cursor: 'pointer' }} href="https://t.me/youhold_bot" target="_blank"
                    rel="noopener noreferrer"> YouHold app </a>
                users</h1>
            <p style={{ marginBottom: '1rem' }}>If you have balance and assets in YouHold app, you get +7% bonus</p>
            <div
                style={{
                    width: '50vw',
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 8,
                    padding: '1rem',
                    background: 'rgb(44,62,80)',
                    boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                    //textAlign: 'center',
                    //alignContent: 'center',
                    //alignItems: 'center',
                    margin: '0 auto 1rem auto'
                }}
            >

                {wallet ? (<>
                    TON wallet connected&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="lightgreen" className="size-6" width={'1rem'}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg></>) : (
                    <>
                        <button
                            onClick={() => setSideBar('account')}
                            style={{
                                width: '100%',
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                borderRadius: 6,
                                border: 'none',
                                cursor: 'pointer',
                                background: '#7fd05a',
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: '1rem',
                            }}
                        >
                                Please connect the TON Wallet for check.
                        </button>
                    </>
                )}
            </div>

            <div style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>



                {/* USDT */}
                <div style={{
                    width: 240,
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 8,
                    padding: '1rem',
                    background: 'rgb(44,62,80)',
                    boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid gray' }}>USDT</h3>

                    <p>Balance: <b>{USDT.toLocaleString('en', { maximumFractionDigits: 2 }) ?? '0'}</b> USDT</p>
                    <p>You get: <b>{USDT ? toUHLD(+USDT, 'usdt').toLocaleString('en', { maximumFractionDigits: 2 }) : '0'} UHLD</b></p>
                    <p style={{ color: 'rgb(127, 208, 90)', marginBottom: '1rem' }}>Bonus: <b>+{USDT ? (toUHLD(+USDT, 'usdt') * 0.07).toLocaleString('en', { maximumFractionDigits: 0 }) : '0'} UHLD</b></p>
                    {/* <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>~ +${(toUHLD(USDT, 'usdt'))}</span> */}

                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid gray', borderTop: '1px solid gray' }}>Total: <b>
                        {UHS
                            ? (
                                toUHLD(+USDT, 'usdt') +
                                toUHLD(+USDT, 'usdt') * 0.07
                            ).toLocaleString('en', { maximumFractionDigits: 0 })
                            : '0'}{' '}
                        UHLD
                    </b>
                    </p>

                    <button
                        disabled={!USDT || !wallet || loading}
                        onClick={() => claimBtn('usdt')}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            //marginBottom: '0rem',
                            padding: '0.5rem',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            background: '#7fd05a',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Loading...' : 'Claim All'}
                    </button>
                </div>

                {/* UHS */}
                <div style={{
                    width: 240,
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 8,
                    padding: '1rem',
                    background: 'rgb(44,62,80)',
                    boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid gray' }}>UHS</h3>

                    <p>Balance: <b>{UHS ? UHS.toLocaleString('en', { maximumFractionDigits: 0 }) : '0'} UHS</b></p>
                    <p>You get: <b>{UHS ? toUHLD(+UHS, 'uhs').toLocaleString('en', { maximumFractionDigits: 0 }) : '0'} UHLD </b> </p>


                    <p style={{ color: 'rgb(127, 208, 90', marginBottom: '1rem' }}>Bonus: <b>+{UHS ? (toUHLD(+UHS, 'uhs') * 0.07).toFixed(0) : '0'} UHLD</b></p>
                    {/* <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>~ +${((toUHLD(+UHS, 'uhs')) * 0.01).toLocaleString('en', { maximumFractionDigits: 2 })}</span> */}
                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid gray', borderTop: '1px solid gray' }}>Total: <b>
                        {UHS
                            ? (
                                toUHLD(+UHS, 'uhs') +
                                toUHLD(+UHS, 'uhs') * 0.07
                            ).toLocaleString('en', { maximumFractionDigits: 0 })
                            : '0'}{' '}
                        UHLD
                    </b>
                    </p>

                    <button
                        disabled={!UHS || !wallet || loading}
                        onClick={() => claimBtn('uhs')}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            background: '#7fd05a',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Loading...' : 'Claim All'}
                    </button>
                </div>

                {/* ASSETS */}
                <div style={{
                    width: 240,
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 8,
                    padding: '1rem',
                    background: 'rgb(44,62,80)',
                    boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid gray' }}>Assets</h3>

                    {/* <p>Quantity: <b>{assetsStats?.count ?? '—'}</b></p> */}

                    <p>
                        UHS total:{' '}
                        <b>
                            {assetsStats
                                ? assetsStats.totalUHS.toLocaleString('en', { maximumFractionDigits: 2 })
                                : '0'} UHS
                        </b>
                    </p>

                    <p>
                        USDT total:{' '}
                        <b>
                            {assetsStats
                                ? assetsStats.totalUSDT.toLocaleString('en', { maximumFractionDigits: 2 })
                                : '0'} USDT
                        </b>
                    </p>

                    <p>
                        UHLD:{' '}
                        <b>
                            {assetsStats
                                ? assetsStats.totalUHLD.toLocaleString('en', { maximumFractionDigits: 0 })
                                : '0'} UHLD
                        </b>
                    </p>

                    <p style={{ color: '#7fd05a' }}>
                        Bonus: +<b>
                            {assetsStats
                                ? assetsStats.bonus.toLocaleString('en', { maximumFractionDigits: 0 })
                                : '0'} UHLD
                        </b>
                    </p>

                    <p style={{ fontWeight: 'bold', borderTop: '1px solid gray', borderBottom: '1px solid gray', marginTop: '1rem' }}>
                        Total:{' '}
                        <b>
                            {assetsStats
                                ? assetsStats.totalWithBonus.toLocaleString('en', { maximumFractionDigits: 0 })
                                : '0'} UHLD
                        </b>
                    </p>

                    <button
                        disabled={!assets || assets.length === 0 || !wallet || loading}
                        onClick={() => claimBtn('assets')}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            background: '#7fd05a',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Loading...' : 'Claim All'}
                    </button>
                </div>

                {/* WALLET */}
                {/* <div style={{
                width: 240,
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 8,
                padding: '1rem',
                background: 'rgb(44,62,80)',
                boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                textAlign: 'center'
            }}>
                <h3 style={{ marginTop: 0 }}>TON Wallet</h3>
                <TonConnectButton />
            </div> */}

            </div>
        </>
    );
};
