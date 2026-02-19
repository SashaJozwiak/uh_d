
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNav } from "../store/nav";
import { Header } from "../components/Header";
import { Sidebar } from '../components/Sidebar';
import { useAuthStore } from "../store/user";
import { Account } from "../components/Account";
import { Presale } from "../components/Presale";
import { Airdrop } from "../components/Airdrop";
import { Achivments } from "../components/Achivments";
import { Ambassadors } from "../components/Ambassadors";

export default function Main() {

    const auth = useAuth();
    console.log('auth data:', auth);

    const { sidebar, setIsMobile } = useNav(state => state);
    const { userData, init } = useAuthStore();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsMobile]);

    useEffect(() => {
        if (!auth.isLoading && auth.isAuthenticated) {
            console.log('auth.user: ', auth.user)

            if (auth.user?.id_token) {
                console.log('auth.user.id_token: ', auth.user.id_token)
                init(auth.user.id_token);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.isLoading, auth.isAuthenticated]);

    console.log('userData: ', userData)
    console.log('mail: ', userData)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>

            {/* HEADER */}
            <Header />

            {/* MAIN CONTAINER */}
            <div style={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                <Sidebar />
                {/* MAIN BODY */}
                <main style={{ flexGrow: 1, background: '#58677c', padding: '20px', overflowY: 'auto' }}>
                    {sidebar === 'account' && <Account />}
                    {sidebar === 'presale' && <Presale />}
                    {sidebar === 'airdrop' && <Airdrop />}
                    {sidebar === 'achivs' && <Achivments />}
                    {sidebar === 'ambassadors' && <Ambassadors />}
                </main>
            </div>
        </div>
    );
};
