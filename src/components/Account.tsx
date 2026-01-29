import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useAuthStore } from '../store/user';

export const Account = () => {
    const { loading, mail, userData } = useAuthStore();

    console.log('user data: ', userData)

    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    const connectTon = async () => {
        await tonConnectUI.openModal();
    };

    const disconnectTon = async () => {
        await tonConnectUI.disconnect();
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ textAlign: 'right', padding: 0, margin: 0, color: 'lightgray' }}>{mail ? mail : 'Loading...'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                        <h2>Ton connect</h2>
                        <button>connect</button>

                        {!wallet ? (
                            <button onClick={connectTon}>
                                Connect TON
                            </button>
                        ) : (
                            <>
                                <p style={{ fontSize: 12 }}>
                                    {wallet.account.address.slice(0, 6)}...
                                    {wallet.account.address.slice(-4)}
                                </p>
                                <button onClick={disconnectTon}>
                                    Disconnect
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        <h2>Solana</h2>
                        <button>connect</button>
                    </div>

                </div>

                <div></div>
                {loading ? (<p>loading</p>) : (<p>ok</p>)}
            </div>
        </>
    )
}
