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
                                borderRadius: '0.5rem'
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
                                borderRadius: '0.5rem'
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
                                borderRadius: '0.5rem'
                            }}
                        >
                            Airdrop
                        </li>
                        <li
                            onClick={() => {
                                setSidebar('achivs')
                                setSidebarOpen(false)
                            }}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #34495e',
                                cursor: 'pointer',
                                background: sidebar === 'achivs' ? '#34495e' : 'transparent',
                                borderRadius: '0.5rem'
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
                                borderRadius: '0.5rem'
                            }}
                        >
                            Ambassadors
                        </li>
                    </ul>
                    <span style={{ fontSize: '0.6rem', fontStyle: 'italic', color: 'gray' }}>© 2024-2026 | YouHold </span>
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
