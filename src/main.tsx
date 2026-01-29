import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "./auth";
import { BrowserRouter } from "react-router-dom";

import { TonConnectUIProvider } from '@tonconnect/ui-react';

import "./index.css";

const manifestUrl = 'https://app.youhold.online/tonconnect-manifest.json';

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </TonConnectUIProvider>
  </React.StrictMode>
);
