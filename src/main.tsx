import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

// Новая конфигурация для SPA с Google через Hosted UI
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_heLB0ld0p", // Hosted UI domain
  client_id: "4sars302msk26ni7i1ebns2gfn", // App client ID
  redirect_uri: "https://app.youhold.online/auth/callback", // callback
  response_type: "code",
  scope: "openid email profile", // для Google OAuth
};

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
