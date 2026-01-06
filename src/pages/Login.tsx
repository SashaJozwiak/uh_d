import { useAuth } from "react-oidc-context";

export default function Login() {
    const auth = useAuth();

    const signOutRedirect = () => {
        const clientId = "4sars302msk26ni7i1ebns2gfn";
        const logoutUri = "https://app.youhold.online/";
        const cognitoDomain = "https://us-east-1helb0ld0p.auth.us-east-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    if (auth.isLoading) return <p>Loading...</p>;
    if (auth.error) return <p>Error: {auth.error.message}</p>;

    if (auth.isAuthenticated) {
        return (
            <div>
                <p>Welcome: {auth.user?.profile.email}</p>
                <button onClick={signOutRedirect}>Sign out</button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => auth.signinRedirect()}>Sign in with Google</button>
        </div>
    );
}
