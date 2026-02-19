export const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_heLB0ld0p", // Hosted UI domain
  client_id: "4sars302msk26ni7i1ebns2gfn", // App client ID
  redirect_uri: "https://app.youhold.online/auth/callback", //"http://localhost:5173/auth/callback", //"https://app.youhold.online/auth/callback",
  response_type: "code",
    scope: "openid email profile", // строго такие скопы для Google!
  automaticSilentRenew: true,
};
