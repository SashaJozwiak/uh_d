import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "./auth";
import { BrowserRouter } from "react-router-dom";

import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

import "./index.css";

import { Buffer } from 'buffer';
import process from 'process';

if (typeof window !== 'undefined') {
  (window).Buffer = Buffer;
  (window).process = process;
}

const manifestUrl = 'https://app.youhold.online/tonconnect-manifest.json';

const wallets = [
  new PhantomWalletAdapter(),
];

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>

    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>

    <TonConnectUIProvider manifestUrl={manifestUrl}>
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </TonConnectUIProvider>

        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

  </React.StrictMode>
);
