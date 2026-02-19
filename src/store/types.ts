// types/navTypes.ts
export type SidebarType = 'account' | 'presale' | 'airdrop' | 'achivs' | 'ambassadors';

export interface UseNav {
    sidebar: SidebarType;
    isMobile: boolean;
    isSidebarOpen: boolean;
    setSidebar: (nav: SidebarType) => void;
    setIsMobile: (isMobile: boolean) => void;
    setSidebarOpen: (isSidebarOpen: boolean) => void;
}


// !!! TON

export interface TonDomain {
    lengthBytes: number;
    value: string;
}

export interface TonAccount {
    address: string;
    publicKey: string;
    walletStateInit: string;
}

export interface TonProof {
    timestamp: number;
    domain: {
        lengthBytes: number;
        value: string;
    };
    payload: string; // nonce
    signature: string;
}

export interface BackendUser {
    id: string;
    name?: string;
}

export type AssetCurrency = 'UHS' | 'USDT';

export interface UserAsset {
    startup_id: number;
    currency: AssetCurrency;
    amount: string;        // ⚠️ строка, потому что NUMERIC(70,2)
    shares: string;        // ⚠️ тоже строка
    total_shares: string;  // ⚠️ строка
}

export type ClaimType = 'uhs' | 'usdt' | 'assets';


export interface AuthState {
    userData: BackendUser | null;
    presaleBalance: number;
    airdropBalance: number;
    USDT: number,
    UHS: number,
    assets: UserAsset[] | null;
    id: number | null;
    mail: string | null;
    loading: boolean;
    tonLoading: boolean;
    tokenTon: string | null;
    tonAddress: string | null;
    solAddress: string | null;
    claim: (type: ClaimType, token: string) => Promise<void>;
    getBalances: (token: string) => Promise<void>;
    saveSolanaAddress: (address: string, token: string) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loginWithTon: (acount: any, proof: any, token: string) => Promise<void>;
    init: (token: string) => Promise<void>;
    reset: () => void;
}
