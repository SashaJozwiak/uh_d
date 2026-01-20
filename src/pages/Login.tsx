import { useAuth } from "react-oidc-context";

import uh_logo from '../assets/favicon-32x32.png'
import { useNavigate } from "react-router-dom";

export default function Login() {
    const auth = useAuth();
    const navigate = useNavigate();

    /* const signOutRedirect = () => {
        const clientId = "4sars302msk26ni7i1ebns2gfn";
        const logoutUri = encodeURIComponent("http://localhost:5173");//"https://app.youhold.online/";
        const cognitoDomain = "https://us-east-1helb0ld0p.auth.us-east-1.amazoncognito.com";
        //const idToken = auth.user?.id_token; // или auth.user?.access_token, если id_token нет
        const idToken = auth.user?.id_token || auth.user?.access_token;
        window.alert(`${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}&id_token_hint=${idToken}`)
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}&id_token_hint=${idToken}`;
        //window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    }; */

    /*  const signOutRedirect = () => {
         const clientId = "4sars302msk26ni7i1ebns2gfn";
         const logoutUri = encodeURIComponent("http://localhost:5173");
         const cognitoDomain = "https://us-east-1helb0ld0p.auth.us-east-1.amazoncognito.com";
         const idToken = auth.user?.id_token || auth.user?.access_token;
         if (!idToken) {
             console.error("No ID token found!");
             return;
         }
         const url = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}&id_token_hint=${idToken}`;
         console.log("Logout URL:", url); // Проверьте URL в консоли
         window.location.href = url;
     }; */

    if (auth.isLoading) return <p>Loading...</p>;
    if (auth.error) return <p>Error: {auth.error.message}</p>;

    /* if (auth.isAuthenticated) {
        return (
            <div>
                <p>Welcome: {auth.user?.profile.email}</p>
                <button onClick={signOutRedirect}>Sign out</button>
            </div>
        );
    } */

    if (auth.isAuthenticated) {
        navigate("/main");
    }

    return (
        <div
            style={{
                display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', background: 'linear-gradient(180deg, #1e293b, #58677c)',

            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', width: '200px', height: '4rem', padding: '2rem', boxShadow: '4px 4px 8px 0px rgba(152, 158, 164, 0.2)', borderRadius: '0.5rem', marginTop: '20vh', backgroundColor: '#58677c' }}>
                <button
                    style={{
                        alignItems: 'center',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#fff',
                        //background: 'linear-gradient(135deg, #7fd05a, #5aa63b)',
                        backgroundColor: '#1e293b',
                        /* boxShadow: '0 4px 15px rgba(170, 170, 170, 0.3)', */
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: 'inset 0px 2px 4px rgba(255, 255, 255, 0.3), inset 0px -2px 4px rgba(140, 140, 140, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)',


                    }}
                    onClick={() => auth.signinRedirect()}>
                    Sign in with Google
                    <div style={{ display: 'flex', margin: '0.5rem 0 0 0', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                        <span style={{ marginBottom: '0.2rem' }}>&nbsp;⇄&nbsp;</span>
                        <img
                            style={{ marginTop: '-0.21rem' }}
                            src={uh_logo}
                            alt="uh logo pic" />
                    </div>
                </button>
            </div>

        </div>
    );
}
