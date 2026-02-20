import { useNav } from '../store/nav'

export const Sidebar = () => {

    const { isMobile, isSidebarOpen, sidebar, setSidebar, setSidebarOpen } = useNav(state => state)

    return (
        <>
            {/* SIDEBAR */}
            <aside style={{
                width: '250px',
                background: '#2c3e50',
                color: '#ecf0f1',
                padding: '20px',
                flexShrink: 0,
                transition: 'transform 0.3s ease',
                // Адаптивные стили:
                position: isMobile ? 'absolute' : 'relative',
                zIndex: 100,
                height: '100%',
                transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
            }}>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li
                            onClick={() => {
                                setSidebar('account')
                                setSidebarOpen(false)
                            }}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #34495e',
                                cursor: 'pointer',
                                background: sidebar === 'account' ? '#34495e' : 'transparent',
                                borderRadius: '0.5rem',
                                color: sidebar === 'account' ? 'white' : 'lightgray',
                            }}
                        >
                            Account
                        </li>
                        <li
                            onClick={() => {
                                setSidebar('presale')
                                setSidebarOpen(false)
                            }}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #34495e',
                                cursor: 'pointer',
                                background: sidebar === 'presale' ? '#34495e' : 'transparent',
                                borderRadius: '0.5rem',
                                color: sidebar === 'presale' ? 'white' : 'lightgray',
                            }}
                        >
                            Presale
                        </li>
                        <li
                            onClick={() => {
                                setSidebar('airdrop')
                                setSidebarOpen(false)
                            }}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #34495e',
                                cursor: 'pointer',
                                background: sidebar === 'airdrop' ? '#34495e' : 'transparent',
                                borderRadius: '0.5rem',
                                color: sidebar === 'airdrop' ? 'white' : 'lightgray',
                            }}
                        >
                            Airdrop
                        </li>
                        <li
                            onClick={() => {
                                /* setSidebar('achivs')
                                setSidebarOpen(false) */
                                console.log('soon')
                            }}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #34495e',
                                cursor: 'pointer',
                                background: sidebar === 'achivs' ? '#34495e' : 'transparent',
                                borderRadius: '0.5rem',
                                color: sidebar === 'achivs' ? 'white' : 'lightgray',
                                opacity: '0.5'
                            }}
                        >
                            Achievements
                        </li>
                        <li
                            onClick={() => {
                                setSidebar('ambassadors')
                                setSidebarOpen(false)
                            }}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #34495e',
                                cursor: 'pointer',
                                background: sidebar === 'ambassadors' ? '#34495e' : 'transparent',
                                borderRadius: '0.5rem',
                                color: sidebar === 'ambassadors' ? 'white' : 'lightgray',
                            }}
                        >
                            Ambassadors
                        </li>
                    </ul>
                    <button
                        //className={styles.btnsupp}
                        style={{
                            padding: '0.5rem 2rem',
                            fontSize: '1rem',
                            color: 'lightgray',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            margin: '2rem auto',
                        }}
                        onClick={() => window.open('https://t.me/youhold_chat', '_blank', 'noopener,noreferrer')}
                    >
                        <span>Support Chat</span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M22 2L2.5 10.8c-1 .4-.9 1.8.1 2.1l4.8 1.5 1.8 5.5c.3.9 1.4 1.1 2 .4l2.9-3.3 4.9 3.6c.8.6 1.9.2 2.1-.8L24 3.6C24 2.4 22.9 1.6 22 2z" />
                        </svg>
                    </button>
                    <span style={{ fontSize: '0.7rem', fontStyle: 'italic', color: 'gray' }}>© 2024-2026 | YouHold </span>
                </nav>
            </aside>

            {/* OVERLAY для мобильных (затемнение при открытом меню) */}
            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
                />
            )}
        </>
    )
}
