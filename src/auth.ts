export const cognitoAuthConfig = {
  authority: "https://us-east-1helb0ld0p.auth.us-east-1.amazoncognito.com", // Hosted UI domain
  client_id: "4sars302msk26ni7i1ebns2gfn", // App client ID
  redirect_uri: "https://app.youhold.online/auth/callback",
  response_type: "code",
  scope: "openid email profile", // строго такие скопы для Google
};
